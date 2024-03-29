import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { getUserRole } from "../../utils/authUtils";
import {
  ADMIN_ROUTES,
  AUTHORITY,
  EMPLOYEE_ROUTES,
  MANAGER_ROUTES,
} from "../../utils/constants";

const getMenuItems = (userRole, userPermissions) => {
  switch (userRole) {
    case "admin":
      return ADMIN_ROUTES;
    case "manager":
      return MANAGER_ROUTES;
    case "employee":
      return userPermissions?.includes(AUTHORITY.level_four)
        ? [...EMPLOYEE_ROUTES, { label: "QMS", link: "/qms" }]
        : EMPLOYEE_ROUTES;
    default:
      return [];
  }
};

const Home = () => {
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const dispatch = useDispatch();

  const fetchUserRole = async () => {
    dispatch(ShowLoading());
    const { role, permissions } = await getUserRole();
    setUserRole(role);
    setUserPermissions(permissions);
    dispatch(HideLoading());
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  const renderMenu = (role, permissions) => {
    const menuItems = getMenuItems(role, permissions);
    return (
      <div className="menu">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.link} className="menu-item">
            {item.label}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="Home">
      {userRole && userPermissions ? (
        renderMenu(userRole, userPermissions)
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;
