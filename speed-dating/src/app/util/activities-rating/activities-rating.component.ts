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

  categories: CategoryModel[] = [];
  activities: ActivityModel[] = [];
  public activityRatings: ActivityRatingModel[] = [];


  protected readonly faStar = faStar
  hoverState: Record<string, number> = {};


  constructor(private backend: BackendService) {}

  async ngOnInit(){
    await this.backend.getAllCategories().then(categories => this.categories = categories.sort((a , b) => a.name > b.name ? 1 : -1));
    await this.backend.getAllActivities().then(activities => this.activities = activities.sort((a , b) => a.name > b.name ? 1 : -1));

    this.activityRatings = this.activities.map(activity => ({
      activity: activity,
      points: 0,
    }));
  }

  getActivity(id: String) : ActivityModel{
    return <ActivityModel>this.activities.find(a => a._id === id);
  }

  findRatingModel(activityId: string): ActivityRatingModel {
    // Try to find the existing rating model
    const ratingModel = this.activityRatings.find(rating => rating.activity === this.getActivity(activityId));

    // If found, return it
    if (ratingModel) {
      return ratingModel;
    }
    const newRatingModel: ActivityRatingModel = {
      activity: this.getActivity(activityId),
      points: 0,
    };
    this.activityRatings.push(newRatingModel);

    return newRatingModel;
  }

  setRatingForActivity(activityId: string, points: number): void {
    const ratingModel = this.findRatingModel(activityId);
    ratingModel.points = points;
  }


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
