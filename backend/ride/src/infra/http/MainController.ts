
import HttpServer from "./HttpServer";
import Signup from "../../application/usecase/Signup";
import Registry, { inject } from "../di/Registry";

//Inteface Adapter
export default class MainController {
    @inject("signup")
    private signup?: Signup;
    
    constructor(httpServer : HttpServer) {
        const registry = Registry.getInstance();
        httpServer.register("post", "/signup", (params: any, body: any) => {
            const output = this.signup?.execute(body);
            return output;
        });
        
        httpServer.register("get", "/accounts/:accountId", async function (params: any, body: any) {
            const output = await registry.inject("account").execute(params.accountId);
            return output;
        });

        httpServer.register("post", "/requestRide", async function (params: any, body: any) {
            const output = await registry.inject("requestRide").execute(body);
            return output;
        });

        httpServer.register("get", "/rides/:rideId", async function (params: any, body: any) {
            const output = await registry.inject("getRide").execute(params.rideId);
            return output;
        });
    }
}