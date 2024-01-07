import { Link } from "react-router-dom";
import regreenBanner from "../../assets/images/regreen-banner.png";
import { Button } from "../../components";

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-around pl-4 pt-2 lg:pt-0 lg:pl-20 gap-10 md:gap-16">
      <div className="flex flex-col justify-center mt-4 lg:-mt-20">
        <p className=" text-5xl">
          <span className="text-primary">ReGreen</span> makes sustainable living fun and accessible.
        </p>

        <p className="mt-6 text-darkGray text-lg mb-3">Join us for free to experience a sustainable world!</p>
        <Link to="/login" className="bg-primary w-[146px] h-12 flex justify-center items-center rounded text-white font-semibold">
          Login
        </Link>
        <p className="mt-3 font-semibold text-lightGray">
          Dont have an account?{" "}
          <Link to="register" className="text-primary">
            Register
          </Link>
        </p>
      </div>
      <img src={regreenBanner} alt="ReGreen" width={475} />
    </div>
  );
};

export default Home;
