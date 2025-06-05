export const contentInfoInitialState = {
    id: 0,
    title: "",
    short_description: "",
    description: "",
    content_link: "",
    content_link_text: "",
    is_in_free_package: "",
    is_published: "NO",
    author_id: 0,
    category_id: 0,
    sub_category_id: 0,
    product_id: 0,
    campaign_id: 0,
    last_visible_cover_image: 1,
    platform: "",
    is_doctor: "",
}

export default function ContentInformationReducer(contentInformation = contentInfoInitialState, action) {

    switch (action.type) {

        case "CONTENT_INFO":

            return action.payload;

        default:
            return contentInformation;
    }

};