import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '@src/app/modules/posts/models/post.model';
import { PostService } from '@src/app/services/post.service';
import { SubSink } from 'subsink';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '@src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css'],
})
export class ListPostComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private subs = new SubSink();
  isLoading = false;
  totalPosts = 0;
  postsPerPageOptions = [1, 2, 5, 10];
  currentPage = 1;
  postsPerPage = this.postsPerPageOptions[1];
  isUserAuthenticated = false;
  userId: string;

  constructor(public postService: PostService, public authService: AuthService, private router: Router) {
    // this.isLoading = true;
    // this.userId = this.authService.getUserId();
    // this.postService.getPosts(this.postsPerPage, this.currentPage);
    // this.subs.add(
    //   this.postService.getPostAddedListener().subscribe((postData: {posts: Post[], totalPosts: number}) => {
    //     this.isLoading = false;
    //     this.posts = postData.posts;
    //     this.totalPosts = postData.totalPosts;
    //   })
    // );
    // this.isUserAuthenticated = this.authService.getIsUserAuthenticated();
    // this.subs.add(this.authService.getAuthStatus().subscribe(isAuthenticated => {
    //   this.isUserAuthenticated = isAuthenticated;
    //   this.userId = this.authService.getUserId();
    // }));
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.subs.add(
      this.postService.getPostAddedListener().subscribe((postData: { posts: Post[]; totalPosts: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.totalPosts;
      })
    );
    this.isUserAuthenticated = this.authService.getIsUserAuthenticated();
    this.subs.add(
      this.authService.getAuthStatus().subscribe(isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      })
    );
  }

  onDelete(postId: string) {
    if (confirm(`Confirm to delete the post "${this.posts.find(p => p.id === postId).title}"`).valueOf()) {
      this.isLoading = true;
      this.subs.add(
        this.postService.deletePost(postId).subscribe(
          () => {
            this.currentPage = (this.totalPosts / this.postsPerPage) ;
            this.postService.getPosts(this.postsPerPage, this.currentPage);
            this.subs.add(
              this.postService.getPostAddedListener().subscribe((postData: { posts: Post[]; totalPosts: number }) => {
                this.isLoading = false;
                this.posts = postData.posts;
                this.totalPosts = postData.totalPosts;
              })
            );
            // this.router.navigate(['/']);
          },
          () => {
            this.isLoading = false;
          }
        )
      );
    }
  }

  onPageChange(pageEvent: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageEvent.pageIndex + 1;
    this.postsPerPage = pageEvent.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
