import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  private subSink = new SubSink();
  isUserAuthenticated = false;

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsUserAuthenticated();
    this.subSink.add(this.authService.getAuthStatus().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
    }));
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
