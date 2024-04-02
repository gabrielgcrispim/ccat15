import AccountRepository, { AccountRepositoryDataBase } from "../../infra/repository/AccountRepository";
import MailerGateway from "../../infra/gateway/MailerGateway";
import Account from "../../domain/Account";

//Use case 
export default class Signup {

	constructor (readonly accountRepository: AccountRepository) {
	}


	async execute(input: Input) {
			const existingEmail = await this.accountRepository.getByEmail(input.email);
			if (existingEmail) throw new Error("Email already exsits");
			const account = Account.create(input.email, input.name, input.cpf, input.isPassenger || false, input.isDriver || false, input.carPlate || "");
			await this.accountRepository.save(account);	
			const mailerGateway = new MailerGateway();
			mailerGateway.send("Welcome", input.email, "Use this link to confirm your account");
			return {
				accountId : account.accountId
			};
		}
}	

	
type Input = {
	name: string,
	email: string,
	cpf: string,
	isPassenger?: boolean,
	isDriver?: boolean,
	carPlate?: string
}
		