import {Expression} from "../types";
import getKey from "./getKey";
import getComment from "./getComment";
import getFloat from "./getFloat";
import getInteger from "./getInteger";
import getIdentifier from "./getIdentifier";

const expressions: Expression[] = [
    getKey(),
    getComment(),
    getFloat(),
    getInteger(),
    getIdentifier(),
];

export default expressions;
