import { Component , ViewChild} from '@angular/core';
import {faX} from "@fortawesome/free-solid-svg-icons/faX";
import {BackendService} from "../../services/backend.service";
import { NgForm } from '@angular/forms';
import {CityModel} from "../../models/cityModel";
import {CategoryModel} from "../../models/categoryModel";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";
import {UserModel} from "../../models/userModel";
import {Router} from "@angular/router";

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
    firstname: '',
    lastname:'',
    gender:'',
    email: '',
    password: '',
    confirmPassword: '',
    city:'',
    age: null,
    interests: '',
  };

  protected readonly faX = faX;
  constructor(private backend: BackendService, private router: Router) {
    this.cities = [];
    this.categories = [];
  }

  async ngOnInit(){
    await this.backend.getAllCities().then(cities => this.cities = cities.sort(( a , b ) => a.name > b.name ? 1 : - 1));
    await this.backend.getAllCategories().then(categories => this.categories = categories.sort((a , b) => a.name > b.name ? 1 : -1));
  }

  register() {
    this.backend.checkAvailability(this.form.email).subscribe({
      next: (response) => {
        if (this.signupForm.valid) {
          console.log(this.form.city)
          const user: UserModel = {
            id: '',
            email: this.form.email,
            password: this.form.password,
            firstname: this.form.firstname,
            lastname: this.form.lastname,
            age: this.form.age,
            city: this.form.city,
            gender: this.form.gender,
            description: "",
            interests: [],
            matchingData: [],
            events: [],
            sharedContacts: [],
            preferences: [],
            imagePath: "",
          };
          this.backend.registerUser(user).subscribe({
            next: (userResponse) => {
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
