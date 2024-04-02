import Account from "../../domain/Account"
import { Model, column, model } from "../orm/ORM"

@model("cccat15", "account")
export default class AccountModel extends Model{
    @column("account_id", true)
    accountId: string
    @column("name")
    name: string
    @column("email")
    email: string
    @column("car_plate")
    carPlate: string
    @column("cpf")
    cpf: string
    @column("is_passenger")
    isPassenger: boolean
    @column("is_driver")
    isDriver: boolean
    @column("credit_card_token")
    creditCardAToken: string

    constructor(accountId: string, name: string, email: string, carPlate: string, cpf: string, isPassanger: boolean = false, isDriver: boolean = false, creditCardToken: string){
        super();
        this.accountId = accountId;
        this.name = name;
        this.email = email;
        this.carPlate = carPlate;
        this.cpf = cpf;
        this.isPassenger = isPassanger;
        this.isDriver = isDriver;
        this.creditCardAToken = creditCardToken;
    }

    static create (account : Account) {
        return new AccountModel(account.accountId, account.getName(), account.getEmail(), account.getCarPlate() || "", account.getCpf(), account.isPassenger, account.isDriver, account.creditCardToken);
    }

     restoreFromModel () {
        return Account.restore(this.accountId, this.email, this.name, this.cpf, this.isPassenger, this.isDriver, this.creditCardAToken, this.carPlate);
    }
}