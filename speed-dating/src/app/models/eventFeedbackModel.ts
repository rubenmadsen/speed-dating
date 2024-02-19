import { BaseModel } from './baseModel';
import { EventModel } from './eventModel';

export interface EventFeedbackModel extends BaseModel {
  event: EventModel;
  feedback: string;
}
