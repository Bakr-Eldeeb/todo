import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(private router: Router) {}

  signup() {
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    createUserWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
        this.router.navigate(['/todo']);
      })
      .catch(() => {
        this.errorMessage = 'Signup failed. Try another email or stronger password.';
      });
  }
}