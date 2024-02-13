import {BaseModel} from "./baseModel";
import {EventModel} from "./eventModel";


export interface CityModel extends BaseModel{
  name:String;
  events:EventModel[];
}
