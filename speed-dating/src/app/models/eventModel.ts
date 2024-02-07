import {BaseModel} from "./baseModel";
import {UserModel} from "./userModel";
import {EventFeedbackModel} from "./eventFeedbackModel";

export interface EventModel extends BaseModel{
  startDate:Date;
  hasEnded:boolean;
  round:number;
  location:string;
  address:string;
  city:string;
  latitude:string;
  longitude:string;
  description:string;
  totalParticipants:number;
  currentParticipants:number;
  participants:UserModel[];
  eventFeedback:EventFeedbackModel[];
}
