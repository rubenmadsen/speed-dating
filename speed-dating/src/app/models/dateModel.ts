import { BaseModel } from './baseModel';
import { UserModel } from './userModel';
import { EventModel } from './eventModel';
import { DateFeedbackModel } from './dateFeedbackModel';

export interface DateModel extends BaseModel {
  event: EventModel;
  tableNumber: number;
  dateRound: number;
  percentage: number;
  personOne: UserModel;
  personTwo: UserModel | null;
  feedback: DateFeedbackModel[];
}
