import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AboutUs from "./Pages/About Us/AboutUs";
import Home from "./Pages/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Live from "./Pages/Live Tv/Live";
import Quran from "./Pages/Quran/Quran";
import Reader from "./Pages/Single Reader/Reader";
import ContactUs from "./Pages/Contact Us/ContactUs";
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/aboutUs",
        element: <AboutUs />,
      },
      {
        path: "/live",
        element: <Live />,
      },
      {
        path: "/quran",
        element: <Quran />,
      },
      {
        path: "/reader/:readerName",
        element: <Reader />,
      },
      {
        path: "/contactUs",
        element: <ContactUs />,
      },
    ],
    errorElement: <NotFound />,
  },
]);