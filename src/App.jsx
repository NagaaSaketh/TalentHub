import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, lazy, Suspense } from "react";
import { fetchCurrentUser } from "./utils/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import ApplicantLayout from "./components/applicant/ApplicantLayout";
import RecruiterLayout from "./components/recruiter/RecruiterLayout";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const JobListing = lazy(() => import("./pages/applicant/JobListing"));
const RecruiterDashboard = lazy(
  () => import("./pages/recruiter/RecruiterDashboard"),
);
const JobDetails = lazy(() => import("./pages/applicant/JobDetails"));
const ApplicantProfile = lazy(
  () => import("./pages/applicant/ApplicantProfile"),
);
const PublishJob = lazy(() => import("./pages/recruiter/PublishJob"));
const RecruiterProfile = lazy(
  () => import("./pages/recruiter/RecruiterProfile"),
);
const AllApplications = lazy(() => import("./pages/recruiter/AllApplications"));
const RecruiterJobs = lazy(() => import("./pages/recruiter/RecruiterJobs"));
const EditJob = lazy(() => import("./pages/recruiter/EditJob"));
const ArchivedJobs = lazy(() => import("./pages/recruiter/ArchivedJobs"));
const ApplicantDashboard = lazy(
  () => import("./pages/applicant/ApplicantDashboard"),
);
const ApplicantJobs = lazy(() => import("./pages/applicant/ApplicantJobs"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const dispatch = useDispatch();
  const { user, initializing } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (initializing) {
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
            path="/forgot-password"
            element={
              user ? (
                <Navigate
                  to={user.role === "recruiter" ? "/recruiter" : "/applicant"}
                  replace
                />
              ) : (
                <ForgotPassword />
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
            path="/applicant"
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
          <Route
            path="*"
            element={user ? <NotFound /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
