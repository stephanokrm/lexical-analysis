import type {NextApiRequest, NextApiResponse} from 'next';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

type Keys = 'int' | 'double' | 'float' | 'real' | 'break' | 'case' | 'char' | 'const' | 'continue';

type Token = string | {
    [Property in keyof Keys]: string;
}

interface Expression {
    token: Token;
    pattern: RegExp;
    symbol: boolean;
    multiple?: boolean;
}

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

    return {token, pattern, symbol: false, multiple: true};
};

const getComment = (): Expression => {
    return {
        token: 'COMENTÁRIO',
        pattern: /^\/\/.*$/,
        symbol: false,
    }
}

const getFloat = (): Expression => {
    return {
        token: 'NÚMERO REAL',
        pattern: /^\d{1,2}\.\d{1,2}$/,
        symbol: true
    }
}

const getInteger = (): Expression => {
    return {
        token: 'NÚMERO INTEIRO',
        pattern: /^\d{1,2}$/,
        symbol: true
    }
}

const getIdentifier = (): Expression => {
    return {
        token: 'IDENTIFICADOR',
        pattern: /^[a-zA-Z]*([a-zA-Z0-9]*)$/,
        symbol: true
    }
}


const expressions: Expression[] = [
    getKey(),
    getComment(),
    getFloat(),
    getInteger(),
    getIdentifier(),
];

const parser = () => {
    const symbols = {};
    const errors = [];

    const fn = (content: string, index: number): string => {
        const line = index + 1;

        for (let i = 0; i < expressions.length; i++) {
            if (expressions[i].pattern.test(content)) {
                const token = expressions[i].token;

                if (expressions[i].symbol) {
                    if (!symbols[content]) {
                        symbols[content] = Object.keys(symbols).length + 1;
                    }

                    return `[${line}] ${token} ${symbols[content]}`;
                }

                if (expressions[i].multiple) {
                    return `[${line}] ${token[content]}`;
                }

                return `[${line}] ${token}`;
            }
        }

        errors.push(`${line} (${content})`);
    };

    return {
        fn,
        getErrors: () => errors,
        getSymbols: () => Object
            .keys(symbols)
            .sort((previous, next) => symbols[previous] > symbols[next] ? 1 : -1)
            .map(symbol => `${symbols[symbol]}. ${symbol}`),
    };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        const identify = parser();
        const content = fs.readFileSync((files.file as formidable.File).filepath, 'utf8');
        const lines = content.split(/\r?\n/).map(identify.fn).filter(Boolean);

        res
            .status(200)
            .json({
                analysis: {
                    lines,
                    symbols: identify.getSymbols(),
                    errors: identify.getErrors(),
                },
            });
    })
}
