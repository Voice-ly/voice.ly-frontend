import { Outlet } from "react-router";
import LeftImage from "../../components/LeftImage";

export default function LeftImageLayout() {
  return (
    <div className="flex flex-col sm:flex-row  w-full min-h-screen">

      {/* LEFT SIDE - Oculto en móvil, visible en desktop */}
      <div className="hidden lg:block lg:w-1/2">
        <LeftImage />
      </div>

      {/* RIGHT SIDE - 100% en móvil, 50% en desktop */}
        <div className="w-full lg:w-1/2 bg-white min-h-screen flex flex-col justify-center py-6 px-5 lg:py-8">
          <Outlet />
        </div>
     
    </div>
  );
}

