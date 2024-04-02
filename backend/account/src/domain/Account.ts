import crypto from "crypto";
import Name from "../vo/Name";
import Email from "../vo/Email";
import Cpf from "../vo/Cpf";
import CarPlate from "../vo/CarPlate";

export default class Account {
   private name : Name;
   private email : Email;
   private cpf : Cpf;
   private carPlate? : CarPlate;

   private constructor (readonly accountId : string, email: string, name : string, 
        cpf: string, readonly isPassenger : boolean, readonly isDriver : boolean, readonly creditCardToken : string,  carPlate?: string) {
            this.name = new Name(name);
            this.email = new Email(email);
            this.cpf = new Cpf(cpf);
            if(isDriver && carPlate) this.carPlate = new CarPlate(carPlate);
    }

    static create (email: string,  name : string,  cpf: string, isPassenger : boolean, isDriver: boolean, carPlate?: string) {
        const accountId = crypto.randomUUID();
        const creditCardAToken = crypto.randomUUID();
        return new Account(accountId, email, name, cpf, isPassenger, isDriver, creditCardAToken, carPlate);
    }

    static restore (accountId: string, email: string,  name : string,  cpf: string,  isPassenger : boolean,  isDriver : boolean, creditCardToken : string,  carPlate?: string) {
        return new Account(accountId, email, name, cpf, isPassenger, isDriver, creditCardToken, carPlate);
    }

    //VO
    getName() {
       return this.name.getValue();
    }

     //VO
    getEmail() {
        return this.email.getValue();
     }

      //VO
     getCpf() {
        return this.cpf.getValue();
     }

      //VO
     getCarPlate() {
        return this.carPlate?.getValue();
     }
}