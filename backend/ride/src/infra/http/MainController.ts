
import HttpServer from "./HttpServer";
import Registry, { inject } from "../di/Registry";

//Inteface Adapter
export default class MainController {

    constructor(httpServer : HttpServer) {
        const registry = Registry.getInstance();
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