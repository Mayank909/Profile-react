import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Registration from "./pages/Registration";
import Dashboard from "./pages/dashboard/Dashboard";
import Nopage from "./pages/Nopage";
import Home from "./pages/dashboard/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Registration />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [{ path: "", element: <Home /> }],
  },
  { path: "*", element: <Nopage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
