import { BaseModel } from './baseModel';
import { UserModel } from './userModel';
import {DateModel} from "./dateModel";

export interface DateFeedbackModel extends BaseModel {
  author: UserModel;
  question: number[];
}
