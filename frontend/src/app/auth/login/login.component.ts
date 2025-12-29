import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('userId', res.userId);

          this.snackBar.open('Login Successful!', 'Close', { duration: 3000 });

          if (res.role === 'Admin') {
            this.router.navigate(['/dashboard/admin']);
          } else if (res.role === 'Staff') {
            this.router.navigate(['/dashboard/staff']);
          } else {
            this.router.navigate(['/dashboard/user']);
          }
        },
        error: (err) => {
          const errorMessage = err?.error?.message || err?.statusText || 'Login Failed';
          this.snackBar.open('Login Failed: ' + errorMessage, 'Close', { duration: 3000 });
        }
      });
    }
  }
}
