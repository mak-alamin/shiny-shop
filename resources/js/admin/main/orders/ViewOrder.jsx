import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../../auth/axios";
import Loader from "../../../components/ui/Loader";
import useUsers from "../../../hooks/useUsers";

const ViewOrder = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState(null);
    const [users] = useUsers();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(
                    `http://green-shop.test/api/orders/${id}`,
                    {
                        withCredentials: true,
                    },
                );
                setOrderData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch order:", error);
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    const getCustomerName = (customerId) => {
        const user = users.find((u) => u.id === customerId);
        return user ? user.name : "User not found";
    };

    if (loading) {
        return <Loader />;
    }

    if (!orderData) {
        return <div>Order not found.</div>;
    }

    return (
        <>
            <Link
                to="/dashboard/orders"
                className="text-brandGreen-900 mb-3 flex items-center"
            >
                <img
                    src="/icons/chevron-left.svg"
                    alt="Back"
                    width={18}
                    height={18}
                />
                Orders
            </Link>

            <div className="orders-view bg-white px-4 py-3 shadow-sm mb-4 rounded-sm">
                <h2 className="block text-2xl font-bold p-3 mb-2">
                    Order Details
                </h2>

                <div className="p-3">
                    <div className="mb-4">
                        <span className="font-bold">Order ID:</span>{" "}
                        {orderData.id}
                    </div>
                    <div className="mb-4">
                        <span className="font-bold">Order Status:</span>{" "}
                        {orderData.status}
                    </div>
                    <div className="mb-4">
                        <span className="font-bold">Customer:</span>{" "}
                        {getCustomerName(orderData?.customer?.user_id)}
                    </div>
                    <div className="mb-4">
                        <span className="font-bold">Payment Method:</span>{" "}
                        {orderData.payment.payment_method}
                    </div>
                    <div className="mb-4">
                        <span className="font-bold">Total Amount:</span> $
                        {orderData.total_amount}
                    </div>

                    <h3 className="text-xl font-bold mt-6 mb-4">Items</h3>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">
                                        Product
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Quantity
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Price
                                    </th>
                                    <th className="px-4 py-2 text-right">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderData.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">
                                            {item.product.title}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            {item.quantity}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            ${item.price}
                                        </td>
                                        <td className="border px-4 py-2 text-right">
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewOrder;
