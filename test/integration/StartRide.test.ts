import AcceptRide from "../../backend/ride/src/application/usecase/AcceptRide";
import GetRide from "../../backend/ride/src/application/usecase/GetRide";
import RequestRide from "../../backend/ride/src/application/usecase/RequestRide";
import Signup from "../../backend/ride/src/application/usecase/Signup";
import StartRide from "../../backend/ride/src/application/usecase/StartRide";
import { PgPromisseAdapter } from "../../backend/ride/src/infra/database/DataBaseConnection";
import AccountRepository, { AccountRepositoryDataBase } from "../../backend/ride/src/infra/repository/AccountRepository";
import RideRepository, { RideRepositoryDataBase } from "../../backend/ride/src/infra/repository/RideRepository";


let accountRepostory : AccountRepository;
let rideRepository : RideRepository;
let signup : Signup;
let acceptRide : AcceptRide;
let requestRide : RequestRide;
let connection : PgPromisseAdapter
let startRide : StartRide;
let getRide : GetRide;


beforeEach(() => {
    connection = new PgPromisseAdapter();
    accountRepostory = new AccountRepositoryDataBase(connection);
    rideRepository = new RideRepositoryDataBase(connection);
    signup = new Signup(accountRepostory);
    acceptRide = new AcceptRide(accountRepostory, rideRepository);
    requestRide = new RequestRide(accountRepostory, rideRepository);
    startRide = new StartRide(rideRepository);
    getRide  = new GetRide(rideRepository, accountRepostory);
    
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