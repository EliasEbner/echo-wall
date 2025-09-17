import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="fixed inset-0 overflow-y-scroll overflow-x-auto text-font bg-canvas dark:bg-canvas-dark dark:text-font-dark">
      <Outlet />
    </div>
  );
}
