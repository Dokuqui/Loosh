import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterModule,
  ],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService
      .register(this.username, this.email, this.password)
      .subscribe({
        next: () => {
          alert('Registration successful! You can now log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration error:', err);
          alert('Registration failed. Please try again.');
        },
      });
  }
}
