import RideRepository from "../../infra/repository/RideRepository"
import ProcessPayment from "./ProcessPayment";

export default class FinishRide {

    constructor(readonly rideRepository: RideRepository, readonly processPayment: ProcessPayment){
    }

    async execute (input: Input): Promise<void> {
        const ride = await this.rideRepository.getByRideId(input.rideId);
        if(!ride) throw new Error("Ride does not exists");
        ride.finish();
        await this.rideRepository.update(ride);
        const processPaymentInput = {
            rideId: ride.rideId,
            creditCardToken: "creditCardToken",
            amount: ride.getFare()
        }
        this.processPayment.execute(processPaymentInput);
    }
}

type Input = {
    rideId: string
}