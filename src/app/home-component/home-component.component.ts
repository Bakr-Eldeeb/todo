import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';   // ← Added RouterLink
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink   // ← Important for routerLink to work
  ],
  templateUrl: './home-component.component.html',
  styleUrl: './home-component.component.css'
})
export class HomeComponentComponent {
  showPassword = false;

  loginForm = new FormGroup({
    email: new FormControl('', { 
      validators: [Validators.required, Validators.email], 
      nonNullable: true 
    }),
    password: new FormControl('', { 
      validators: [Validators.required], 
      nonNullable: true 
    }),
    rememberMe: new FormControl(false, { nonNullable: true })
  });

  constructor(
    private router: Router,
    private data: DataService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      alert('Please enter a valid email and password');
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    if (this.data.validateCredentials(email, password)) {
      const user = this.data.getUserByEmail(email);
      this.data.setCurrentUser(user);
      
      console.log("Login Success!");
      this.router.navigate(['/app/todo']);
    } else {
      alert("Incorrect email or password!");
    }
  }
}