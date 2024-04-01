
import RequestRide from "./application/usecase/RequestRide";
import GetRide from "./application/usecase/GetRide";
import { RideRepositoryDataBase } from "./infra/repository/RideRepository";
import { PgPromisseAdapter } from "./infra/database/DataBaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import MainController from "./infra/http/MainController";
import Registry from "./infra/di/Registry";
import { AccountGetwayHttp } from "./infra/gateway/AccountGatewayHttp";

const httpServer = new ExpressAdapter();
const connection = new PgPromisseAdapter();
const accountGateway = new AccountGetwayHttp();
const rideRepository = new RideRepositoryDataBase(connection);
const getRide = new GetRide(rideRepository, accountGateway);
const requestRide = new RequestRide(accountGateway, rideRepository);
const registry = Registry.getInstance();;
registry.register("getRide", getRide);
registry.register("requestRide", requestRide);
new MainController(httpServer);
httpServer.listen(3000);