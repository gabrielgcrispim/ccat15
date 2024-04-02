import AccountGetway from "../../infra/gateway/AccountGateway";
import ProcessPayment from "../../infra/gateway/ProcessPayment";
import RideRepository from "../../infra/repository/RideRepository"

export default class FinishRide {

    constructor(readonly rideRepository: RideRepository, readonly processPayment: ProcessPayment, readonly accountGateway: AccountGetway){
    }

    async execute (input: Input): Promise<void> {
        const ride = await this.rideRepository.getByRideId(input.rideId);
        if(!ride) throw new Error("Ride does not exists")
        const account = await this.accountGateway.getById(ride.passengerId);
        if(!ride) throw new Error("Ride does not exists");
        ride.finish();
        await this.rideRepository.update(ride);
        const processPaymentInput = {
            rideId: ride.rideId,
            creditCardToken: account.creditCardToken,
            amount: ride.getFare()
        }
        this.processPayment.creditcard(processPaymentInput);
    }
}

type Input = {
    rideId: string
}