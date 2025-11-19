import { Outlet } from "react-router";
import RightImage from "../../components/RightImage";

export default function RightImageLayout() {
  return (
    <div className="flex sm:flex-row  w-full ">

      {/* LEFT SIDE */}
      <RightImage />

      {/* RIGHT SIDE */}
      
        <div className=" w-full sm:w-1/2 bg-white min-h-screen flex flex-col justify-center py-10 px-6">
          <Outlet />
        </div>
     
    </div>
  );
}

