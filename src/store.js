import { configureStore } from "@reduxjs/toolkit";
import reducers from "./store/reducers";
import { composeWithDevTools } from "redux-devtools-extension";

const store = configureStore({ reducer: reducers }, composeWithDevTools());

export default store;