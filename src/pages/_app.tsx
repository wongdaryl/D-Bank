import "@/styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import type { AppProps } from "next/app";
import { NavBar } from "@/components/navbar";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
            {/* <div className="flex justify-center items-center h-screen bg-gray-100">
                <Component {...pageProps} />
            </div> */}
            <div className="flex flex-col min-h-screen bg-gray-100">
                <NavBar />
                <div className="flex justify-center items-center pt-10 ">
                    <Component {...pageProps} />
                </div>
            </div>
        </ThemeProvider>
    );
}
