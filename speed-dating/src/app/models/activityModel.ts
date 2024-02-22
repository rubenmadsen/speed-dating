import { BaseModel } from './baseModel';
import { CategoryModel } from './categoryModel';

export interface ActivityModel extends BaseModel {
  name: String;
  category: CategoryModel;
}
