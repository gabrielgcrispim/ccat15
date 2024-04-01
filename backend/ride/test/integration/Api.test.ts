import axios from "axios";

axios.defaults.validateStatus = function() {
  return true;
}

test("Deve criar uma conta passageiro", async function(){
        const input = {
            "name": "John Doe",
            "email": `john.doe${Math.random()}@gmail.com`,
            "cpf": "97456321558",
            "isPassenger": true
        }

      const response =  await axios.post("http://localhost:3000/signup", input);
      const responseData = response.data;
      const rawAcc = await axios.get(`http://localhost:3000/accounts/${responseData.accountId}`);
      const acc = rawAcc.data;
      expect(acc.name).toBe(input.name);
      expect(acc.email).toBe(input.email);
      expect(acc.cpf).toBe(input.cpf);
      expect(acc.isPassenger).toBe(input.isPassenger);     
});


test("Deve solicitar uma corrida", async function(){
  const inputSignUp = {
      "name": "John Doe",
      "email": `john.doe${Math.random()}@gmail.com`,
      "cpf": "97456321558",
      "isPassenger": true
  }

  const responseSignUp =  await axios.post("http://localhost:3000/signup", inputSignUp);

  const requestRideInput = {
    passengerId: responseSignUp.data.accountId,
    fromLat : 27.8990870709,
    fromLong: 28.89080970,
    toLat: -29.8790809890,
    toLong: -27.09809890
  }

  const responseRideId = await axios.post("http://localhost:3000/requestRide", requestRideInput)
  expect(responseRideId.data.rideId).toBeDefined();
  const responseGetRide = await axios.get(`http://localhost:3000/rides/${responseRideId.data.rideId}`);
  const responseGetRideData = responseGetRide.data;
  expect(responseSignUp.data.account_id).toBe(responseRideId.data.passenger_id);
  expect(responseGetRideData.rideId).toBe(responseRideId.data.rideId);
  expect(responseGetRideData.fromLat).toBe(requestRideInput.fromLat);
  expect(responseGetRideData.fromLong).toBe(requestRideInput.fromLong);
  expect(responseGetRideData.toLat).toBe(requestRideInput.toLat);
  expect(responseGetRideData.toLong).toBe(requestRideInput.toLong);
  expect(responseGetRideData.status).toBe("REQUESTED");
});

test("Não deve solicitar uma corrida se não for passageiro", async function(){
  const inputSignUp = {
      "name": "John Doe",
      "email": `john.doe${Math.random()}@gmail.com`,
      "cpf": "97456321558",
      "isPassenger": false,
      "isDrive": true
  }

  const responseSignUp =  await axios.post("http://localhost:3000/signup", inputSignUp);

  const requestRideInput = {
    passengerId: responseSignUp.data.accountId,
    fromLat : 27.8990870709,
    fromLong: 28.89080970,
    toLat: -29.8790809890,
    toLong: -27.09809890
  }

  const responseRideId = await axios.post("http://localhost:3000/requestRide", requestRideInput)
  const outRequestRide = responseRideId.data;
  expect(outRequestRide.message).toBe("User is not a passenger");
});


test("Não deve solicitar uma corrida se o passageiro tiver uma corrida ativa", async function(){
  const inputSignUp = {
      "name": "John Doe",
      "email": `john.doe${Math.random()}@gmail.com`,
      "cpf": "97456321558",
      "isPassenger": true,
      "isDrive": false
  }

  const responseSignUp =  await axios.post("http://localhost:3000/signup", inputSignUp);

  const requestRideInput = {
    passengerId: responseSignUp.data.accountId,
    fromLat : 27.8990870709,
    fromLong: 28.89080970,
    toLat: -29.8790809890,
    toLong: -27.09809890
  }
  await axios.post("http://localhost:3000/requestRide", requestRideInput);
  const responseRideId = await axios.post("http://localhost:3000/requestRide", requestRideInput)
  const outRequestRide = responseRideId.data;
  expect(outRequestRide.message).toBe("New ride can't be created");
});