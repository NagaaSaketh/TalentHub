import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/auth/authSlice";
import { useDispatch } from "react-redux";

const RecruiterDashboard = () => {
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
      <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
      <p>
        Welcome! This is a placeholder — build out job posting, applicants,
        analytics, etc. here.
      </p>
      <button onClick={handleLogout} className="btn btn-warning">
        Logout
      </button>
    </div>
  );
};

export default RecruiterDashboard;
