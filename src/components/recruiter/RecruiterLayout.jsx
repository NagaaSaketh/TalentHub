import { Outlet } from "react-router-dom";
import RecruiterSidebar from "./RecruiterSidebar";
import RecruiterTopbar from "./RecruiterTopbar";

const RecruiterLayout = () => {
  return (
    <div className="drawer lg:drawer-open bg-base-200">
      <input id="recruiter-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        <RecruiterTopbar />

        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>

      <RecruiterSidebar />
    </div>
  );
};

export default RecruiterLayout;
