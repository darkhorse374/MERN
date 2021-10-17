import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  authSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authSub = this.authService.getAuthStatus().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onSignup(signupForm: NgForm) {
    this.isLoading = true;
    this.authService.createUser(signupForm.value.email, signupForm.value.password);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
