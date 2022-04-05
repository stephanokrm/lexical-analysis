import {Expression, Token} from "../types";

const getKey = (): Expression => {
    const keys = [
        'int',
        'double',
        'float',
        'real',
        'break',
        'case',
        'char',
        'const',
        'continue',
    ];

    const token = keys.reduce((tokens, token) => ({
        ...tokens,
        [token]: token.toUpperCase(),
    }), {}) as Token;

    const pattern = new RegExp(`^(${keys.join('|')})$`);

    return {token, pattern, isSymbol: false, isReserved: true};
};

export default getKey;
