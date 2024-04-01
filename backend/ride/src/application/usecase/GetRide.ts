import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";


export default class GetRide {
    constructor(readonly rideRepository : RideRepository, readonly accountRepository : AccountRepository) {
    }

    async execute (rideId : any): Promise<Output> {
        const ride =  await this.rideRepository.getByRideId(rideId);
        if(!ride) throw new Error("Ride dones not exists");
        const account = await this.accountRepository.getById(ride.passengerId);
        if(!account) throw new Error("Passenger not found");
        return {
            passengerId : ride.passengerId,
            driverId: ride.getDriverId(),
            rideId: ride.rideId,
            fromLat: ride.getFromLat(),
            fromLong: ride.getFromLong(),
            toLat: ride.getToLat(),
            toLong: ride.getToLong(),
            lastLat: ride.getLastLat(),
            lastLong: ride.getLastLong(),
            distance: ride.getDistance(),
            date: ride.date,
            status: ride.getStatus(),
            fare: ride.getFare(),
            passengerName : account.getName()
        };
    }
}


type Output = {
    passengerId: string, 
    driverId?: string,
    rideId : string, 
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    lastLat: number,
    lastLong: number,
    distance: number,
    status: string,
    fare: number,
    date: Date,
    passengerName : string;
}