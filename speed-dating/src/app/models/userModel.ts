import { BaseModel } from './baseModel';
import { EventModel } from './eventModel';
import { ActivityModel } from './activityModel';
import { CityModel } from './cityModel';

export interface UserModel extends BaseModel {
  imagePath: string;
  email: string;
  firstname: string;
  lastname: string;
  age: number;
  isOrganizer: boolean;
  password: string;
  gender: 'male' | 'female';
  city: CityModel;
  description: string;
  events: EventModel[];
  sharedContacts: UserModel[];
  preferences: {
    name: string;
    min: number;
    max: number;
  }[];
  activityData: {
    activity: ActivityModel;
    points: number;
  }[];
}
