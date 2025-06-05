import React from 'react';
import { Box, Chip, Drawer, IconButton, Rating, SvgIcon, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export const ViewProductSideNav = (props) => {
    const { open, onClose } = props;
    const productSideNav = useSelector((state) => state.ViewPaymentSideNavReducer);

    return (
        <Drawer
            anchor='right'
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: 'neutral.100',
                    width: 300
                }
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: "2px solid grey",
                }}
            >
                <Typography variant='h6'>
                    {productSideNav?.productSideNavContent?.product_name}
                </Typography>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => {
                        onClose()
                    }}
                    aria-label="close"
                >
                    <SvgIcon fontSize='small'>
                        <XMarkIcon />
                    </SvgIcon>
                </IconButton>
            </Box>
            <Table
                sx={{
                    '& th, & td': {
                        borderBottom: 'none',
                    },
                }}
            >
                <TableBody>
                    <TableRow>
                        <TableCell>Category:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.product_category_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sub-Category:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.product_sub_category_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Vendor Name:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.product_vendor_name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Quantity:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.product_quantity}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Purchase Price:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.product_purchase_amount}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Selling Price:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.product_amount}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Promotion Selling Price:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.product_promotion_amount}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Shipping Cost In Dar:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.product_shipping_cost_in_dar}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Shipping Cost In Other Regions:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.product_shipping_cost_in_other_regions}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Multiply Shipping Cost:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.multiply_shipping_cost}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Free Delivery In Dar:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.free_delivery_in_dar}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Free Delivery In Other Regions:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.free_delivery_in_other_regions}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Short Description:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.short_description}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Description:</TableCell>
                        <TableCell>{productSideNav?.productSideNavContent?.product_description}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Rating:</TableCell>
                        <TableCell>
                            <Rating
                                name="read-only"
                                value={productSideNav?.productSideNavContent?.product_rating}
                                readOnly
                                precision={0.5}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Status:</TableCell>
                        <TableCell>
                            <Chip
                                color={productSideNav?.productSideNavContent?.status === "AVAILABLE" ? 'success' : 'warning'}
                                label={productSideNav?.productSideNavContent?.status}
                                sx={{
                                    width: 120
                                }}
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Drawer>
    );

};

ViewProductSideNav.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
};