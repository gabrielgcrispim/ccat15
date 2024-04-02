import crypto from "crypto";

export default class Transaction {

    constructor(readonly transactionId: string, readonly rideId: string, readonly amount: number, readonly date: Date, readonly status: String) {
    }


    static create(rideId: string, amount: number, date: Date, status: String) {
        const transactionId = crypto.randomUUID();
        return new Transaction(transactionId, rideId, amount, date, status);
    }

    static restore(transactionId: string, rideId: string, amount: number, date: Date, status: String) {
        return new Transaction(transactionId, rideId, amount, date, status);
    }
}