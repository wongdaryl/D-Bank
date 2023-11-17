"use client";

import AdminHome from "@/components/adminHome";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import UserHome from "../components/userHome";

const Home: NextPage = () => {
    const [userId, setUserId] = useState<string | null>("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState<string | null>("");

    useEffect(() => {
        if (sessionStorage.getItem("userId") === null) {
            window.location.href = "/login";
        }
        loadUser();
    }, []);

    const loadUser = async () => {
        if (
            sessionStorage.getItem("userId") === null ||
            sessionStorage.getItem("role") === null
        ) {
            return;
        }
        const userId = sessionStorage.getItem("userId");
        const role = sessionStorage.getItem("role");
        setUserId(userId);
        setRole(role);
        const res = await fetch(`/api/user/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            setName(data.name);
            setUsername(data.username);
        } else {
            window.location.href = "/login";
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="p-10 rounded shadow-md bg-white text-black w-11/12 h-4/5">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-4">Welcome {name}</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded"
                    onClick={handleLogout}
                >
                    Log out
                </button>
            </div>

            {role === null ? (
                <></>
            ) : role === "admin" ? (
                <AdminHome />
            ) : role === "user" && (
                <UserHome userId={userId} />
            )}
        </div>
    );
};

export default Home;
