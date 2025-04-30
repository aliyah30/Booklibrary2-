import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true, 
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  
  constructor(
    private router: Router,
    private http: HttpClient
  ) {}
  
  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Username and password are required';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    // Send POST request to login API
    this.http.post<any>('http://localhost:5000/api/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          // Store user info in localStorage or a service
          localStorage.setItem('user_id', response.user_id);
          localStorage.setItem('username', response.username);
          // Navigate to profile
          this.router.navigate(['/profile']);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
        console.error('Login error', error);
      }
    });
  }
}
