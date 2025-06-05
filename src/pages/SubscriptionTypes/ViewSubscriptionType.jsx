import React from 'react'
import { Box, Container, Dialog, DialogActions, DialogContent, IconButton, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { subscriptionTypesHeadCells } from '../../seed/table-headers';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { CREATE, UPDATE, filterItems } from '../../utils/constant';
import { FormDialog } from '../../components/form-dialog';
import { subscriptionTypeFields } from '../../seed/form-fields';
import { getAllPackagesByCategoryUrl, updatePackagesUrl } from '../../seed/url';
import { webGetRequest } from '../../services/api-service';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';

const usePackagesIds = (packages) => {
    return React.useMemo(
        () => {
            return packages.map((customer) => customer.id);
        },
        [packages]
    );
};

function ViewSubscriptionType({ open, handleClose, selected }) {
    const [action, setAction] = React.useState(CREATE)
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
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const values = [
        {
            packageId: action === UPDATE ? subscriptionSelection?.selected[0]?.id : 0,
            BusinessCategoryId: selected.id,
            name: action === UPDATE ? subscriptionSelection?.selected[0]?.name : "",
            amount: action === UPDATE ? subscriptionSelection?.selected[0]?.amount : 0,
            active_days: action === UPDATE ? subscriptionSelection?.selected[0]?.active_days : "",
            eng_package_description: action === UPDATE ? subscriptionSelection?.selected[0]?.eng_package_description : "",
            status: action === UPDATE ? subscriptionSelection?.selected[0]?.status : "",
            apple_pay_product_id: action === UPDATE ? subscriptionSelection?.selected[0]?.apple_pay_product_id : "",
            IOS_description: action === UPDATE ? subscriptionSelection?.selected[0]?.IOS_description : "",
            IOS_title: action === UPDATE ? subscriptionSelection?.selected[0]?.IOS_title : "",
            IOS_currency: action === UPDATE ? subscriptionSelection?.selected[0]?.IOS_currency : "",
            IOS_price: action === UPDATE ? subscriptionSelection?.selected[0]?.IOS_price : "",
            IOS_price_string: action === UPDATE ? subscriptionSelection?.selected[0]?.IOS_price_string : "",
        }
    ]

    const fetcher = React.useCallback(
        (page) => {
            webGetRequest(
                getAllPackagesByCategoryUrl + selected.id,
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
        [selected]
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

    const handleClickOpenCreateDialog = () => {
        setOpenCreateDialog(true)
    }

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false)
        fetcher(1)
    }

    const contentPopoverItems = [
        {
            id: 'edit',
            label: 'Edit',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
            onClick: () => {
                if (subscriptionSelection?.selected[0]?.id) {
                    setAction(UPDATE)
                    handleClickOpenCreateDialog()
                }
            },
        },
    ]

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen
            PaperProps={{
                style: {
                    boxShadow: "none"
                },
            }}
        >
            <DialogActions>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="close"
                    onClick={() => {
                        handleClose()
                    }}
                >
                    <SvgIcon fontSize='large'>
                        <XMarkIcon />
                    </SvgIcon>
                </IconButton>
            </DialogActions>
            <DialogContent>
                {openCreateDialog && 
                    <FormDialog
                        open={openCreateDialog}
                        handleClose={handleCloseCreateDialog}
                        dialogTitle={"Subscription Type"}
                        action={action}
                        fields={subscriptionTypeFields}
                        values={values}
                        url={updatePackagesUrl + subscriptionSelection?.selected[0]?.id}
                        isWebServerRequest={true}
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
                                        {selected.name}
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
                                headCells={subscriptionTypesHeadCells}
                                popoverItems={contentPopoverItems}
                                isLoading={isLoading}
                            />
                        </Stack>
                    </Container>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default ViewSubscriptionType