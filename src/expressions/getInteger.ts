import {Expression} from "../types";

const getInteger = (): Expression => {
    return {
        token: 'NÚMERO INTEIRO',
        pattern: /^\d{1,2}$/,
        isSymbol: true
    }
}

export default getInteger;
