import Transaction from "../../domain/Transaction";
import TransactionRepository from "../repository/TransactionRepository";

export default interface PaymentGetway {
    processPayment(input: Input): Promise<void>
}


export class CreditCardPaymentGetway implements PaymentGetway {
    
    constructor(readonly transactionRepository: TransactionRepository){
    }

    async processPayment(input: Input): Promise<void> {
        const transaction = Transaction.create(input.rideId, input.amount, new Date(), "SUCCESS");
        await this.transactionRepository.save(transaction);
    }
}

type Input = {
    rideId: string,
    creditCardToken: string,
    amount: number
}