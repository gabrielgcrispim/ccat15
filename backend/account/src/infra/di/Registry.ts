export default class Registry {

    private dependencies: {[name: string]: any};
    private static instance: Registry;

    private constructor () {
        this.dependencies = {};
    }
 
    register(name: string, instance: any){
        this.dependencies[name] = instance;
    }

    inject(name: string) {
        return this.dependencies[name];
    }

    static getInstance () {
        if(!this.instance) {
            this.instance = new Registry();
        }
        return this.instance;
    }
}

export function inject (name: string) {
    return function (target: any, propertyKey: string) {
        target[propertyKey] = new Proxy({}, ({
            get(target: any, propertyKey: string) {
                const dependency = Registry.getInstance().inject(name);
                return dependency[propertyKey];
            }
        }));
    }
}