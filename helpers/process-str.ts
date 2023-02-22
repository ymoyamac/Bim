export function processStr(colsCondition: Array<string>, conditions: Array<string | number | boolean>):string {
    let currentCol:string = ""
    for (let index = 0; index < colsCondition.length; index++) {
        if(colsCondition[index].includes(".")) {
            currentCol += `${colsCondition[index]} = ${conditions![index]} AND `
            continue
        }
        currentCol += `${colsCondition[index]} = '${conditions![index]}' AND `
    }
    /**
     * Removes the space at the end and the last three characters
     * @example
     * e_turno = $1 AND rol_id = $2 AND
     * e_turno = $1 AND rol_id = $2
     * 
     * @example
     * SELECT * FROM Empleados, Usuarios WHERE u_estado_civil = 'SOLTERO'
     *  AND e_turno = 'MAT'
     *  AND Usuarios.usuario_id = Empleados.usuario_id;
     */
    const conditionsCols:string = currentCol.trimEnd().slice(0, -3)
    return conditionsCols
}
