import React, { ReactNode } from "react";
import ReactDOM from "react-dom/client";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { MantineProvider } from "@mantine/core";
import Layout from "./layouts/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import NewSkill from "./pages/Admin/NewSkill";
import Skill from "./pages/Admin/Skill";
import NewQuestion from "./pages/Admin/NewQuestion";
import Evaluation from "./pages/Evaluation";
import Success from "./pages/Success";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

const ward = (page: ReactNode) => (
  <>
    <SignedIn>{page}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: ward(<Home />),
      },
      {
        path: "/skills",
        children: [
          {
            path: ":id",
            element: ward(<Skill />),
          },
          {
            path: "new",
            element: ward(<NewSkill />),
          },
          {
            path: ":id/questions/new",
            element: ward(<NewQuestion />),
          },
        ],
      },
      {
        path: "/evaluation/:id",
        element: <Evaluation />,
      },
      {
        path: "/success",
        element: <Success />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster position="bottom-center" />
        </QueryClientProvider>
      </MantineProvider>
    </ClerkProvider>
  </React.StrictMode>
);
