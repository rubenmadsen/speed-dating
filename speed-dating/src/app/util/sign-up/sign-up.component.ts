import { Component , ViewChild} from '@angular/core';
import {faX} from "@fortawesome/free-solid-svg-icons/faX";
import {BackendService} from "../../services/backend.service";
import { NgForm } from '@angular/forms';
import {CityModel} from "../../models/cityModel";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  @ViewChild('f') signupForm!: NgForm; // Reference to the form


  isVisible: boolean = true;
  isOrganizer: boolean = false;
  nextIsPressed: boolean = false;

  cities: CityModel[];

  form: any = {
    option: 'B',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    city:'',
    age: null,
    interests: '',
  };
  protected readonly faX = faX;
  constructor(private backend: BackendService) {
    this.cities = [];
  }

  async ngOnInit(){
    await this.backend.getAllCities().then(cities => this.cities = cities.sort(( a , b ) => a.name > b.name ? 1 : - 1));
  }


  // Will be used for organizer
  // Is not callable if not every field is filled
  register(){
    this.notUsedEmail()
    console.log("REGG")

  }

  notUsedEmail(): boolean {
    console.log(this.backend.checkAvailability(this.form.email));
    return true;
  }

  next(event: Event) {
    event.stopPropagation();
    if (!this.nextIsPressed && !this.signupForm.valid) {
      this.signupForm.control.markAllAsTouched();
      return;
    }
    this.nextIsPressed = !this.nextIsPressed;
  }

  passwordsMatch(): boolean {
    return this.form.password === this.form.confirmPassword;
  }

  passwordValidation():boolean {
    const isLongEnough = this.form.password.length >= 6;
    const containsNumber = /\d/.test(this.form.password);
    return isLongEnough && containsNumber;
  }

  verifyAge(): boolean {
    return this.form.age > 18;
  }


  closeForm(){
    this.isVisible = false;
  }

  onOptionChange(){
    this.isOrganizer = !this.isOrganizer;
    this.form.interests = "";
  }
}
