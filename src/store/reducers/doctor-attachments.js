import { CREATE } from "../../utils/constant";

export const doctorattachmentsInitalState = {
    action: CREATE,
    first_degree_certificate: null,
    mct: null,
    cv: null,
    identity_card: null,
    signature: null,
}

export default function DoctorAttachmentsReducer(doctorInformation = doctorattachmentsInitalState, action) {

    switch (action.type) {

        case "DOCTOR_ATTACHMENTS":

            return action.payload;

        default:
            return doctorInformation;
    }

};