import { BrowserRouter, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import "./App.css";

import { Home, About, Projects, Contact, Profile, Feed, Login, Register, NotFound, Unauthorized, ForgotPassword } from "./pages/";

import RootLayout from "./layouts/RootLayout";
import OutsideLayout from "./layouts/OutsideLayout";
import InsideLayout from "./layouts/InsideLayout";
import PrivateRoute from "./layouts/PrivateRoute";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

const RegreenRoutes = () => {
  const location = useLocation();

  return (
    <>
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
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="*" element={<NotFound />} />
          <Route path="/yetki-yok" element={<Unauthorized />} />
        </Route>
      </Routes>
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
