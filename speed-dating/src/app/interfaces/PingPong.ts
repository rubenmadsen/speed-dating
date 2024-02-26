export interface PingPong<T> {
  amount: number;
  itemType: string;
  items: T[];
  retrieved:number;
}
