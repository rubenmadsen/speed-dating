import { Component } from '@angular/core';
import {faX} from "@fortawesome/free-solid-svg-icons/faX";
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  protected readonly faX = faX;

  form: any = {
    email: '',
    password: ''
  };
  constructor(private backend: BackendService) {
  }

  login() {
    this.backend.login(this.form.email, this.form.password).subscribe({
      next: (response) => console.log('Login successful', response),
      error: (error) => console.error('Login failed', error)
    });
  }

}

