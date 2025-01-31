import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Smart Home Automation System';
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    this.isAuthenticated = !!this.authService.getToken();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
