import { logoutUser } from "../utils/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Applicant Dashboard</h1>
      <p>
        Welcome! This is a placeholder — build out job search, applications,
        etc. here.
      </p>
    <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ApplicantDashboard;
