import PaymentGetway from "../../infra/gateway/PaymentGateway";


export default class ProcessPayment{


    constructor(readonly paymentGateway: PaymentGetway) {
    }
    
    async execute(input : Input): Promise<void>{
        this.paymentGateway.processPayment(input);
    }
}


type Input = {
    rideId: string,
    creditCardToken: string,
    amount: number
}