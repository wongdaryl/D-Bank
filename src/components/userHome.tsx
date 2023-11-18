"use client";

import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import LoanModal from "./loanModal";
import LoanTable from "./loanTable";

const UserHome = (props: any) => {
    const [loans, setLoans] = useState([]);
    const [applyLoan, setApplyLoan] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!props.userId) return;
        const getLoans = async () => {
            setLoading(true);
            const res = await fetch(`/api/loan/user/${props.userId}`, {
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
                <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded"
                    onClick={() => {
                        // setApplyLoan(true);
                    }}
                >
                    Edit
                </button>
            </div>

            {props.user ? (
                <table className="table-auto mb-10">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Date of Birth</th>
                            <th className="px-4 py-2">Monthly Income</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">
                                {new Date(
                                    props?.user.date_of_birth
                                ).toLocaleDateString()}
                            </td>
                            <td className="border px-4 py-2">
                                ${props?.user.monthly_income}
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <InfinitySpin color="blue" />
            )}
            <div className="flex space-x-3">
                <h1 className="text-2xl font-bold mb-4">My Loans</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded"
                    onClick={() => {
                        setApplyLoan(true);
                    }}
                >
                    Apply Loan
                </button>
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

            <LoanModal
                isOpen={applyLoan}
                onClose={() => setApplyLoan(false)}
                userId={props.userId}
            />
        </div>
    );
};

export default UserHome;
