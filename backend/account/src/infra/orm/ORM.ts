import DataBaseConnection from "../database/DataBaseConnection";

export default class ORM {

    constructor(readonly connection: DataBaseConnection) {
    }

    async save(model: any): Promise<void>{
       
        const columns = model.columns.map((column: any) => column.column).join(",");
        const values = model.columns.map((column: any, index: number) => `$${index += 1}`);
        const params = model.columns.map((column: any) => model[column.property])
        const query = `insert into ${model.schema}.${model.table} (${columns}) values(${values})`;
        await this.connection.query(query, params);
    }

    async findById(model: any, field: string, value: string): Promise<any> {
        const query = `select * from ${model.prototype.schema}.${model.prototype.table} where ${field} = $1`;
        const [data] = await this.connection.query(query, [value]);
        console.log(query);
        const obj = new model();
        for(const column of model.prototype.columns) {
            obj[column.property] = data[column.column];
        }
        return obj;
    }
}

export class Model {
    declare schema: string;
    declare table: string;
    declare columns: {property: string, column: string, pk: boolean}; 
    [key: string]: any;
}

export function model (schema: string, table: string) {
    return function(constructor: Function) {
        constructor.prototype.schema = schema;
        constructor.prototype.table = table;
    }
}

export function column (name: string, pk: boolean = false) {
    return function(target: any, propertyKey: string ) {
        target.columns = target.columns || [];
        target.columns.push({property: propertyKey, column: name, pk: pk})
    }
}



