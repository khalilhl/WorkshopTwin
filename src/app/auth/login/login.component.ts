import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    // Si déjà connecté, rediriger
    if (this.authService.isAuthenticated()) {
      this.redirectAfterLogin();
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.redirectAfterLogin();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error || error.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
        console.error('Login error:', error);
      }
    });
  }

  private redirectAfterLogin(): void {
    // Récupérer l'URL de retour depuis les query params
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
    const redirectUrl = returnUrl || '/events';
    this.router.navigate([redirectUrl]);
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}

