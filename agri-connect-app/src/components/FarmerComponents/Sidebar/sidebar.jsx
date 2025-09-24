import React, { useState, useEffect, useRef } from "react";
import { GiFarmTractor } from "react-icons/gi";
import { FaUserCircle, FaChartBar, FaComment } from "react-icons/fa";
import { RiPriceTag3Line } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import StartFarm from "../StartFarming/farm";
import Listings from "../Listings/listings";
import ProfileManager from "../../Profile/profileManager";
import LogoutButton from "../../Logout/logout";
import classes from "./Styles_Sidebar.module.css";
import FarmerChartById from "../../Charts/FarmerChartById";
import Chat from "../../../pages/Chat/Chat";
import { useNavigate } from "react-router-dom";

const Sidebar = () => { 
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const tabs = [
    { name: "Logout", icon: <FiLogOut />, content: <LogoutButton /> },
    {
      name: "Manage Profile",
      icon: <FaUserCircle />,
      content: <ProfileManager />,
    },
    { name: "Start Farming", icon: <GiFarmTractor />, content: <StartFarm /> },
    { name: "List Products", icon: <RiPriceTag3Line />, content: <Listings /> },
    { name: "Analyze Bar", icon: <FaChartBar />, content: <FarmerChartById /> },
    { name: "Chat", icon: <FaComment />, content: null },
  ];

  const toggleSidebar = (index) => {
    const tabName = tabs[index].name;

    if (tabName === "Chat") {
      navigate("/chat/:userId?/:email?"); // navigate to chat route
      return;
    }

    setIsExpanded(!isExpanded); 
    setActiveTab(index);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={classes.dashboardContainer}>
      <div
        ref={sidebarRef}
        className={`${classes.sidebar} ${isExpanded ? classes.expanded : ""}`}
      >
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={classes.sidebarTab}
            onClick={() => toggleSidebar(index)}
          >
            <div className={classes.icon}>{tab.icon}</div>
            {isExpanded && <span className={classes.label}>{tab.name}</span>}
          </div>
        ))}
      </div>
      <div className={classes.content}>
        {activeTab !== null && tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Sidebar;
