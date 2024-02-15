import { Component , ViewChild} from '@angular/core';
import {faX} from "@fortawesome/free-solid-svg-icons/faX";
import {BackendService} from "../../services/backend.service";
import { NgForm } from '@angular/forms';
import {CityModel} from "../../models/cityModel";
import {CategoryModel} from "../../models/categoryModel";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {UserModel} from "../../models/userModel";

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
  categories: CategoryModel[];
  activities: any[] = [];
  selectedCategory: any = null;


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
    this.categories = [];
  }

  async ngOnInit(){
    await this.backend.getAllCities().then(cities => this.cities = cities.sort(( a , b ) => a.name > b.name ? 1 : - 1));
    await this.backend.getAllCategories().then(categories => this.categories = categories.sort((a , b) => a.name > b.name ? 1 : -1));
    console.log(this.categories);
  }

  // Will be used for organizer
  // Is not callable if not every field is filled
  register(){
    this.backend.checkAvailability(this.form.email).subscribe({
      next: (response) =>


        this.backend.registerUser(),
      error: (error) => console.log(error)

    });

    if(this.form.valid) {
      const user: UserModel = {
        email: this.form.email,
        password: this.form.password,
        name: this.form.name,
        city: this.form.city,
        age: this.form.age,
        interests: this.form.interests,
      };
    }

  }

  notUsedEmail(): boolean {
    this.backend.checkAvailability(this.form.email).subscribe({
      next: (response) => this.backend.registerUser(),
      error: (error) => console.log(error)

    });
    return true;
  }

  next(event: Event) {
    event.stopPropagation();
    if (!this.nextIsPressed && !this.signupForm.valid) {
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

  onCategoryChange() {
    const category = this.categories.find(cat => cat.name === this.form.interests);
    console.log(category);
    if (category) {
      this.selectedCategory = category;
      this.activities = category.activities || [];
    }
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
