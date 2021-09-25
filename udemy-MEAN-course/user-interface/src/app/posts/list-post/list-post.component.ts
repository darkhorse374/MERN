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

  constructor(public postService: PostService) {
    this.postService.getPosts();
    this.subs.add(
      this.postService.getPostAddedListener().subscribe((posts: Post[]) => {
        this.posts = posts;
      })
    );
  }

  ngOnInit(): void {}

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
