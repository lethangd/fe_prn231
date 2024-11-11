import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Client } from "../api-client"; // NSwag-generated Client
import Image from "../Share/img/Image";
import convertMoney from "../convertMoney";

function Home() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiClient = new Client();

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        pageNumber: 1,
        pageSize: 8,
        sortBy: "",
        sortDirection: 0,
      };

      try {
        setLoading(true);
        const response = await apiClient.productGET(
          undefined,
          undefined,
          undefined,
          undefined,
          params.pageNumber,
          params.pageSize,
          params.sortBy,
          params.sortDirection
        );

        // Log the full response to verify structure
        console.log("API Response:" + response);

        // Check if 'items' exists in response
        if (response && response.items) {
          setProducts(response.items);
          setTotalPages(response.totalPages || 1);
        } else {
          setError("Unexpected response structure from the server.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading indicator
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>; // Error message display
  }

  return (
    <div className="page-holder">
      <header className="header bg-white">
        <div className="container">
          {/* Hero Banner Section */}
          <section
            className="hero pb-3 bg-cover bg-center d-flex align-items-center"
            style={{ backgroundImage: `url(${Image.banner})` }}
          >
            <div className="container py-5">
              <div className="row px-4 px-lg-5">
                <div className="col-lg-6">
                  <p className="text-muted small text-uppercase mb-2">
                    New Inspiration 2020
                  </p>
                  <h1 className="h2 text-uppercase mb-3">
                    20% off on new season
                  </h1>
                  <Link className="btn btn-dark" to="/shop">
                    Browse collections
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Categories Section */}
          <section className="pt-5">
            <header className="text-center">
              <p className="small text-muted text-uppercase mb-1">
                Carefully created collections
              </p>
              <h2 className="h5 text-uppercase mb-4">Browse our categories</h2>
            </header>
            <div className="row">
              <CategoryLink image={Image.img1} category="Phone" />
              <CategoryLink image={Image.img2} category="Laptop" />
              <CategoryLink image={Image.img3} category="Tablet" />
              <CategoryLink image={Image.img4} category="Accessories" />
              <CategoryLink image={Image.img5} category="Accessories" />
            </div>
          </section>

          {/* Products Section */}
          <section className="py-5" id="section_product">
            <header>
              <p className="small text-muted text-uppercase mb-1">
                Made the hard way
              </p>
              <h2 className="h5 text-uppercase mb-4">Top trending products</h2>
            </header>
            <div className="row">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </header>
    </div>
  );
}

export default Home;

// CategoryLink Component
function CategoryLink({ image, category }) {
  return (
    <div className="col-md-4 mb-4">
      <Link className="category-item" to={`/shop?category=${category}`}>
        <img className="img-fluid" src={image} alt={category} />
      </Link>
    </div>
  );
}

// ProductCard Component
function ProductCard({ product }) {
  return (
    <div className="col-xl-3 col-lg-4 col-sm-6">
      <div className="product text-center">
        <div className="position-relative mb-3">
          <a
            className="d-block"
            href={`#product_${product.id}`}
            data-toggle="modal"
          >
            <img className="img-fluid" src={product.coverImage} alt={product.name} />
          </a>
          <div className="product-overlay">
            <ul className="mb-0 list-inline">
              {/* Add buttons for add to cart, wishlist, etc. */}
            </ul>
          </div>
        </div>
        <h6>
          <Link className="reset-anchor" to={`/detail/${product.id}`}>
            {product.name}
          </Link>
        </h6>
        <p className="small text-muted">{convertMoney(product.price)} VND</p>
      </div>
    </div>
  );
}
