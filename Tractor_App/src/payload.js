"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TractorBookingPayload = exports.TractorPayload = exports.FarmerPayload = void 0;
var azle_1 = require("azle");
exports.FarmerPayload = (0, azle_1.Record)({
    farmernatId: azle_1.nat64,
    farmer_Fname: azle_1.text,
    farmer_Lname: azle_1.text,
    location: azle_1.text,
    phoneNumber: azle_1.nat64,
});
exports.TractorPayload = (0, azle_1.Record)({
    tractorModel: azle_1.text,
    tractorBrand: azle_1.text,
});
exports.TractorBookingPayload = (0, azle_1.Record)({
    farmerId: azle_1.text,
    tractorId: azle_1.nat64,
});
