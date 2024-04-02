export default class Registry {

    dependencies: {[name: string]: any};
    static instance : Registry;

    constructor() {
        this.dependencies = {};
    }

    register (name: string, instance: any) {
        this.dependencies[name] = instance;
    } 

    inject(name: string) {
        return this.dependencies[name];
    }


    static getInstance() {
        if(!this.instance){
            this.instance = new Registry();
        }

        return this.instance;
    }

}