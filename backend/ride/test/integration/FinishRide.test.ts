import AcceptRide from "../../src/application/usecase/AcceptRide";
import FinishRide from "../../src/application/usecase/FinishRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import StartRide from "../../src/application/usecase/StartRide";
import UpdatePosition from "../../src/application/usecase/UpdatePosition";
import { PgPromisseAdapter } from "../../src/infra/database/DataBaseConnection";
import AccountGetway from "../../src/infra/gateway/AccountGateway";
import { AccountGetwayHttp } from "../../src/infra/gateway/AccountGatewayHttp";
import PositionRepository, { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import RideRepository, { RideRepositoryDataBase } from "../../src/infra/repository/RideRepository";
import ProcessPayment, { CreditCardPaymentGetway } from "../../src/infra/gateway/ProcessPayment";



let rideRepository : RideRepository;
let acceptRide : AcceptRide;
let requestRide : RequestRide;
let connection : PgPromisseAdapter
let startRide : StartRide;
let getRide : GetRide;
let updatePosition: UpdatePosition;
let positionRepository : PositionRepository;
let finishRide : FinishRide;
let processPayment: ProcessPayment;
let accountGateway: AccountGetway;


beforeEach(() => {
    connection = new PgPromisseAdapter();
    accountGateway = new AccountGetwayHttp();
    rideRepository = new RideRepositoryDataBase(connection);
    positionRepository = new PositionRepositoryDatabase(connection);
    acceptRide = new AcceptRide(accountGateway, rideRepository);
    requestRide = new RequestRide(accountGateway, rideRepository);
    startRide = new StartRide(rideRepository);
    getRide  = new GetRide(rideRepository, accountGateway);
    updatePosition = new UpdatePosition(positionRepository, rideRepository);
    processPayment = new CreditCardPaymentGetway();
    finishRide = new FinishRide(rideRepository, processPayment, accountGateway);
    
});



test("Deve mudar o status da corrida para IN_PROGRESS apenas se o status anterior for ACCEPTED", async function(){
    const acountDriverInput = {
        "name" : "John Doe",
        "email": `john.doe${Math.random()}@gmail.com`,
        "cpf": "97456321558",
        "isDriver": true,
        "carPlate": "ABC1234"
    };
    const outPutDriverAccount = await accountGateway.signUp(acountDriverInput);

    const acountPassengerInput = {
        "name" : "John Doe",
        "email": `john.doe${Math.random()}@gmail.com`,
        "cpf": "97456321558",
        "isPassenger": true
    };
   const outPutPassengerAccount = await accountGateway.signUp(acountPassengerInput);
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
    expect(processPayment).toBeDefined();
});


afterEach( () => {
    connection.close();
})