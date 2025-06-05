import React from 'react'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { productsHeadCells } from '../../seed/table-headers';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import VideoCameraIcon from '@heroicons/react/24/outline/VideoCameraIcon';
import CameraIcon from '@heroicons/react/24/outline/CameraIcon';
import StarIcon from '@heroicons/react/24/outline/StarIcon';
import ClipboardIcon from '@heroicons/react/24/outline/ClipboardIcon';
import { CREATE, UPDATE, filterItems, productStatus } from '../../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { DeleteDialog } from '../../components/delete-dialog';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { FormDialog } from '../../components/form-dialog';
import { productYoutubeVideoFields, productsFormFields, scheduleNotificationsFields } from '../../seed/form-fields';
import { getRequest, postRequest } from '../../services/api-service';
import { addProductYouTubeVideoUrl, createProductUrl, deleteProductUrl, getAllProductsCategoriesUrl, getAllProductsSubCategoriesUrl, getAllProductsUrl, scheduleProductNotificationUrl, shopUrl, updateProductAvailabilityUrl, updateProductUrl } from '../../seed/url';
import { CustomAlert } from '../../components/custom-alert';
import { Scrollbar } from '../../components/scrollbar';
import ViewProductRatings from './ViewProductRatings';
import ViewProductMedia from './ViewProductMedia';
import dayjs from 'dayjs';
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';

const useProductsIds = (specializations) => {
    return React.useMemo(
        () => {
            return specializations.map((customer) => customer.id);
        },
        [specializations]
    );
};

function Products() {
    const dispatch = useDispatch();
    const productSideNav = useSelector((state) => state.ViewPaymentSideNavReducer);
    const formInfo = useSelector((state) => state.FormInformationReducer);
    const [currentTab, setCurrentTab] = React.useState(0);
    const [action, setAction] = React.useState(CREATE)
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [productsCategories, setProductsCategories] = React.useState([]);
    const [formFields, setFormFields] = React.useState(productsFormFields);
    const [products, setProducts] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: []
    });
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSubmitting, setSubmitting] = React.useState(false)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const productsIds = useProductsIds(products.results);
    const productsSelection = useSelection(productsIds);
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const [openViewProductMediaDialog, setOpenViewProductMediaDialog] = React.useState(false);
    const [openViewProductYoutubeVideoDialog, setOpenViewProductYoutubeVideoDialog] = React.useState(false);
    const [openViewProductRatingsDialog, setOpenViewProductRatingsDialog] = React.useState(false);
    const [openScheduleNotificationDialog, setOpenScheduleNotificationDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false)
    const [severity, setSeverity] = React.useState("")
    const [severityMessage, setSeverityMessage] = React.useState("")
    const values = [
        {
            id: action === UPDATE ? productsSelection.selected[0].id : 0,
            product_name: action === UPDATE ? productsSelection.selected[0].product_name : "",
            short_description: action === UPDATE ? productsSelection.selected[0].short_description : "",
            product_description: action === UPDATE ? productsSelection.selected[0].product_description : "",
            description_in_html_form: action === UPDATE ? productsSelection.selected[0].description_in_html_form : "",
            product_rating: action === UPDATE ? productsSelection.selected[0].product_rating : 0,
            product_category_id: action === UPDATE ? productsSelection.selected[0].product_category_id : 0,
            product_sub_category_id: action === UPDATE ? productsSelection.selected[0].product_sub_category_id : 0,
            product_vendor_id: action === UPDATE ? productsSelection.selected[0].product_vendor_id : 0,
            product_quantity: action === UPDATE ? productsSelection.selected[0].product_quantity : 0,
            product_purchase_amount: action === UPDATE ? productsSelection.selected[0].product_purchase_amount : 0,
            product_amount: action === UPDATE ? productsSelection.selected[0].product_amount : 0,
            product_promotion_amount: action === UPDATE ? productsSelection.selected[0].product_promotion_amount : 0,
            product_shipping_cost_in_dar: action === UPDATE ? productsSelection.selected[0].product_shipping_cost_in_dar : 0,
            product_shipping_cost_in_other_regions: action === UPDATE ? productsSelection.selected[0].product_shipping_cost_in_other_regions : 0,
            multiply_shipping_cost: action === UPDATE ? productsSelection.selected[0].multiply_shipping_cost : "",
            free_delivery_in_dar: action === UPDATE ? productsSelection.selected[0].free_delivery_in_dar : "",
            free_delivery_in_other_regions: action === UPDATE ? productsSelection.selected[0].free_delivery_in_other_regions : "",
            platform: action === UPDATE ? productsSelection.selected[0].platform : "",
        }
    ]
    const productYoutubeVideoValues = [{
        product_id: productsSelection?.selected?.[0]?.id,
        image_path: "",
        thumbunail_url: "",
        aspect_ratios: "",
        file_type: "YOUTUBE"
    }]
    const scheduleNotificationValues = [
        {
            content_id: productsSelection?.selected?.[0]?.id,
            notification_time: dayjs(),
            notification_repeat: 0,
            notification_interval: 0
        }
    ]
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('id');

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const fetcher = React.useCallback(
        (page) => {
            postRequest(
                getAllProductsUrl,
                {
                    query: searchTerm,
                    status: currentTab === 0 || currentTab === 3 || currentTab === 4 ? "ALL" : currentTab === 1 ? "AVAILABLE" : currentTab === 2 ? "UNAVAILABLE" : "SCHEDULED",
                    platform: currentTab === 3 ? "" : currentTab === 4 ? "PORTAL" : "WEB",
                    sort: orderBy + " " + order,
                    limit: rowsPerPage,
                    page: page
                },
                (data) => {
                    setProducts(data)
                    setIsLoading(false)
                },
                (error) => {
                    setProducts({
                        page: 1,
                        total_results: 0,
                        total_pages: 0,
                        results: [],
                    })
                    setIsLoading(false)
                },
            )
        },
        [rowsPerPage, searchTerm, currentTab, orderBy, order]
    );

    const updateProductAvailability = (data) => {
        if (!isSubmitting) {
            productsSelection.handleSelectOne(data)
            postRequest(
                updateProductAvailabilityUrl,
                {
                    id: data.id,
                    status: data.status === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE",
                },
                (data) => {
                    fetcher(products.page)
                    setSubmitting(false)
                },
                (error) => {
                    if (error?.response?.data?.message) {
                        setSeverityMessage(error.response.data.message[0])
                        setSeverity("error")
                        handleClickAlert()
                    }
                    setSubmitting(false)
                },
            )
        }
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    const getAllProductsSubCategories = React.useCallback((productCategoryId) => {
        postRequest(
            getAllProductsSubCategoriesUrl,
            {
                "id": productCategoryId
            },
            (data) => {
                const newProductsSubCategories = data.map((category) => {
                    const newItem = {};
                    ["label", "value"].forEach((item) => {
                        if (item === "label") {
                            newItem[item] = category.product_sub_category_name;
                        }
                        if (item === "value") {
                            newItem[item] = category.id;
                        }
                    });
                    return newItem;
                });
                let newFormFields = formFields;
                newFormFields[6].items = newProductsSubCategories;
                setFormFields(newFormFields);
                setIsLoading(false)
            },
            (error) => {
                let newFormFields = formFields;
                newFormFields[6].items = [];
                setFormFields(newFormFields);
                setIsLoading(false)
            },
        )
    }, [formFields])

    React.useEffect(() => {
        fetcher(1)
    }, [fetcher])

    React.useEffect(() => {
        getRequest(
            getAllProductsCategoriesUrl,
            (data) => {
                setProductsCategories(data);
            },
            (error) => { }
        )
    }, [])

    React.useEffect(() => {
        if (formInfo.product_category_id) {
            getAllProductsSubCategories(formInfo?.product_category_id)
        }
    }, [formInfo, getAllProductsSubCategories])

    React.useEffect(() => {
        if (productsCategories.length > 0) {
            const newProductsCategories = productsCategories.map((category) => {
                const newItem = {};
                ["label", "value"].forEach((item) => {
                    if (item === "label") {
                        newItem[item] = category.product_category_name;
                    }
                    if (item === "value") {
                        newItem[item] = category.id;
                    }
                });
                return newItem;
            });
            let newFormFields = formFields;
            newFormFields[5].items = newProductsCategories;
            setFormFields(newFormFields);
        }
    }, [productsCategories, formFields])

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
        action === UPDATE ? fetcher(products.page) : fetcher(1)
        setOpenCreateDialog(false)
        setAction(CREATE)
    }

    const handleClickOpenViewProductMediaDialog = () => {
        setOpenViewProductMediaDialog(true)
    }

    const handleCloseViewProductMediaDialog = () => {
        setOpenViewProductMediaDialog(false)
    }

    const handleClickOpenViewProductYoutubeVideoDialog = () => {
        setOpenViewProductYoutubeVideoDialog(true)
    }

    const handleCloseViewProductYoutubeVideoDialog = () => {
        setOpenViewProductYoutubeVideoDialog(false)
    }

    const handleClickOpenViewProductRatingsDialog = () => {
        setOpenViewProductRatingsDialog(true)
    }

    const handleCloseViewProductRatingsDialog = () => {
        setOpenViewProductRatingsDialog(false)
    }

    const handleClickOpenScheduleNotificationDialog = () => {
        setOpenScheduleNotificationDialog(true)
    }

    const handleCloseScheduleNotificationDialog = () => {
        fetcher(products.page)
        setOpenScheduleNotificationDialog(false)
    }

    const handleClickOpenDeleteDialog = () => {
        setOpenDeleteDialog(true)
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
    }

    const handleClickAlert = () => {
        setOpenAlert(true)
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenAlert(false)
    }

    const handleDelete = async () => {
        postRequest(
            deleteProductUrl,
            {
                id: productsSelection.selected[0].id,
            },
            (data) => {
                fetcher(products.page)
                setSeverityMessage(data.message)
                setSeverity("success")
                handleClickAlert()
                setIsDeleting(false)
                handleCloseDeleteDialog()
            },
            (error) => {
                if (error?.response?.data?.message) {
                    setSeverityMessage(error.response.data.message[0])
                    setSeverity("error")
                    handleClickAlert()
                }
                setIsDeleting(false)
            },
        )
    }

    const productsPopoverItems = [
        {
            id: 'view',
            label: 'View',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><EyeIcon /></SvgIcon>,
            onClick: () => {
                if (productsSelection?.selected?.[0]?.id) {
                    dispatch({
                        type: "TOOGLE_PAYMENT_SIDENAV",
                        payload: {
                            ...productSideNav,
                            openViewProductSideNav: true,
                            productSideNavContent: productsSelection.selected[0]
                        },
                    });
                }
            },
        },
        {
            id: 'media',
            label: 'Media',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><CameraIcon /></SvgIcon>,
            onClick: () => {
                if (productsSelection?.selected?.[0]?.id) {
                    handleClickOpenViewProductMediaDialog()
                }
            },
        },
        {
            id: 'youtube video',
            label: 'Youtube Video',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><VideoCameraIcon /></SvgIcon>,
            onClick: () => {
                if (productsSelection?.selected?.[0]?.id) {
                    handleClickOpenViewProductYoutubeVideoDialog()
                }
            },
        },
        {
            id: 'ratings',
            label: 'Ratings',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><StarIcon /></SvgIcon>,
            onClick: () => {
                if (productsSelection?.selected?.[0]?.id) {
                    handleClickOpenViewProductRatingsDialog()
                }
            },
        },
        {
            id: 'schedule',
            label: 'Schedule Notification',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><ClockIcon /></SvgIcon>,
            onClick: () => {
                if (productsSelection?.selected?.[0]?.id) {
                    handleClickOpenScheduleNotificationDialog()
                }
            },
        },
        {
            id: 'copy link',
            label: 'Copy Link',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><ClipboardIcon /></SvgIcon>,
            onClick: () => {
                if (productsSelection?.selected?.[0]?.id) {
                    const textToCopy = shopUrl + `/product/${productsSelection.selected[0].product_name}`;

                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            setSeverityMessage("Text Copied")
                            setSeverity("success")
                            handleClickAlert()
                        })
                        .catch((error) => {
                            setSeverityMessage(error)
                            setSeverity("error")
                            handleClickAlert()
                        });
                }
            },
        },
        {
            id: 'edit',
            label: 'Edit',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
            onClick: () => {
                if (productsSelection?.selected?.[0]?.id) {
                    setAction(UPDATE)
                    handleClickOpenCreateDialog()
                    getAllProductsSubCategories(productsSelection?.selected?.[0]?.product_category_id)
                }
            },
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><TrashIcon /></SvgIcon>,
            onClick: () => {
                if (productsSelection?.selected?.[0]?.id) {
                    handleClickOpenDeleteDialog()
                }
            },
        },
    ]

    return (
        <>
            {openAlert &&
                <CustomAlert
                    openAlert={openAlert}
                    handleCloseAlert={handleCloseAlert}
                    severity={severity}
                    severityMessage={severityMessage}
                />
            }
            {openCreateDialog &&
                <FormDialog
                    open={openCreateDialog}
                    handleClose={handleCloseCreateDialog}
                    dialogTitle={"Product"}
                    action={action}
                    fields={formFields}
                    values={values}
                    url={action === CREATE ? createProductUrl : updateProductUrl}
                />
            }
            {openViewProductMediaDialog &&
                <ViewProductMedia
                    open={openViewProductMediaDialog}
                    handleClose={handleCloseViewProductMediaDialog}
                    selected={productsSelection.selected[0]}
                />
            }
            {openViewProductYoutubeVideoDialog &&
                <FormDialog
                    open={openViewProductYoutubeVideoDialog}
                    handleClose={handleCloseViewProductYoutubeVideoDialog}
                    dialogTitle={"Product Youtube Video"}
                    action={action}
                    fields={productYoutubeVideoFields}
                    values={productYoutubeVideoValues}
                    url={addProductYouTubeVideoUrl}
                />
            }
            {openViewProductRatingsDialog &&
                <ViewProductRatings
                    open={openViewProductRatingsDialog}
                    handleClose={handleCloseViewProductRatingsDialog}
                    selected={productsSelection.selected[0]}
                />
            }
            {openScheduleNotificationDialog &&
                <FormDialog
                    open={openScheduleNotificationDialog}
                    handleClose={handleCloseScheduleNotificationDialog}
                    dialogTitle={"Notifications Schedule"}
                    action={CREATE}
                    fields={scheduleNotificationsFields}
                    values={scheduleNotificationValues}
                    url={scheduleProductNotificationUrl}
                />
            }
            {openDeleteDialog &&
                <DeleteDialog
                    open={openDeleteDialog}
                    handleClose={handleCloseDeleteDialog}
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
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
                                    Products
                                </Typography>
                            </Stack>
                            <div>
                                <Button
                                    onClick={handleClickOpenCreateDialog}
                                    startIcon={(
                                        <SvgIcon fontSize="small">
                                            <PlusIcon />
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                    sx={{
                                        color: "neutral.100"
                                    }}
                                >
                                    Add
                                </Button>
                            </div>
                        </Stack>
                        <Scrollbar
                            sx={{
                                position: 'sticky',
                                top: 64,
                                zIndex: (theme) => theme.zIndex.appBar
                            }}
                        >
                            <Box
                                component="header"
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    alignContent: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "neutral.100",
                                    borderRadius: "70px",
                                    height: 75,
                                    minWidth: 1000,
                                    transition: 'all 0.3 ease-in-out',
                                }}
                            >
                                {productStatus.map((item, index) => {

                                    return (
                                        <Button
                                            key={index}
                                            sx={{
                                                borderRadius: "70px",
                                                width: '100%',
                                                height: '100%',
                                                color: 'text.primary',
                                                '&:hover': {
                                                    backgroundColor: currentTab === index ? 'primary.main' : 'neutral.300)'
                                                },
                                                ...(currentTab === index && {
                                                    backgroundColor: "primary.main",
                                                    color: "neutral.100",
                                                }),
                                            }}
                                            onClick={() => setCurrentTab(index)}
                                        >
                                            {item.label}
                                        </Button>
                                    );
                                })}
                            </Box>
                        </Scrollbar>
                        <CustomSearch
                            popoverItems={filterItems}
                            handleSearch={handleSearch}
                        />
                        <CustomTable
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            count={products.total_results}
                            items={products.results}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectOne={productsSelection.handleSelectOne}
                            page={products.page >= 1 ? products.page - 1 : products.page}
                            rowsPerPage={rowsPerPage}
                            selected={productsSelection.selected}
                            headCells={productsHeadCells}
                            popoverItems={productsPopoverItems}
                            isLoading={isLoading}
                            switchFunction={updateProductAvailability}
                            isSubmitting={isSubmitting}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    )
}

export default Products