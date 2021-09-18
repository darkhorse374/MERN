import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../service/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.css'],
})
export class ListPostComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postService: PostService) {
    this.postsSub = this.postService
      .getPostAddedListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnInit(): void {
    this.posts = this.postService.getPosts();
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
