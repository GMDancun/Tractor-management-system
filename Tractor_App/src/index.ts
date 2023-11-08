import {
    Canister, query, text, update, Void,
    Record, StableBTreeMap, Ok, None,
    Some, Err, Vec, Result, nat64,
    ic, Opt, Variant, bool, int64
} from 'azle';
import {v4 as uuidv4} from 'uuid';
// This is a global variable that is stored on the heap

// MessagePayload, Message, Err -> Models


const FarmerPayload = Record({
    farmernatId: nat64,
    farmer_Fname: text,
    farmer_Lname: text,
    location: text,
    phoneNumber: nat64,

});

const TractorPayload = Record({
    tractorModel: text,
    tractorBrand: text,

});

const TractorBookingPayload = Record({
    farmerId: text,
    tractorId: nat64,
});

const servType = Variant({
    cropPlanting: text,
    cropHarvesting: text
});

// const ServicePayload = Record({
//     tractorId: text,
//     farmerId: text,
//
//     ServiceType: servType,
//     // ServiceCategory: text,
//     SizeofLand: nat64,
//     // Service_charges: nat64,
//     // ModeofPayment: text,
// });


// farmernatid: BigInt(farmernatid ?? 0)

// Message
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

// type ExpectedReturnType = {
//     tractorModel: string;
//     tractorbrand: bigint;
//     tractorId: bigint; // Ensure tractorId is of type bigint
//     status: boolean;
//     createdAt: bigint;
//     updatedAt: Opt<bigint>;
//     _azleCandidType?: "azleCandidType" | undefined;
// };

const Tractor = Record({
    tractorId: nat64,
    tractorModel: text,
    tractorBrand: text,
    status: bool,
    createdAt: nat64,
    updatedAt: Opt(nat64)


});

// const Service = Record({
//
//     ServiceId: nat64,
//     tractorId: text,
//     farmerId: text,
//     ServiceType: servType,
//     SizeofLand: nat64,
// });

const TractorBooking = Record({
    bookingId: nat64,
    farmerId: text,
    tractorId: nat64,

    returnTractor: bool,
    createdAt: nat64,
    updatedAt: Opt(nat64)
});


// Error
const Error = Variant({
    NotFound: text,
    InvalidPayload: text,
    TractorNotAvailable: text,
    TractorBookingNotFound: text,
    TractorNotFound: text,
    NoRecordtoKeyIn: text,
    TractorReturned: text,
});

let myServiceId: number = 10000;
let mytractorId: number = 1001;
let mybookingId: number = 6200;


// Message DB: StableTreeMap
// orthogonal/Transparent Persistence - it maintain the state

const FarmerStorage = StableBTreeMap(text, Farmer, 0)
const TractorStorage = StableBTreeMap(nat64, Tractor, 1)
// const ServiceStorage = StableBTreeMap(nat64, Service, 2)
const TractorBookingStorage = StableBTreeMap(nat64, TractorBooking, 3)


export default Canister({
    // Query calls complete quickly because they do not go through consensus


    // create CRUD Application
    //C -> one is able to create a resource to the cannister(update), e.g Employees app

    //addMessage: update
    // function: type([datatypes for the parameters], Return Type, (parameters)){}
    addFarmer: update([FarmerPayload], Result(Farmer, Error), (farmerdetails) => {
        if (Object.values(farmerdetails).some(v => v === undefined || v === '')) {
            return Err({NoRecordtoKeyIn: 'All farmer details must be filled'});
        }

        try {
            const farmer = {farmerId: uuidv4(), createdAt: ic.time(), updatedAt: None, ...farmerdetails};
            FarmerStorage.insert(farmer.farmerId, farmer);

            return Ok(farmer);
        } catch (error) {
            return Err({NoRecordtoKeyIn: `The farmer of details not filled`});
        }

    }),


    // R -> Read resources excisting on the canister(query)
    // Read All Farmers

    getFarmer: query([], Result(Vec(Farmer), Error), () => {
        return Ok(FarmerStorage.values());
    }),

    // Read a specific Farmer(id)
    getspecificFarmer: query([text], Result(Farmer, Error), (farmerId) => {
        const specificFarmer = FarmerStorage.get(farmerId);

        if ("None" in specificFarmer) {
            return Err({NotFound: `The farmer of id ${farmerId} Not Found`});
        }

        return Ok(specificFarmer.Some);
    }),


    // U -> Update the existing resources(id)
    updateFarmer: update([text, FarmerPayload], Result(Farmer, Error), (farmerId, farmerdetails) => {
        const updateFarmer = FarmerStorage.get(farmerId)
        if ("None" in updateFarmer) {
            return Err({NotFound: `The farmer of id {farmerId} Not Found`});
        }

        const farmer = updateFarmer.Some;
        const modifiedFarmer = {...farmer, ...farmerdetails, updatedAt: None};

        FarmerStorage.insert(farmer.farmerId, modifiedFarmer)
        return Ok(modifiedFarmer)
    }),


    //D -> Delete a resource/
    deleteFarmer: update([text], Result(Farmer, Error), (farmerId) => {
        const deleteFarmer = FarmerStorage.remove(farmerId);
        if ("None" in deleteFarmer) {
            return Err({NotFound: `The farmer of id {farmerId} Not Found`});
        }
        return Ok(deleteFarmer.Some)
    }),


    // Tractor Models
    //CRUD FOR Tractor

    //addMessage: update
    // function: type([datatypes for the parameters], Return Type, (parameters)){}
    addTractor: update([TractorPayload], Result(Tractor, Error), (tractordetails) => {
        if (Object.values(tractordetails).some(v => v === undefined || v === '')) {
            return Err({NoRecordtoKeyIn: 'All tractor details must be filled'});
        }

        try {

            // Creating tractor object with provided details and additional properties
            const tractor = {
                tractorId: mytractorId,
                status: true,
                createdAt: ic.time(),
                updatedAt: None, ...tractordetails
            };

            //insert Tractor details into Storage
            TractorStorage.insert(mytractorId, tractor);
            mytractorId += 1;

            return Result.Ok(tractor);
        } catch (error) {
            return Result.Err({InvalidPayload: "Invalid tractor payload"});
        }

    }),

    // R -> Read resources existing on the canister(query)
    // Read All Farmers

    getTractor: query([], Result(Vec(Tractor), Error), () => {
        return Ok(TractorStorage.values());
    }),

    // Read a specific Tractor(id)
    getspecificTractor: query([nat64], Result(Tractor, Error), (tractorId) => {
        const specificTractor = TractorStorage.get(tractorId)

        if ("None" in specificTractor) {
            return Err({NotFound: `The tractor of id ${tractorId} Not Found`})
        }

        return Ok(specificTractor.Some)
    }),


    // U -> Update the existing resources(id)
    updateTractor: update([nat64, TractorPayload], Result(Tractor, Error), (tractorId, tractordetails) => {
        const updateTractor = TractorStorage.get(tractorId)
        if ("None" in updateTractor) {
            return Err({NotFound: `The tractor of id {tractorId} Not Found`});
        }

        const tractor = updateTractor.Some;
        const modifiedTractor = {...tractor, ...tractordetails, updatedAt: None};

        TractorStorage.insert(tractor.tractorId, modifiedTractor)
        return Ok(modifiedTractor)
    }),


    deleteTractor: update([nat64], Result(Tractor, Error), (tractorId) => {
        const deleteTractor = TractorStorage.remove(tractorId);
        if ("None" in deleteTractor) {
            return Err({NotFound: `The tractor of id {tractorId} Not Found`});
        }
        return Ok(deleteTractor.Some)
    }),


    // SERVICE MODELS
    // addService: update([ServicePayload], Result(Service, Error), (servicedetails) => {
    //
    //     const service = {
    //         ServiceId: myServiceId,
    //         status: false,
    //         createdAt: ic.time(),
    //         updatedAt: None, ...servicedetails
    //     };
    //     ServiceStorage.insert(myServiceId, service);
    //     myServiceId += 1;
    //
    //     return Ok(service)
    //
    //
    // }),
    // getService: query([], Result(Vec(Service), Error), () => {
    //     return Ok(ServiceStorage.values());
    // }),
    //
    // // Read a specific Service(id)
    // getspecificService: query([nat64], Result(Service, Error), (ServiceId) => {
    //     const specificService = ServiceStorage.get(ServiceId);
    //
    //     if ("None" in specificService) {
    //         return Err({NotFound: `The service of id ${ServiceId} Not Found`});
    //     }
    //
    //     return Ok(specificService.Some)
    // }),


    // Add Tractor Booking function
    bookTractor: update([TractorBookingPayload], Result(TractorBooking, Error), (bookingpayload) => {

            if (Object.values(bookingpayload).some(v => v === undefined || v === '')) {
                return Err({NoRecordtoKeyIn: 'All booking details must be filled'});
            }

            try {
                const {farmerId, tractorId} = bookingpayload;
                const bookingId = mybookingId;

                let mytractor = TractorStorage.get(tractorId);
                if ("None" in mytractor) {
                    return Err({TractorNotFound: `Tractor with ID ${tractorId} not found`});
                }
                const tractorData = mytractor.Some;
                if (tractorData.status) {

                    const booking = {
                        bookingId: mybookingId,
                        farmerId: bookingpayload.farmerId,
                        tractorId: bookingpayload.tractorId,
                        returnTractor: false,
                        createdAt: ic.time(),
                        updatedAt: None
                    };


                    TractorBookingStorage.insert(mybookingId, booking);
                    mybookingId += 1;

                    const modifiedTractor = {...tractorData, ...tractorData, status: false};

                    TractorStorage.insert(modifiedTractor.tractorId, modifiedTractor)
                    return Ok(booking);
                } else {
                    return Err({TractorNotAvailable: 'The Tractor is not available for booking'});
                }

            } catch (error) {
                return Err({TractorNotAvailable: 'An error occured}'});
                // return "failed";
            }

        }
    ),


    // Cancel Tractor Booking function

    returnTractorBooked: update([nat64], Result(TractorBooking, Error), (bookingId) => {
        try {
            const booking = TractorBookingStorage.get(bookingId);
            if ("None" in booking) {
                return Err({TractorNotAvailable: "Booking not found"})
            }

            let bookingDetails = booking.Some;
            if (!(bookingDetails.returnTractor)) {
                const myoldtractor = TractorStorage.get(bookingDetails.tractorId);
                const tractorData = myoldtractor.Some;
                if (tractorData) {
                    // tractorData.status = false;
                    const updated_tractor = {...tractorData, ...tractorData, status: true};
                    TractorStorage.insert(bookingDetails.tractorId, updated_tractor);


                    const updated_booking = {...bookingDetails, ...bookingDetails, returnTractor: true};
                    TractorBookingStorage.insert(updated_booking.bookingId, updated_booking);

                    return Ok(updated_booking);
                }

                return Err({TractorReturned: `Tractor booking with ID ${bookingId} returned`});

            } else {
                return Err({TractorBookingNotFound: `Tractor booking with ID ${bookingId} not found`});
            }
        } catch (error) {
            return Err({TractorBookingNotFound: `Something Went Wrong Please try again`});
        }


    }),

    getBooking: query([], Result(Vec(TractorBooking), Error), () => {
        return Ok(TractorBookingStorage.values()
        );


    }),

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