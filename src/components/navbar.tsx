import Link from "next/link";
import React from "react";
// import "../styles/navbar.css";
import useToken from "../src/utils/use-token";

const Navbar = () => {

  const { setToken } = useToken();

  const handleLogout = () => {
    setToken('');
    window.location.href = "/";
  }

  return (
    <div className="navbar">
      <ul className="navbar-list" style={{ listStyleType: 'none' }}>
        <li>
          <Link className="navbar-item" href="/me">Mina sidor</Link>
        </li>
        <li>
          <div className="navbar-item" onClick={handleLogout}>Logga ut</div>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
