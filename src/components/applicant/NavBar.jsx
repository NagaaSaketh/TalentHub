import { logoutUser } from "../../utils/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UsersRoundIcon } from "lucide-react";
import { useState } from "react";
import { setSearch } from "../../utils/applicant/applicantSlice";

const NavBar = ({ showSearch = true }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, profile } = useSelector((state) => state.user);
  const { search } = useSelector((state) => state.applicant);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-md px-4 lg:px-8">
        <div className="flex-1">
          <Link to="/applicant" className="flex items-center gap-2">
            <UsersRoundIcon size={34} className="text-blue-600" />
            <span className="text-xl md:text-2xl font-bold">TalentHub</span>
          </Link>
        </div>
        {showSearch && (
          <div className="hidden md:flex flex-1 justify-center px-6">
            <label className="input input-bordered w-full max-w-xl">
              <svg
                className="h-5 w-5 opacity-60"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>

              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Search jobs, companies..."
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
              />
            </label>
          </div>
        )}

        <div className="flex-1 flex justify-end items-center gap-2">
          <h2 className="text-xl font-bold px-2">
            Welcome back, {user.fullname}
          </h2>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                {profile?.photo ? (
                  <img src={profile?.photo} alt="profile-pic" />
                ) : (
                  <span className="font-semibold">
                    {user?.fullname?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-56 rounded-box bg-base-100 shadow-lg z-50"
            >
              <li>
                <Link
                  to={
                    user?.role === "recruiter"
                      ? "/recruiter/profile"
                      : "/applicant/profile"
                  }
                >
                  Profile
                </Link>
              </li>

              <li>
                <Link
                  to={
                    user?.role === "recruiter"
                      ? "/recruiter"
                      : "/applicant/dashboard"
                  }
                >
                  Dashboard
                </Link>
              </li>

              {user?.role === "recruiter" && (
                <li>
                  <Link to="/recruiter/publish-job">Publish New Job</Link>
                </li>
              )}

              {user?.role === "applicant" && (
                <li>
                  <Link to="/applicant/jobs">View My Applications</Link>
                </li>
              )}

              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="md:hidden px-4 py-3 bg-base-100 shadow-sm">
          <label className="input input-bordered w-full">
            <svg
              className="h-5 w-5 opacity-60"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>

            <input
              type="search"
              className="grow"
              placeholder="Search jobs..."
            />
          </label>
        </div>
      )}
    </>
  );
};

export default NavBar;
