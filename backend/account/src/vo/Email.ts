export default class Email {

    private value : string;

    constructor(email: string) {
        if (!this.isInvalidEmail(email)) throw new Error("Email does not match");
        this.value = email;
    }


    private isInvalidEmail(email: string) {
        return email.match(/^(.+)@(.+)$/)
    }

    getValue() {
        return this.value;
    }

}