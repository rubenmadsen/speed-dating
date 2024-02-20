import { BaseModel } from './baseModel';
import { UserModel } from './userModel';

export interface DateFeedbackModel extends BaseModel {
  author: UserModel;
  date: Date;
  feedback: string;
}
