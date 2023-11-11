"use strict";
// This file contains all functions
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var azle_1 = require("azle");
var uuid_1 = require("uuid");
var payload_1 = require("./payload");
var blueprints_1 = require("./blueprints");
var errorblueprint_1 = require("./errorblueprint");
var db_1 = require("./db");
// This is a global variable that is stored on the heap
// let mytractorId: nat64 = 1001;
var mytractorId = BigInt(1000);
var mybookingId = BigInt(6200);
exports.default = (0, azle_1.Canister)({
    // Query calls complete quickly because they do not go through consensus
    //addFarmer: update
    // function: type([datatypes for the parameters], Return Type, (parameters)){}
    addFarmer: (0, azle_1.update)([payload_1.FarmerPayload], (0, azle_1.Result)(blueprints_1.Farmer, errorblueprint_1.Error), function (farmerdetails) {
        if (Object.values(farmerdetails).some(function (v) { return v === undefined || v === ''; })) {
            return (0, azle_1.Err)({ NoRecordtoKeyIn: 'All farmer details must be filled' });
        }
        try {
            var farmer = __assign({ farmerId: (0, uuid_1.v4)(), createdAt: azle_1.ic.time(), updatedAt: azle_1.None }, farmerdetails);
            db_1.FarmerStorage.insert(farmer.farmerId, farmer);
            return (0, azle_1.Ok)(farmer);
        }
        catch (error) {
            return (0, azle_1.Err)({ NoRecordtoKeyIn: "The farmer of details not filled" });
        }
    }),
    // Read All Farmers
    getFarmer: (0, azle_1.query)([], (0, azle_1.Result)((0, azle_1.Vec)(blueprints_1.Farmer), errorblueprint_1.Error), function () {
        return (0, azle_1.Ok)(db_1.FarmerStorage.values());
    }),
    // Read a specific Farmer(id)
    getspecificFarmer: (0, azle_1.query)([azle_1.text], (0, azle_1.Result)(blueprints_1.Farmer, errorblueprint_1.Error), function (farmerId) {
        var specificFarmer = db_1.FarmerStorage.get(farmerId);
        if ("None" in specificFarmer) {
            return (0, azle_1.Err)({ NotFound: "The farmer of id ".concat(farmerId, " Not Found") });
        }
        return (0, azle_1.Ok)(specificFarmer.Some);
    }),
    // U -> Update the existing resources(id)
    updateFarmer: (0, azle_1.update)([azle_1.text, payload_1.FarmerPayload], (0, azle_1.Result)(blueprints_1.Farmer, errorblueprint_1.Error), function (farmerId, farmerdetails) {
        var updateFarmer = db_1.FarmerStorage.get(farmerId);
        if ("None" in updateFarmer) {
            return (0, azle_1.Err)({ NotFound: "The farmer of id {farmerId} Not Found" });
        }
        var farmer = updateFarmer.Some;
        var modifiedFarmer = __assign(__assign({}, farmer), farmerdetails);
        db_1.FarmerStorage.insert(farmer.farmerId, modifiedFarmer);
        return (0, azle_1.Ok)(modifiedFarmer);
    }),
    //D -> Delete a resource/
    deleteFarmer: (0, azle_1.update)([azle_1.text], (0, azle_1.Result)(blueprints_1.Farmer, errorblueprint_1.Error), function (farmerId) {
        var deleteFarmer = db_1.FarmerStorage.remove(farmerId);
        if ("None" in deleteFarmer) {
            return (0, azle_1.Err)({ NotFound: "The farmer of id {farmerId} Not Found" });
        }
        return (0, azle_1.Ok)(deleteFarmer.Some);
    }),
    // Tractor Models
    //addTractor: update
    // function: type([datatypes for the parameters], Return Type, (parameters)){}
    addTractor: (0, azle_1.update)([payload_1.TractorPayload], (0, azle_1.Result)(blueprints_1.Tractor, errorblueprint_1.Error), function (tractordetails) {
        if (Object.values(tractordetails).some(function (v) { return v === undefined || v === ''; })) {
            return (0, azle_1.Err)({ NoRecordtoKeyIn: 'All tractor details must be filled' });
        }
        try {
            // Creating tractor object with provided details and additional properties
            var tractor = __assign({ tractorId: mytractorId, status: true, createdAt: azle_1.ic.time(), updatedAt: azle_1.None }, tractordetails
            // Assign individual properties from tractordetails
            // tractorModel: tractordetails.tractorModel,
            // tractorBrand: tractordetails.tractorBrand,
            );
            //insert Tractor details into Storage
            db_1.TractorStorage.insert(mytractorId, tractor);
            mytractorId = BigInt(mytractorId + BigInt(1));
            return azle_1.Result.Ok(tractor);
        }
        catch (error) {
            return azle_1.Result.Err({ InvalidTractorPayload: "Invalid tractor payload" });
        }
    }),
    // Read All Farmers
    getTractor: (0, azle_1.query)([], (0, azle_1.Result)((0, azle_1.Vec)(blueprints_1.Tractor), errorblueprint_1.Error), function () {
        return (0, azle_1.Ok)(db_1.TractorStorage.values());
    }),
    // Read a specific Tractor(id)
    getspecificTractor: (0, azle_1.query)([azle_1.nat64], (0, azle_1.Result)(blueprints_1.Tractor, errorblueprint_1.Error), function (tractorId) {
        var specificTractor = db_1.TractorStorage.get(tractorId);
        if ("None" in specificTractor) {
            return (0, azle_1.Err)({ NotFound: "The tractor of id ".concat(tractorId, " Not Found") });
        }
        return (0, azle_1.Ok)(specificTractor.Some);
    }),
    // Update the existing resources(id)
    updateTractor: (0, azle_1.update)([azle_1.nat64, payload_1.TractorPayload], (0, azle_1.Result)(blueprints_1.Tractor, errorblueprint_1.Error), function (tractorId, tractordetails) {
        var updateTractor = db_1.TractorStorage.get(tractorId);
        if ("None" in updateTractor) {
            return (0, azle_1.Err)({ NotFound: "The tractor of id {tractorId} Not Found" });
        }
        var tractor = updateTractor.Some;
        var modifiedTractor = __assign(__assign(__assign({}, tractor), tractordetails), { updatedAt: azle_1.None });
        db_1.TractorStorage.insert(tractor.tractorId, modifiedTractor);
        return (0, azle_1.Ok)(modifiedTractor);
    }),
    deleteTractor: (0, azle_1.update)([azle_1.nat64], (0, azle_1.Result)(blueprints_1.Tractor, errorblueprint_1.Error), function (tractorId) {
        var deleteTractor = db_1.TractorStorage.remove(tractorId);
        if ("None" in deleteTractor) {
            return (0, azle_1.Err)({ NotFound: "The tractor of id {tractorId} Not Found" });
        }
        return (0, azle_1.Ok)(deleteTractor.Some);
    }),
    // Booking a tractor.
    bookTractor: (0, azle_1.update)([payload_1.TractorBookingPayload], (0, azle_1.Result)(blueprints_1.TractorBooking, errorblueprint_1.Error), function (bookingpayload) {
        // checks if the user has filled all the fields
        if (Object.values(bookingpayload).some(function (v) { return v === undefined || v === ''; })) {
            return (0, azle_1.Err)({ NoRecordtoKeyIn: 'All booking details must be filled' });
        }
        try {
            var farmerId = bookingpayload.farmerId, tractorId = bookingpayload.tractorId;
            var bookingId = mybookingId;
            var mytractor = db_1.TractorStorage.get(tractorId);
            if ("None" in mytractor) {
                return (0, azle_1.Err)({ TractorNotFound: "Tractor with ID ".concat(tractorId, " not found") });
            }
            var tractorData = mytractor.Some;
            if (tractorData.status) {
                var booking = {
                    bookingId: bookingId,
                    farmerId: farmerId,
                    tractorId: tractorId,
                    returnTractor: false,
                    createdAt: azle_1.ic.time(),
                    updatedAt: azle_1.None
                };
                db_1.TractorBookingStorage.insert(bookingId, booking);
                mybookingId = BigInt(mybookingId + BigInt(1));
                var modifiedTractor = __assign(__assign(__assign({}, tractorData), tractorData), { status: false });
                db_1.TractorStorage.insert(modifiedTractor.tractorId, modifiedTractor);
                return (0, azle_1.Ok)(booking);
            }
            else {
                return (0, azle_1.Err)({ TractorNotAvailable: 'The Tractor is not available for booking' });
            }
        }
        catch (error) {
            return (0, azle_1.Err)({ TractorNotAvailable: 'An error occured}' });
            // return "failed";
        }
    }),
    // Cancel Tractor Booking function
    returnTractorBooked: (0, azle_1.update)([azle_1.nat64], (0, azle_1.Result)(blueprints_1.TractorBooking, errorblueprint_1.Error), function (bookingId) {
        try {
            var booking = db_1.TractorBookingStorage.get(bookingId);
            if ("None" in booking) {
                return (0, azle_1.Err)({ TractorNotAvailable: "Booking not found" });
            }
            var bookingDetails = booking.Some;
            if (!(bookingDetails.returnTractor)) {
                var myoldtractor = db_1.TractorStorage.get(bookingDetails.tractorId);
                var tractorData = myoldtractor.Some;
                if (tractorData) {
                    // tractorData.status = false;
                    var updated_tractor = __assign(__assign(__assign({}, tractorData), tractorData), { status: true });
                    db_1.TractorStorage.insert(bookingDetails.tractorId, updated_tractor);
                    var updated_booking = __assign(__assign(__assign({}, bookingDetails), bookingDetails), { returnTractor: true });
                    db_1.TractorBookingStorage.insert(updated_booking.bookingId, updated_booking);
                    return (0, azle_1.Ok)(updated_booking);
                }
                return (0, azle_1.Err)({ TractorReturned: "Tractor booking with ID ".concat(bookingId, " returned") });
            }
            else {
                return (0, azle_1.Err)({ TractorBookingNotFound: "Tractor booking with ID ".concat(bookingId, " not found") });
            }
        }
        catch (error) {
            return (0, azle_1.Err)({ TractorBookingNotFound: "Something Went Wrong Please try again" });
        }
    }),
    getBooking: (0, azle_1.query)([], (0, azle_1.Result)((0, azle_1.Vec)(blueprints_1.TractorBooking), errorblueprint_1.Error), function () {
        return (0, azle_1.Ok)(db_1.TractorBookingStorage.values());
    }),
});
// Cannister ends
// This code below enables the uuid to work on this app
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: function () {
        var array = new Uint8Array(32);
        for (var i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        return array;
    }
};
