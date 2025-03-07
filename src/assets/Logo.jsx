import React from "react";
import { useNavigate } from "react-router-dom";
import Wooly_Logo from "~/assets/Logo/Wooly_logo.png";

const Logo = ({ className, style }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  return (
    <img
      src={Wooly_Logo}
      alt="Wooly Logo"
      onClick={handleLogoClick}
      style={{ cursor: "pointer", ...style }}
      className={className}
    />
  );
};

export default Logo;
