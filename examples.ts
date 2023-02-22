import { EmpleadoImpl } from "../src/interfaces";
import {Bim} from "./Bim";
import {
    BimInsertQueryOptions,
    BimQueryOptions,
    EntityResult,
    BimActions,
    BimJoinTypes,
    BimJoinOptions
} from "./types/bim-types";

interface Rol {
    rol_id: number
    rol_tipo:string
    rol_estatus: boolean
}

// const bim = new Bim<Empleado>({
//     provider: "postgres",
//     connection: {
//         host: "localhost",
//         port: 5432,
//         user: "ymoy",
//         password: "root",
//         database: "test_guarderia"
//     }
// })

const bim = new Bim<EmpleadoImpl>({
    provider: "postgres",
    connection: {
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "proot",
        database: "test_guarderia"
    }
})

// ;(async () => {
//     const empleado: EntityResult<Empleado> = await bim.select("Empleados", BimActions.SELECT)
//     console.log(empleado)
// })()

// ;(async () => {
//     const params:BimQueryOptions = {
//         id: "em4",
//         columnId: "empleado_id",
//         columns: ["*"],
//         tables: ["Empleados"]
//     }
//     const empleado: EntityResult<Empleado> = await bim.findOneById(params)
//     console.log(empleado)
// })()

// ;(async () => {
//     const params:BimQueryOptions = {
//         columns: ["*"],
//         tables: ["Empleados"],
//         columnsCondition: ["e_turno", "rol_id"],
//         conditions: ["MAT", 2]
//     }
//     const empleados: Array<Empleado> | void = await bim.getAll(params)
//     console.log(empleados)
// })()

// ;(async () => {
//     const usuarios: Empleado | Array<Empleado> | void = await bim.join({
//                 columns: ["*"],
//                 tables: ["Empleados", "Usuarios", "Direcciones"],
//                 joins: [BimJoinTypes.INNER],
//                 keys: ["usuario_id", "direccion_id"]
//             })
//     console.log(usuarios)
// })()

// ;(async () => {
//     const params:BimInsertQueryOptions = {
//         tables: ["Usuarios"],
//         values: ["usr888","Alejandro","Taboada","ale_taboa@mail.com","contraseña","SOLTERO","5929388342","5900202101", "true"]
//     }
//     const usuario: EntityResult<Usuario> = await bim.insertInto(params, BimActions.INSERT)
//     console.log(usuario)
// })()

// ;(async () => {
//     const params:BimQueryOptions = {
//         tables:["Roles"],
//         values:[3, "ROL_TEST", true]
//     }
//     const rol: EntityResult<Rol> = await bim.insertInto(params, BimActions.INSERT)
//     console.log(rol)
// })()

// ;(async () => {
//     const params:BimQueryOptions = {
//         tables:["Roles"],
//         colsCondition: ["rol_id"],
//         id: 3
//     }
//     const rol: EntityResult<Rol> = await bim.findOneByIdAndDelete(params, BimActions.DELETE)
//     console.log(rol)
// })()

// ;(async () => {
//     const rol: EntityResult<Rol> | void = await bim.select("Roles")
//     console.log(rol)
// })()

// ;(async () => {
//     const params:BimInsertQueryOptions = {
//         tables: ["Usuarios"],
//         values: ["test11","Test","Tst","test_1@test.com","contraseña","SOLTERO","5000000000","5000000000", true]
//     }
//     const usuario: EntityResult<Usuario> = await bim.insertInto(params, BimActions.INSERT)
//     console.log(usuario)
// })()

// ;(async () => {
//     const params:BimInsertQueryOptions = {
//         tables: ["Lugar_Nacimiento"],
//         values: ["test-mx123", "México", "CDMX", "Ciudad de México", true, "test11"]
//     }
//     const usuario: EntityResult<Usuario> = await bim.insertInto(params, BimActions.INSERT)
//     console.log(usuario)
// })()

// ;(async () => {
//     const params:BimInsertQueryOptions = {
//         tables: ["Usuarios"],
//         columnId: "usuario_id",
//         values: ["test11"]
//     }
//     const usuario: EntityResult<Usuario> = await bim.findOneByIdAndDelete(params, BimActions.INSERT)
//     console.log(usuario)
// })()

// ;(async () => {
//     const params:BimInsertQueryOptions = {
//         tables: ["Usuarios"],
//         columns: ["u_nombre", "u_apellido", "u_password", "u_telefono_casa", "u_celular"],
//         columnId: "usuario_id",
//         id: "test11",
//         values: ["Test UPDATE","Tst UPDATE", "12345678", "5000000001","5000000001"]
//     }
//     const usuario: EntityResult<Usuario> = await bim.findOneByIdAndUpdate(params, BimActions.UPDATE)
//     console.log(usuario)
// })()


    // const params:BimQueryOptions = {
    //         columns: ["*"],
    //         tables: ["Empleados"],
    //         columnsCondition: ["e_turno", "rol_id"],
    //         conditions: ["MAT", 2]
    //     }
;(async () => {
    const params:BimQueryOptions | BimJoinOptions = {
        // SELECT * FROM Empleados, Usuarios WHERE u_estado_civil = 'SOLTERO'
        // AND e_turno = 'MAT'
        // AND Usuarios.usuario_id = Empleados.usuario_id;
        // columns: ["*"],
        // tables: ["Empleados", "Usuarios"],
        // colsCondition: ["u_estado_civil", "e_turno", "Empleados.usuario_id"],
        // conditions: ["SOLTERO", "MAT", "Usuarios.usuario_id"]
        // const empleados: EntityResult<Empleado> | void = await bim.getAll(params)


        // SELECT * FROM Empleados, Usuarios, Direcciones
        // WHERE e_estatus = true
        // AND Usuarios.usuario_id = Empleados.usuario_id
        // AND Direcciones.usuario_id = Usuarios.usuario_id;
        columns: ["*"],
        tables: ["Empleados", "Usuarios", "Roles", "Direcciones"],
        colsCondition: ["u_estatus", "u_estado_civil", "Usuarios.usuario_id", "Roles.rol_id", "rol_tipo", "Direcciones.usuario_id"],
        conditions: [true, "SOLTERO", "Empleados.usuario_id", "Empleados.rol_id", "EMPLEADO_ROL", "Usuarios.usuario_id"]
        // const empleados: EntityResult<Empleado> | void = await bim.getAll(params)


                
        // SELECT * FROM Empleados
        // INNER JOIN Usuarios
        // ON Empleados.usuario_id = Usuarios.usuario_id
        // INNER JOIN Direcciones
        // ON Usuarios.usuario_id = Direcciones.usuario_id
        // WHERE e_turno = 'MAT';
        // columns: ["*"],
        // tables: ["Roles", "Empleados", "Usuarios"],
        // colsCondition: ["e_turno", "rol_tipo"],
        // conditions: ['MAT', "EMPLEADO_ROL"],
        // joins: [BimJoinTypes.INNER],
        // keys: ["rol_id", "usuario_id"]
        // const empleados: EntityResult<Empleado> | void = await bim.join(params)

    }
    const query = {
        text: `SELECT * FROM Empleados, Usuarios WHERE u_estado_civil = 'SOLTERO'
        AND e_turno = 'MAT'
        AND Usuarios.usuario_id = Empleados.usuario_id`
    }
    const empleados: EntityResult<EmpleadoImpl> | void = await bim.getAll(params)
    console.log(empleados)
})()