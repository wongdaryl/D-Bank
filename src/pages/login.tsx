"use client";

import { NextPage } from "next";
import { useState } from "react";

const Login: NextPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(username, password);

        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (res.status === 200) {
            const data = await res.json();
            sessionStorage.setItem("userId", data?.user?.id);
            window.location.href = "/";
        } else {
            setError("Invalid credentials, please try again.");
        }
    };

    return (
            <div className="p-10 rounded shadow-md bg-white text-black w-2/5">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-2 ">
                            Username:
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2">
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <p>
                            Don&apos;t have an account?{" "}
                            <a href="/register" className="text-blue-500">
                                Register here!
                            </a>
                        </p>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Log In
                        </button>
                    </div>
                    <div>
                        <p className="text-red-500">{error}</p>
                    </div>
                </form>
            </div>
    );
};

export default Login;
