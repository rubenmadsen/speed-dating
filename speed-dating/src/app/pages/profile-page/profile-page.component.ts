import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from "../../models/userModel";
import {ActivityRatingModel} from "../../models/activityRatingModel"
import { ActivatedRoute } from '@angular/router'
import {BackendService} from "../../services/backend.service";
import {CategoryModel} from "../../models/categoryModel";
import {faStar} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  protected readonly faStar = faStar

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
    this.backendService.getMe().subscribe({
      next: (response) => {
        this.user = response;
        this.arm = response.activityData;
      }, error: (error) => {
        console.log(error);
      }
    });
    await this.backendService.getAllCategories().then(categories => this.categories = categories.sort((a , b) => a.name > b.name ? 1 : -1));

  }
}
