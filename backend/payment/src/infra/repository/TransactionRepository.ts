import Transaction from "../../domain/Transaction";
import DataBaseConnection from "../database/DataBaseConnection"

export default interface TransactionRepository { 
        save(transaction: Transaction): Promise<void>
        getTransactionByRideId(rideId: string): Promise<Transaction>
}


export class TransactionDataBaseRepository implements TransactionRepository {

    constructor(readonly connection: DataBaseConnection) {
    }

    async save(transaction: Transaction): Promise<void> {
       await this.connection.query("insert into cccat15.transaction (transaction_id, ride_id, amount, date, status) values($1, $2, $3, $4, $5)", [transaction.transactionId, transaction.rideId, transaction.amount, transaction.date, transaction.status]);
    }

    async getTransactionByRideId(rideId: string): Promise<Transaction>{
      const [transaction] = await this.connection.query("select * from cccat15.transaction where ride_id = $1", [rideId]);
      return Transaction.restore(transaction.transaction_id, transaction.ride_id, parseFloat(transaction.amount), transaction.date, transaction.status);
        
    }

}