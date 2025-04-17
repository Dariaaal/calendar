import { Link, Outlet, useLocation } from "react-router-dom";
import css from "./Layout.module.css";
import { cx } from "../../lib/classNames";
import { SearchIcon } from "../../icons/SearchIcon";
import { ArrowDownIcon } from "../../icons/ArrowDownIcon";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { path: "/home", label: "Home" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/inbox", label: "Inbox" },
  { path: "/products", label: "Products" },
  { path: "/invoices", label: "Invoices" },
  { path: "/customers", label: "Customers" },
  { path: "/chat-room", label: "Chat Room" },
  { path: "/calendar", label: "Calendar" },
  { path: "/help", label: "Help Center" },
  { path: "/settings", label: "Settings" },
];

const Layout = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cx(css["layout-root"], "fx")}>
      <aside className={css["layout-sidebar"]}>
        <div className={css["layout-logo-container"]}>
          <img src="logo.png" alt="logo" className={css["layout-logo"]} />
        </div>
        <nav className={cx("fx", "fx--col")}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cx(
                css["layout-nav-link"],
                location.pathname === link.path ? css["active"] : ""
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className={cx(css["layout-main"], "fx", "fx--col")}>
        <header
          className={cx(
            css["layout-header"],
            "fx",
            "fx--justify-sb",
            "fx--ai-center"
          )}
        >
          <div
            className={cx(css["layout-input-container"], "fx", "fx--ai-center")}
          >
            <div className={css["layout-input-icon"]}>
              <SearchIcon />
            </div>
            <input
              className={css["layout-input"]}
              placeholder="Search transactions, invoices or help"
            />
          </div>
          <div
            className={cx(
              "bg-white",
              "fx",
              "fx--ai-center",
              css["layout-user-container"]
            )}
            ref={menuRef}
          >
            <div className={css["layout-line"]}></div>
            <span className={css["layout-user-name"]}>John Doe</span>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className={cx(
                css["layout-icon-btn"],
                "bg-white",
                menuOpen && css["rotate"]
              )}
            >
              <ArrowDownIcon />
            </div>
            <img
              src="avatar.png"
              alt="Avatar"
              className={css["layout-user-avatar"]}
            />

            {menuOpen && (
              <div className={css["layout-dropdown"]}>
                <button className={css["layout-dropdown-item"]}>Profile</button>
                <button className={css["layout-dropdown-item"]}>
                  Settings
                </button>
                <button className={css["layout-dropdown-item"]}>Logout</button>
              </div>
            )}
          </div>
        </header>

        <main className={css["layout-content"]}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
