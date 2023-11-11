"use strict";
// This file contains all errors that will be displayed to the user incase a problem occurs
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = void 0;
var azle_1 = require("azle");
var Error = (0, azle_1.Variant)({
    NotFound: azle_1.text,
    InvalidTractorPayload: azle_1.text,
    TractorNotAvailable: azle_1.text,
    TractorBookingNotFound: azle_1.text,
    TractorNotFound: azle_1.text,
    NoRecordtoKeyIn: azle_1.text,
    TractorReturned: azle_1.text,
});
exports.Error = Error;
