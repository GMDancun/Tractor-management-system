// This file contains specifics of the structure of my object and its properties

import {
    text, Record, nat64,
    Opt, Variant, bool
} from 'azle';


// This is a global variable that is stored on the heap



// Farmer
const Farmer = Record({
    farmerId: text,
    farmernatId: nat64,
    farmer_Fname: text,
    farmer_Lname: text,
    location: text,
    phoneNumber: nat64,
    createdAt: nat64,
    updatedAt: Opt(nat64)

});
export {Farmer};


// Tractor
const Tractor = Record({
    tractorId: nat64,
    tractorModel: text,
    tractorBrand: text,
    status: bool,
    createdAt: nat64,
    updatedAt: Opt(nat64)


});
export {Tractor};

// Tractor Booking
const TractorBooking = Record({
    bookingId: nat64,
    farmerId: text,
    tractorId: nat64,
    returnTractor: bool,
    createdAt: nat64,
    updatedAt: Opt(nat64)
});
export {TractorBooking};


// Error



