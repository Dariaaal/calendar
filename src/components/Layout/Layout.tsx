import { Link, Outlet, useLocation } from "react-router-dom";
import css from "./Layout.module.css";
import { cx } from "../../lib/classNames";
import Header from "../Header/Header";
import { HomeIcon } from "../../icons/HomeIcon";
import { DashboardIcon } from "../../icons/DashboardIcon";
import { NavLink } from "../../models/NavLink";
import { InboxIcon } from "../../icons/InboxIcon";
import { InvoicesIcon } from "../../icons/InvoicesIcon";
import { CustomersIcon } from "../../icons/CustomersIcon";
import { HelpIcon } from "../../icons/HelpIcon";
import { SettingsIcon } from "../../icons/SettingIcon";
import { ChatIcon } from "../../icons/ChatIcon";
import { CalendarIcon } from "../../icons/CalendarIcon";
import { ProductsIcon } from "../../icons/ProductsIcon";

const navLinks: NavLink[] = [
  { path: "/home", label: "Home", icon: <HomeIcon /> },
  { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon/> },
  { path: "/inbox", label: "Inbox", icon: <InboxIcon/> },
  { path: "/products", label: "Products", icon: <ProductsIcon/> },
  { path: "/invoices", label: "Invoices", icon: <InvoicesIcon/> },
  { path: "/customers", label: "Customers", icon: <CustomersIcon/> },
  { path: "/chat-room", label: "Chat Room", icon: <ChatIcon/> },
  { path: "/calendar", label: "Calendar", icon: <CalendarIcon/> },
  { path: "/help", label: "Help Center", icon: <HelpIcon/> },
  { path: "/settings", label: "Settings", icon: <SettingsIcon/> },
];

const Layout = () => {
  const location = useLocation();

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
                "fx",
                "fx--ai-center",
                css["layout-nav-link"],
                location.pathname === link.path ? css["active"] : ""
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className={cx(css["layout-main"], "fx", "fx--col")}>
        <Header />

        <main className={cx("bg-primary", css["layout-content"])}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
