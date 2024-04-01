import AccountGetway from "./AccountGateway";
import axios  from "axios";

export class AccountGetwayHttp implements AccountGetway {

    async getById(accountId: string): Promise<any> {
        const output = await axios.get(`http://localhost:3001/accounts/${accountId}`);
        return output.data;
    }

    async signUp(input: any): Promise<any> {
         const output = await axios.post("http://localhost:3001/signup", input);
         return output.data;
    }

}