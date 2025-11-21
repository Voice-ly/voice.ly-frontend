import { Outlet } from "react-router";
import LeftImage from "../../components/LeftImage";

/**
 * LeftImageLayout component
 *
 * This layout is used for pages that require a left-side image section
 * (visible only on desktop) and a right-side content area where the
 * routed components are rendered.
 *
 * Behavior:
 * - On mobile devices: only the right content area is visible (full width).
 * - On desktop screens: the layout splits into two columns:
 *   - Left side: an image or promotional component.
 *   - Right side: the page content rendered through React Router's `<Outlet />`.
 *
 * @component
 * @returns {JSX.Element} A responsive layout with a left-side image and right-side form/content area.
 */

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

