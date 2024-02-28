import {Component, EventEmitter, Output} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {CategoryModel} from "../../models/categoryModel";
import {ActivityModel} from "../../models/activityModel";
import {ActivityRatingModel} from "../../models/activityRatingModel";
import {faStar} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-activities-rating',
  templateUrl: './activities-rating.component.html',
  styleUrls: ['./activities-rating.component.css']
})
export class ActivitiesRatingComponent {

  protected readonly faStar = faStar

  categories: CategoryModel[] = [];
  activities: ActivityModel[] = [];
  hoverState: Record<string, number> = {};

  // Public to allow Signup component to reach the list
  public activityRatings: ActivityRatingModel[] = [];

  constructor(private backend: BackendService) {}

  async ngOnInit(){
    await this.backend.getAllCategories().then(categories => this.categories = categories.sort((a , b) => a.name > b.name ? 1 : -1));
    await this.backend.getAllActivities().then(activities => this.activities = activities.sort((a , b) => a.name > b.name ? 1 : -1));
    this.activityRatings = this.activities.map(activity => ({
      activity: activity,
      points: 3,
    }));
  }

  /**
   * Method to find the ActivityModel
   * @param id the id of the activity
   */
  getActivity(id: String) : ActivityModel{
    return <ActivityModel>this.activities.find(a => a._id === id);
  }

  /**
   * Method to find the ActvityRatingModel depending on the ActivityModel
   * @param id the id of the activity
   */
  findRatingModel(id: string): ActivityRatingModel {
    const ratingModel = this.activityRatings.find(rating => rating.activity === this.getActivity(id));
    if (ratingModel) {
      return ratingModel;
    }
    const newRatingModel: ActivityRatingModel = {
      activity: this.getActivity(id),
      points: 0,
    };
    this.activityRatings.push(newRatingModel);
    return newRatingModel;
  }

  /**
   * Metod push the new rating of the ActivityRatingModel
   * @param id the ActivityRatingModel
   * @param points the new points
   */
  setRatingForActivity(id: string, points: number): void {
    const ratingModel = this.findRatingModel(id);
    ratingModel.points = points;
  }


  // Methods for star effect
  handleMouseEnter(activityId: string, rate: number): void {
    this.hoverState[activityId] = rate;
  }
  handleMouseLeave(activityId: string): void {
    this.hoverState[activityId] = 0;
  }
  isStarFilled(activityId: string, starIndex: number): boolean {
    const hoverRating = this.hoverState[activityId];
    const actualRating = this.findRatingModel(activityId).points;
    return starIndex <= (hoverRating || actualRating);
  }

}
