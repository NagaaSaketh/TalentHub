import { Outlet } from "react-router-dom";
import ApplicantNavBar from "../components/ApplicantNavBar";

const ApplicantLayout = () => {
  return (
    <>
      <ApplicantNavBar />
      <Outlet />
    </>
  );
};

export default ApplicantLayout;