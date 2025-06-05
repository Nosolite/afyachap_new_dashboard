const initalState = {
    theme: localStorage.getItem("theme") != null ? localStorage.getItem("theme") : "",
    currentIndex: 0,
}

export default function SettingsReducer(settings = initalState, action) {

    switch (action.type) {

        case "CHANGE_THEME":

            return action.payload;

        case "CHANGE_INDEX":

            return action.payload;

        default:
            return settings;
    }

};