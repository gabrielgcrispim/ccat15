import AccountRepository from "../../infra/repository/AccountRepository";
import AccountDAO, { AccountRepositoryDataBase } from "../../infra/repository/AccountRepository";


export default class GetAccount{

    constructor (readonly accountDAO : AccountRepository) {
    }

    async execute (accountId : string) {
            const account = await this.accountDAO.getById(accountId);
            if(!account) throw new Error("Account does not exists");
            return {
                accountId: account.accountId,
                name: account.getName(),
                email: account.getEmail(),
                cpf: account.getCpf(),
                isPassenger: account.isPassenger,
                isDriver: account.isDriver,
                carPlate: account.getCarPlate()
            };
    }
}

// export interface GetAccountAccountDAO{
//     getById(accountId : string): Promise<any>;
// }

