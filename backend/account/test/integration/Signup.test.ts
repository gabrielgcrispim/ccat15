import GetAccount from "../../src/application/usecase/GetAccount";
import Signup from "../../src/application/usecase/Signup";
import DataBaseConnection, { PgPromisseAdapter } from "../../src/infra/database/DataBaseConnection";
import MailerGateway from "../../src/infra/gateway/MailerGateway";
import { AccountRepositoryDataBase } from "../../src/infra/repository/AccountRepository";
import sinon from "sinon";


let signup: Signup;
let getAccount : GetAccount;
let connection : DataBaseConnection;
let accountRepository : AccountRepositoryDataBase;

//integration test setup
beforeEach(() => {
    connection = new PgPromisseAdapter();
    accountRepository = new AccountRepositoryDataBase(connection);
    signup = new Signup(accountRepository);
    getAccount = new GetAccount(accountRepository);
});


test("Deve criar uma conta de um passageiro", async function () {
    
        const input = {
            "name" : "John Doe",
            "email": `john.doe${Math.random()}@gmail.com`,
            "cpf": "97456321558",
            "isPassenger": true
        };

        const outPutSignUp = await signup.execute(input);
        expect(outPutSignUp.accountId).toBeDefined();
        const registeredUser = await getAccount.execute(outPutSignUp.accountId);
        expect(registeredUser.email).toBe(input.email);
        expect(registeredUser.name).toBe(input.name);
        expect(registeredUser.cpf).toBe(input.cpf);
        expect(registeredUser.isPassenger).toBe(input.isPassenger);
        
});

test("Deve criar uma conta de um motorista", async function () {
    
    const input = {
        "name" : "John Doe",
        "email": `john.doe${Math.random()}@gmail.com`,
        "cpf": "97456321558",
        "isDriver": true,
        "carPlate": "ABC1234"
    };

    const outPutSignUp = await signup.execute(input);
    expect(outPutSignUp.accountId).toBeDefined();
    const registeredUser = await getAccount.execute(outPutSignUp.accountId);

    expect(registeredUser.email).toBe(input.email);
    expect(registeredUser.name).toBe(input.name);
    expect(registeredUser.cpf).toBe(input.cpf);
    expect(registeredUser.isDriver).toBe(input.isDriver);
    
});

test("Deve lançar uma exceção caso nome esteja fora do padrão", async function () {
    
    const input = {
        "name" : "John",
        "email": `john.doe${Math.random()}@gmail.com`,
        "cpf": "97456321558",
        "isDriver": true,
        "carPlate": "ABC1234"
    };

   await expect(() => signup.execute(input)).rejects.toThrow(new Error("Name does not match"));
    
});


test("Deve lançar uma exceção caso email esteja fora do padrão", async function () {
    
    const input = {
        "name" : "John Doe",
        "email": `john.doe${Math.random()}`,
        "cpf": "97456321558",
        "isDriver": true,
        "carPlate": "ABC1234"
    };

   await expect(() => signup.execute(input)).rejects.toThrow(new Error("Email does not match"));
    
});

test("Deve lançar uma exceção caso cpf esteja fora do padrão", async function () {
    
    const input = {
        "name" : "John Doe",
        "email": `john.doe${Math.random()}@gmail.com`,
        "cpf": "974563215",
        "isDriver": true,
        "carPlate": "ABC1234"
    };

   await expect(() => signup.execute(input)).rejects.toThrow(new Error("CPF is not valid"));
    
});


test("Deve lançar uma exceção caso a placa do carro esteja fora do padrão", async function () {
    
    const input = {
        "name" : "John Doe",
        "email": `john.doe${Math.random()}@gmail.com`,
        "cpf": "97456321558",
        "isDriver": true,
        "carPlate": "ABC123"
    };

   await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"));
    
});


test("Deve lançar uma exceção caso a placa do carro esteja fora do padrão", async function () {
    
    const input = {
        "name" : "John Doe",
        "email": `john.doe${Math.random()}@gmail.com`,
        "cpf": "97456321558",
        "isPassenger": true
    };

    await signup.execute(input);
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Email already exsits"));
    
});

// test("Deve criar uma conta de um passageiro stub", async function () {
    
//     const input = {
//         "name" : "John Doe",
//         "email": `john.doe${Math.random()}@gmail.com`,
//         "cpf": "97456321558",
//         "isPassenger": true
//     };

//     const saveStub = sinon.stub(AccountDAODataBase.prototype, "save").resolves();
//     const emailStub = sinon.stub(AccountDAODataBase.prototype, "getByEmail").resolves();
//     const getByIdStub = sinon.stub(AccountDAODataBase.prototype, "getById").resolves(input);
//     const outPutSignUp = await signup.execute(input);
//     expect(outPutSignUp.accountId).toBeDefined();
//     const registeredUser = await getAccount.execute(outPutSignUp.accountId);
//     expect(registeredUser.email).toBe(input.email);
//     expect(registeredUser.name).toBe(input.name);
//     expect(registeredUser.cpf).toBe(input.cpf);
//     expect(registeredUser.isPassenger).toBe(input.isPassenger);
//     saveStub.restore();
//     emailStub.restore();
//     getByIdStub.restore();
    
// });


test("Deve criar uma conta de um passageiro spy", async function () {
    
    const input = {
        "name" : "John Doe",
        "email": `john.doe${Math.random()}@gmail.com`,
        "cpf": "97456321558",
        "isPassenger": true
    };


    
    const saveSpy = sinon.spy(AccountRepositoryDataBase.prototype, "save");
    const emailSpy = sinon.spy(AccountRepositoryDataBase.prototype, "getByEmail");

    const outPutSignUp = await signup.execute(input);
    expect(outPutSignUp.accountId).toBeDefined();
    const registeredUser = await getAccount.execute(outPutSignUp.accountId);
    expect(registeredUser.email).toBe(input.email);
    expect(registeredUser.name).toBe(input.name);
    expect(registeredUser.cpf).toBe(input.cpf);
    expect(registeredUser.isPassenger).toBe(input.isPassenger);
    expect(saveSpy.calledOnce).toBe(true);
    expect(emailSpy.calledOnce).toBe(true);
    saveSpy.restore();
    emailSpy.restore();
    
});

test("Deve criar uma conta de um passageiro mock", async function () {
    
    const input = {
        "name" : "John Doe",
        "email": `john.doe${Math.random()}@gmail.com`,
        "cpf": "97456321558",
        "isPassenger": true
    };


    
    const maiLerMock = sinon.mock(MailerGateway.prototype);
    maiLerMock.expects("send").withArgs("Welcome", input.email, "Use this link to confirm your account").once();
   

    const outPutSignUp = await signup.execute(input);
    expect(outPutSignUp.accountId).toBeDefined();
    const registeredUser = await getAccount.execute(outPutSignUp.accountId);
    expect(registeredUser.email).toBe(input.email);
    expect(registeredUser.name).toBe(input.name);
    expect(registeredUser.cpf).toBe(input.cpf);
    expect(registeredUser.isPassenger).toBe(input.isPassenger);
    maiLerMock.verify();
    maiLerMock.restore();
});



afterEach(async() => {
    await connection.close();
})