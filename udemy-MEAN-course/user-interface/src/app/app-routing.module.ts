import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPostComponent } from '@src/app/modules/posts/list-post/list-post.component';
import { AuthGuard } from './services/auth.guard';
import { CreatePostComponent } from './modules/posts/create-post/create-post.component';

const routes: Routes = [
  { path: '', component: ListPostComponent },
  { path: 'createPost', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'editPost/:postId', component: CreatePostComponent, canActivate: [AuthGuard] },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
  },
  // { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
