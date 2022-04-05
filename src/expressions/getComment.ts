import {Expression} from "../types";

const getComment = (): Expression => {
    return {
        token: 'COMENTÁRIO',
        pattern: /^\/\/.*$/,
        isSymbol: false,
    }
}

export default getComment;
