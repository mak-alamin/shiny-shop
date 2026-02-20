import React from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../../auth/LogoutButton";
import axios from "../../auth/axios";

const Sidebar = () => {
    const location = useLocation();
    const activePath = location.pathname;

    const activeClasses = "flex gap-2 items-center p-3 mb-2 active";
    const inactiveClasses = "flex gap-2 items-center p-3 mb-2";

    // check if the current path includes the given path
    const isActive = (path) =>
        activePath === path ||
        (path != "/dashboard" && activePath.startsWith(path));

    const pointer = (
        <div className="inline-grid *:[grid-area:1/1]">
            <div className="status status-info animate-ping"></div>
            <div className="status status-info"></div>
        </div>
    );

    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        axios
            .get("/api/user")
            .then((res) => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    const isAdmin = user && (user.role === "admin" || user.role === "Admin");

    const routes = {
        "/dashboard": "Dashboard",
        ...(isAdmin && {
            "/dashboard/products": "Products",
            "/dashboard/categories": "Categories",
            "/dashboard/orders": "Orders",
            "/dashboard/customers": "Customers",
            "/dashboard/users": "Users",
        }),
        "/dashboard/settings": "Settings",
    };

    const routeLinks = Object.keys(routes).map((route) => {
        return (
            <li key={route}>
                <Link
                    to={route}
                    className={
                        isActive(route) ? activeClasses : inactiveClasses
                    }
                >
                    {isActive(route) && pointer} {routes[route]}
                </Link>
            </li>
        );
    });

    // Render the sidebar with the links
    return (
        <div className="sidebar w-1/6 bg-brandGreen-400 p-4">
            <ul>
                {routeLinks}

                <li>
                    <a
                        href="/"
                        target="_blank"
                        className="flex gap
                    -2 items-center p-3 mb-2"
                    >
                        View Site
                    </a>
                </li>

                <li>
                    <LogoutButton></LogoutButton>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
