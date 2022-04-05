import {Analysis, Expression, Symbols} from "./types";
import expressions from "./expressions";

const identify = (expression: Expression, content: string, line: number, symbols: Symbols): string => {
    const token = expression.token;

    if (expression.isSymbol) {
        return `[${line}] ${token} ${symbols[content]}`;
    }

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
    const errorsLines = [];
    const tokens = [];
    const symbols = {};

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        let identified = false;
        const lineContent = lines[lineIndex];
        const line = lineIndex + 1;

        for (let expressionIndex = 0; expressionIndex < expressions.length; expressionIndex++) {
            const expression = expressions[expressionIndex];

            if (expression.pattern.test(lineContent)) {
                if (expression.isSymbol && !symbols.hasOwnProperty(lineContent)) {
                    symbols[lineContent] = Object.keys(symbols).length + 1;
                }

                const result = identify(expression, lineContent, line, symbols);

                tokens.push(result);

                identified = true;

                break;
            }
        }

        if (!identified) {
            errorsLines.push(line);
            errors.push(`${line} (${lineContent})`);
        }
    }

    return {
        errors,
        tokens,
        errorsLines,
        symbols: getSymbols(symbols),
    };
};

export default analyse;
