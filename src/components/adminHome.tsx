"use client";

import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import LoanTable from "./loanTable";

const AdminHome = (props: any) => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getLoans = async () => {
            setLoading(true);
            const res = await fetch(`/api/loan`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.status === 200) {
                const data = await res.json();
                setLoans(data);
                setLoading(false);
            }
        };
        getLoans();
    }, [props]);

    return (
        <div>
            <div className="flex space-x-3">
                <h1 className="text-2xl font-bold mb-4">All Loans</h1>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-4/5 mt-14">
                    <InfinitySpin color="blue" />
                </div>
            ) : loans.length === 0 ? (
                <div>No loans found.</div>
            ) : (
                <LoanTable loans={loans} />
            )}
        </div>
    );
};

export default AdminHome;
