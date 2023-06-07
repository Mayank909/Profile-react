import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import Nopage from "./pages/Nopage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Registration />,
    
  },
  { path: "/dashboard", element: <Dashboard />, children: [] },
  {path: '*', element: <Nopage/>}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
