import Registry from "../di/Registry";
import HttpServer from "./HttpServer";

export default class MainController {

    constructor(readonly httpServer: HttpServer) {
        const registry = Registry.getInstance();
        httpServer.register("/processPayment", "post", async function(params: any, body: any) {
            const response = await registry.inject("processPayment").execute(body);
            return response;
        })
    }
}