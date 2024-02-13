import { Component } from '@angular/core';
import {faX} from "@fortawesome/free-solid-svg-icons/faX";
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  isVisible: boolean = true;

  isOrganizer: boolean = false;

  form: any = {
    option: 'B',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    city:'',
    age: '',
  };
  protected readonly faX = faX;
  constructor(private backend: BackendService) {}


  // Will be used for organizer
  register(){}

  // Will be used to show the next screen in the registration form for a participant
  // Is not callable if not every field is filled
  next(){}

  closeForm(){
    this.isVisible = false;
  }
  onOptionChange(){
    this.isOrganizer = !this.isOrganizer;
  }
}
