export class PingPong<T> {
  amount: number = 0;
  private itemType: string;
  private items: T[] = [];

  constructor(itemTypeClassName: string) {
    this.itemType = itemTypeClassName;
  }

  public getAndClearItems(): T[] {
    let items:T[] = this.items;
    this.items = [];
    return items;
  }
}
