const initialState = {
    openViewPaymentSideNav: false,
    openViewOrderSideNav: false,
    openViewProductSideNav: false,
    openViewContentVerificationHistorySideNav: false,
    paymentSideNavContent: {},
    orderSideNavContent: {},
    productSideNavContent: {},
    contentVerificationHistory: {}
}

export default function ViewPaymentSideNavReducer(viewPaymentSideNav = initialState, action) {

    switch (action.type) {

        case "TOOGLE_PAYMENT_SIDENAV":

            return action.payload;

        default:
            return viewPaymentSideNav;
    }

};