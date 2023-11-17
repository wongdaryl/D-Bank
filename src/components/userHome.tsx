"use client";

import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import LoanModal from "./loanModal";

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
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Curr</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2 w-32">Start Date</th>
                            <th className="px-4 py-2 w-32">End Date</th>
                            <th className="px-4 py-2">Interest Rate</th>
                            <th className="px-4 py-2">Paid</th>
                            <th className="px-4 py-2">Outstanding</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan: any) => (
                            <tr key={loan.id}>
                                <td className="border px-4 py-2">
                                    {loan.currency}
                                </td>
                                <td className="border px-4 py-2">
                                    ${loan.amount}
                                </td>
                                <td className="border px-4 py-2">
                                    {new Date(loan.start_date).toLocaleDateString()}
                                </td>
                                <td className="border px-4 py-2">
                                    {new Date(loan.end_date).toLocaleDateString()}
                                </td>
                                <td className="border px-4 py-2">
                                    {loan.interest_rate}
                                </td>
                                <td className="border px-4 py-2">
                                    {loan.amount_paid}
                                </td>
                                <td className="border px-4 py-2">
                                    {loan.outstanding_amount}
                                </td>
                                <td className="border px-4 py-2">
                                    {loan.status}
                                </td>

                                <td>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => {
                                            window.location.href = `/loan/${loan.id}`;
                                        }}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
