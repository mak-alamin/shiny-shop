import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "../../../auth/axios";
import Alert from "../../../components/ui/Alert";
import Loader from "../../../components/ui/Loader";

const AddUser = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [validationErrors, setValidationErrors] = React.useState({});

    const roleOptions = [
        { value: "admin", label: "Admin" },
        { value: "editor", label: "Editor" },
        { value: "shop_manager", label: "Shop Manager" },
        { value: "seo_manager", label: "SEO Manager" },
        { value: "customer", label: "Customer" },
        { value: "subscriber", label: "Subscriber" },
        { value: "user", label: "User" },
    ];

    const onSubmit = async (data) => {
        setLoading(true);
        setValidationErrors({});
        try {
            await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
                withCredentials: true,
            });
            const response = await axios.post(
                "http://localhost:8000/api/users",
                data,
                {
                    withCredentials: true,
                },
            );
            setSuccess(true);
            reset();
        } catch (err) {
            setSuccess(false);
            if (err.response?.status === 422) {
                setValidationErrors(err.response.data.errors);
            } else {
                setValidationErrors({
                    general: ["An unexpected error occurred"],
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Link
                to="/dashboard/users"
                className="text-brandGreen-900  mb-3 flex items-center"
            >
                <img
                    src="/icons/chevron-left.svg"
                    alt="Back"
                    width={18}
                    height={18}
                />
                Users
            </Link>

            <div className="users-form bg-white px-4 py-3 shadow-sm mb-4 rounded-sm">
                <h2 className="block text-2xl font-bold p-3 mb-2">
                    Add New User
                </h2>
                <form
                    className="add-user-form p-3"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <label
                        htmlFor="name"
                        className="label mb-4 block max-w-[300px]"
                    >
                        <span className="text-base block">Name</span>
                        <input
                            id="name"
                            type="text"
                            className="input bg-base-light w-full"
                            {...register("name", {
                                required: "Name is required",
                            })}
                        />
                        {errors.name && (
                            <p style={{ color: "red" }}>
                                {errors.name.message}
                            </p>
                        )}
                    </label>
                    <label
                        htmlFor="email"
                        className="label mb-4 block max-w-[300px]"
                    >
                        <span className="text-base block">Email</span>
                        <input
                            id="email"
                            type="email"
                            className="input bg-base-light w-full"
                            {...register("email", {
                                required: "Email is required",
                            })}
                        />
                        {errors.email && (
                            <p style={{ color: "red" }}>
                                {errors.email.message}
                            </p>
                        )}
                    </label>
                    <label
                        htmlFor="role"
                        className="label mb-4 block max-w-[300px]"
                    >
                        <span className="text-base block">Role</span>
                        <select
                            id="role"
                            className="select bg-base-light w-full"
                            {...register("role", {
                                required: "Role is required",
                            })}
                            defaultValue="user"
                        >
                            {roleOptions.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p style={{ color: "red" }}>
                                {errors.role.message}
                            </p>
                        )}
                    </label>
                    <label
                        htmlFor="password"
                        className="label mb-4 block max-w-[300px]"
                    >
                        <span className="text-base block">Password</span>
                        <input
                            id="password"
                            type="password"
                            className="input bg-base-light w-full"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                            })}
                        />
                        {errors.password && (
                            <p style={{ color: "red" }}>
                                {errors.password.message}
                            </p>
                        )}
                    </label>
                    {Object.keys(validationErrors).length > 0 && (
                        <div className="mb-4">
                            {Object.entries(validationErrors).map(
                                ([field, messages]) => (
                                    <p key={field} style={{ color: "red" }}>
                                        <strong>{field}:</strong>{" "}
                                        {Array.isArray(messages)
                                            ? messages.join(" ")
                                            : messages}
                                    </p>
                                ),
                            )}
                        </div>
                    )}
                    <input
                        type="submit"
                        className="text-white bg-brandGreen-600 btn my-4 max-w-48"
                        value={loading ? "Adding..." : "Add User"}
                    />
                </form>
                {loading && <Loader />}
                {success && (
                    <Alert type="success" message="User added successfully!" />
                )}
            </div>
        </>
    );
};

export default AddUser;
