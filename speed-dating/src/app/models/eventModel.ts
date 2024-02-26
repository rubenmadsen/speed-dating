import { BaseModel } from './baseModel';
import { UserModel } from './userModel';
import { EventFeedbackModel } from './eventFeedbackModel';
import {CityModel} from "./cityModel";
import {DateModel} from "./dateModel";

export interface EventModel extends BaseModel {
  startDate: Date;
  imagePath: string;
  hasEnded: boolean;
  round: number;
  location: string;
  city: CityModel;
  dates: DateModel[];
  description: string;
  totalParticipants: number;
  currentParticipants: number;
  participants: UserModel[];
  eventFeedback: EventFeedbackModel[];
}
