import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.prod';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  private apiUrl = environment.apiUrl;
  
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  showRegister = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Toggle between login and register forms
  toggleRegister(event: Event) {
    event.preventDefault();
    this.showRegister = !this.showRegister;
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.http.post<any>(`${this.apiUrl}/login`, this.loginForm.value)
        .subscribe({
          next: (response) => {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
            // Close Bootstrap modal
            const modal = document.getElementById('loginModal');
            if (modal) {
              (window as any).bootstrap.Modal.getInstance(modal)?.hide();
            }
            this.router.navigate(['/user-profile']);
          },
          error: (error) => {
            console.error('Login failed', error);
            alert('Login failed. Please check your credentials.');
          }
        });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.http.post<any>(`${this.apiUrl}/register`, this.registerForm.value)
        .subscribe({
          next: (response) => {
           
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
            // Close Bootstrap modal
            const modal = document.getElementById('loginModal');
            if (modal) {
              (window as any).bootstrap.Modal.getInstance(modal)?.hide();
            }
            this.router.navigate(['/user-profile']);

            this.registerForm.reset();
            this.showRegister = false;
          },
          error: (error) => {
            console.error('Registration failed', error);
            alert('Registration failed. Please try again.');
          }
        });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getUserName(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).name : null;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  getShortName(max: number = 5): string {
    const name = this.getUserName();
    if (!name) return 'Profile';
    return name.length > max ? name.substring(0, max) + '..' : name;
  }
}