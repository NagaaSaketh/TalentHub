import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const ApplicantLayout = () => {
  const location = useLocation();
  const hideSearchRoutes = ["/applicant/profile","/applicant/dashboard","/applicant","/applicant/myjobs"];
  const hideSearch =
    location.pathname.startsWith("/applicant/job") ||
    hideSearchRoutes.includes(location.pathname);
  return (
    <>
      <NavBar showSearch={!hideSearch} />
      <Outlet />
    </>
  );
};

export default ApplicantLayout;
