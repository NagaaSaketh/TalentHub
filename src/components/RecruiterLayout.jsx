import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const RecruiterLayout = () => {

  return (
    <>
      <NavBar showSearch={false} />
      <Outlet />
    </>
  );
};

export default RecruiterLayout;
