export const doctorInfoInitalState = {
    doctor_id: 0,
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: null,
    phone_number: "",
    email: "",
    current_hospital: "",
    session_fee: 0,
    experience: 0,
    bio: "",
}

export default function DoctorInformationReducer(doctorInformation = doctorInfoInitalState, action) {

    switch (action.type) {

        case "DOCTOR_INFO":

            return action.payload;

        default:
            return doctorInformation;
    }

};