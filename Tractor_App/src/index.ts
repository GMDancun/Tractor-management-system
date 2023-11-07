import {
    Canister, query, text, update, Void,
    Record, StableBTreeMap, Ok, None,
    Some, Err, Vec, Result, nat64,
    ic, Opt, Variant, bool
} from 'azle';
import {v4 as uuidv4} from 'uuid';
// This is a global variable that is stored on the heap

// MessagePayload, Message, Err -> Models

const FarmerPayload = Record({
    farmernatid: nat64,
    farmer_fname: text,
    farmer_lname: text,
    location: text,
    phonenumber: nat64,

});

const TractorPayload = Record({
    TractorModel: text,
    Tractorbrand: text,
    available: bool,

});

const ServicePayload = Record({
    ServiceType: text,
    ServiceCategory: text,
    SizeofLand: nat64,
    Service_charges: nat64,
    ModeofPayment:  text,
});


// Message
const Farmer = Record({
    farmerid: text,
    farmernatid: nat64,
    farmer_fname: text,
    farmer_lname: text,
    location: text,
    phonenumber: nat64,
    createdAt: nat64,
    updatedAt: Opt(nat64)

});

const Tractor = Record({
    tractorId: text,
    tractorModel: text,
    tractorbrand: text,
    status: bool,
    createdAt: nat64,
    updatedAt: Opt(nat64)


});

const Service = Record({
    Serviceid: text,
    ServiceType: text,
    ServiceCategory: text,
    SizeofLand: nat64,
    Service_charges: nat64,
    ModeofPayment:  text,
})

//
// const Message = Record({
//     id: text,
//     title: text,
//     body: text,
//     attchmentUrl: text,
//     createdAt: nat64,
//     updatedAt: Opt(nat64)
//
// });

// Error
const Error = Variant({
    NotFound: text,
    InvalidPayload: text
});


// Message DB: StableTreeMap
// orthogonal/Transparent Persistence - it maintain the state

const FarmerStorage = StableBTreeMap(text, Farmer, 1)
const TractorStorage = StableBTreeMap(text, Tractor, 2)
const ServiceStorage = StableBTreeMap(text, Service, 3)

export default Canister({
    // Query calls complete quickly because they do not go through consensus


    // create CRUD Application
    //C -> one is able to create a resource to the cannister(update), e.g Employees app

    //addMessage: update
    // function: type([datatypes for the parameters], Return Type, (parameters)){}
    addFarmer: update([FarmerPayload], Result(Farmer, Error), (farmerdetails) => {
        const farmer = {farmerid: uuidv4(), createdAt: ic.time(), updatedAt: None, ...farmerdetails};
        FarmerStorage.insert(farmer.farmerid, farmer);

        return Ok(farmer);
    }),


    // R -> Read resources excisting on the canister(query)
    // Read All Farmers

    getFarmer: query([], Result(Vec(Farmer), Error), () => {
        return Ok(FarmerStorage.values());
    }),

    // Read a specific Farmer(id)
    getspecificFarmer: query([text], Result(Farmer, Error), (farmerid) => {
        const specificFarmer = FarmerStorage.get(farmerid)

        if ("None" in specificFarmer) {
            return Err({NotFound: `The farmer of id ${farmerid} Not Found`})
        }

        return Ok(specificFarmer.Some)
    }),


    // U -> Update the existing resources(id)
    updateFarmer: update([text, FarmerPayload], Result(Farmer, Error), (farmerid, farmerdetails) => {
        const updateFarmer = FarmerStorage.get(farmerid)
        if ("None" in updateFarmer) {
            return Err({NotFound: `The farmer of id {farmerid} Not Found`});
        }

        const farmer = updateFarmer.Some;
        const modifiedFarmer = {...farmer, ...farmerdetails, updatedAt: None};

        FarmerStorage.insert(farmer.farmerid, modifiedFarmer)
        return Ok(modifiedFarmer)
    }),


    //D -> Delete a resource/
    deleteFarmer: update([text], Result(Farmer, Error), (farmerid) => {
        const deleteFarmer = FarmerStorage.remove(farmerid);
        if ("None" in deleteFarmer) {
            return Err({NotFound: `The farmer of id {farmerid} Not Found`});
        }
        return Ok(deleteFarmer.Some)
    })




    // Tractor Models
    //CRUD FOR Tractor



});
// Cannister ends

// This code below enables the uuid to work on this app
// https://justpaste.it/bpfxm

globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};

