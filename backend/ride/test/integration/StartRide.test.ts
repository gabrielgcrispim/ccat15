import AcceptRide from "../../src/application/usecase/AcceptRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import StartRide from "../../src/application/usecase/StartRide";
import { PgPromisseAdapter } from "../../src/infra/database/DataBaseConnection";
import AccountGetway from "../../src/infra/gateway/AccountGateway";
import { AccountGetwayHttp } from "../../src/infra/gateway/AccountGatewayHttp";
import RideRepository, { RideRepositoryDataBase } from "../../src/infra/repository/RideRepository";


let rideRepository : RideRepository;
let acceptRide : AcceptRide;
let requestRide : RequestRide;
let connection : PgPromisseAdapter
let startRide : StartRide;
let getRide : GetRide;
let accountGateway: AccountGetway;


beforeEach(() => {
    connection = new PgPromisseAdapter();
    accountGateway = new AccountGetwayHttp();
    rideRepository = new RideRepositoryDataBase(connection);
    acceptRide = new AcceptRide(accountGateway, rideRepository);
    requestRide = new RequestRide(accountGateway, rideRepository);
    startRide = new StartRide(rideRepository);
    getRide  = new GetRide(rideRepository, accountGateway);
    
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
        fromLat : 27.8990870709,
        fromLong: 28.89080970,
        toLat: -29.8790809890,
        toLong: -27.09809890
    }

    const ride = await requestRide.execute(requestRideInput);
    const inputAcceptRide = {
        rideId: ride.rideId,
        driverId: outPutDriverAccount.accountId
    }
    await acceptRide.execute(inputAcceptRide);

    const acceptedRide = await getRide.execute(ride.rideId);

   
    expect(acceptedRide.status).toBe("ACCEPTED");
    expect(acceptedRide.driverId).toBe(outPutDriverAccount.accountId);
    expect(acceptedRide.passengerId).toBe(outPutPassengerAccount.accountId);

   const startRideInput = {
        rideId: ride.rideId
    }

    await startRide.execute(startRideInput);

    const startedRide = await getRide.execute(ride.rideId);

    expect(startedRide.status).toBe("IN_PROGRESS");
    expect(startedRide.driverId).toBe(outPutDriverAccount.accountId);
    expect(startedRide.passengerId).toBe(outPutPassengerAccount.accountId);
});


test("Deve lançar uma exceção se o status for diferente de ACCEPTED", async function(){
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
        fromLat : 27.8990870709,
        fromLong: 28.89080970,
        toLat: -29.8790809890,
        toLong: -27.09809890
    }

    const ride = await requestRide.execute(requestRideInput);
    const inputAcceptRide = {
        rideId: ride.rideId,
        driverId: outPutDriverAccount.accountId
    }
    await acceptRide.execute(inputAcceptRide);

    const startRideInput = {
        rideId: ride.rideId
    }
    await startRide.execute(startRideInput);
    await expect(startRide.execute(startRideInput)).rejects.toThrowError(new Error("Ride must have ACCEPTED status"));
});


afterEach(async() => {
    await connection.close();
})