import {Expression} from "../types";

const getIdentifier = (): Expression => {
    return {
        token: 'IDENTIFICADOR',
        pattern: /^[a-zA-Z][a-zA-Z0-9]*$/,
        isSymbol: true
    }
}

export default getIdentifier;
