import { Component } from '@angular/core';
import {faX} from "@fortawesome/free-solid-svg-icons/faX";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  protected readonly faX = faX;
}
