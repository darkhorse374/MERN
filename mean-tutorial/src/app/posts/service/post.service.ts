import { Injectable } from '@angular/core';
import { Post } from '../post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private postsAdded = new Subject<Post[]>();

  constructor() { }

  getPosts() {
    return [...this.posts];
  }

  getPostAddedListener() {
    return this.postsAdded.asObservable();
  }

  addPost(postTitle: string, postContent: string) {
    const post: Post = { title: postTitle, content: postContent };
    this.posts.push(post);
    this.postsAdded.next([...this.posts]);
  }
}
