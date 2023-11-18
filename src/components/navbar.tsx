import Link from "next/link";
import { useEffect, useState } from "react";

export const NavBar = () => {
    // You can handle the logout functionality here
    const [userId, setUserId] = useState<string | null>();
    const [role, setRole] = useState<string | null>();

    useEffect(() => {
        setUserId(sessionStorage.getItem("userId"));
        setRole(sessionStorage.getItem("role"));
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    };

    return (
        <nav className="bg-black py-4 px-6 flex justify-between items-center ">
            <div className="flex space-x-8 items-center">
                <Link href="/" className="text-white font-bold text-3xl ">
                    D-Bank
                </Link>
                {
                    role === "admin" ? (
                        <Link href="/" className="text-white hover:text-gray-200 text-lg">
                            Manage Loans
                        </Link>
                    ) : (
                        <></>
                    )
                }
            </div>

            {userId === null ? (
                <div className="flex space-x-4">
                    <Link
                        href="/login"
                        className="text-white hover:text-gray-200"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="text-white hover:text-gray-200"
                    >
                        Register
                    </Link>
                </div>
            ) : (
                <button
                    className="text-white bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            )}
        </nav>
    );
};
