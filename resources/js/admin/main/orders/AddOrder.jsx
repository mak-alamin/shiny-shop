import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../../auth/axios";
import Loader from "../../../components/ui/Loader";
import Alert from "../../../components/ui/Alert";
import useUsers from "../../../hooks/useUsers";
import useProducts from "../../../hooks/useProducts";
import AddItems from "../../../components/ui/AddItems";
import ValidationErrors from "../../../components/ui/ValidationErrors";

const AddOrder = () => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    const [submitText, setSubmitText] = useState("Create Order");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const [users, setUsers] = useUsers();

    useEffect(() => {
        if (users.length) {
            setValue("customer_id", users[0].id);
        }
    }, [users, setValue]);

    const [products, setProducts] = useProducts();

    const selectableProducts = products.length
        ? products
              .filter((product) => product.price && product.stock != 0)
              .map((product) => ({
                  value: product.id,
                  label: product.title,
              }))
        : [];

    const [items, setItems] = useState([
        { product_id: null, quantity: 1, price: null },
    ]);

    const handleAddItem = () => {
        setItems((prev) => [
            ...prev,
            { product_id: null, quantity: 1, price: null },
        ]);
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setValidationErrors({});

        if (!items.length) {
            return;
        }

        data.items = items.filter(
            (item) => item.product_id && item.quantity > 0,
        );

        try {
            await axios.get("http://green-shop.test/sanctum/csrf-cookie", {
                withCredentials: true,
            });

            const response = await axios.post(
                "http://green-shop.test/api/orders",
                data,
                {
                    withCredentials: true,
                },
            );

            setSuccess(true);
            setLoading(false);
            reset();
            setItems([{ product_id: null, quantity: 1, price: null }]);
            setSubmitText("Update Order");
        } catch (err) {
            console.log(err);

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

    if (!users.length) {
        <Loader />;
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
                    Add New Order
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
                                        defaultValue="pending"
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
                                        defaultValue={users[0]?.id}
                                    >
                                        {users.length &&
                                            users.map((user) => {
                                                return (
                                                    <option
                                                        key={user.id}
                                                        value={user.id}
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
                                        defaultValue="cod"
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

                {loading && <Loader />}
                {success && (
                    <Alert type="success" message="Order added successfully!" />
                )}
            </div>
        </>
    );
};

export default AddOrder;
