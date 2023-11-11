"use strict";
// This file contains The database
Object.defineProperty(exports, "__esModule", { value: true });
exports.TractorBookingStorage = exports.TractorStorage = exports.FarmerStorage = void 0;
/* StableBTreeMap is a type of map (or dictionary) data structure.
It typically uses a B-tree internally, which is a self-balancing...
tree data structure that maintains sorted data and allows ...
for efficient search, insertion, and deletion operations. */
var azle_1 = require("azle");
var blueprints_1 = require("./blueprints");
// DB: StableTreeMap
var FarmerStorage = (0, azle_1.StableBTreeMap)(azle_1.text, blueprints_1.Farmer, 0);
exports.FarmerStorage = FarmerStorage;
var TractorStorage = (0, azle_1.StableBTreeMap)(azle_1.nat64, blueprints_1.Tractor, 1);
exports.TractorStorage = TractorStorage;
var TractorBookingStorage = (0, azle_1.StableBTreeMap)(azle_1.nat64, blueprints_1.TractorBooking, 3);
exports.TractorBookingStorage = TractorBookingStorage;
