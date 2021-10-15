import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../service/auth.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService){}

  isLoading = false;

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      return;
    }
    this.authService.login(loginForm.value.email, loginForm.value.password);
  }

}
