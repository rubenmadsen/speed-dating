import {Base} from "./base";
import {User} from "./user";
import {Event} from "./event";

export interface Date extends Base{
  event:Event;
  dateRound:number;
  percentage:number;
  personOne:User;
  personTwo:User;
  feedback:DateFeedback[];
}
