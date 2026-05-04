import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './home-component.component.html'
})
export class HomeComponentComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private router: Router) {}

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      console.log("Login Success");
      this.router.navigate(['/todo']);

    } catch (err) {
      alert("Login Failed");
    }
  }
  goToTodo() {
  this.router.navigate(['/app/todo']);
}
}