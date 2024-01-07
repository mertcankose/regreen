import { Outlet } from "react-router-dom";
import { Header, Footer } from "../components";

const OutsideLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default OutsideLayout;
