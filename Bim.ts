/// BIM (building information modeling)
/// Type definitions for bim 0.0.1
/// TypeScript Version: 4.8.3

import { Pool } from "pg"
import {
    BimConnectionImpl,
    QueryImpl,
    BimQueryOptions,
    BimJoinOptions,
    Connection,
    BimInsertQueryOptions,
    EntityResult,
} from "./types/bim-types"
import { processStr } from "./helpers/process-str"

export class Bim<T> {
    /**
     * Every field of the config object is entirely optional
     * The config passed to the pool is also passed to every client
     * instance within the pool when the pool creates that client
     */
    private dialect?: string = "postgres"
    private connection: BimConnectionImpl

    constructor(config: BimConnectionImpl) {
        this.connection = config
    }

    getPort(): number {
        return this.connection.connection.port
    }

    setPort(port: number): void {
        this.connection.connection.port = port
    }

    /**
     * @return {Pool}  pool - The object pool
     */
    private getConnection(): Pool {
        const { user, host, database, password, port }: Connection = this.connection.connection
        const pool: Pool = new Pool({
            user,
            host,
            database,
            password,
            port,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        })
        pool.connect((err, client, release) => {
            if (err) {
                return console.error("Error acquiring client", err.stack)
            } else {
                console.log("Successful connection")
                client.query("SELECT NOW()", (err, result) => {
                    release()
                    if (err) {
                        return console.error("Error executing query", err.stack)
                    }
                    console.log(result.rows)
                })
                return client
            }
        })
        return pool
    }

    /**
     * This method creates a pool connection and makes
     * the SQL query it comes from the params
     *
     * @param   {string}   table - The options for the database query such as the columns, tables, etc.
     * @return  {EntityResult}  entity - The entity found from the database with information on the action taken
     *
     */
    private async pgQuery(query: QueryImpl): EntityResult {
        const pool: Pool = this.getConnection()
        const entities: Promise<Array<T> | T | void> = await pool
        .query(query)
        .then((response) => {
            /**
             * If the array rows in length is zero that means the query
             * failed or a field was not correct and will throw an error
             */
            // if (response.rows.length === 0) {
            //     throw new Error("Entities not found in database")
            // }
            /**
             * If the array rows in length is one that means the method will
             * only one entity
             */
            if (response.rows.length === 1) {
                return response.rows[0]
            }
            return response.rows
        })
        .catch((err) => {
            throw new Error("Ups... something went wrong\n" + err.stack)
        })
        /// Close database connection
        pool.end().then(() => console.log("pool has ended"))
        /// Will always return a promise
        return entities
    }

    /**
     * The following method do a custom query
     *
     * @param   {BimQueryOptions}   query  - The SQL quey
     * @param   {BimQueryOptions}   action - The SQL action
     *
     * @return  {Entities}      entities - An array with the entities found from the database
     * @return  {void}          will not return anything in case the promise is not resolved and ends up in the catch
     * @return  {EntityResult}  entity - The entity found from the database with information on the action taken
     *
     */
    async customQuery(query: QueryImpl): EntityResult {
        return this.pgQuery(query)
    }

    /**
     * The following method selects all the columns from one table
     * This method returns all items from the database
     * By default it returns all attributes of a table
     *
     * @param   {BimQueryOptions}   params - The options for the database query such as the columns, tables, etc
     *
     * @return  {Entities}      entities - An array with the entities found from the database
     * @return  {void}          will not return anything in case the promise is not resolved and ends up in the catch
     * @return  {EntityResult}  entity - The entity found from the database with information on the action taken
     *
     */
    async select(table: string): EntityResult {
        let query: QueryImpl = { text: "" }
        query = { text: `SELECT * FROM ${table}` }
        return this.pgQuery(query)
    }

    /**
     * This method can return all attributes or only one attribute
     * The method getAll can receive conditions for the SQL consult
     *
     * @async
     * @function  getAll
     * @param     {BimQueryOptions}   params - The options for the database query such as the columns, tables, etc
     *
     * @return    {Promise<T>}      entity - The entity found from the database
     * @return    {Promise<void>}   will not return anything in case the promise is not resolved and ends up in the catch
     * @return    {EntityResult}    entity - The entity found from the database with information on the action taken
     *
     */
    async getAll(params: BimQueryOptions): EntityResult {
        let query: QueryImpl = { text: "" }
        const { tables, columns, colsCondition, conditions }: BimQueryOptions = params
        if (colsCondition) {
            const newConditions = processStr(colsCondition, conditions!)
            query = {
                text: `
                    SELECT ${columns}
                    FROM ${tables}
                    WHERE ${newConditions}
                `,
            }
        } else if (columns) {
            query = { text: `SELECT ${columns} FROM ${tables}` }
        }
        return this.pgQuery(query)
    }

    /**
     *
     * @async
     * @function  findOne
     * @param     {BimQueryOptions}   params - The options for the database query such as the columns, tables, etc
     *
     * @return    {Promise<T>}      entity - The entity found from the database
     * @return    {Promise<void>}   will not return anything in case the promise is not resolved and ends up in the catch
     * @return    {EntityResult}    entity - The entity found from the database with information on the action taken
     *
     */
     async findOne(params: BimQueryOptions): EntityResult {
        const { tables, columns, colsCondition, conditions }: BimQueryOptions = params
        const newConditions = processStr(colsCondition!, conditions!)
        let query: QueryImpl = {
            text: `
                SELECT ${columns}
                FROM ${tables}
                WHERE ${newConditions}
            `,
        }
        const pool: Pool = this.getConnection()
        const entities: Promise<T | void> = await pool
            .query(query)
            .then((response) => {
                return response.rows[0]
            })
            .catch((err) => {
                throw new Error("Ups... something went wrong\n" + err.stack)
            })
        pool.end().then(() => console.log("pool has ended"))
        return entities
    }

    /**
     * This method returns a database item using an identifier
     *
     * @async
     * @function  findOneById
     * @param     {BimQueryOptions}   params - The options for the database query such as the columns, tables, etc
     *
     * @return    {Promise<T>}      entity - The entity found from the database
     * @return    {Promise<void>}   will not return anything in case the promise is not resolved and ends up in the catch
     * @return    {EntityResult}    entity - The entity found from the database with information on the action taken
     *
     */
    async findOneById(params: BimQueryOptions): EntityResult {
        const { columns, tables, columnId, id, conditions, colsCondition } = params
        let query: QueryImpl = { text: "" }
        if (colsCondition) {
            const newConditions = processStr(colsCondition!, conditions!)
            query = {
                text: `
                    SELECT ${columns}
                    FROM ${tables}
                    WHERE ${newConditions}
                    AND ${columnId} = $1
                `,
                values: [id!],
            }
        } else {
            query = {
                text: `
                    SELECT ${columns}
                    FROM ${tables}
                    WHERE ${columnId} = $1
                `,
                values: [id!],
            }
        }

        return this.pgQuery(query)
    }

    /**
     * @alpha
     *
     * This method does a join on multiple tables
     *
     * @async
     * @function  join
     *
     * @param   {string[]}   keys    - The key relating two or more tables
     * @param   {string[]}   joins   - The join clause
     * @param   {string[]}   tables  - The tables where the join clause shall be executed
     * @param   {string[]}   columns - The columns where the records of the table will be modified
     * @return  {EntityResult}   entity - The entity found from the database with information on the action taken
     */
    async join(params: BimJoinOptions): EntityResult {
        const { keys, joins, tables, columns, colsCondition, conditions, columnId, id, }: BimJoinOptions = params
        let query: QueryImpl = { text: "" }
        let innerJoinQuery: string = ""
        if (colsCondition) {
            for (let i = 0; i < tables.length - 1; i++) {
                if (tables[i] !== undefined) {
                innerJoinQuery += `
                        ${joins} ${tables[i + 1]}
                        ON ${colsCondition![i]} = ${conditions![i]}\n
                    `
                }
            }
            const newConditions = processStr([columnId!], [id!])
            query = {
                text: `
                    SELECT ${columns}
                    FROM ${tables[0]}
                    ${innerJoinQuery} 
                    WHERE ${newConditions}
                `,
            }
        } else {
            for (let i = 0; i < tables.length; i++) {
                if (keys[i] !== undefined) {
                    innerJoinQuery += `
                        ${joins} ${tables[i + 1]}
                        ON ${tables[i]}.${keys[i]} = ${tables[i + 1]}.${keys[i]}\n
                    `
                }
            }
            query = { text: `SELECT ${columns} FROM ${tables[0]} ${innerJoinQuery}` }
        }
        return this.pgQuery(query)
    }

    /**
     * This method allows you to insert a single item into a table.
     *
     * @async
     * @function  insertInto
     *
     * @param     {string[]}     tables   - The table where the insert is to be made.
     * @param     {string[]}     values   - The values for all the columns of the table.
     * @param     {string[]}     colsName - The specific name of the columns
     * @param     {BimActions}   action   - SQL action (insert, delete, update, select)
     * @return    {EntityResult}    entity - The entity found from the database with information on the action taken
     */
    async insertInto(params: BimInsertQueryOptions): EntityResult {
        const { tables, values, colsName }: BimInsertQueryOptions = params
        let query: QueryImpl = { text: "" }
        let iter: Array<string> | undefined = values?.map((_value: string | number | boolean, index: number) => `$${index + 1}`)
        if (colsName) {
            query = {
                /// Specify both the column names and the values to be inserted
                text: `
                    INSERT INTO ${tables} (${colsName}) VALUES (${iter})
                    RETURNING *
                `,
                values,
            }
            return this.pgQuery(query)
        }
        query = {
            /**
             * If you are adding values for all the columns of the table,
             * you do not need to specify the column names in the SQL query.
             * However, make sure the order of the values is in the same
             * order as the columns in the table.
             */
            text: `
                INSERT INTO ${tables} VALUES (${iter})
                RETURNING *
            `,
            values,
        }
        return this.pgQuery(query)
    }

    /**
     * This method does a deletion of the database using a condition,
     * in this case an ID.
     * It does not delete the relationship, in that case use the 
     * deleteOnCascade method
     * 
     * @async
     * @function  findOneByIdAndDelete
     * 
     * @param     {string[]}     tables   - The table where the insert is to be made
     * @param     {string[]}     columnId - The name of the column where the ID can be identified
     * @param     {BimActions}   action   - SQL action (insert, delete, update, select)
     * 
     * @return    {Promise<T>}               entity - The entity found from the database
     * @return    {Promise<Array<T>>        entities - The entities found from the database
     * @return    {Promise<void>}   will not return anything in case the promise is not resolved and ends up in the catch
     * @return    {EntityResult}    entity - The entity found from the database with information on the action taken
     
    */
    async findOneByIdAndDelete(params: BimQueryOptions): EntityResult {
        const { tables, columnId, id }: BimQueryOptions = params
        const query: QueryImpl = {
            text: `
                DELETE FROM ${tables}
                WHERE ${columnId} = ${id}
                RETURNING *
            `,
        }
        return this.pgQuery(query)
    }

    /**
     * This method is used to modify the existing records in a table
     *
     * @async
     * @function  findOneByIdAndUpdate
     *
     * @param     {string[]}     tables   - The table where the insert is to be made
     * @param     {string[]}     columns  - The columns where the records of the table will be modified
     * @param     {string[]}     columnId - The name of the column where the ID can be identified
     * @param     {string}       id       - The ID
     * @param     {string[]}     values   - The new values
     * @param     {BimActions}   action   - SQL action (insert, delete, update, select)
     *
     * @return    {Promise<T>}               entity - The entity found from the database
     * @return    {Promise<Array<T>>        entities - The entities found from the database
     * @return    {Promise<void>}   will not return anything in case the promise is not resolved and ends up in the catch
     * @return    {EntityResult}    entity - The entity found from the database with information on the action taken
     *
     */
    async findOneByIdAndUpdate(params: BimQueryOptions): EntityResult {
        const { tables, columns, columnId, id, values }: BimQueryOptions = params
        let currentQuery: string = ""
        columns!.forEach((col, index) => {currentQuery += ` ${col} = $${index + 1},`})
        currentQuery = currentQuery.trimEnd().slice(0, -1)
        const query: QueryImpl = {
            text: `
                UPDATE ${tables}
                SET ${currentQuery}
                WHERE ${columnId} = '${id}'
                RETURNING *
            `,
            values,
        }
        return this.pgQuery(query)
    }
}
