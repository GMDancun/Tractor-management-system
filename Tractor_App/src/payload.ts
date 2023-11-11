import {nat64, Record, text} from "azle";


export const FarmerPayload = Record({
    farmernatId: nat64,
    farmer_Fname: text,
    farmer_Lname: text,
    location: text,
    phoneNumber: nat64,

});

export const TractorPayload = Record({
    tractorModel: text,
    tractorBrand: text,

});

export const TractorBookingPayload = Record({
    farmerId: text,
    tractorId: nat64,
});
