import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private postsAdded = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    // return [...this.posts];
    console.log('In getPosts() from post.service.ts');
    this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts').subscribe((postsData) => {
      this.posts = postsData.posts;
      this.postsAdded.next([...this.posts]);
    });
  }

  getPostAddedListener() {
    return this.postsAdded.asObservable();
  }

  addPost(postTitle: string, postContent: string) {
    const post: Post = { id: '', title: postTitle, content: postContent };
    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post).subscribe((responseData) => {
      console.log(responseData.message);
      this.posts.push(post);
      this.postsAdded.next([...this.posts]);
    });
  }
}
