import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";
import Ride from "../../domain/Ride";

export default class RequestRide {
    constructor(readonly accountRepository : AccountRepository, readonly rideRepository: RideRepository){
    }

    async execute(input : Input): Promise<Output> {
        const account = await this.accountRepository.getById(input.passengerId);
        if(!account) throw new Error("Account does exists");
        if(!account.isPassenger) throw new Error("User is not a passenger");
        const [ride] = await this.rideRepository.getActivesRidesByPassengerId(account.accountId);
        if(ride && ride.getStatus() != "COMPLETED") throw new Error("New ride can't be created");
        const newRide = Ride.create(input.passengerId, 0, 0, input.fromLat, input.fromLong, input.toLat, input.toLong);
        this.rideRepository.save(newRide);
        return {
            rideId: newRide.rideId
        };
        
    }
}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
}

type Output = {
    rideId : string
}