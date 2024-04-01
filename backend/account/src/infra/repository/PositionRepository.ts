import Position from "../../domain/Position";
import DataBaseConnection from "../database/DataBaseConnection"

export default interface PositionRepository {
    save(position : Position): Promise<void>
    listByRideId(rideId: string): Promise<Position[]>;
}

export class PositionRepositoryDatabase implements PositionRepository {

    constructor(readonly connection : DataBaseConnection){
    }

   async save(position: Position): Promise<void> {
       await this.connection.query("insert into cccat15.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)", [position.positionId, position.rideId, position.getLat(), position.getLong(), position.getDate()]);
    }

   async listByRideId(rideId: string): Promise<Position[]> {
     const positions =  await this.connection.query("select * from cccat15.position where ride_id = $1", [rideId]);
     const  positionsByRideID: Position[] = [];
     
        for(const position of positions) {
            positionsByRideID.push(Position.restore(position.position_id, position.ride_id, parseFloat(position.lat), parseFloat(position.long), position.date));
        }

        return positionsByRideID;
    }
}