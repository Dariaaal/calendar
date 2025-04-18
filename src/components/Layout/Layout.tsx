import { Link, Outlet, useLocation } from "react-router-dom";
import css from "./Layout.module.css";
import { cx } from "../../lib/classNames";
import { useState, useRef, useEffect } from "react";
import Header from "../Header/Header";

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
        <Header/>

        <main className={cx("bg-primary", css["layout-content"])}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
