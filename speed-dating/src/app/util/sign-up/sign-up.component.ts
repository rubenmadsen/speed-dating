import { Component , ViewChild} from '@angular/core';
import {faX} from "@fortawesome/free-solid-svg-icons/faX";
import {BackendService} from "../../services/backend.service";
import { NgForm } from '@angular/forms';
import {CityModel} from "../../models/cityModel";
import {UserModel} from "../../models/userModel";
import {Router} from "@angular/router";
import {ActivityRatingModel} from "../../models/activityRatingModel";
import {ActivitiesRatingComponent} from "../activities-rating/activities-rating.component";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  @ViewChild('f') signupForm!: NgForm;

  isVisible: boolean = true;
  isOrganizer: boolean = false;
  nextIsPressed: boolean = false;
  cities: CityModel[];
  @ViewChild(ActivitiesRatingComponent) activitiesRatingComponent!: ActivitiesRatingComponent;


  form: any = {
    option: 'B',
    firstname: '',
    lastname:'',
    description: '',
    gender:'',
    email: '',
    password: '',
    activityData:'',
    confirmPassword: '',
    city:'',
    age: null,
  };

  protected readonly faX = faX;

  constructor(private backend: BackendService, private router: Router) {
    this.cities = [];
  }

  async ngOnInit(){
    await this.backend.getAllCities().then(cities => this.cities = cities.sort(( a , b ) => a.name > b.name ? 1 : - 1));
  }


  register() {
    if (!this.signupForm.valid) {
      Object.keys(this.signupForm.controls).forEach(field => {
        const control = this.signupForm.controls[field];
        control.markAsTouched({onlySelf: true});
        return;
      })
    }


    this.backend.checkAvailability(this.form.email).subscribe({
    next: (response) => {
      let ratings : ActivityRatingModel[]= [];
      if (!this.isOrganizer) {
        ratings = this.activitiesRatingComponent.activityRatings;
      }
      if (this.signupForm.valid) {
        const user: UserModel = {
          _id: null,
          email: this.form.email,
          activityData: ratings,
          isOrganizer: this.isOrganizer,
          password: this.form.password,
          firstname: this.form.firstname,
          lastname: this.form.lastname,
          age: this.form.age,
          city: this.form.city,
          gender: this.form.gender,
          description: this.form.description,
          events: [],
          sharedContacts: [],
          preferences: [],
          imagePath: "ononoeope",
        };
        this.backend.registerUser(user).subscribe({
          next: (userResponse) => {
            this.isVisible = false;
            this.router.navigate(['profile']);
          },
          error: (registerError) => console.error('Registration error', registerError)
        });
      }
    },
      error: (error) => console.log(error)
    });
  }

  next(event: Event) {
    event.stopPropagation();
    if (!this.nextIsPressed && !this.signupForm.valid) {
      // return;
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
  }
}
