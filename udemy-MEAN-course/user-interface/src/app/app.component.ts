import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/service/auth.service';
// import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
  // createdPosts: Post[] = [];

  // onPostCreated(post: Post) {
  //   this.createdPosts.push(post);
  // }
}
