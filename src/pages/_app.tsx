import "@/styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <Component {...pageProps} />
            </div>
        </ThemeProvider>
    );
}
