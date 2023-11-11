// This file contains all errors that will be displayed to the user incase a problem occurs

import {text, Variant} from "azle";

const Error = Variant({
    NotFound: text,
    InvalidTractorPayload: text,
    TractorNotAvailable: text,
    TractorBookingNotFound: text,
    TractorNotFound: text,
    NoRecordtoKeyIn: text,
    TractorReturned: text,
});

export {Error};