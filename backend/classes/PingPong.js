export default class PingPong{
    retrieved = 0;
    amount = 0;
    itemType;
    items = [];
    constructor(type) {
        this.itemType = type;
    }
}