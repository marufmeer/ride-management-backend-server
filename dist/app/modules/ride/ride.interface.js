"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT = exports.allowedDriverTransitions = exports.Status = exports.PAYMENT_METHOD = void 0;
var PAYMENT_METHOD;
(function (PAYMENT_METHOD) {
    PAYMENT_METHOD["CASH"] = "CASH";
})(PAYMENT_METHOD || (exports.PAYMENT_METHOD = PAYMENT_METHOD = {}));
var Status;
(function (Status) {
    Status["REQUESTED"] = "REQUESTED";
    Status["CANCELLED"] = "CANCELLED";
    Status["REJECTED"] = "REJECTED";
    Status["ACCEPTED"] = "ACCEPTED";
    Status["PICKED_UP"] = "PICKED_UP";
    Status["IN_TRANSIT"] = "IN_TRANSIT";
    Status["COMPLETED"] = "COMPLETED";
})(Status || (exports.Status = Status = {}));
exports.allowedDriverTransitions = {
    [Status.REQUESTED]: [Status.ACCEPTED, Status.REJECTED],
    [Status.ACCEPTED]: [Status.PICKED_UP, Status.IN_TRANSIT],
    [Status.PICKED_UP]: [Status.IN_TRANSIT, Status.COMPLETED],
    [Status.IN_TRANSIT]: [Status.COMPLETED],
    [Status.COMPLETED]: [],
    [Status.REJECTED]: [],
    [Status.CANCELLED]: [],
};
var PAYMENT;
(function (PAYMENT) {
    PAYMENT["PAID"] = "PAID";
    PAYMENT["UNPAID"] = "UNPAID";
})(PAYMENT || (exports.PAYMENT = PAYMENT = {}));
