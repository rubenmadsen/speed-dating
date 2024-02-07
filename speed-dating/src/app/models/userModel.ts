import {BaseModel} from "./baseModel";
import {EventModel} from "./eventModel";

export interface UserModel extends BaseModel {
  imagePath: string;
  email: string;
  firstname: string;
  lastname: string;
  age: number;
  gender: 'male' | 'female';
  description: string;
  events: EventModel[];
  sharedContacts: UserModel[];
  preferences: {
    name: string;
    min: number;
    max: number;
  }[];
  interests: {
    category: number;
    activities: string[];
  }[];
  matchingData: {
    category: number;
    points: number;
  }[];
}
