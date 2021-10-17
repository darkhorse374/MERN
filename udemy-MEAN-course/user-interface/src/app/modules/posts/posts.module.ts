import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from '@src/app/app-routing.module';
import { AngularMaterialModule } from '../angular-material.module';
import { CreatePostComponent } from './create-post/create-post.component';
import { ListPostComponent } from './list-post/list-post.component';

@NgModule({
  imports: [CommonModule, AngularMaterialModule, ReactiveFormsModule, FormsModule, AppRoutingModule],
  declarations: [CreatePostComponent, ListPostComponent],
})
export class PostsModule {}
