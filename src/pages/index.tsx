"use client";

import { NextPage } from "next";
import { useEffect, useState } from "react";
import UserHome from "../components/userHome";
import AdminHome from "@/components/adminHome";

const Home: NextPage = () => {
    const [userId, setUserId] = useState<string | null>("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        if (sessionStorage.getItem("userId") === null) {
            window.location.href = "/login";
        }
        loadUser();
    }, []);

    const loadUser = async () => {
        if (sessionStorage.getItem("userId") === null) {
            return;
        }
        const userId = sessionStorage.getItem("userId");
        setUserId(userId);
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
            setRole(data.role);
        } else {
            window.location.href = "/login";
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    }

    return (
        <div className="p-10 rounded shadow-md bg-white text-black w-4/5 h-4/5">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-4">Welcome {name}</h1>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded" onClick={handleLogout}>Log out</button>
            </div>

            {role === "admin" ? (
                <AdminHome />
            ) : (
                <UserHome userId={userId} />
            )}
        </div>
    );
};

export default Home;
