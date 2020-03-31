export class ArgusModel {

    constructor(date: Date, price: number, percentage: string) {
        this.date = date;
        this.price = price;
        this.percentage = percentage;
    }

    date: Date;
    price: number;
    percentage: string;

}