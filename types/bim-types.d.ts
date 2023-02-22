export interface Connection {
    host:string
    port:number
    user:string
    password:string
    database:string
}

export interface BimConnectionImpl {
    provider:string | undefined
    url?: string
    connection: Connection
}

export interface BimQueryOptions {
    tables: Array<string>
    columns?: Array<string>
    id?: string | number
    columnId?: string
    status?: boolean
    conditions?: Array<string | number | boolean>
    colsCondition?: Array<string>
    values?: Array<string | number | boolean>
}

export interface BimJoinOptions extends BimQueryOptions {
    joins: Array<BimJoinTypes>
    keys: Array<string>
}
  
export interface QueryImpl {
    text: string
    values?: Array<string | number | boolean>
}

export interface BimInsertQueryOptions extends BimQueryOptions {
    colsName?: Array<string | boolean>
}

export type EntityResult = Promise<Array<T> | T | void>

export const enum BimActions {
    INSERT = "[ACTION] INSERTED",
    UPDATE = "[ACTION] UPDATED",
    DELETE = "[ACTION] DELETED",
    SELECT = "[ACTION] SELECT"
}

export const enum BimJoinTypes {
    CROSS = "CROSS JOIN",
    INNER = "INNER JOIN",
    LEFT = "LEFT OUTER JOIN",
    RIGHT = "RIGTH OUTER JOIN",
    FULL = "FULL OUTER JOIN"
}