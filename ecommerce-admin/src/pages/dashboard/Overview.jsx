import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "react-icons/tb";
import Bar from "../../charts/Bar.jsx";
import Area from "../../charts/Area.jsx";
import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import Profile from "../../components/common/Profile.jsx";
import { Client } from "../api-client"; // Import NSwag API client

const Overview = () => {
  const apiClient = new Client();
  const [totalSale, setTotalSale] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    fetchOrdersAndProducts();
  }, []);

  const fetchOrdersAndProducts = async () => {
    try {
      // Fetch all orders
      const ordersData = await apiClient.orderGET();
      setRecentOrders(ordersData);
      setTotalOrders(ordersData.length);

      // Calculate total revenue and total items from orders
      const revenue = ordersData.reduce(
        (acc, order) => acc + order.totalAmount,
        0
      );

      // Fetch all products
      const productsData = await apiClient.productGET(
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        100,
        undefined,
        undefined
      );
      const products = productsData.items;
      setBestSellingProducts(products);

      const items = productsData.totalItemsCount;
      setTotalRevenue(revenue);
      setTotalItems(items);

      setTotalSale(revenue);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <section>
      <div className="container">
        <div className="wrapper">
          <div className="content">
            <div className="content_item sale_overview">
              <div className="sale_overview_card">
                <Icons.TbShoppingCart />
                <div className="sale_overview_content">
                  <h5 className="sale_title">Total Sale</h5>
                  <h4 className="sale_value">${totalSale.toFixed(2)}</h4>
                </div>
              </div>
              <div className="sale_overview_card">
                <Icons.TbShoppingBag />
                <div className="sale_overview_content">
                  <h5 className="sale_title">Total Orders</h5>
                  <h4 className="sale_value">{totalOrders}</h4>
                </div>
              </div>
              <div className="sale_overview_card">
                <Icons.TbPackage />
                <div className="sale_overview_content">
                  <h5 className="sale_title">Total Items</h5>
                  <h4 className="sale_value">{totalItems}</h4>
                </div>
              </div>
              <div className="sale_overview_card">
                <Icons.TbChartBar />
                <div className="sale_overview_content">
                  <h5 className="sale_title">Total Revenue</h5>
                  <h4 className="sale_value">${totalRevenue.toFixed(2)}</h4>
                </div>
              </div>
            </div>
            <div className="content_item">
              <h2 className="sub_heading">
                <span>Sale Analytic</span>
                <Button label="Total Sale" className="sm" />
              </h2>
              <Area />
            </div>
            <div className="content_item">
              <h2 className="sub_heading">Best selling products</h2>
              <table className="simple">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>In Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellingProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <Profile
                          src={product.images?.thumbnail}
                          slogan={product.brand}
                          name={product.name}
                        />
                      </td>
                      <td>{product.brand}</td>
                      <td>${product.price}</td>
                      <td>
                        {product.isInStock ? (
                          <Badge label="In Stock" className="light-success" />
                        ) : (
                          <Badge
                            label="Out of Stock"
                            className="light-danger"
                          />
                        )}
                      </td>
                      <td>{product.isInStock ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="sidebar">
            <div className="sidebar_item">
              <h2 className="sub_heading">Audience</h2>
              <Bar />
            </div>
            <div className="sidebar_item">
              <h2 className="sub_heading">Order Recently</h2>
              <div className="recent_orders column">
                {recentOrders.slice(0, 5).map((order) => (
                  <Link
                    key={order.id}
                    to={`/orders/manage/${order.id}`}
                    className="recent_order"
                  >
                    <div className="recent_order_content">
                      <h4 className="recent_order_title">{order.userId}</h4>
                      <p className="recent_order_category">{order.status}</p>
                    </div>
                    <div className="recent_order_details">
                      <h5 className="recent_order_price">
                        ${order.totalAmount}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
