import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../../../services/auth.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  isLoading = false;
  authSub: Subscription;

  ngOnInit(): void {
    this.authSub = this.authService.getAuthStatus().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(loginForm.value.email, loginForm.value.password);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
