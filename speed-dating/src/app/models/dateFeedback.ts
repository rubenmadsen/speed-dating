import {Base} from "./base";
import {User} from "./user";

export interface DateFeedback extends Base{
  author:User;
  date:Date;
  feedback:string;
}
