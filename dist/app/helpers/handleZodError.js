"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (err) => {
    const errSources = [];
    const parseArrayOfZodErr = JSON.parse(err.message);
    const zodErrArray = parseArrayOfZodErr.map((obj) => ({
        path: obj.path[0],
        message: obj.message
    }));
    errSources.push(zodErrArray);
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources: errSources
    };
};
exports.handleZodError = handleZodError;
