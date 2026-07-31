import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import notfound from "../assets/notfound.jpg";

const NotFound = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <motion.img
          src={notfound}
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-72 mx-auto"
        />
        <p className="mt-4 mb-2 text-base-content/60">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link to={user?.role === "recruiter" ? "/recruiter" : "/applicant"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
          >
            Back Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
