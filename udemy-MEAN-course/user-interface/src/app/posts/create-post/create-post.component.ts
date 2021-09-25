import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { Post } from '@src/app/posts/post.model';
import { PostService } from '@src/app/posts/service/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  // @Output() postCreated = new EventEmitter<Post>();

  constructor(public postService: PostService) {
  }

  onAddPost(postForm: NgForm) {

    if (postForm.invalid)
      return;

    this.postService.addPost(
      postForm.value.postTitle,
      postForm.value.postContent
    );

    postForm.resetForm();
    // const post: Post = {
    //   title: postForm.value.postTitle,
    //   content: postForm.value.postContent
    // };
    // this.postCreated.emit(post);
    // this.postService.addPost(post.title, post.content);
  }
}
