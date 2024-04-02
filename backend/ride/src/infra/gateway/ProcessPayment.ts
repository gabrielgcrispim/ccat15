import axios from "axios";

export default interface ProcessPayment{

    creditcard(input: Input): Promise<void>;
}


export class CreditCardPaymentGetway implements ProcessPayment {

    async creditcard(input: Input): Promise<void> {
       await axios.post("http://localhost:3002/processPayment", input);
    }


}

type Input = {
    rideId: string,
    creditCardToken: string,
    amount: number
}