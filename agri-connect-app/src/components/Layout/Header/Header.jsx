import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaBox,
  FaBlog,
  FaEnvelope,
  FaSignInAlt,
  FaCloudSun,
} from "react-icons/fa";
import classes from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  logOut,
  selectIsAuthenticate,
} from "../../../features/slices/authSlice";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useState } from "react";
import { selectUser } from "../../../features/slices/authSlice.js";
import { FaChartLine } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const isAuth = useSelector(selectIsAuthenticate);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const userNavigate = () => {
    if (user.role === 0) {
      navigate("/admin");
    } else if (user.role === 1) {
      navigate("/farmer");
    } else if (user.role === 2) {
      navigate("/FertilizerVender");
    } else if (user.role === 3) {
      navigate("/MachineryVendor");
    }
  };
  const handleLogout = () => {
    dispatch(logOut());
    navigate("/");
  };

  return (
    <header className={classes.header}>
      <div className={classes.logo}>AgriConnect</div>
      <nav>
        <ul className={classes.navLinks}>
          <li>
            <NavLink to="/" className={classes.link}>
              <FaHome className={classes.icon} /> Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={classes.link}>
              <FaInfoCircle className={classes.icon} /> About
            </NavLink>
          </li>
          <li>
            <NavLink to="/weather" className={classes.link}>
              <FaCloudSun className={classes.icon} /> Weather
            </NavLink>
          </li>
          <li>
            <NavLink to="/priceprediction" className={classes.link}>
              <FaChartLine className={classes.icon} /> Crop Price Prediction
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={classes.link}>
              <FaBox className={classes.icon} /> Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" className={classes.link}>
              <FaBlog className={classes.icon} /> Blog
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={classes.link}>
              <FaEnvelope className={classes.icon} /> Contact
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/chat/:userId?/:email?" className={classes.link}>
              <FaEnvelope className={classes.icon} /> Chat
            </NavLink>
          </li> */}
        </ul>
      </nav>
      {isAuth ? (
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={userNavigate}>User</MenuItem>
            <MenuItem onClick={handleLogout}>LogOut</MenuItem>
          </Menu>
        </div>
      ) : (
        <NavLink
          to="/sign-in"
          className={`${classes.loginButton} ${classes.link}`}
        >
          <FaSignInAlt className={classes.icon} /> SignIn
        </NavLink>
      )}
    </header>
  );
};

export default Header;
