import { combineReducers } from "redux";
import SettingsReducer from "./settings-reducers";
import ViewPaymentSideNavReducer from "./view-payment-side-nav-reducers";
import DoctorInformationReducer from "./doctor-information";
import DoctorAttachmentsReducer from "./doctor-attachments";
import ContentInformationReducer from "./content-information";
import FormInformationReducer from "./form-dialog";

const reducers = combineReducers({
    SettingsReducer,
    ViewPaymentSideNavReducer,
    DoctorInformationReducer,
    DoctorAttachmentsReducer,
    ContentInformationReducer,
    FormInformationReducer,
});

export default reducers;