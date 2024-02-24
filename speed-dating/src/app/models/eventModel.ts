import { BaseModel } from './baseModel';
import { UserModel } from './userModel';
import { EventFeedbackModel } from './eventFeedbackModel';
import {CityModel} from "./cityModel";

export interface EventModel extends BaseModel {
  startDate: Date;
  imagePath: string;
  hasEnded: boolean;
  round: number;
  location: string;
  city: CityModel;
  description: string;
  totalParticipants: number;
  currentParticipants: number;
  participants: UserModel[];
  eventFeedback: EventFeedbackModel[];
}
