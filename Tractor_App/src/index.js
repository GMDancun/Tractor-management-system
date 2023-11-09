"use strict";
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
// This is a global variable that is stored on the heap
var FarmerPayload = (0, azle_1.Record)({
    farmernatId: azle_1.nat64,
    farmer_Fname: azle_1.text,
    farmer_Lname: azle_1.text,
    location: azle_1.text,
    phoneNumber: azle_1.nat64,
});
var TractorPayload = (0, azle_1.Record)({
    tractorModel: azle_1.text,
    tractorBrand: azle_1.text,
});
var TractorBookingPayload = (0, azle_1.Record)({
    farmerId: azle_1.text,
    tractorId: azle_1.nat64,
});
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
var Tractor = (0, azle_1.Record)({
    tractorId: azle_1.nat64,
    tractorModel: azle_1.text,
    tractorBrand: azle_1.text,
    status: azle_1.bool,
    createdAt: azle_1.nat64,
    updatedAt: (0, azle_1.Opt)(azle_1.nat64)
});
var TractorBooking = (0, azle_1.Record)({
    bookingId: azle_1.nat64,
    farmerId: azle_1.text,
    tractorId: azle_1.nat64,
    returnTractor: azle_1.bool,
    createdAt: azle_1.nat64,
    updatedAt: (0, azle_1.Opt)(azle_1.nat64)
});
// Error
var Error = (0, azle_1.Variant)({
    NotFound: azle_1.text,
    InvalidPayload: azle_1.text,
    TractorNotAvailable: azle_1.text,
    TractorBookingNotFound: azle_1.text,
    TractorNotFound: azle_1.text,
    NoRecordtoKeyIn: azle_1.text,
    TractorReturned: azle_1.text,
});
var mytractorId = 1001;
var mybookingId = 6200;
// DB: StableTreeMap
var FarmerStorage = (0, azle_1.StableBTreeMap)(azle_1.text, Farmer, 0);
var TractorStorage = (0, azle_1.StableBTreeMap)(azle_1.nat64, Tractor, 1);
var TractorBookingStorage = (0, azle_1.StableBTreeMap)(azle_1.nat64, TractorBooking, 3);
exports.default = (0, azle_1.Canister)({
    // Query calls complete quickly because they do not go through consensus
    //addFarmer: update
    // function: type([datatypes for the parameters], Return Type, (parameters)){}
    addFarmer: (0, azle_1.update)([FarmerPayload], (0, azle_1.Result)(Farmer, Error), function (farmerdetails) {
        if (Object.values(farmerdetails).some(function (v) { return v === undefined || v === ''; })) {
            return (0, azle_1.Err)({ NoRecordtoKeyIn: 'All farmer details must be filled' });
        }
        try {
            var farmer = __assign({ farmerId: (0, uuid_1.v4)(), createdAt: azle_1.ic.time(), updatedAt: azle_1.None }, farmerdetails);
            FarmerStorage.insert(farmer.farmerId, farmer);
            return (0, azle_1.Ok)(farmer);
        }
        catch (error) {
            return (0, azle_1.Err)({ NoRecordtoKeyIn: "The farmer of details not filled" });
        }
    }),
    // Read All Farmers
    getFarmer: (0, azle_1.query)([], (0, azle_1.Result)((0, azle_1.Vec)(Farmer), Error), function () {
        return (0, azle_1.Ok)(FarmerStorage.values());
    }),
    // Read a specific Farmer(id)
    getspecificFarmer: (0, azle_1.query)([azle_1.text], (0, azle_1.Result)(Farmer, Error), function (farmerId) {
        var specificFarmer = FarmerStorage.get(farmerId);
        if ("None" in specificFarmer) {
            return (0, azle_1.Err)({ NotFound: "The farmer of id ".concat(farmerId, " Not Found") });
        }
        return (0, azle_1.Ok)(specificFarmer.Some);
    }),
    // U -> Update the existing resources(id)
    updateFarmer: (0, azle_1.update)([azle_1.text, FarmerPayload], (0, azle_1.Result)(Farmer, Error), function (farmerId, farmerdetails) {
        var updateFarmer = FarmerStorage.get(farmerId);
        if ("None" in updateFarmer) {
            return (0, azle_1.Err)({ NotFound: "The farmer of id {farmerId} Not Found" });
        }
        var farmer = updateFarmer.Some;
        var modifiedFarmer = __assign(__assign(__assign({}, farmer), farmerdetails), { updatedAt: azle_1.None });
        FarmerStorage.insert(farmer.farmerId, modifiedFarmer);
        return (0, azle_1.Ok)(modifiedFarmer);
    }),
    //D -> Delete a resource/
    deleteFarmer: (0, azle_1.update)([azle_1.text], (0, azle_1.Result)(Farmer, Error), function (farmerId) {
        var deleteFarmer = FarmerStorage.remove(farmerId);
        if ("None" in deleteFarmer) {
            return (0, azle_1.Err)({ NotFound: "The farmer of id {farmerId} Not Found" });
        }
        return (0, azle_1.Ok)(deleteFarmer.Some);
    }),
    // Tractor Models
    //addTractor: update
    // function: type([datatypes for the parameters], Return Type, (parameters)){}
    addTractor: (0, azle_1.update)([TractorPayload], (0, azle_1.Result)(Tractor, Error), function (tractordetails) {
        // checks if the user has filled all the fields
        if (Object.values(tractordetails).some(function (v) { return v === undefined || v === ''; })) {
            return (0, azle_1.Err)({ NoRecordtoKeyIn: 'All tractor details must be filled' });
        }
        try {
            // Creating tractor object with provided details and additional properties
            var tractor = __assign({ tractorId: mytractorId, status: true, createdAt: azle_1.ic.time(), updatedAt: azle_1.None }, tractordetails);
            //insert Tractor details into Storage
            TractorStorage.insert(mytractorId, tractor);
            mytractorId += 1;
            return azle_1.Result.Ok(tractor);
        }
        catch (error) {
            return azle_1.Result.Err({ InvalidPayload: "Invalid tractor payload" });
        }
    }),
    // Read All Farmers
    getTractor: (0, azle_1.query)([], (0, azle_1.Result)((0, azle_1.Vec)(Tractor), Error), function () {
        return (0, azle_1.Ok)(TractorStorage.values());
    }),
    // Read a specific Tractor(id)
    getspecificTractor: (0, azle_1.query)([azle_1.nat64], (0, azle_1.Result)(Tractor, Error), function (tractorId) {
        var specificTractor = TractorStorage.get(tractorId);
        if ("None" in specificTractor) {
            return (0, azle_1.Err)({ NotFound: "The tractor of id ".concat(tractorId, " Not Found") });
        }
        return (0, azle_1.Ok)(specificTractor.Some);
    }),
    // Update the existing resources(id)
    updateTractor: (0, azle_1.update)([azle_1.nat64, TractorPayload], (0, azle_1.Result)(Tractor, Error), function (tractorId, tractordetails) {
        var updateTractor = TractorStorage.get(tractorId);
        if ("None" in updateTractor) {
            return (0, azle_1.Err)({ NotFound: "The tractor of id {tractorId} Not Found" });
        }
        var tractor = updateTractor.Some;
        var modifiedTractor = __assign(__assign(__assign({}, tractor), tractordetails), { updatedAt: azle_1.None });
        TractorStorage.insert(tractor.tractorId, modifiedTractor);
        return (0, azle_1.Ok)(modifiedTractor);
    }),
    deleteTractor: (0, azle_1.update)([azle_1.nat64], (0, azle_1.Result)(Tractor, Error), function (tractorId) {
        var deleteTractor = TractorStorage.remove(tractorId);
        if ("None" in deleteTractor) {
            return (0, azle_1.Err)({ NotFound: "The tractor of id {tractorId} Not Found" });
        }
        return (0, azle_1.Ok)(deleteTractor.Some);
    }),
    // Booking a tractor.
    bookTractor: (0, azle_1.update)([TractorBookingPayload], (0, azle_1.Result)(TractorBooking, Error), function (bookingpayload) {
        // checks if the user has filled all the fields
        if (Object.values(bookingpayload).some(function (v) { return v === undefined || v === ''; })) {
            return (0, azle_1.Err)({ NoRecordtoKeyIn: 'All booking details must be filled' });
        }
        try {
            var farmerId = bookingpayload.farmerId, tractorId = bookingpayload.tractorId;
            var bookingId = mybookingId;
            var mytractor = TractorStorage.get(tractorId);
            if ("None" in mytractor) {
                return (0, azle_1.Err)({ TractorNotFound: "Tractor with ID ".concat(tractorId, " not found") });
            }
            var tractorData = mytractor.Some;
            if (tractorData.status) {
                var booking = {
                    bookingId: mybookingId,
                    farmerId: bookingpayload.farmerId,
                    tractorId: bookingpayload.tractorId,
                    returnTractor: false,
                    createdAt: azle_1.ic.time(),
                    updatedAt: azle_1.None
                };
                TractorBookingStorage.insert(mybookingId, booking);
                mybookingId += 1;
                var modifiedTractor = __assign(__assign(__assign({}, tractorData), tractorData), { status: false });
                TractorStorage.insert(modifiedTractor.tractorId, modifiedTractor);
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
    returnTractorBooked: (0, azle_1.update)([azle_1.nat64], (0, azle_1.Result)(TractorBooking, Error), function (bookingId) {
        try {
            var booking = TractorBookingStorage.get(bookingId);
            if ("None" in booking) {
                return (0, azle_1.Err)({ TractorNotAvailable: "Booking not found" });
            }
            var bookingDetails = booking.Some;
            if (!(bookingDetails.returnTractor)) {
                var myoldtractor = TractorStorage.get(bookingDetails.tractorId);
                var tractorData = myoldtractor.Some;
                if (tractorData) {
                    // tractorData.status = false;
                    var updated_tractor = __assign(__assign(__assign({}, tractorData), tractorData), { status: true });
                    TractorStorage.insert(bookingDetails.tractorId, updated_tractor);
                    var updated_booking = __assign(__assign(__assign({}, bookingDetails), bookingDetails), { returnTractor: true });
                    TractorBookingStorage.insert(updated_booking.bookingId, updated_booking);
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
    getBooking: (0, azle_1.query)([], (0, azle_1.Result)((0, azle_1.Vec)(TractorBooking), Error), function () {
        return (0, azle_1.Ok)(TractorBookingStorage.values());
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
