import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import { useLocation } from 'react-router-dom';
import { items } from './config';
import { MIN_SIDE_NAV_WIDTH, SIDE_NAV_WIDTH } from '../../utils/constant';
import { withAuthGuard } from '../../hocs/with-auth-guard';
import { ViewPaymentSideNav } from './view-payment-side-nav';
import { useDispatch, useSelector } from 'react-redux';
import { ViewOrderSideNav } from './view-order-side-nav';
import { ViewProductSideNav } from './view-product-side-nav';
import { ViewContentVerificationHistorySideNav } from './view-content-verification-history-side-nav';

const LayoutRoot = styled('div')(({ theme, width }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
        paddingLeft: width
    }
}));

const LayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%'
});

const Layout = withAuthGuard((props) => {
    const { children } = props;
    const dispatch = useDispatch();
    const router = useLocation();
    const { pathname } = router;
    const [openNav, setOpenNav] = useState(false);
    const paymentSideNav = useSelector((state) => state.ViewPaymentSideNavReducer);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const handlePathnameChange = useCallback(
        () => {
            if (openNav) {
                setOpenNav(false);
            }
        },
        [openNav]
    );

    useEffect(
        () => {
            handlePathnameChange();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [pathname]
    );

    React.useEffect(() => {
        const searchIndex = items.findIndex((item) => {
            return item.children ?
                item.children.some(item1 => item1.path === pathname) :
                item.path === pathname;
        });

        searchIndex >= 0 && setCurrentIndex(searchIndex);
    }, [pathname]);

    return (
        <>
            <TopNav onNavOpen={() => setOpenNav(true)} />
            <SideNav
                onClose={() => setOpenNav(false)}
                open={openNav}
            />
            <ViewPaymentSideNav
                open={paymentSideNav.openViewPaymentSideNav}
                onClose={() => {
                    dispatch({
                        type: "TOOGLE_PAYMENT_SIDENAV",
                        payload: { ...paymentSideNav, openViewPaymentSideNav: !paymentSideNav.openViewPaymentSideNav },
                    });
                }}
            />
            {paymentSideNav.openViewOrderSideNav &&
                <ViewOrderSideNav
                    open={paymentSideNav.openViewOrderSideNav}
                    onClose={() => {
                        dispatch({
                            type: "TOOGLE_PAYMENT_SIDENAV",
                            payload: {
                                ...paymentSideNav,
                                openViewOrderSideNav: !paymentSideNav.openViewOrderSideNav,
                                orderSideNavContent: {}
                            },
                        });
                    }}
                />
            }
            {paymentSideNav.openViewProductSideNav &&
                <ViewProductSideNav
                    open={paymentSideNav.openViewProductSideNav}
                    onClose={() => {
                        dispatch({
                            type: "TOOGLE_PAYMENT_SIDENAV",
                            payload: { ...paymentSideNav, openViewProductSideNav: !paymentSideNav.openViewProductSideNav },
                        });
                    }}
                />
            }
            {paymentSideNav.openViewContentVerificationHistorySideNav &&
                <ViewContentVerificationHistorySideNav
                    open={paymentSideNav.openViewContentVerificationHistorySideNav}
                    onClose={() => {
                        dispatch({
                            type: "TOOGLE_PAYMENT_SIDENAV",
                            payload: {
                                ...paymentSideNav,
                                openViewContentVerificationHistorySideNav: !paymentSideNav.openViewContentVerificationHistorySideNav,
                                contentVerificationHistory: {}
                            },
                        });
                    }}
                />
            }
            <LayoutRoot
                width={items[currentIndex]?.children ? SIDE_NAV_WIDTH : MIN_SIDE_NAV_WIDTH}
            >
                <LayoutContainer>
                    {children}
                </LayoutContainer>
            </LayoutRoot>
        </>
    );
})

export default Layout