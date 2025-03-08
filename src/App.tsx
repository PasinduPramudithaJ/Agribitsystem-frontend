import "./app.scss";
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider, useUser } from "./pages/login/UserContext";

// Lazy-loaded components
const Home = lazy(() => import("./pages/home/Home"));
const Gigs = lazy(() => import("./pages/gigs/Gigs"));
const Gig = lazy(() => import("./pages/gig/Gig"));
const Login = lazy(() => import("./pages/login/Login"));
const Register = lazy(() => import("./pages/register/Register"));
const Add = lazy(() => import("./pages/add/Add"));
const Orders = lazy(() => import("./pages/orders/Orders"));
const Messages = lazy(() => import("./pages/messages/Messages"));
const Message = lazy(() => import("./pages/message/Message"));
const MyGigs = lazy(() => import("./pages/myGigs/MyGigs"));
const Pay = lazy(() => import("./pages/pay/Pay"));
const Success = lazy(() => import("./pages/success/Success"));
const GigDescription = lazy(() => import("./pages/GigDescription/GigDescription"));

// Constants for user roles
const ROLES = {
  FARMER: "Farmer",
  BUYER: "Buyer",
  ADMIN: "Admin",
};

// Query Client for React Query
const queryClient = new QueryClient();

// Layout component with Navbar, Footer, and dynamic Outlet content
const Layout: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <div className="app">
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
      <Footer />
    </div>
  </QueryClientProvider>
);

// Protected Route Component
const ProtectedRoute: React.FC<{
  roles?: string[];
  redirectTo?: string;
  children: React.ReactNode;
}> = ({ roles = [], redirectTo = "/login", children }) => {
  const { currentUser } = useUser();

  if (!currentUser) {
    // Redirect to login if the user is not logged in
    return <Navigate to={redirectTo} />;
  }

  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    // Redirect to home if the user's role is not authorized
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

// Router Configuration
const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/gigs", element: <Gigs /> },
        {
          path: "/order",
          element: (
            <ProtectedRoute roles={[ROLES.FARMER]}>
              <Orders />
            </ProtectedRoute>
          ),
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/myGigs",
          element: (
            <ProtectedRoute roles={[ROLES.FARMER]}>
              <MyGigs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/orders/:productId",
          element: (
            <ProtectedRoute roles={[ROLES.FARMER]}>
              <Orders />
            </ProtectedRoute>
          ),
        },
        { path: "/messages", element: <Messages /> },
        { path: "/message", element: <Message /> },
        {
          path: "/add",
          element: (
            <ProtectedRoute roles={[ROLES.FARMER]}>
              <Add />
            </ProtectedRoute>
          ),
        },
        { path: "/register", element: <Register /> },
        { path: "/login", element: <Login /> },
        { path: "/pay", element: <Pay /> },
        { path: "/success", element: <Success /> },
        { path: "/description/:productId", element: <GigDescription /> },
      ],
    },
  ]);

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

export default App;

