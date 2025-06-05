export const formInfoInitalState = {}

export default function FormInformationReducer(formInformation = formInfoInitalState, action) {

    switch (action.type) {

        case "FORM_INFO":

            return action.payload;

        default:
            return formInformation;
    }

};