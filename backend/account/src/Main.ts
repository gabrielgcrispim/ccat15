import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
import {AccountRepositoryDataBase} from "./infra/repository/AccountRepository";
import { PgPromisseAdapter } from "./infra/database/DataBaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import MainController from "./infra/http/MainController";
import Registry from "./infra/di/Registry";

const httpServer = new ExpressAdapter();
const connection = new PgPromisseAdapter();
const accountRepository = new AccountRepositoryDataBase(connection);
const account = new GetAccount(accountRepository);
const signup = new Signup(accountRepository);
const registry = Registry.getInstance();
registry.register("signup", signup);
registry.register("account", account);
new MainController(httpServer);
httpServer.listen(3001);