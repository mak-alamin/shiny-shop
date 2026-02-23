import Logo from "../../../images/Logo.png";

const Navbar = () => {
    return (
        <header className="app-nav flex items-center justify-between px-4 py-2">
            <div className="logo w-1/4">
                <img src={Logo} alt="Logo" width="180" />
            </div>

            <div className="navbar-main flex justify-center w-1/2">
                <div className="search-box flex w-3/4 relative">
                    <input
                        type="text"
                        name="admin_search"
                        id="admin_search"
                        placeholder="Search..."
                        className="border-1 border-gray-200 rounded-full px-4 w-full focus:border-brandGreen-900 outline-none focus:shadow-none"
                    />
                    <img
                        src="/icons/search-icon.svg"
                        alt="Logo"
                        width="26"
                        className="absolute right-3 top-2"
                    />
                </div>
            </div>

            <div className="nav-right flex items-center justify-end gap-3 w-1/4">
                <ul className="languages flex gap-1">
                    <li> English </li>
                    <li> Spanish </li>
                </ul>
                <div className="current-user avatar">
                    <div className="w-12 rounded-full">
                        <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
