import {BaseModel} from "./baseModel";
import {ActivityModel} from "./activityModel";


export interface ActivityRatingModel extends BaseModel{
  activity:ActivityModel;
  points:number;
}
