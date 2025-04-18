import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { SearchIcon } from "../../icons/SearchIcon";
import { ArrowDownIcon } from "../../icons/ArrowDownIcon";
import { MessageIcon } from "../../icons/MessageIcon";
import { SupportIcon } from "../../icons/SupportIcon";
import { NotificationIcon } from "../../icons/NotificationIcon";
import { cx } from "../../lib/classNames";
import css from "./Header.module.css"; 

const Header = () => {
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
    <header className={cx(css["layout-header"], "fx", "fx--justify-sb", "fx--ai-center")}>
      <div className={cx(css["layout-input-container"], "fx", "fx--ai-center")}>
        <div className={css["layout-input-icon"]}>
          <SearchIcon />
        </div>
        <input
          className={css["layout-input"]}
          placeholder="Search transactions, invoices or help"
        />
      </div>

      <div className="fx">
        <div className={cx("fx", "fx--ai-center", css["layout-icons"])}>
          <Link to="/"><SupportIcon /></Link>
          <Link to="/"><MessageIcon /></Link>
          <Link to="/"><NotificationIcon /></Link>
        </div>

        <div
          className={cx("fx", "fx--ai-center", css["layout-user-container"])}
          ref={menuRef}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={css["layout-line"]}></div>
          <span className={css["layout-user-name"]}>John Doe</span>
          <div className={cx(css["layout-icon-btn"], menuOpen && css["rotate"])}>
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
              <button className={css["layout-dropdown-item"]}>Settings</button>
              <button className={css["layout-dropdown-item"]}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
