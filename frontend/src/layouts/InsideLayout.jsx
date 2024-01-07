import { Outlet } from "react-router-dom";
import { FeedHeader } from "../components";

const InsideLayout = () => {
  return (
    <>
      <FeedHeader />
      <Outlet />
    </>
  );
};

export default InsideLayout;
