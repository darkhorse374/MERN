import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '@src/app/posts/post.model';
import { PostService } from '@src/app/posts/service/post.service';
import { SubSink } from 'subsink';

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

  constructor(public postService: PostService) {
    this.isLoading = true;
    this.postService.getPosts();
    this.subs.add(
      this.postService.getPostAddedListener().subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      })
    );
  }

  ngOnInit(): void {}

  onDelete(postId: string) {
    if (confirm(`Confirm to delete the post "${this.posts.find(p => p.id === postId).title}"`).valueOf()) {
      this.postService.deletePost(postId);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
