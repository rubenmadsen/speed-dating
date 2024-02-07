import {Base} from "./base";
import {User} from "./user";
import {EventFeedback} from "./eventFeedback";

export interface Event extends Base{
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
  participants:User[];
  eventFeedback:EventFeedback[];
}
