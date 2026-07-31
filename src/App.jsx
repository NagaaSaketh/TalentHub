import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, lazy, Suspense } from "react";
import { fetchCurrentUser } from "./utils/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import ApplicantLayout from "./components/ApplicantLayout";
import RecruiterLayout from "./components/RecruiterLayout";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const JobListing = lazy(() => import("./pages/JobListing"));
const RecruiterDashboard = lazy(() => import("./pages/RecruiterDashboard"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const ApplicantProfile = lazy(() => import("./pages/ApplicantProfile"));
const PublishJob = lazy(() => import("./pages/PublishJob"));
const RecruiterProfile = lazy(() => import("./pages/RecruiterProfile"));
const AllApplications = lazy(() => import("./pages/AllApplications"));
const RecruiterJobs = lazy(() => import("./pages/RecruiterJobs"));
const EditJob = lazy(() => import("./pages/EditJob"));
const ArchivedJobs = lazy(() => import("./pages/ArchivedJobs"));
const ApplicantDashboard = lazy(() => import("./pages/ApplicantDashboard"));
const ApplicantJobs = lazy(() => import("./pages/ApplicantJobs"));

function App() {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate
                  to={user.role === "recruiter" ? "/recruiter" : "/applicant"}
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate
                  to={user.role === "recruiter" ? "/recruiter" : "/applicant"}
                  replace
                />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate
                  to={user.role === "recruiter" ? "/recruiter" : "/applicant"}
                  replace
                />
              ) : (
                <Register />
              )
            }
          />
          <Route
            path="/applicant/"
            element={
              <ProtectedRoute allowedRoles={["applicant"]}>
                <ApplicantLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<JobListing />} />
            <Route path="dashboard" element={<ApplicantDashboard />} />
            <Route path="profile" element={<ApplicantProfile />} />
            <Route path="job/:id" element={<JobDetails />} />
            <Route path="jobs" element={<ApplicantJobs />} />
          </Route>
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RecruiterDashboard />} />
            <Route path="profile" element={<RecruiterProfile />} />
            <Route path="publish-job" element={<PublishJob />} />
            <Route path="applications" element={<AllApplications />} />
            <Route path="jobs" element={<RecruiterJobs />} />
            <Route path="jobs/:id/edit" element={<EditJob />} />
            <Route path="archived-jobs" element={<ArchivedJobs />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
