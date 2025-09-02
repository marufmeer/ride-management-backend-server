"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const handleValidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    errors.forEach((obj) => {
        errorSources.push({
            path: obj.path,
            message: obj.message
        });
    });
    return {
        statusCode: 400,
        message: err.message,
        errorSources
    };
};
exports.handleValidationError = handleValidationError;
