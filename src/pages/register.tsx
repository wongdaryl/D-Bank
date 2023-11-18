import { NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";

const Register: NextPage = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [monthlyIncome, setMonthlyIncome] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, username, password, dateOfBirth, monthlyIncome }),
        });

        if (res.status === 201) {
            window.location.href = "/login";
        }
    };
    return (
        <div className="p-10 rounded shadow-md bg-white text-black w-3/5">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center">
                    <label htmlFor="username" className="block mb-2 w-1/5">
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
                <div className="flex items-center">
                    <label htmlFor="username" className="block mb-2 w-1/5">
                        Full Name:
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex items-center">
                    <label htmlFor="username" className="block mb-2 w-1/5">
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
                <div className="flex items-center">
                    <label htmlFor="username" className="block mb-2 w-1/5">
                        Date of Birth:
                    </label>
                    <input
                        id="dateOfBirth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex items-center">
                    <label htmlFor="username" className="block mb-2 w-1/5">
                        Monthly Income:
                    </label>
                    <input
                        id="monthlyIncome"
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <p>
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500">
                            Login here!
                        </Link>
                    </p>
                </div>
                <div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;
