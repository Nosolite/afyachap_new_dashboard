import React from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useSelection } from "../../hooks/use-selection";
import { CustomTable } from "../../components/custom-table";
import { CustomSearch } from "../../components/custom-search";
import { productCategoriesHeadCells } from "../../seed/table-headers";
import { CREATE, UPDATE, filterItems } from "../../utils/constant";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { DeleteDialog } from "../../components/delete-dialog";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { FormDialog } from "../../components/form-dialog";
import { productCategoriesFields } from "../../seed/form-fields";
import {
  createProductsCategoryUrl,
  deleteProductsCategoryUrl,
  getAllProductsCategoriesByPaginationUrl,
  updateProductsCategoryUrl,
} from "../../seed/url";
import { postRequest } from "../../services/api-service";
import { CustomAlert } from "../../components/custom-alert";
import ViewProductCategories from "./ViewProductCategories";
import TagIcon from "@heroicons/react/24/outline/TagIcon";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";
import PhotoIcon from "@heroicons/react/24/outline/PhotoIcon";
import ViewProductCategoriesSections from "./ViewProductCategoriesSections";
import ViewProductCategoriesBanners from "./ViewProductCategoriesBanners";

const useProductsCategoriesIds = (specializations) => {
  return React.useMemo(() => {
    return specializations.map((customer) => customer.id);
  }, [specializations]);
};

function ProductCategories() {
  const [action, setAction] = React.useState(CREATE);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [productsCategories, setProductsCategories] = React.useState({
    page: 1,
    total_results: 0,
    total_pages: 0,
    results: [],
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const productsCategoriesIds = useProductsCategoriesIds(
    productsCategories.results
  );
  const productCategoriesSelection = useSelection(productsCategoriesIds);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openViewProductSectionsDialog, setOpenViewProductSectionsDialog] =
    React.useState(false);
  const [openViewProductBannersDialog, setOpenViewProductBannersDialog] =
    React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [severity, setSeverity] = React.useState("");
  const [severityMessage, setSeverityMessage] = React.useState("");
  const values = [
    {
      id: action === UPDATE ? productCategoriesSelection.selected[0].id : 0,
      product_category_name:
        action === UPDATE
          ? productCategoriesSelection.selected[0].product_category_name
          : "",
      product_category_color:
        action === UPDATE
          ? productCategoriesSelection.selected[0].product_category_color
          : "#9ef6b0",
      image:
        action === UPDATE
          ? productCategoriesSelection.selected[0].icon_url
          : null,
    },
  ];
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("id");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const fetcher = React.useCallback(
    (page) => {
      postRequest(
        getAllProductsCategoriesByPaginationUrl,
        {
          query: searchTerm,
          sort: orderBy + " " + order,
          limit: rowsPerPage,
          page: page,
        },
        (data) => {
          setProductsCategories(data);
          setIsLoading(false);
        },
        (error) => {
          setProductsCategories({
            page: 1,
            total_results: 0,
            total_pages: 0,
            results: [],
          });
          setIsLoading(false);
        }
      );
    },
    [rowsPerPage, searchTerm, orderBy, order]
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    fetcher(1);
  }, [fetcher]);

  const handlePageChange = React.useCallback(
    (event, value) => {
      fetcher(value + 1);
    },
    [fetcher]
  );

  const handleRowsPerPageChange = React.useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleClickOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    action === UPDATE ? fetcher(productsCategories.page) : fetcher(1);
    setOpenCreateDialog(false);
    setAction(CREATE);
  };

  const handleClickOpenViewDialog = () => {
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  const handleClickOpenViewProductSectionsDialog = () => {
    setOpenViewProductSectionsDialog(true);
  };

  const handleCloseViewProductSectionsDialog = () => {
    setOpenViewProductSectionsDialog(false);
  };

  const handleClickOpenViewProductBannersDialog = () => {
    setOpenViewProductBannersDialog(true);
  };

  const handleCloseViewProductBannersDialog = () => {
    setOpenViewProductBannersDialog(false);
  };

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleClickAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleDelete = async () => {
    postRequest(
      deleteProductsCategoryUrl,
      {
        id: productCategoriesSelection.selected[0].id,
      },
      (data) => {
        fetcher(productsCategories.page);
        setSeverityMessage(data.message);
        setSeverity("success");
        handleClickAlert();
        setIsDeleting(false);
        handleCloseDeleteDialog();
      },
      (error) => {
        if (error?.response?.data?.message) {
          setSeverityMessage(error.response.data.message[0]);
          setSeverity("error");
          handleClickAlert();
        }
        setIsDeleting(false);
      }
    );
  };

  const productPopoverItems = [
    {
      id: "view_sub_categories",
      label: "Sub Categories",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <TagIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (productCategoriesSelection?.selected[0]?.id) {
          handleClickOpenViewDialog();
        }
      },
    },
    {
      id: "view_sections",
      label: "Sections",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <TableCellsIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (productCategoriesSelection?.selected[0]?.id) {
          handleClickOpenViewProductSectionsDialog();
        }
      },
    },
    {
      id: "view_banners",
      label: "Banners",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <PhotoIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (productCategoriesSelection?.selected[0]?.id) {
          handleClickOpenViewProductBannersDialog();
        }
      },
    },
    {
      id: "edit",
      label: "Edit",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <PencilIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (productCategoriesSelection?.selected[0]?.id) {
          setAction(UPDATE);
          handleClickOpenCreateDialog();
        }
      },
    },
    {
      id: "delete",
      label: "Delete",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <TrashIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (productCategoriesSelection?.selected[0]?.id) {
          handleClickOpenDeleteDialog();
        }
      },
    },
  ];

  return (
    <>
      {openAlert && (
        <CustomAlert
          openAlert={openAlert}
          handleCloseAlert={handleCloseAlert}
          severity={severity}
          severityMessage={severityMessage}
        />
      )}
      {openCreateDialog && (
        <FormDialog
          open={openCreateDialog}
          handleClose={handleCloseCreateDialog}
          dialogTitle={"Product Category"}
          action={action}
          fields={productCategoriesFields}
          values={values}
          url={
            action === CREATE
              ? createProductsCategoryUrl
              : updateProductsCategoryUrl
          }
        />
      )}
      {openViewDialog && (
        <ViewProductCategories
          open={openViewDialog}
          handleClose={handleCloseViewDialog}
          selected={productCategoriesSelection.selected[0]}
        />
      )}
      {openViewProductSectionsDialog && (
        <ViewProductCategoriesSections
          open={openViewProductSectionsDialog}
          handleClose={handleCloseViewProductSectionsDialog}
          selected={productCategoriesSelection.selected[0]}
        />
      )}
      {openViewProductBannersDialog && (
        <ViewProductCategoriesBanners
          open={openViewProductBannersDialog}
          handleClose={handleCloseViewProductBannersDialog}
          selected={productCategoriesSelection.selected[0]}
        />
      )}
      {openDeleteDialog && (
        <DeleteDialog
          open={openDeleteDialog}
          handleClose={handleCloseDeleteDialog}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 8,
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Product Categories</Typography>
              </Stack>
              <div>
                <Button
                  onClick={handleClickOpenCreateDialog}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  sx={{
                    color: "neutral.100",
                  }}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CustomSearch
              popoverItems={filterItems}
              handleSearch={handleSearch}
            />
            <CustomTable
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              count={productsCategories.total_results}
              items={productsCategories.results}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectOne={productCategoriesSelection.handleSelectOne}
              page={
                productsCategories.page >= 1
                  ? productsCategories.page - 1
                  : productsCategories.page
              }
              rowsPerPage={rowsPerPage}
              selected={productCategoriesSelection.selected}
              headCells={productCategoriesHeadCells}
              popoverItems={productPopoverItems}
              isLoading={isLoading}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default ProductCategories;
