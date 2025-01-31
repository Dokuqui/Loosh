import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        alert('Registration successful! You can now log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        alert('Registration failed. Please try again.');
      },
    })
  }
}