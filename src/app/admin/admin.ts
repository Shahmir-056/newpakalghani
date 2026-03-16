// src/app/admin/admin.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class Admin {

  private auth   = inject(Auth);
  private router = inject(Router);

  email        = '';
  password     = '';
  errorMessage = '';
  loading      = false;
  showPassword = false;

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.loading      = true;
    this.errorMessage = '';

    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((result) => {
        console.log('✅ Login success:', result.user.email);
        this.router.navigate(['/admin-dashboard']).then(success => {
          console.log('Navigation result:', success);
        });
      })
      .catch((error: any) => {
        console.error('❌ Login error:', error.code);
        this.loading      = false;
        this.errorMessage = this.getFriendlyError(error.code);
      });
  }

  private getFriendlyError(code: string): string {
    const map: Record<string, string> = {
      'auth/user-not-found'        : 'No admin account found with this email.',
      'auth/wrong-password'        : 'Incorrect password. Please try again.',
      'auth/invalid-credential'    : 'Invalid email or password.',
      'auth/invalid-email'         : 'Please enter a valid email address.',
      'auth/too-many-requests'     : 'Too many attempts. Try again later.',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return map[code] || 'Login failed. Please try again.';
  }
}