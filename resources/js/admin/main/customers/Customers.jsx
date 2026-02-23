import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../../../components/ui/Loader";
import axios from "../../../auth/axios";
import useUsers from "../../../hooks/useUsers";

const Customers = () => {
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useUsers("customers");

    const handleDelete = async (e, id) => {
        e.preventDefault();
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }
        setLoading(true);
        try {
            await axios.delete(`http://localhost:8000/api/users/${id}`, {
                withCredentials: true,
            });
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
            console.error("Failed to delete user:", error);
            alert("Failed to delete user.");
        }
        setLoading(false);
    };

    console.log(users);

    const contentHeader = (
        <div className="content-header mb-4">
            <h2 className="inline-flex items-center gap-3 text-2xl font-bold mr-3">
                Customers
            </h2>
        </div>
    );

    if (!users.length) {
        return (
            <>
                {contentHeader}
                <div>No customer founds.</div>
            </>
        );
    }

    return (
        <>
            {contentHeader}
            <div className="content-filters bg-white px-4 py-3 shadow-sm mb-4 rounded-sm">
                User Filters{" "}
            </div>

            <div className="list-table  bg-white px-4 py-3 shadow-sm mb-4 rounded-sm">
                <table className="table-auto w-full text-left">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th className="actions text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!users.length ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    <Loader />
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => {
                                return (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            {user.role
                                                ? user.role
                                                      .replace(/_/g, " ")
                                                      .replace(/\b\w/g, (c) =>
                                                          c.toUpperCase(),
                                                      )
                                                : ""}
                                        </td>

                                        <td className="actions text-right">
                                            <Link
                                                to={`/dashboard/users/edit/${user.id}`}
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
                                                    handleDelete(e, user.id)
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
        </>
    );
};

export default Customers;
