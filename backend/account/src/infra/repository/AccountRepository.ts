import Account from "../../domain/Account";
import DataBaseConnection from "../database/DataBaseConnection";
import AccountModel from "../model/AccountModel";
import ORM from "../orm/ORM";

//Port
export default interface AccountRepository {
    save(account : Account): Promise<void>;
    getByEmail(email : string): Promise<Account | undefined>;
    getById(accountId : string): Promise<Account | undefined>;
}

//Adapter Database
export class AccountRepositoryORMDataBase implements AccountRepository {
    private orm : ORM;

    constructor(readonly connection : DataBaseConnection) {
        this.orm = new ORM(connection);
    }   

    async save(account: Account) {
            await this.orm.save(AccountModel.create(account));
        }
    async  getByEmail(email: string): Promise<Account | undefined> {
            const [account] = await this.connection.query("select * from cccat15.account where email = $1", [email]);;
            if(!account) return;
            return Account.restore(account.account_id, account.email, account.name, account.cpf, account.is_passenger, account.is_driver, account.car_plate);
        }
    async getById(accountId: string): Promise<Account | undefined> {
            const [account] = await this.connection.query("select * from cccat15.account where account_id = $1", [accountId]);
            if(!account) return;
            return Account.restore(account.account_id, account.email, account.name, account.cpf, account.is_passenger, account.is_driver, account.car_plate);
        }

}

//Adapter Database
export class AccountRepositoryDataBase implements AccountRepository {

        constructor(readonly connection : DataBaseConnection) {
        }

        async save(account: Account) {
                await this.connection.query("insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.getName(), account.getEmail(), account.getCpf(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver]);
            }
        async  getByEmail(email: string): Promise<Account | undefined> {
                const [account] = await this.connection.query("select * from cccat15.account where email = $1", [email]);;
                if(!account) return;
                return Account.restore(account.account_id, account.email, account.name, account.cpf, account.is_passenger, account.is_driver, account.car_plate);
            }
        async getById(accountId: string): Promise<Account | undefined> {
                const [account] = await this.connection.query("select * from cccat15.account where account_id = $1", [accountId]);
                if(!account) return;
                return Account.restore(account.account_id, account.email, account.name, account.cpf, account.is_passenger, account.is_driver, account.car_plate);
            }
    
}

//Adapter memory
export class AccountDAOMemory implements AccountRepository {
        accounts: any = [];

        async save(account: any): Promise<void> {
           return this.accounts.push(account);
        }
        async getByEmail(email: string): Promise<any> {
           return this.accounts.find((account: any) => account.email === email);
        }
        async getById(accountId: string): Promise<any> {
           return this.accounts.find((account: any) => account.accountId === accountId);
        }

}