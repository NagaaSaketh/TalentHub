import { Outlet, useLocation } from "react-router-dom";
import ApplicantNavBar from "../components/ApplicantNavBar";

const ApplicantLayout = () => {
  const location = useLocation();
  const hideSearchRoutes = ["/applicant/profile"];
  const hideSearch =
    location.pathname.startsWith("/applicant/job") ||
    hideSearchRoutes.includes(location.pathname);
  return (
    <>
      <ApplicantNavBar showSearch={!hideSearch} />
      <Outlet />
    </>
  );
};

export default ApplicantLayout;
