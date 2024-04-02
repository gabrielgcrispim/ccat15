import ProcessPayment from "./application/usecase/ProcessPayment";
import Registry from "./infra/di/Registry";
import { CreditCardPaymentGetway } from "./infra/gateway/PaymentGateway";
import { ExpressAdapter } from "./infra/http/HttpServer";
import MainController from "./infra/http/MainController";

const httpServer = new ExpressAdapter();
const registry = Registry.getInstance();

const paymentGateway = new CreditCardPaymentGetway();
const processPayment = new ProcessPayment(paymentGateway);
const mainController = new MainController(httpServer);
registry.register("processPayment", processPayment);



httpServer.listen(3002);