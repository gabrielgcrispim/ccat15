import crypto from "crypto";
import Coord from "../vo/Coord";
import DistanceCalculator from "../ds/DistanceCalculator";

//Entity
export default class Ride {
    private to : Coord;
    private from : Coord;
    private lastPosition: Coord;

    private constructor(readonly rideId : string, readonly passengerId : string, private status : string, private fare : number,
        private distance : number,  fromLat : number,  fromLong : number,  toLat : number, 
         toLong : number, readonly date : Date, lastLat: number, lastLong: number, private driverId? : string){
            this.to = new Coord(toLat, toLong);
            this.from = new Coord(fromLat, fromLong);
            this.lastPosition = new Coord(lastLat, lastLong)
    }


    static create (passengerId : string, fare : number,
         distance : number,  fromLat : number,  fromLong : number,  toLat : number,  toLong : number) {
        const rideId = crypto.randomUUID();
        const status = "REQUESTED";
        const date = new Date();
        return new Ride(rideId, passengerId, status, fare, 0, fromLat, fromLong, toLat, toLong, date, fromLat, fromLong);
    }

    static restore (rideId : string,passengerId : string, status : string,  fare : number,
       distance : number,  fromLat : number,  fromLong : number,  toLat : number,  toLong : number,  date : Date, lastLat : number, lastLong : number,  driverId? : string) {
       return new Ride(rideId, passengerId, status, fare, distance, fromLat, fromLong, toLat, toLong, date, lastLat, lastLong, driverId);
   }

    accept(driverId : string) {
        if(this.status != "REQUESTED") throw new Error("Ride must have REQUESTED status");
        this.driverId = driverId;
        this.status = "ACCEPTED";
    }

   start() {
        if(this.status != "ACCEPTED") throw new Error("Ride must have ACCEPTED status");
        this.status = "IN_PROGRESS";
    }

    finish() {
        if(this.status != "IN_PROGRESS") throw new Error("Ride must have IN_PROGRESS status");
        this.fare = this.distance * DistanceCalculator.getPricePerKm();
        this.status = "COMPLETED";
    }

    updatePosition(lat: number, long: number) {
        if(this.status != "IN_PROGRESS") throw new Error("Ride must have IN_PROGRESS status");
        const newLastPosition = new Coord(lat, long);
        this.distance += DistanceCalculator.calculateDistance(this.lastPosition, newLastPosition);
        this.lastPosition = newLastPosition;
    }

    getStatus() {
        return this.status;
    }

    getDriverId() {
        return this.driverId;
    }

    getFromLat() {
        return this.from.getLat();
    }

    getFromLong() {
        return this.from.getLong();
    }

    getToLat() {
        return this.to.getLat();
    }

    getToLong() {
        return this.to.getLong();
    }

    getDistance() {
       return this.distance;
    }

    getLastLat() {
        return this.lastPosition.getLat();
    }

    getLastLong() {
        return this.lastPosition.getLong();
    }

    getFare() {
        return this.fare;
    }

}