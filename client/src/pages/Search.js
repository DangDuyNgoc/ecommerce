import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";

const Search = () => {
    const [values, setVaules] = useSearch();

    return (
        <Layout title={"Search"}>
            <div className="container">
                <div className="text-center">
                    <h1>Search Results</h1>
                    <h6>
                        {values?.results.length < 1
                        ? "No Products Found"
                        : `Found ${values.results.length}`}
                    </h6>
                    <div className="d-flex flex-wrap">
                        {values?.results.map((product) => (
                            <div
                                className="card m-2"
                                style={{ width: "18rem" }}
                                key={product._id}
                            >
                                <img
                                    src={`/api/v1/product/product-image/${product._id}`}
                                    className="card-img-top"
                                    alt={product.name}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">
                                        {product.description}....
                                    </p>
                                    <p className="card-text">{product.price}</p>
                                    <button className="btn btn-primary">More Details</button>
                                    <button className="btn btn-secondary">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Search;
