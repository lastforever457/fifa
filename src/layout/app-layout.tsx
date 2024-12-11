import { Outlet } from "react-router-dom";
import Header from "../components/header";

const AppLayout = () => {
  return (
    <div>
      <Header />
      <div className="mx-auto p-5 md:p-10 container">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
