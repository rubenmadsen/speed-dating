import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from "../../models/userModel";
import {ActivityRatingModel} from "../../models/activityRatingModel"
import { ActivatedRoute } from '@angular/router'
import {BackendService} from "../../services/backend.service";
import {CategoryModel} from "../../models/categoryModel";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  user?: UserModel;
  private sub: any
  arm: ActivityRatingModel[];
  categories: CategoryModel[];

  constructor(private route : ActivatedRoute, private backendService: BackendService) {
    this.arm = []
    this.categories = [];
  }

  /**
   * Params should be used when an organizer tries to enter a participant profile, but getMe should be used when a user goes
   * to its own profile.
   */
  async ngOnInit(){
    // this.sub = this.route.queryParams.subscribe(params =>{
    //   console.log(params)
    //   // this.user= params as UserModel;
    //   console.log(this.route.queryParams)
    //   console.log(params)
    //   // console.log(this.user.city)
    //   // console.log(this.user.email)
    //   // console.log(this.user.imagePath)
    // });
    this.backendService.getMe().subscribe({
      next: (response) => {
        this.user = response.user;
        this.arm = response.user.activityData;

      }, error: (error) => {
        console.log(error);
      }
    });
    this.backendService.getAllCategories().then(result => {
      this.categories = result;
    })
  }
}
