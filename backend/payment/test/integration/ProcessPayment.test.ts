import ProcessPayment from "../../src/application/usecase/ProcessPayment";
import DataBaseConnection, { PgPromisseAdapter } from "../../src/infra/database/DataBaseConnection";
import PaymentGetway, { CreditCardPaymentGetway } from "../../src/infra/gateway/PaymentGateway";
import TransactionRepository, { TransactionDataBaseRepository } from "../../src/infra/repository/TransactionRepository"
import crypto from "crypto";


let transactionRepository: TransactionRepository;
let processPayment: ProcessPayment;
let paymentGateway: PaymentGetway;
let connection: DataBaseConnection;

beforeEach(() => {
    connection = new PgPromisseAdapter();
    transactionRepository = new TransactionDataBaseRepository(connection);
    paymentGateway = new CreditCardPaymentGetway(transactionRepository);
    processPayment = new ProcessPayment(paymentGateway)
})


test("Deve persistir a transação após concluir a corrida", async function (){

    //Given
    const transactionInput = {
        rideId: crypto.randomUUID(),
        creditCardToken: crypto.randomUUID(),
        amount: 100
    }


    //When
    await paymentGateway.processPayment(transactionInput);
    const transaction = await transactionRepository.getTransactionByRideId(transactionInput.rideId);

    //Then
    expect(transaction.rideId).toBe(transactionInput.rideId);
    expect(transaction.amount).toBe(100);
    expect(transaction.status).toBe("SUCCESS");
    expect(transaction.date).toBeDefined();
})

afterEach(() => {
    connection.close();
})