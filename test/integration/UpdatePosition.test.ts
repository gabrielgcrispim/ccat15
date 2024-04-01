import AcceptRide from "../../backend/ride/src/application/usecase/AcceptRide";
import GetRide from "../../backend/ride/src/application/usecase/GetRide";
import RequestRide from "../../backend/ride/src/application/usecase/RequestRide";
import Signup from "../../backend/ride/src/application/usecase/Signup";
import StartRide from "../../backend/ride/src/application/usecase/StartRide";
import UpdatePosition from "../../backend/ride/src/application/usecase/UpdatePosition";
import DataBaseConnection, { PgPromisseAdapter } from "../../backend/ride/src/infra/database/DataBaseConnection";
import AccountRepository, { AccountRepositoryDataBase } from "../../backend/ride/src/infra/repository/AccountRepository";
import PositionRepository, { PositionRepositoryDatabase } from "../../backend/ride/src/infra/repository/PositionRepository";
import RideRepository, { RideRepositoryDataBase } from "../../backend/ride/src/infra/repository/RideRepository";

let rideRepository : RideRepository;
let positionRepository : PositionRepository;
let accountRepostory : AccountRepository;
let signup : Signup;
let acceptRide : AcceptRide;
let requestRide : RequestRide;
let connection : DataBaseConnection;
let startRide : StartRide;
let updatePosition : UpdatePosition;
let getRide : GetRide;

beforeEach(() => {
    connection = new PgPromisseAdapter();
    rideRepository = new RideRepositoryDataBase(connection);
    positionRepository = new PositionRepositoryDatabase(connection);
    accountRepostory = new AccountRepositoryDataBase(connection);
    signup = new Signup(accountRepostory);
    acceptRide = new AcceptRide(accountRepostory, rideRepository);
    requestRide = new RequestRide(accountRepostory, rideRepository);
    updatePosition = new UpdatePosition(positionRepository, rideRepository);
    startRide = new StartRide(rideRepository);
    getRide = new GetRide(rideRepository, accountRepostory);
});

test("Deve criar um novo registro na tabela position somente se o status da corrida estiver em IN_PROGRESS", async function() {

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
});

test("Deve lançar uma exceção se o status da corrida não for IN_PROGRESS", async function() {

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

    const inputPosition = {
        rideId: acceptedRide?.rideId,
        lat: -29.8790809890,
        long: -27.09809890,
    }
    await expect(updatePosition.execute(inputPosition)).rejects.toThrow(new Error("Ride must have IN_PROGRESS status"));
});

afterEach( () => {
    connection.close();
})