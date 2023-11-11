// This file contains The database

/* StableBTreeMap is a type of map (or dictionary) data structure.
It typically uses a B-tree internally, which is a self-balancing...
tree data structure that maintains sorted data and allows ...
for efficient search, insertion, and deletion operations. */

import {StableBTreeMap, text, nat64} from "azle";
import {Farmer, Tractor, TractorBooking} from './blueprints'


// DB: StableTreeMap
const FarmerStorage = StableBTreeMap(text, Farmer, 0)
const TractorStorage = StableBTreeMap(nat64, Tractor, 1)
const TractorBookingStorage = StableBTreeMap(nat64, TractorBooking, 3)

export {FarmerStorage, TractorStorage, TractorBookingStorage};