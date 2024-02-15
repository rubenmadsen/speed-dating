import {BaseModel} from "./baseModel";
import {EventModel} from "./eventModel";
import {CityModel} from "./cityModel";

export interface UserModel extends BaseModel {
  imagePath: string;
  email: string;
  name: string;
  lastname: string;
  age: number;
  city: CityModel,
  password: string,
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
