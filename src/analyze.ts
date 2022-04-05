import {Analysis, Expression, Symbols} from "./types";
import expressions from "./expressions";

const identify = (expression: Expression, content: string, line: number, symbols: Symbols): string => {
    const token = expression.token;

    //retorna identificadores e constantes numéricas
    if (expression.isSymbol) {
        return `[${line}] ${token} ${symbols[content]}`;
    }

    //retorna palavras reservadas
    if (expression.isReserved) {
        return `[${line}] ${token[content]}`;
    }

    return `[${line}] ${token}`;
}

const getSymbols = (symbols: Symbols): string[] => {
    return Object
        .keys(symbols)
        .sort((previous, next) => symbols[previous] > symbols[next] ? 1 : -1)
        .map(symbol => `${symbols[symbol]}. ${symbol}`);
}

const analyse = (fileContent: string): Analysis => {
    const lines = fileContent.split(/\r?\n/);
    const errors = [];
    const tokens = [];
    const symbols = {};

    //percorre as linhas do arquivo
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        let identified = false;
        const lineContent = lines[lineIndex];
        const line = lineIndex + 1;

        //percorre as expressões para identificar o tipo de token
        for (let expressionIndex = 0; expressionIndex < expressions.length; expressionIndex++) {
            const expression = expressions[expressionIndex];

            //testa se o token corresponde a expressão regular
            if (expression.pattern.test(lineContent)) {
                if (expression.isSymbol && !symbols.hasOwnProperty(lineContent)) {
                    symbols[lineContent] = Object.keys(symbols).length + 1;
                }

                //identifica o tipo do token
                const result = identify(expression, lineContent, line, symbols);

                tokens.push(result);

                identified = true;

                break;
            }
        }

        //armazena erro caso token não seja identificado
        if (!identified) {
            errors.push(`${line} (${lineContent})`);
        }
    }

    return {
        errors,
        tokens,
        symbols: getSymbols(symbols),
    };
};

export default analyse;
