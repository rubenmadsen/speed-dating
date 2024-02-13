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

  isVisible: boolean = true;

  errorMessage: string = '';

  form: any = {
    email: '',
    password: ''
  };

  constructor(private backend: BackendService) {}

  /**
   * Method to login, currently just reloads the root page with the cookie.
   */
  login() {
    this.backend.login(this.form.email, this.form.password).subscribe({
      next: (response) => window.location.reload(),
      error: (error) => {this.errorMessage = 'Login failed. Please try again.';}
    });
  }
  closeForm() {
    this.isVisible = false; // Set the visibility flag to false
  }
}

