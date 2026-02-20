import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../../auth/axios";
import Loader from "../../../components/ui/Loader";

const Orders = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await axios.get("http://green-shop.test/sanctum/csrf-cookie", {
                    withCredentials: true,
                });

                const response = await axios.get(
                    "http://green-shop.test/api/orders",
                    {
                        withCredentials: true,
                    },
                );
                setOrders(response.data.data || response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleDelete = async (e, id) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await axios.delete(`http://green-shop.test/api/orders/${id}`, {
                    withCredentials: true,
                });
                setOrders(orders.filter((order) => order.id !== id));
            } catch (error) {
                console.error("Failed to delete order:", error);
            }
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="content-header mb-4">
                <h2 className="inline-flex items-center gap-3 text-2xl font-bold mr-3">
                    Orders
                </h2>

                <Link
                    to="/dashboard/orders/add"
                    className="bg-blue-500 px-4 py-2 rounded-full text-white"
                >
                    Add New Order
                </Link>
            </div>

            <div className="content-filters bg-white px-4 py-2 shadow-sm mb-4 rounded-sm">
                Order Filters
            </div>

            <div className="list-table bg-white px-4 py-2 shadow-sm mb-4 rounded-sm">
                <table className="table-auto w-full text-left ">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Date Created</th>
                            <th>Total</th>
                            <th>Delivery Info</th>
                            <th>Status</th>
                            <th className="actions text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    <Loader />
                                </td>
                            </tr>
                        ) : (
                            currentOrders.map((order) => {
                                return (
                                    <tr key={order.id}>
                                        <td>
                                            <Link
                                                to={`/dashboard/orders/${order.id}`}
                                                className="edit mr-3 underline"
                                            >
                                                #{order.id}
                                            </Link>
                                        </td>
                                        <td>
                                            {order.created_at
                                                ? new Date(
                                                      order.created_at,
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          day: "2-digit",
                                                          month: "long",
                                                          year: "numeric",
                                                      },
                                                  )
                                                : ""}
                                        </td>
                                        <td>${order.total_amount}</td>
                                        <td>N/A</td>
                                        <td>{order.status}</td>

                                        <td className="actions text-right">
                                            <Link
                                                to={`/dashboard/orders/${order.id}`}
                                                className="edit mr-3"
                                            >
                                                <img
                                                    src="/icons/preview.svg"
                                                    alt="Edit"
                                                    width={16}
                                                    height={16}
                                                />
                                            </Link>
                                            <Link
                                                to={`/dashboard/orders/edit/${order.id}`}
                                                className="edit mr-3"
                                            >
                                                <img
                                                    src="/icons/edit.svg"
                                                    alt="Edit"
                                                    width={16}
                                                    height={16}
                                                />
                                            </Link>

                                            <button
                                                onClick={(e) =>
                                                    handleDelete(e, order.id)
                                                }
                                                className="delete"
                                            >
                                                <img
                                                    src="/icons/delete.svg"
                                                    alt="Delete"
                                                    width={16}
                                                    height={16}
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <div className="pagination flex justify-end gap-2">
                <button
                    className="btn"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    className="btn"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentOrders.length < itemsPerPage}
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default Orders;
