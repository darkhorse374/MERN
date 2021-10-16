import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '@src/app/posts/post.model';
import { PostService } from '@src/app/posts/service/post.service';
import { SubSink } from 'subsink';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '@src/app/auth/service/auth.service';

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

  constructor(public postService: PostService, public authService: AuthService) {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.subs.add(
      this.postService.getPostAddedListener().subscribe((postData: {posts: Post[], totalPosts: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.totalPosts;
      })
    );
    this.isUserAuthenticated = this.authService.getIsUserAuthenticated();
    this.subs.add(this.authService.getAuthStatus().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
    }));
  }

  ngOnInit(): void {}

  onDelete(postId: string) {
    if (confirm(`Confirm to delete the post "${this.posts.find(p => p.id === postId).title}"`).valueOf()) {
      this.isLoading = true;
      this.postService.deletePost(postId).subscribe(() => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      });
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
