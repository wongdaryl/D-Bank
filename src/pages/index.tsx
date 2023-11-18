"use client";

import AdminHome from "@/components/adminHome";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import UserHome from "../components/userHome";

const Home: NextPage = () => {
    const [userId, setUserId] = useState<string | null>("");
    const [role, setRole] = useState<string | null>("");
    const [user, setUser] = useState<any>({});

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

        const headers: any = {
            "Content-Type": "application/json",
            "x-user-id": userId,
            "x-user-role": role,
        };

        const res = await fetch(`/api/user/${userId}`, {
            method: "GET",
            headers: headers,
        });
        if (res.status === 200) {
            const data = await res.json();
            setUser(data);
        } else {
            window.location.href = "/login";
        }
    };

    return (
        <div className="p-10 rounded shadow-md bg-white text-black w-11/12 h-4/5">
            <h1 className="text-3xl font-bold mb-4">Welcome {user?.name}</h1>
            {role === null ? (
                <></>
            ) : role === "admin" ? (
                <AdminHome />
            ) : (
                role === "user" && <UserHome userId={userId} user={user} />
            )}
        </div>
    );
};

export default Home;
