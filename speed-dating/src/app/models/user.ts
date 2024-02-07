export interface User {
  imagePath: string;
  email: string;
  firstname: string;
  lastname: string;
  age: number;
  gender: 'male' | 'female';
  description: string;
  events: Event[];
  sharedContacts: User[];
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
