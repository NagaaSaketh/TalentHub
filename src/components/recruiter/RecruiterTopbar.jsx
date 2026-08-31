import { Bell, Menu } from "lucide-react";
import { useSelector } from "react-redux";

const RecruiterTopbar = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);

  return (
    <nav className="navbar bg-base-100 border-b px-3 sm:px-6 shadow-sm min-w-0">
      <label
        htmlFor="recruiter-drawer"
        className="btn btn-square btn-ghost drawer-button shrink-0"
      >
        <Menu size={22} />
      </label>

      <div className="flex-1 min-w-0 px-2 sm:px-3">
        <h1 className="text-xl sm:text-3xl font-bold truncate">
          Recruiter Portal
        </h1>
      </div>

      <div className="hidden sm:block shrink-0">
        <h2 className="text-sm sm:text-xl font-semibold">
          Welcome back, {user.fullname}
        </h2>
      </div>

      <div className="avatar ml-2 sm:ml-4 shrink-0">
        <div className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-primary text-primary-content">
          <span className="font-bold">
            {user?.fullname?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default RecruiterTopbar;
