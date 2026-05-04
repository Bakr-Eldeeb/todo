import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html'
})
export class SignupComponent {

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private router: Router) {}

  async register() {
    if (this.registerForm.invalid) return;

    const { email, password } = this.registerForm.value;

    try {
      await createUserWithEmailAndPassword(auth, email!, password!);
      this.router.navigate(['/signin']);
    } catch (err) {
      alert("Signup Failed");
    }
  }
}