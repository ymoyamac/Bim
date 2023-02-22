export class Bim<T> {
    constructor(config:BimConnectionImpl)

    readonly dialect?:string = "postgres"
    readonly connection:BimConnectionImpl

    private getConnection():Pool

    private pgQuery(query:QueryImpl):Promise<EntityResult<T>>

    select(table:string):Promise<EntityResult<T>>
    getAll(params:BimQueryOptions):Promise<EntityResult<T>>
    findOneById(params:BimQueryOptions):Promise<EntityResult<T>>
    join(params:BimJoinOptions):Promise<EntityResult<T>>
    insertInto(params: BimInsertQueryOptions):Promise<EntityResult<T>>
    findOneByIdAndDelete(params:BimQueryOptions):Promise<EntityResult<T>>
    findOneByIdAndUpdate(params:BimQueryOptions):Promise<EntityResult<T>>
}