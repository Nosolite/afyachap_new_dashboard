import React from 'react'
import { Box, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { packageCategoriesHeadCells } from '../../seed/table-headers';
import { filterItems } from '../../utils/constant';
import { getAllPackageCategoriesUrl } from '../../seed/url';
import { webGetRequest } from '../../services/api-service';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import ViewSubscriptionType from './ViewSubscriptionType';

const usePackagesIds = (packages) => {
    return React.useMemo(
        () => {
            return packages.map((customer) => customer.id);
        },
        [packages]
    );
};

function SubscriptionTypes() {
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [packages, setPackages] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: []
    });
    const [isLoading, setIsLoading] = React.useState(true)
    const packagesIds = usePackagesIds(packages.results);
    const subscriptionSelection = useSelection(packagesIds);
    const [openViewDialog, setOpenViewDialog] = React.useState(false);

    const fetcher = React.useCallback(
        (page) => {
            webGetRequest(
                getAllPackageCategoriesUrl,
                (data) => {
                    setPackages({
                        page: 1,
                        total_results: data.length,
                        total_pages: 1,
                        results: data,
                    })
                    setIsLoading(false)
                },
                (error) => {
                    setPackages({
                        page: 1,
                        total_results: 0,
                        total_pages: 0,
                        results: [],
                    })
                    setIsLoading(false)
                },
            )
        },
        []
    );

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

    const handleClickOpenViewDialog = () => {
        setOpenViewDialog(true)
    }

    const handleCloseViewDialog = () => {
        setOpenViewDialog(false)
    }

    const contentPopoverItems = [
        {
            id: 'view',
            label: 'View',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><EyeIcon /></SvgIcon>,
            onClick: () => {
                if (subscriptionSelection?.selected[0]?.id) {
                    handleClickOpenViewDialog()
                }
            },
        },
    ]

    return (
        <>
            {openViewDialog &&
                <ViewSubscriptionType
                    open={openViewDialog}
                    handleClose={handleCloseViewDialog}
                    selected={subscriptionSelection.selected[0]}
                />
            }
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
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    Subscription Categories
                                </Typography>
                            </Stack>
                        </Stack>
                        <CustomSearch
                            popoverItems={filterItems}
                        />
                        <CustomTable
                            count={packages.total_results}
                            items={packages.results}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectOne={subscriptionSelection.handleSelectOne}
                            page={packages.page >= 1 ? packages.page - 1 : packages.page}
                            rowsPerPage={rowsPerPage}
                            selected={subscriptionSelection.selected}
                            headCells={packageCategoriesHeadCells}
                            popoverItems={contentPopoverItems}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

export default SubscriptionTypes