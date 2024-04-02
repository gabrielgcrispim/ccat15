import pgp from "pg-promise";

export default interface DataBaseConnection {
        query(statement : string, params : any) : Promise<any>;
        close() : Promise<any>;
}   


export class PgPromisseAdapter implements DataBaseConnection {
    readonly connection : any;

    constructor () {
        this.connection =  pgp()("postgres://postgres:123456@localhost:5432/gabrielcrispim");
    }

   async query(statement: string, params: any): Promise<any> {
        return await this.connection.query(statement, params);
    }
   async close(): Promise<void> {
        return await this.connection.$pool.end();
    }

}