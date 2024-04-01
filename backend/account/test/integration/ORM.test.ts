import Account from "../../src/domain/Account";
import { PgPromisseAdapter } from "../../src/infra/database/DataBaseConnection";
import AccountModel from "../../src/infra/model/AccountModel";
import ORM from "../../src/infra/orm/ORM";
import { AccountRepositoryORMDataBase } from "../../src/infra/repository/AccountRepository";


test("Deve testar o ORM", async function() {

    const accountId = crypto.randomUUID();
    const accountModel = new AccountModel(accountId, "John Doe", "jonh.doe@gmail.com", "", "111.111.111-11", true, false);
    const connection = new PgPromisseAdapter();
    const orm = new ORM(connection);
    await orm.save(accountModel);
    const data = await orm.findById(AccountModel, "account_id", accountId);
    expect(data.accountId).toBe(accountId);
    expect(data.name).toBe("John Doe");
    expect(data.email).toBe("jonh.doe@gmail.com");
    expect(data.cpf).toBe("111.111.111-11");
    expect(data.isPassenger).toBe(true);
    expect(data.isDriver).toBe(false);
    connection.close();
});

test.only("Deve testar o ORM com um Aggregate real", async function() {

    const accountId = crypto.randomUUID();
    const account = Account.restore(accountId, "jonh.doe@gmail.com", "John Doe", "97456321558",  true, false,  "");
    const connection = new PgPromisseAdapter();
    const orm = new ORM(connection);
    const accountRepository = new AccountRepositoryORMDataBase(connection);
    await accountRepository.save(account);
    const data = await orm.findById(AccountModel, "account_id", accountId);
    expect(data.accountId).toBe(accountId);
    expect(data.name).toBe("John Doe");
    expect(data.email).toBe("jonh.doe@gmail.com");
    expect(data.cpf).toBe("97456321558");
    expect(data.isPassenger).toBe(true);
    expect(data.isDriver).toBe(false);
    connection.close();
});