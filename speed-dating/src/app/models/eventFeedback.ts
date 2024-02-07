import {Base} from "./base";
import {Event} from "./event";

export interface EventFeedback extends Base{
  event:Event;
  feedback:string;
}
