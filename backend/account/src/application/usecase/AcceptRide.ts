import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {

    constructor(readonly accountRepostory : AccountRepository, readonly rideRepository : RideRepository){
    }

    async execute (input: Input): Promise<void> {
        const account = await this.accountRepostory.getById(input.driverId);
        if(!account) throw new Error("Account does not exists");
        if(!account.isDriver) throw new Error("It is not a driver account");
        const ride = await this.rideRepository.getByRideId(input.rideId);
        if(!ride) throw new Error("Ride does not exists");
        ride.accept(account.accountId);
        await this.rideRepository.update(ride);
    }
}


type Input = {
    rideId: string,
    driverId: string
}