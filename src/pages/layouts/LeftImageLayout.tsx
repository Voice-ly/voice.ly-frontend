import { Outlet } from "react-router";
import LeftImage from "../../components/LeftImage";

export default function LeftImageLayout() {
  return (
    <div className="flex sm:flex-row  w-full">

      {/* LEFT SIDE - Oculto en móvil, visible en desktop */}
      <LeftImage />

      {/* RIGHT SIDE - 100% en móvil, 50% en desktop */}
        <div className="w-full sm:w-1/2 bg-white min-h-screen flex flex-col justify-center py-0 px-5">
          <Outlet />
        </div>
     
    </div>
  );
}

