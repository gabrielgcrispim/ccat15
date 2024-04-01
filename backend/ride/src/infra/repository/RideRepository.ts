import  Ride from "../../domain/Ride";
import DataBaseConnection from "../database/DataBaseConnection";

//Port
export default interface RideRepository {
    save(ride : Ride) : Promise<void>;
    getByRideId(rideId : any) : Promise<Ride | undefined>;
    getActivesRidesByPassengerId(accountId : any) : Promise<Ride[]>;
    update(ride : Ride) : Promise<void>;
}


//Adapter
export class RideRepositoryDataBase implements RideRepository {
    constructor(readonly connection : DataBaseConnection){       
    }

    async save(ride: Ride): Promise<void> {
        await this.connection.query("insert into cccat15.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, last_lat, last_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)", 
                [ride.rideId, ride.passengerId, null, ride.getStatus(), ride.getFare(), ride.getDistance(), ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), ride.getLastLat(), ride.getLastLong(),  ride.date]);
    }
    
   async getByRideId(rideId: any): Promise<any> {   
        const[ride] =  await this.connection.query("select * from cccat15.ride where ride_id = $1", [rideId]);
        if(!ride) return;
        return Ride.restore(ride.ride_id, ride.passenger_id, ride.status, parseFloat(ride.fare), parseFloat(ride.distance), 
            parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.date, parseFloat(ride.last_lat), parseFloat(ride.last_long), ride.driver_id);
    }

   async getActivesRidesByPassengerId(accountId: any): Promise<any> {
        const rides =  await this.connection.query("select * from cccat15.ride where passenger_id = $1", [accountId]);
        if(!rides) return;
        const activeRides: Ride[] = [];
        for(const ride of rides) {
            activeRides.push(Ride.restore(ride.ride_id, ride.passenger_id, ride.status, ride.fare, ride.distance, 
                parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.toLat), parseFloat(ride.to_long), ride.date, parseFloat(ride.last_lat), parseFloat(ride.last_long), ride.driver_id));
        }
        return activeRides;
    }

   async update(ride : Ride): Promise<void> {
        await this.connection.query("update cccat15.ride set status = $1, driver_id = $2, last_lat = $3, last_long = $4, distance = $5, fare = $6 where ride_id = $7", [ride.getStatus(), ride.getDriverId(), ride.getLastLat(), ride.getLastLong(), ride.getDistance(), ride.getFare(), ride.rideId]);
    }
}