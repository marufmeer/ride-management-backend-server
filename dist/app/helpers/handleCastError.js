"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (err) => {
    const errorSources = [];
    errorSources.push({
        path: err.path,
        message: err.message
    });
    return {
        statusCode: 400,
        message: `Invalid value ${err.value} for field ${err.path}`,
        errorSources
    };
};
exports.handleCastError = handleCastError;
