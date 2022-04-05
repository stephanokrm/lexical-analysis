import {Expression} from "../types";

const getFloat = (): Expression => {
    return {
        token: 'NÚMERO REAL',
        pattern: /^\d{1,2}\.\d{1,2}$/,
        isSymbol: true
    }
}

export default getFloat;
