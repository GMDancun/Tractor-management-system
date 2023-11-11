"use strict";
// This file contains specifics of the structure of my object and its properties
Object.defineProperty(exports, "__esModule", { value: true });
exports.TractorBooking = exports.Tractor = exports.Farmer = void 0;
var azle_1 = require("azle");
// This is a global variable that is stored on the heap
// Farmer
var Farmer = (0, azle_1.Record)({
    farmerId: azle_1.text,
    farmernatId: azle_1.nat64,
    farmer_Fname: azle_1.text,
    farmer_Lname: azle_1.text,
    location: azle_1.text,
    phoneNumber: azle_1.nat64,
    createdAt: azle_1.nat64,
    updatedAt: (0, azle_1.Opt)(azle_1.nat64)
});
exports.Farmer = Farmer;
// Tractor
var Tractor = (0, azle_1.Record)({
    tractorId: azle_1.nat64,
    tractorModel: azle_1.text,
    tractorBrand: azle_1.text,
    status: azle_1.bool,
    createdAt: azle_1.nat64,
    updatedAt: (0, azle_1.Opt)(azle_1.nat64)
});
exports.Tractor = Tractor;
// Tractor Booking
var TractorBooking = (0, azle_1.Record)({
    bookingId: azle_1.nat64,
    farmerId: azle_1.text,
    tractorId: azle_1.nat64,
    returnTractor: azle_1.bool,
    createdAt: azle_1.nat64,
    updatedAt: (0, azle_1.Opt)(azle_1.nat64)
});
exports.TractorBooking = TractorBooking;
// Error
