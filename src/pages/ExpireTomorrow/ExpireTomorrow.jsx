import React from 'react'
import { Box, CircularProgress, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { accountsExpireTomorrowHeadCells } from '../../seed/table-headers';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import { useDispatch, useSelector } from 'react-redux';
import { webGetRequest } from '../../services/api-service';
import { getAllExpireTomorrowAccountsUrl } from '../../seed/url';

const useContentsIds = (contents) => {
    return React.useMemo(
        () => {
            return contents.map((customer) => customer.id);
        },
        [contents]
    );
};

function ExpireTomorrow() {
    const dispatch = useDispatch();
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [contents, setContents] = React.useState({
        account_user_info_to_expire_tomorrow: [],
        pagination: {
            current_page: 1,
            per_page: 0,
            total: 0,
            last_page: 0
        }
    });
    const [, setSearchTerm] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const contentsIds = useContentsIds(contents.account_user_info_to_expire_tomorrow);
    const contentsSelection = useSelection(contentsIds);
    const paymentSideNav = useSelector((state) => state.ViewPaymentSideNavReducer);

    const fetcher = React.useCallback(
        (page) => {
            setIsLoading(true);
            webGetRequest(
                `${getAllExpireTomorrowAccountsUrl}?page=${page}&per_page=${rowsPerPage}`,
                (data) => {
                    setContents(data);
                    setIsLoading(false);
                },
                (error) => {
                    setContents({
                        account_user_info_to_expire_tomorrow: [],
                        pagination: {
                            current_page: 1,
                            per_page: 0,
                            total: 0,
                            last_page: 0
                        }
                    });
                    setIsLoading(false);
                }
            );
        },
        [rowsPerPage]
    );

    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    React.useEffect(() => {
        fetcher(1)
    }, [fetcher])

    const handlePageChange = React.useCallback(
        (event, value) => {
            fetcher(value + 1)
        },
        [fetcher]
    );

    const handleRowsPerPageChange = React.useCallback(
        (event) => {
            setRowsPerPage(event.target.value);
        },
        []
    );

    const paymentPopoverItems = [
        {
            id: 'view',
            label: 'View',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><EyeIcon /></SvgIcon>,
            onClick: () => {
                if (contentsSelection?.selected[0]?.id) {
                    dispatch({
                        type: "TOOGLE_PAYMENT_SIDENAV",
                        payload: {
                            ...paymentSideNav,
                            openViewPaymentSideNav: true,
                            paymentSideNavContent: contentsSelection.selected[0]
                        },
                    });
                }
            },
        },
    ]

    return (
        <>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    pt: 2,
                    pb: 8
                }}
            >
                <Container maxWidth={false}>
                    <Stack spacing={2}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                            alignItems="center"
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    Accounts Expire Tomorrow
                                </Typography>
                            </Stack>
                        </Stack>
                        <CustomSearch
                            handleSearch={handleSearch}
                        />
                        {isLoading &&
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <CircularProgress
                                    sx={{
                                        mx: 'auto',
                                        my: 3,
                                    }}
                                />
                            </Box>
                        }
                        {!isLoading &&
                            <CustomTable
                                count={contents.pagination.total}
                                items={contents.account_user_info_to_expire_tomorrow}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                onSelectOne={contentsSelection.handleSelectOne}
                                page={contents.pagination.current_page >= 1 ? contents.pagination.current_page - 1 : contents.pagination.current_page}
                                rowsPerPage={rowsPerPage}
                                selected={contentsSelection.selected}
                                headCells={accountsExpireTomorrowHeadCells}
                                isLoading={isLoading}
                                popoverItems={paymentPopoverItems}
                            />
                        }
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

export default ExpireTomorrow