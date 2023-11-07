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
    tractorModel: text,
    tractorbrand: nat64,

});

const servType = Variant({
    cropPlanting: text,
    cropHarvesting: text
});

const ServicePayload = Record({
    tractorid: text,
    farmerid: text,

    ServiceType: servType,
    // ServiceCategory: text,
    SizeofLand: nat64,
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
    tractorModel: text,
    tractorbrand: nat64,
    tractorId: nat64,
    status: bool,
    createdAt: nat64,
    updatedAt: Opt(nat64)


});

const Service = Record({

    Serviceid: nat64,
    tractorid: text,
    farmerid: text,
    ServiceType: servType,
    // ServiceCategory: text,
    SizeofLand: nat64,
    // Service_charges: nat64,
    // ModeofPayment: text,
})

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
const Error = Variant({
    NotFound: text,
    InvalidPayload: text
});

let myServiceId: number = 10000;
let myid: number = 1001;

// Message DB: StableTreeMap
// orthogonal/Transparent Persistence - it maintain the state

const FarmerStorage = StableBTreeMap(text, Farmer, 1)
const TractorStorage = StableBTreeMap(nat64, Tractor, 2)
const ServiceStorage = StableBTreeMap(nat64, Service, 3)

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
    }),


    // Tractor Models
    //CRUD FOR Tractor

    //addMessage: update
    // function: type([datatypes for the parameters], Return Type, (parameters)){}
    addTractor: update([TractorPayload], Result(Tractor, Error), (tractordetails) => {
        const tractor = {tractorId: myid, status: false, createdAt: ic.time(), updatedAt: None, ...tractordetails};
        TractorStorage.insert(myid, tractor);
        myid += 1;

        return Ok(tractor)

    }),


    // R -> Read resources excisting on the canister(query)
    // Read All Farmers

    getTractor: query([], Result(Vec(Tractor), Error), () => {
        return Ok(TractorStorage.values());
    }),

    // Read a specific Farmer(id)
    getspecificTractor: query([nat64], Result(Tractor, Error), (tractorid) => {
        const specificTractor = FarmerStorage.get(tractorid)

        if ("None" in specificTractor) {
            return Err({NotFound: `The farmer of id ${tractorid} Not Found`})
        }

        return Ok(specificTractor.Some)
    }),


    // U -> Update the existing resources(id)
    updateTractor: update([nat64, TractorPayload], Result(Farmer, Error), (tractorid, tractordetails) => {
        const updateTractor = TractorStorage.get(tractorid)
        if ("None" in updateTractor) {
            return Err({NotFound: `The tractor of id {tractorid} Not Found`});
        }

        const tractor = updateTractor.Some;
        const modifiedTractor = {...tractor, ...tractordetails, updatedAt: None};

        TractorStorage.insert(tractor.tractorid, modifiedTractor)
        return Ok(modifiedTractor)
    }),


    //D -> Delete a resource/
    deleteTractor: update([nat64], Result(Farmer, Error), (tractorid) => {
        const deleteTractor = TractorStorage.remove(tractorid);
        if ("None" in deleteTractor) {
            return Err({NotFound: `The tractor of id {tractorid} Not Found`});
        }
        return Ok(deleteTractor.Some)
    }),


    // SERVICE MODELS
    addService: update([ServicePayload], Result(Service, Error), (servicedetails) => {
        const service = {
            Serviceid: myServiceId,
            status: false,
            createdAt: ic.time(),
            updatedAt: None, ...servicedetails
        };
        ServiceStorage.insert(myServiceId, service);
        myServiceId += 1;

        return Ok(service)

    }),
    getService: query([], Result(Vec(Service), Error), () => {
        return Ok(ServiceStorage.values());
    }),

    // Read a specific Farmer(id)
    getspecificService: query([nat64], Result(Service, Error), (Serviceid) => {
        const specificService = ServiceStorage.get(Serviceid);

        if ("None" in specificService) {
            return Err({NotFound: `The farmer of id ${Serviceid} Not Found`});
        }

        return Ok(specificService.Some)
    }),
    returnTractor: update([TractorPayload], Result(Tractor, Error), (tractordetails) => {
        const tractor = {tractorId: myid, status: false, createdAt: ic.time(), updatedAt: None, ...tractordetails};
        TractorStorage.insert(myid, tractor);
        myid += 1;

        return Ok(tractor)


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