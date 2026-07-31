import { Bell, Menu } from "lucide-react";
import { useSelector } from "react-redux";

const RecruiterTopbar = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);

  return (
    <nav className="navbar bg-base-100 border-b px-6 shadow-sm">
      <label
        htmlFor="recruiter-drawer"
        className="btn btn-square btn-ghost drawer-button"
      >
        <Menu size={22} />
      </label>

      <div className="flex-1 px-3">
        <h1 className="text-3xl font-bold">Recruiter Portal</h1>
      </div>

      <div>
        <h2 className="text-xl font-semibold ">Welcome back, {user.fullname} </h2>
      </div>

      <div className="avatar ml-4">
        <div className=" flex items-center justify-center w-12 rounded-full bg-primary text-primary-content">
          <span className="font-bold">
            {user?.fullname?.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default RecruiterTopbar;
