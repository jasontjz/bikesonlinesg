import React, { Fragment, useEffect } from "react";
import MetaData from "./layout/MetaData";
import Product from "./product/Product";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productActions";
import Loader from "./layout/Loader";

const Home = () => {
  const dispatch = useDispatch();

  const { loading, products, error, productsCount } = useSelector(
    (state) => state.products
  );
  useEffect(() => {
    dispatch(getProducts());

    if (error) {
    }
  }, [dispatch]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`Buy bikes and accessories online in Singapore`} />
          <h1 id="products_heading">Bikes</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
