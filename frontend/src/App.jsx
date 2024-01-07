import { BrowserRouter, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import "./App.css";

import {
  Home,
  About,
  Projects,
  Messages,
  Notifications,
  Contact,
  Profile,
  Feed,
  Login,
  Register,
  NotFound,
  Unauthorized,
} from "./pages/";

import RootLayout from "./layouts/RootLayout";
import OutsideLayout from "./layouts/OutsideLayout";
import InsideLayout from "./layouts/InsideLayout";
import PrivateRoute from "./layouts/PrivateRoute";

import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

const pageVariants = {
  initial: {
    opacity: 0.5,
    x: "100vw",
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.23,
    },
  },
  exit: {
    opacity: 0.5,
    x: "-100vw",
    transition: {
      duration: 0.23,
    },
  },
};

const RegreenRoutes = () => {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial="initial" animate="animate" exit="exit" variants={pageVariants}>
          <Routes location={location}>
            <Route element={<RootLayout />}>
              <Route path="/" element={<OutsideLayout />}>
                <Route index element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* INSIDE */}
              <Route element={<PrivateRoute />}>
                <Route element={<InsideLayout />}>
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>

              {/* LOGIN, REGISTER */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="*" element={<NotFound />} />
              <Route path="/yetki-yok" element={<Unauthorized />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RegreenRoutes />
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
