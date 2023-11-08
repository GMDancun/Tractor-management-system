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
// MessagePayload, Message, Err -> Models
var FarmerPayload = (0, azle_1.Record)({
    farmernatid: azle_1.nat64,
    farmer_fname: azle_1.text,
    farmer_lname: azle_1.text,
    location: azle_1.text,
    phonenumber: azle_1.nat64,
});
var TractorPayload = (0, azle_1.Record)({
    tractorModel: azle_1.text,
    tractorbrand: azle_1.nat64,
});
var servType = (0, azle_1.Variant)({
    cropPlanting: azle_1.text,
    cropHarvesting: azle_1.text
});
var ServicePayload = (0, azle_1.Record)({
    tractorid: azle_1.text,
    farmerid: azle_1.text,
    ServiceType: servType,
    // ServiceCategory: text,
    SizeofLand: azle_1.nat64,
    // Service_charges: nat64,
    // ModeofPayment: text,
});
// const servCategory = Variant({
//     cropPlanting: text,
//     cropHarvesting: text
// });
// const serviceCategory = Variant({
//     Fire: Null,
//     ThumbsUp: Null,
//     Emotion: Emotion
// });
// Message
var Farmer = (0, azle_1.Record)({
    farmerid: azle_1.text,
    farmernatid: azle_1.nat64,
    farmer_fname: azle_1.text,
    farmer_lname: azle_1.text,
    location: azle_1.text,
    phonenumber: azle_1.nat64,
    createdAt: azle_1.nat64,
    updatedAt: (0, azle_1.Opt)(azle_1.nat64)
});
var Tractor = (0, azle_1.Record)({
    tractorModel: azle_1.text,
    tractorbrand: azle_1.nat64,
    tractorId: azle_1.nat64,
    status: azle_1.bool,
    createdAt: azle_1.nat64,
    updatedAt: (0, azle_1.Opt)(azle_1.nat64)
});
var Service = (0, azle_1.Record)({
    Serviceid: azle_1.nat64,
    tractorid: azle_1.text,
    farmerid: azle_1.text,
    ServiceType: servType,
    // ServiceCategory: text,
    SizeofLand: azle_1.nat64,
    // Service_charges: nat64,
    // ModeofPayment: text,
});
//
// const Message = Record({
//     id: text,
//     title: text,
//     body: text,
//     attchmentUrl: text,
//    b56ff121-81aa-4b07-a00d-a096182b894c createdAt: nat64,
//     updatedAt: Opt(nat64)
//
// });
// Error
var Error = (0, azle_1.Variant)({
    NotFound: azle_1.text,
    InvalidPayload: azle_1.text
});
var myServiceId = 10000;
var myid = 1001;
// Message DB: StableTreeMap
// orthogonal/Transparent Persistence - it maintain the state
var FarmerStorage = (0, azle_1.StableBTreeMap)(azle_1.text, Farmer, 1);
var TractorStorage = (0, azle_1.StableBTreeMap)(azle_1.nat64, Tractor, 2);
var ServiceStorage = (0, azle_1.StableBTreeMap)(azle_1.nat64, Service, 3);
exports.default = (0, azle_1.Canister)({
    // Query calls complete quickly because they do not go through consensus
    // create CRUD Application
    //C -> one is able to create a resource to the cannister(update), e.g Employees app
    //addMessage: update
    // function: type([datatypes for the parameters], Return Type, (parameters)){}
    addFarmer: (0, azle_1.update)([FarmerPayload], (0, azle_1.Result)(Farmer, Error), function (farmerdetails) {
        var farmer = __assign({ farmerid: (0, uuid_1.v4)(), createdAt: azle_1.ic.time(), updatedAt: azle_1.None }, farmerdetails);
        FarmerStorage.insert(farmer.farmerid, farmer);
        return (0, azle_1.Ok)(farmer);
    }),
    // R -> Read resources excisting on the canister(query)
    // Read All Farmers
    getFarmer: (0, azle_1.query)([], (0, azle_1.Result)((0, azle_1.Vec)(Farmer), Error), function () {
        return (0, azle_1.Ok)(FarmerStorage.values());
    }),
    // Read a specific Farmer(id)
    getspecificFarmer: (0, azle_1.query)([azle_1.text], (0, azle_1.Result)(Farmer, Error), function (farmerid) {
        var specificFarmer = FarmerStorage.get(farmerid);
        if ("None" in specificFarmer) {
            return (0, azle_1.Err)({ NotFound: "The farmer of id ".concat(farmerid, " Not Found") });
        }
        return (0, azle_1.Ok)(specificFarmer.Some);
    }),
    // U -> Update the existing resources(id)
    updateFarmer: (0, azle_1.update)([azle_1.text, FarmerPayload], (0, azle_1.Result)(Farmer, Error), function (farmerid, farmerdetails) {
        var updateFarmer = FarmerStorage.get(farmerid);
        if ("None" in updateFarmer) {
            return (0, azle_1.Err)({ NotFound: "The farmer of id {farmerid} Not Found" });
        }
        var farmer = updateFarmer.Some;
        var modifiedFarmer = __assign(__assign(__assign({}, farmer), farmerdetails), { updatedAt: azle_1.None });
        FarmerStorage.insert(farmer.farmerid, modifiedFarmer);
        return (0, azle_1.Ok)(modifiedFarmer);
    }),
    //D -> Delete a resource/
    deleteFarmer: (0, azle_1.update)([azle_1.text], (0, azle_1.Result)(Farmer, Error), function (farmerid) {
        var deleteFarmer = FarmerStorage.remove(farmerid);
        if ("None" in deleteFarmer) {
            return (0, azle_1.Err)({ NotFound: "The farmer of id {farmerid} Not Found" });
        }
        return (0, azle_1.Ok)(deleteFarmer.Some);
    }),
    // Tractor Models
    //CRUD FOR Tractor
    //addMessage: update
    // function: type([datatypes for the parameters], Return Type, (parameters)){}
    addTractor: (0, azle_1.update)([TractorPayload], (0, azle_1.Result)(Tractor, Error), function (tractordetails) {
        var tractor = __assign({ tractorId: myid, status: false, createdAt: azle_1.ic.time(), updatedAt: azle_1.None }, tractordetails);
        TractorStorage.insert(myid, tractor);
        myid += 1;
        return (0, azle_1.Ok)(tractor);
    }),
    // R -> Read resources excisting on the canister(query)
    // Read All Farmers
    getTractor: (0, azle_1.query)([], (0, azle_1.Result)((0, azle_1.Vec)(Tractor), Error), function () {
        return (0, azle_1.Ok)(TractorStorage.values());
    }),
    // Read a specific Farmer(id)
    getspecificTractor: (0, azle_1.query)([azle_1.nat64], (0, azle_1.Result)(Tractor, Error), function (tractorid) {
        var specificTractor = FarmerStorage.get(tractorid);
        if ("None" in specificTractor) {
            return (0, azle_1.Err)({ NotFound: "The farmer of id ".concat(tractorid, " Not Found") });
        }
        return (0, azle_1.Ok)(specificTractor.Some);
    }),
    // U -> Update the existing resources(id)
    updateTractor: (0, azle_1.update)([azle_1.nat64, TractorPayload], (0, azle_1.Result)(Farmer, Error), function (tractorid, tractordetails) {
        var updateTractor = TractorStorage.get(tractorid);
        if ("None" in updateTractor) {
            return (0, azle_1.Err)({ NotFound: "The tractor of id {tractorid} Not Found" });
        }
        var tractor = updateTractor.Some;
        var modifiedTractor = __assign(__assign(__assign({}, tractor), tractordetails), { updatedAt: azle_1.None });
        TractorStorage.insert(tractor.tractorid, modifiedTractor);
        return (0, azle_1.Ok)(modifiedTractor);
    }),
    //D -> Delete a resource/
    deleteTractor: (0, azle_1.update)([azle_1.nat64], (0, azle_1.Result)(Farmer, Error), function (tractorid) {
        var deleteTractor = TractorStorage.remove(tractorid);
        if ("None" in deleteTractor) {
            return (0, azle_1.Err)({ NotFound: "The tractor of id {tractorid} Not Found" });
        }
        return (0, azle_1.Ok)(deleteTractor.Some);
    }),
    // SERVICE MODELS
    addService: (0, azle_1.update)([ServicePayload], (0, azle_1.Result)(Service, Error), function (servicedetails) {
        var service = __assign({ Serviceid: myServiceId, status: false, createdAt: azle_1.ic.time(), updatedAt: azle_1.None }, servicedetails);
        ServiceStorage.insert(myServiceId, service);
        myServiceId += 1;
        return (0, azle_1.Ok)(service);
    }),
    getService: (0, azle_1.query)([], (0, azle_1.Result)((0, azle_1.Vec)(Service), Error), function () {
        return (0, azle_1.Ok)(ServiceStorage.values());
    }),
    // Read a specific Farmer(id)
    getspecificService: (0, azle_1.query)([azle_1.nat64], (0, azle_1.Result)(Service, Error), function (Serviceid) {
        var specificService = ServiceStorage.get(Serviceid);
        if ("None" in specificService) {
            return (0, azle_1.Err)({ NotFound: "The farmer of id ".concat(Serviceid, " Not Found") });
        }
        return (0, azle_1.Ok)(specificService.Some);
    }),
});
// Cannister ends
// This code below enables the uuid to work on this app
// https://justpaste.it/bpfxm
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
