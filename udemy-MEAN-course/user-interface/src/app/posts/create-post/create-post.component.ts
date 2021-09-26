import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
// import { Post } from '@src/app/posts/post.model';
import { PostService } from '@src/app/posts/service/post.service';
import { Post } from '@src/app/posts/post.model';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit{
  // @Output() postCreated = new EventEmitter<Post>();
  mode = 'create';
  private postId = '';
  public post!: Post;
  isLoading = false;

  constructor(public postService: PostService,
  public route:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId') || '';
        this.isLoading = true;
        this.postService.getPost(String(this.postId)).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData.posts._id,
            title: postData.posts.title,
            content: postData.posts.content
          };
        });
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }

  onSavePost(postForm: NgForm) {
    // console.log('postForm.value.postTitle :: ' + this.post.title);
    // console.log('postForm.value.postContent :: ' + this.post.content);
    if (postForm.invalid)
      return;

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(postForm.value.postTitle, postForm.value.postContent);
    } else {
      this.postService.updatePost(this.postId, postForm.value.postTitle, postForm.value.postContent);
    }


    postForm.resetForm();
    // const post: Post = {
    //   title: postForm.value.postTitle,
    //   content: postForm.value.postContent
    // };
    // this.postCreated.emit(post);
    // this.postService.addPost(post.title, post.content);
  }
}
