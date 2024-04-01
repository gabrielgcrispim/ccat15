export default interface PaymentGetway {
    processPayment(input: Input): Promise<void>
}


export class CreditCardPaymentGetway implements PaymentGetway {
    async processPayment(input: Input): Promise<void> {
        console.log("Credit card payment processed successfully");
    }
}

type Input = {
    rideId: string,
    creditCardToken: string,
    amount: number
}