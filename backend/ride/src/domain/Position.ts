import crypto from "crypto";
import Coord from "../vo/Coord";

export default class Position {
    private coord : Coord;
    private constructor (readonly positionId: string, readonly rideId : string, private lat : number, private long : number, readonly date : Date) {
        this.coord = new Coord(lat, long);
    }

    static create(rideId : string, lat : number, long : number) {
        const positionId = crypto.randomUUID();
        return new Position(positionId, rideId, lat, long, new Date());
    }

    static restore(positionId : string, rideId: string, lat: number, long: number, date: Date) {
        return new Position(positionId, rideId, lat, long, date);
    }


    getLat() {
        return this.coord.getLat();
    }

    getLong() {
        return this.coord.getLong();
    }

    getDate() {
        return this.date;
    }
}
