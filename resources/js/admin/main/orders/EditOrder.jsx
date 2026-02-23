import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../../auth/axios";
import Loader from "../../../components/ui/Loader";
import Alert from "../../../components/ui/Alert";
import useUsers from "../../../hooks/useUsers";
import AddItems from "../../../components/ui/AddItems";
import ValidationErrors from "../../../components/ui/ValidationErrors";

const EditOrder = () => {
    const { id } = useParams();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const [submitText, setSubmitText] = useState("Update Order");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [users] = useUsers(); // users are fetched here
    const [items, setItems] = useState([]);
    const [orderData, setOrderData] = useState(null); // New state to store fetched order

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/orders/${id}`,
                    {
                        withCredentials: true,
                    },
                );
                setOrderData(response.data); // Store fetched order data
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch order:", error);
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]); // Only depends on id

    useEffect(() => {
        // This useEffect runs when orderData or users change
        if (!orderData) {
            setLoading(true);
        }

        if (orderData && users.length > 0) {
            setValue("status", orderData.status);
            setValue("customer_id", parseInt(orderData?.customer?.user_id));
            setValue("payment_method", orderData?.payment?.payment_method);
            // console.log(orderData.items);

            setItems(
                orderData.items.map((item) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price,
                })),
            );
        }
    }, [orderData, users, setValue]); // Depends on orderData and users

    const handleAddItem = () => {
        setItems((prev) => [...prev, { product_id: null, quantity: 1 }]);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setValidationErrors({});

        if (!items.length) {
            setLoading(false);
            return;
        }

        data.items = items.filter(
            (item) => item.product_id && item.quantity > 0,
        );

        try {
            await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
                withCredentials: true,
            });

            await axios.put(`http://localhost:8000/api/orders/${id}`, data, {
                withCredentials: true,
            });

            setSuccess(true);
            setLoading(false);
        } catch (err) {
            if (err.response?.status === 422) {
                setValidationErrors(err.response.data.errors);
            } else {
                setValidationErrors({
                    general: ["An unexpected error occurred"],
                });
            }
            setSuccess(false);
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            <Link
                to="/dashboard/orders"
                className="text-brandGreen-900  mb-3 flex items-center"
            >
                <img
                    src="/icons/chevron-left.svg"
                    alt="Back"
                    width={18}
                    height={18}
                />
                Orders
            </Link>

            <div className="orders-form bg-white px-4 py-3 shadow-sm mb-4 rounded-sm">
                <h2 className="block text-2xl font-bold p-3 mb-2">
                    Edit Order
                </h2>

                <form
                    action=""
                    method="post"
                    className="item-add-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex gap-6">
                        <fieldset className="fieldset order-info w-3/4">
                            <label
                                htmlFor="items"
                                className="label mb-4 items-baseline"
                            >
                                <span className="text-base">Items:</span>

                                <div className="items-holder">
                                    <AddItems
                                        items={items}
                                        setItems={setItems}
                                    ></AddItems>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success mt-2"
                                        onClick={handleAddItem}
                                    >
                                        + Add Item
                                    </button>
                                </div>
                            </label>

                            <label htmlFor="status" className="label mb-4">
                                <span className="text-base">Order Status:</span>

                                <div className="w-3/4">
                                    <select
                                        id="status"
                                        className="select bg-base-light"
                                        {...register("status")}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">
                                            Processing
                                        </option>
                                        <option value="on_hold">On hold</option>
                                        <option value="paid">Paid</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                </div>
                            </label>

                            <label htmlFor="customer_id" className="label mb-4">
                                <span className="text-base">Customer:</span>

                                <div className="w-3/4">
                                    <select
                                        id="customer_id"
                                        className="select bg-base-light"
                                        {...register("customer_id")}
                                    >
                                        {users.length &&
                                            users.map((user) => {
                                                return (
                                                    <option
                                                        key={parseInt(user.id)}
                                                        value={parseInt(
                                                            user.id,
                                                        )}
                                                    >
                                                        {user.name}
                                                    </option>
                                                );
                                            })}
                                    </select>
                                </div>
                            </label>

                            <label
                                htmlFor="payment_method"
                                className="label mb-4"
                            >
                                <span className="text-base">
                                    Payment Method:
                                </span>

                                <div className="w-3/4">
                                    <select
                                        id="payment_method"
                                        className="select bg-base-light"
                                        {...register("payment_method")}
                                    >
                                        <option value="cod">
                                            Cash on Delivery
                                        </option>
                                        <option value="card">Card</option>
                                    </select>
                                </div>
                            </label>
                        </fieldset>
                    </div>

                    <input
                        type="submit"
                        className="text-white btn btn-soft btn-info my-4 max-w-48"
                        value={submitText}
                    />
                </form>

                <ValidationErrors errors={validationErrors}></ValidationErrors>

                {success && (
                    <Alert
                        type="success"
                        message="Order updated successfully!"
                    />
                )}
            </div>
        </>
    );
};

export default EditOrder;
