import AcceptRide from "../../src/application/usecase/AcceptRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import { PgPromisseAdapter } from "../../src/infra/database/DataBaseConnection";
import AccountGetway from "../../src/infra/gateway/AccountGateway";
import { AccountGetwayHttp } from "../../src/infra/gateway/AccountGatewayHttp";
import RideRepository, { RideRepositoryDataBase } from "../../src/infra/repository/RideRepository";


let rideRepository : RideRepository;
let acceptRide : AcceptRide;
let requestRide : RequestRide;
let connection : PgPromisseAdapter
let getRide : GetRide;
let accountGateway: AccountGetway;

beforeEach(() => {
    connection = new PgPromisseAdapter();
    accountGateway = new AccountGetwayHttp();
    rideRepository = new RideRepositoryDataBase(connection);
    acceptRide = new AcceptRide(accountGateway, rideRepository);
    requestRide = new RequestRide(accountGateway, rideRepository);
    getRide = new GetRide(rideRepository, accountGateway);
});


test("Deve mudar o status da corrida para ACCEPTED caso a conta seja de um motorista", async function() {

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
    const outPutGetRide = await getRide.execute(ride.rideId);

    expect(outPutGetRide.passengerId).toBe(requestRideInput.passengerId);
    expect(outPutGetRide.passengerName).toBe("John Doe");
    expect(outPutGetRide.fromLat).toBe(requestRideInput.fromLat);
    expect(outPutGetRide.fromLong).toBe(requestRideInput.fromLong);
    expect(outPutGetRide.toLat).toBe(requestRideInput.toLat);
    expect(outPutGetRide.toLong).toBe(requestRideInput.toLong);
    expect(outPutGetRide.status).toBe("ACCEPTED");
    expect(outPutGetRide.driverId).toBe(outPutDriverAccount.accountId);
    expect(outPutGetRide.passengerId).toBe(outPutPassengerAccount.accountId);
    
   
});


test("Deve lançar uma exceção caso o status da corrida seja diferente de REQUESTED", async function() {

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
    await expect(acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Ride must have REQUESTED status"));
});



afterEach(async() => {
    await connection.close();
})