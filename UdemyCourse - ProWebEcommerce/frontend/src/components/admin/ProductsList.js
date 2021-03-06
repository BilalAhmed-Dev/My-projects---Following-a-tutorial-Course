import React, { Fragment, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../layouts/MetaData";
import Loader from "../layouts/Loader";
import Sidebar from "./Sidebar";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminProducts,
  clearAdminProductErrors,
} from "../../actions/productAdminActions";
import {
  deleteProduct,
  deleteProductReset,
  clearDeleteProductErrors,
} from "../../actions/deleteProductActions";

// import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";

const ProductsList = () => {
  const history = useHistory();
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, products } = useSelector(
    (state) => state.productAdmin
  );
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.deleteProduct
  );
  console.log(isDeleted);
  useEffect(() => {
    dispatch(getAdminProducts(alert, history));
    if (error) {
      alert.error(error);
    }

    if (deleteError) {
      alert.error(deleteError);
    }

    if (isDeleted) {
      alert.success("Product deleted successfully");
      history.push("/admin/products");
      dispatch(deleteProductReset());
    }
    dispatch(clearDeleteProductErrors());
    dispatch(clearAdminProductErrors());
  }, [dispatch, alert, error, history, deleteError, isDeleted]);

  const setProducts = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    products.forEach((product) => {
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,
        actions: (
          <Fragment>
            <Link
              to={`/admin/product/${product._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              className="btn btn-danger py-1 px-2 ml-2"
              onClick={() => deleteProductHandler(product._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <Fragment>
      <MetaData title={"All Products"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Products</h1>

            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={setProducts()}
                className="px-3"
                bordered
                striped
                hover
              />
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductsList;
