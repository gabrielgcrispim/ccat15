import Position from "../../domain/Position";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class UpdatePosition{

    constructor(readonly positionRepository : PositionRepository, readonly rideRepository : RideRepository){
    }

    async execute(input: Input){
        const ride = await this.rideRepository.getByRideId(input.rideId);
        if(!ride) throw new Error("Ride does not exists");
        ride.updatePosition(input.lat, input.long);
        this.rideRepository.update(ride);
        const position = Position.create(input.rideId, ride.getLastLat(), ride.getLastLong()); 
        await this.positionRepository.save(position);
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number
}