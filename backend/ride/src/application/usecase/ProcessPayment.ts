import PaymentGetway from "../../infra/gateway/PaymentGateway"
import RideRepository from "../../infra/repository/RideRepository"

export default class ProcessPayment{


    constructor(readonly rideRepository: RideRepository, readonly paymentGateway: PaymentGetway) {
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