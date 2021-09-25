import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Post } from '@src/app/posts/post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getPosts() {
    // return [...this.posts];
    console.log('In getPosts() from post.service.ts');
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts', this.httpOptions)
      .pipe(
        map(postsData => {
          return postsData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostAddedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(postTitle: string, postContent: string) {
    const post: Post = { id: '', title: postTitle, content: postContent };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post, this.httpOptions)
      .subscribe(responseData => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId, this.httpOptions)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        console.log(`Post with ID ${postId} is successfully deleted`);
      });
  }
}
