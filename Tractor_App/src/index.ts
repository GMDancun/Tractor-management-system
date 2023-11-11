// This file contains all functions

import {
    Canister, query, text, update,
    Ok, None,
    Err, Vec, Result, nat64, ic,
} from 'azle';

import {v4 as uuidv4} from 'uuid';
import {FarmerPayload, TractorPayload, TractorBookingPayload} from './payload';
import {Farmer, Tractor, TractorBooking} from './blueprints'
import {Error} from "./errorblueprint";
import {FarmerStorage, TractorStorage, TractorBookingStorage} from './db'


// This is a global variable that is stored on the heap
// let mytractorId: nat64 = 1001;
let mytractorId: bigint = BigInt(1000);
let mybookingId: bigint = BigInt(6200);


export default Canister({

    // Query calls complete quickly because they do not go through consensus

    //addFarmer: update
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

        const modifiedFarmer = {
            ...farmer,
            // farmerId: farmer.farmerId,

            ...farmerdetails,
            // farmernatId: farmerdetails.farmernatId,
            // farmer_Fname: farmerdetails.farmer_Fname,
            // farmer_Lname: farmerdetails.farmer_Lname,
            // location: farmerdetails.location,
            // phoneNumber: farmerdetails.phoneNumber,
            // updatedAt: None
        };

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
    //addTractor: update
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
                updatedAt: None,
                ...tractordetails
                // Assign individual properties from tractordetails
                // tractorModel: tractordetails.tractorModel,
                // tractorBrand: tractordetails.tractorBrand,


            };


            //insert Tractor details into Storage
            TractorStorage.insert(mytractorId, tractor);
            mytractorId = BigInt(mytractorId + BigInt(1));

            return Result.Ok(tractor);
        } catch (error) {
            return Result.Err({InvalidTractorPayload: "Invalid tractor payload"});
        }

    }),


    // Read All Farmers

    getTractor:
        query([], Result(Vec(Tractor), Error), () => {
            return Ok(TractorStorage.values());
        }),

    // Read a specific Tractor(id)
    getspecificTractor:
        query([nat64], Result(Tractor, Error), (tractorId) => {
            const specificTractor = TractorStorage.get(tractorId)

            if ("None" in specificTractor) {
                return Err({NotFound: `The tractor of id ${tractorId} Not Found`})
            }

            return Ok(specificTractor.Some)
        }),


    // Update the existing resources(id)
    updateTractor:
        update([nat64, TractorPayload], Result(Tractor, Error), (tractorId, tractordetails) => {
            const updateTractor = TractorStorage.get(tractorId)
            if ("None" in updateTractor) {
                return Err({NotFound: `The tractor of id {tractorId} Not Found`});
            }

            const tractor = updateTractor.Some;
            const modifiedTractor = {...tractor, ...tractordetails, updatedAt: None};

            TractorStorage.insert(tractor.tractorId, modifiedTractor)
            return Ok(modifiedTractor)
        }),


    deleteTractor:
        update([nat64], Result(Tractor, Error), (tractorId) => {
            const deleteTractor = TractorStorage.remove(tractorId);
            if ("None" in deleteTractor) {
                return Err({NotFound: `The tractor of id {tractorId} Not Found`});
            }
            return Ok(deleteTractor.Some)
        }),


    // Booking a tractor.
    bookTractor:
        update([TractorBookingPayload], Result(TractorBooking, Error), (bookingpayload) => {

                // checks if the user has filled all the fields
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
                            bookingId: bookingId,
                            farmerId: farmerId,
                            tractorId: tractorId,
                            returnTractor: false,
                            createdAt: ic.time(),
                            updatedAt: None
                        };


                        TractorBookingStorage.insert(bookingId, booking);
                        mybookingId = BigInt(mybookingId + BigInt(1));

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

    returnTractorBooked:
        update([nat64], Result(TractorBooking, Error), (bookingId) => {
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

    getBooking:
        query([], Result(Vec(TractorBooking), Error), () => {
            return Ok(TractorBookingStorage.values()
            );


        }),

});
// Cannister ends

// This code below enables the uuid to work on this app


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