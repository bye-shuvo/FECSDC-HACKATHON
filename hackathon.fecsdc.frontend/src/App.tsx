import { RouterProvider } from "react-router";
import { router } from "./app/router.jsx";

export default function App() {
  return <RouterProvider router={router} />;
}
