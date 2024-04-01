export default class Name {

    private value : string;

    constructor(name: string) {
        if(!this.isInvalidName(name)) throw new Error("Name does not match");
        this.value = name;
    }


    private isInvalidName(name: string) {
        return name.match(/[a-zA-Z] [a-zA-Z]+/);
    }

    getValue() {
        return this.value;
    }

}