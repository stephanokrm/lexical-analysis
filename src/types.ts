export interface Analysis {
    tokens: string[];
    symbols: string[];
    errors: string[];
    errorsLines: number[];
}

export type Keys = 'int' | 'double' | 'float' | 'real' | 'break' | 'case' | 'char' | 'const' | 'continue';

export type Token = string | {
    [Property in keyof Keys]: string;
}

export interface Expression {
    token: Token;
    pattern: RegExp;
    isSymbol: boolean;
    isReserved?: boolean;
}

export type Symbols = { [key: string]: number };
