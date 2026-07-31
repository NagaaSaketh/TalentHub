import {
  LayoutDashboard,
  PlusSquare,
  Briefcase,
  User,
  LogOut,
  UsersRoundIcon,
  FileUser,
  Archive,
} from "lucide-react";

import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../utils/auth/authSlice";

const RecruiterSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate("/login");
  };

  const menus = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/recruiter",
    },
    {
      name: "Publish Job",
      icon: PlusSquare,
      path: "/recruiter/publish-job",
    },
    {
      name: "View All Applications",
      icon: FileUser,
      path: "/recruiter/applications",
    },
    {
      name: "My Jobs",
      icon: Briefcase,
      path: "/recruiter/jobs",
    },
    {
      name: "View Archived Jobs",
      icon: Archive,
      path: "/recruiter/archived-jobs",
    },
    {
      name: "Profile",
      icon: User,
      path: "/recruiter/profile",
    },
  ];

  return (
    <div className="drawer-side is-drawer-close:overflow-visible">
      <label htmlFor="recruiter-drawer" className="drawer-overlay"></label>

      <div
        className="
        flex
        min-h-full
        flex-col
        bg-base-100
        border-r
        is-drawer-close:w-20
        is-drawer-open:w-64
      "
      >
        <div className="h-24 border-b flex items-center justify-center">
          <Link
            to="/recruiter"
            className="flex items-center gap-3  w-full

    is-drawer-close:justify-center
    is-drawer-open:justify-center"
          >
            <UsersRoundIcon size={38} className="text-primary shrink-0" />

            <span className="font-bold text-2xl is-drawer-close:hidden">
              TalentHub
            </span>
          </Link>
        </div>

        <ul className="menu w-full grow px-3 py-6 space-y-3">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <li key={menu.name}>
                <NavLink
                  to={menu.path}
                  end={menu.path === "/recruiter"}
                  className={({ isActive }) => ` h-14
    rounded-xl
    flex
    items-center
    gap-3

    
    is-drawer-close:justify-center
    is-drawer-open:justify-start

    ${isActive ? "bg-primary text-primary-content" : "hover:bg-base-200"}
    `}
                >
                  <Icon size={24} />

                  <span className="is-drawer-close:hidden">{menu.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        <div className="border-t p-3">
          <button
            onClick={logout}
            className="
btn
btn-ghost
w-full
rounded-xl
text-error

is-drawer-close:justify-center
is-drawer-open:justify-start
"
          >
            <LogOut size={22} />

            <span className="is-drawer-close:hidden">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterSidebar;
