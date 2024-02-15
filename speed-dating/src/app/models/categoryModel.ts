import {BaseModel} from "./baseModel";

export interface CategoryModel extends BaseModel{
  name:String;
  activities:String[];
}
