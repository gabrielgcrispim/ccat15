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

      const response =  await axios.post("http://localhost:3001/signup", input);
      const responseData = response.data;
      const rawAcc = await axios.get(`http://localhost:3001/accounts/${responseData.accountId}`);
      const acc = rawAcc.data;
      expect(acc.name).toBe(input.name);
      expect(acc.email).toBe(input.email);
      expect(acc.cpf).toBe(input.cpf);
      expect(acc.isPassenger).toBe(input.isPassenger);     
});