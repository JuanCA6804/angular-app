import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly router = inject(Router);
  private servicio = inject(Auth);

  loading = signal(false);
  error = signal('');

  readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  // Alias para mantener compatibilidad si se usa formulario
  get formulario() {
    return this.form;
  }

  invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.touched && control.invalid;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { username, password } = this.form.getRawValue();

    this.servicio.login(username, password).subscribe({
      next: () => {
        this.loading.set(false);
        console.log('Listo');
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(
          error.status === 401
            ? 'Usuario o contraseña incorrecta'
            : 'No se puede conectar espere mas tarde ...'
        );
      },
    });
  }

  onSubmit(): void {
    this.submit();
  }
}

export { LoginComponent as Login };
