import {
    applyMiddleware,
    combineReducers,
    legacy_createStore
} from "redux";
import thunk from "redux-thunk";
import { authReducer } from "./Auth/Reducer.js";
import { customerProductReducer } from "./Product/Reducer.js";
import { cartReducer } from "./Cart/Reducer.js";

const rootReducers = combineReducers({
    auth: authReducer,
    product: customerProductReducer,
    cart: cartReducer
});

export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));