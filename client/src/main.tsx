import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import "./i18n";
import Switch from "./switch";
import React from "react";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={clerkPubKey}>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <Switch />
                    </BrowserRouter>
                    <Toaster position="bottom-center" />
                </QueryClientProvider>
            </MantineProvider>
        </ClerkProvider>
    </React.StrictMode>
);
