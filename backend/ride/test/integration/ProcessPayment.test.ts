import AcceptRide from "../../backend/ride/src/application/usecase/AcceptRide";
import FinishRide from "../../backend/ride/src/application/usecase/FinishRide";
import GetRide from "../../backend/ride/src/application/usecase/GetRide";
import ProcessPayment from "../../backend/ride/src/application/usecase/ProcessPayment";
import RequestRide from "../../backend/ride/src/application/usecase/RequestRide";
import Signup from "../../backend/ride/src/application/usecase/Signup";
import StartRide from "../../backend/ride/src/application/usecase/StartRide";
import UpdatePosition from "../../backend/ride/src/application/usecase/UpdatePosition";
import { PgPromisseAdapter } from "../../backend/ride/src/infra/database/DataBaseConnection";
import PaymentGetway, { CreditCardPaymentGetway } from "../../backend/ride/src/infra/gateway/PaymentGateway";
import AccountRepository, { AccountRepositoryDataBase } from "../../backend/ride/src/infra/repository/AccountRepository";
import PositionRepository, { PositionRepositoryDatabase } from "../../backend/ride/src/infra/repository/PositionRepository";
import RideRepository, { RideRepositoryDataBase } from "../../backend/ride/src/infra/repository/RideRepository";
import sinon from "sinon";


let accountRepostory : AccountRepository;
let rideRepository : RideRepository;
let signup : Signup;
let acceptRide : AcceptRide;
let requestRide : RequestRide;
let connection : PgPromisseAdapter
let startRide : StartRide;
let getRide : GetRide;
let updatePosition: UpdatePosition;
let positionRepository : PositionRepository;
let finishRide : FinishRide;
let processPayment : ProcessPayment;
let paymentGetway: PaymentGetway;


beforeEach(() => {
    connection = new PgPromisseAdapter();
    accountRepostory = new AccountRepositoryDataBase(connection);
    rideRepository = new RideRepositoryDataBase(connection);
    positionRepository = new PositionRepositoryDatabase(connection);
    signup = new Signup(accountRepostory);
    acceptRide = new AcceptRide(accountRepostory, rideRepository);
    requestRide = new RequestRide(accountRepostory, rideRepository);
    startRide = new StartRide(rideRepository);
    getRide  = new GetRide(rideRepository, accountRepostory);
    updatePosition = new UpdatePosition(positionRepository, rideRepository);
    paymentGetway = new CreditCardPaymentGetway();
    processPayment = new ProcessPayment(rideRepository, paymentGetway);
    finishRide = new FinishRide(rideRepository, processPayment);
});



test("Deve mudar o status da corrida para IN_PROGRESS apenas se o status anterior for ACCEPTED", async function(){
    const acountDriverInput = {
        "name" : "John Doe",
        "email": `john.doe${Math.random()}@gmail.com`,
        "cpf": "97456321558",
        "isDriver": true,
        "carPlate": "ABC1234"
    };
    const outPutDriverAccount = await signup.execute(acountDriverInput);

    const acountPassengerInput = {
        "name" : "John Doe",
        "email": `john.doe${Math.random()}@gmail.com`,
        "cpf": "97456321558",
        "isPassenger": true
    };
   const outPutPassengerAccount = await signup.execute(acountPassengerInput);
   const requestRideInput = {
        passengerId: outPutPassengerAccount.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }

    const outPutRequestRide = await requestRide.execute(requestRideInput);
    const inputAcceptRide = {
        rideId: outPutRequestRide.rideId,
        driverId: outPutDriverAccount.accountId
    }
    await acceptRide.execute(inputAcceptRide);

    const acceptedRide = await getRide.execute(outPutRequestRide.rideId);

   
    expect(acceptedRide.status).toBe("ACCEPTED");
    expect(acceptedRide.driverId).toBe(outPutDriverAccount.accountId);
    expect(acceptedRide.passengerId).toBe(outPutPassengerAccount.accountId);

   const startRideInput = {
        rideId: acceptedRide.rideId
    }

    await startRide.execute(startRideInput);

    const startedRide = await getRide.execute(outPutRequestRide.rideId);

    expect(startedRide.status).toBe("IN_PROGRESS");
    expect(startedRide.driverId).toBe(outPutDriverAccount.accountId);
    expect(startedRide.passengerId).toBe(outPutPassengerAccount.accountId);
  
    const inputPosition = {
        rideId: outPutRequestRide.rideId,
        lat: -27.496887588317275,
		long: -48.522234807851476
    }

    await updatePosition.execute(inputPosition);
    const lastPosition = await getRide.execute(outPutRequestRide.rideId);
    expect(lastPosition.distance).toBe(10);
    expect(lastPosition.lastLong).toBe(inputPosition.long);
    expect(lastPosition.lastLat).toBe(inputPosition.lat);

    const [updatedPosition] = await positionRepository.listByRideId(outPutRequestRide.rideId)
    expect(updatedPosition.getLat()).toBe(inputPosition.lat);
    expect(updatedPosition.getLong()).toBe(inputPosition.long);
    expect(updatedPosition.positionId).toBeDefined();
    expect(updatedPosition.rideId).toBe(outPutRequestRide.rideId);

    const finishRideInput = {
        rideId: acceptedRide.rideId
    }
    await finishRide.execute(finishRideInput);
    const finishedRide = await getRide.execute(outPutRequestRide.rideId);
    expect(finishedRide.status).toBe("COMPLETED");
    expect(finishedRide.fare).toBe(10 * 2.1);
    const inputProcessPayment = {
        rideId: finishedRide.rideId,
        creditCardToken: "creditCardToken",
        amount: finishedRide.fare
    }

    await processPayment.execute(inputProcessPayment);
    const paymentGatewayMock = sinon.mock(CreditCardPaymentGetway.prototype);
    paymentGatewayMock.expects("processPayment").withArgs("Credit card payment processed successfully").once();
});

afterEach( () => {
    connection.close();
})