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

    return {token, pattern};
};

const getComment = (): Expression => {
    return {
        token: 'COMENTÁRIO',
        pattern: /^\/\/.*$/,
    }
}

const getFloat = (): Expression => {
    return {
        token: 'NÚMERO REAL',
        pattern: /^\d{1,2}\.\d{1,2}$/,
    }
}

const getInteger = (): Expression => {
    return {
        token: 'NÚMERO INTEIRO',
        pattern: /^\d{1,2}$/,
    }
}

const getIdentifier = (): Expression => {
    return {
        token: 'IDENTIFICADOR',
        pattern: /^[a-zA-Z]*([a-zA-Z0-9]*)$/,
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
    const tokens = {};

    const fn = (content: string, index: number): string => {
        const line = index + 1;

        for (let i = 0; i < expressions.length; i++) {
            if (expressions[i].pattern.test(content)) {
                const token = expressions[i].token;

                const identifier = typeof token === 'string' ? token : token[content];

                if (!tokens[content]) {
                    tokens[content] = Object.keys(tokens).length + 1;
                }

                return `[${line}] ${identifier} ${tokens[content]}`;
            }
        }

        return `[${line}] ERRO`;
    };

    return {
        fn,
        tokens,
    };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        const identify = parser();
        const data = fs.readFileSync((files.file as formidable.File).filepath, 'utf8');
        const lines = data.split(/\r?\n/).map(identify.fn);

        console.log(identify.tokens);

        res.status(200).json({analysis: lines});
    })
}
