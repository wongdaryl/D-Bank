"use client";

import PaymentModal from "@/components/paymentModal";
import PaymentTable from "@/components/paymentTable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

const Loan = (props: any) => {
    const router = useRouter();
    const { id } = router.query;
    const [userId, setUserId] = useState<string | null>("");
    const [role, setRole] = useState<string | null>("");

    const [loanLoading, setLoanLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const [userProfile, setUserProfile] = useState<any>({});
    const [loan, setLoan] = useState<any>({});
    const [payments, setPayments] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (
            !id ||
            sessionStorage.getItem("userId") === null ||
            sessionStorage.getItem("role") === null
        ) {
            return;
        }
        setUserId(sessionStorage.getItem("userId"));
        setRole(sessionStorage.getItem("role"));

        const headers: any = {
            "Content-Type": "application/json",
            "x-user-id": sessionStorage.getItem("userId"),
            "x-user-role": sessionStorage.getItem("role"),
        };
        const getLoan = async () => {
            setLoanLoading(true);
            const res = await fetch(`/api/loan/${id}`, {
                method: "GET",
                headers: headers,
            });
            if (res.status === 200) {
                const data = await res.json();
                setLoan(data[0]);
                setLoanLoading(false);
            } else {
                const data = await res.json();
                alert(data.message);
                window.location.href = "/";
            }
        };
        const getPayments = async () => {
            setPaymentLoading(true);
            const res = await fetch(`/api/payment/loan/${id}`, {
                method: "GET",
                headers: headers,
            });
            if (res.status === 200) {
                const data = await res.json();
                setPayments(data);
                setPaymentLoading(false);
            } else {
                const data = await res.json();
                alert(data.message);
                window.location.href = "/";
            }
        };
        getLoan();
        getPayments();
    }, [id, props]);

    useEffect(() => {
        if (!loan || role !== "admin") return;

        const getUserProfile = async () => {
            const headers: any = {
                "Content-Type": "application/json",
                "x-user-id": userId,
                "x-user-role": role,
            };
            const res = await fetch(`/api/user/${loan.user_id}`, {
                method: "GET",
                headers: headers,
            });
            if (res.status === 200) {
                const data = await res.json();
                setUserProfile(data);
            }
        };
        getUserProfile();
    }, [loan, role, userId]);

    const handleAdminAction = async (status: string) => {
        const headers: any = {
            "Content-Type": "application/json",
            "x-user-id": userId,
            "x-user-role": role,
        };
        const res = await fetch(`/api/loan/admin/${id}`, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify({ status: status }),
        });
        if (res.status === 200) {
            window.location.reload();
        } else {
            const data = await res.json();
            alert(data.message);
        }
    };

    return (
        <div className="p-10 rounded shadow-md bg-white text-black w-4/5 h-4/5 space-y-5">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded"
                onClick={() => {
                    router.back();
                }}
            >
                Back
            </button>

            {role === "admin" && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">
                        User ID: {loan.user_id} Profile
                    </h1>

                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Username</th>
                                <th className="px-4 py-2">Date of Birth</th>
                                <th className="px-4 py-2">Monthly Income</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">
                                    {userProfile.name}
                                </td>
                                <td className="border px-4 py-2">
                                    {userProfile.username}
                                </td>
                                <td className="border px-4 py-2">
                                    {new Date(
                                        userProfile.date_of_birth
                                    ).toLocaleDateString()}
                                </td>
                                <td className="border px-4 py-2">
                                    ${userProfile.monthly_income}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            <h1 className="text-2xl font-bold">Loan ID: {id} Details</h1>
            {loanLoading ? (
                <div className="flex justify-center items-center">
                    <InfinitySpin color="blue" />
                </div>
            ) : (
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Curr</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Start Date</th>
                            <th className="px-4 py-2">End Date</th>
                            <th className="px-4 py-2">Interest Rate</th>
                            <th className="px-4 py-2">Paid</th>
                            <th className="px-4 py-2">Outstanding</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">
                                {loan.currency}
                            </td>
                            <td className="border px-4 py-2">{loan.type}</td>
                            <td className="border px-4 py-2">${loan.amount}</td>
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
                                ${loan.amount_paid}
                            </td>
                            <td className="border px-4 py-2">
                                ${loan.outstanding_amount}
                            </td>
                            {loan.status === "active" ? (
                                <td className="border px-4 py-2 text-green-600">
                                    {loan.status}
                                </td>
                            ) : loan.status === "rejected" ? (
                                <td className="border px-4 py-2 text-red-500">
                                    {loan.status}
                                </td>
                            ) : loan.status === "pending" ? (
                                <td className="border px-4 py-2 text-yellow-600">
                                    {loan.status}
                                </td>
                            ) : (
                                loan.status === "paid" && (
                                    <td className="border px-4 py-2 text-orange-600">
                                        {loan.status}
                                    </td>
                                )
                            )}
                        </tr>
                    </tbody>
                </table>
            )}

            {loanLoading ? (
                <></>
            ) : role === "admin" && loan["status"] === "pending" ? (
                <div className="flex space-x-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            handleAdminAction("active");
                        }}
                    >
                        Approve
                    </button>
                    <button
                        className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                            handleAdminAction("rejected");
                        }}
                    >
                        Reject
                    </button>
                </div>
            ) : role === "user" && loan["status"] === "active" ? (
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    Make Payment
                </button>
            ) : (
                <button
                    className="bg-blue-300 text-white font-bold py-2 px-4 rounded"
                    disabled
                >
                    Make Payment
                </button>
            )}
            <div>
                <h1 className="text-xl font-bold mb-4">Payments History</h1>

                {paymentLoading ? (
                    <div className="flex justify-center items-center mt-14">
                        <InfinitySpin color="blue" />
                    </div>
                ) : payments.length === 0 ? (
                    <div>No payments found.</div>
                ) : (
                    <PaymentTable payments={payments} />
                )}
            </div>
            <PaymentModal
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                }}
                loan={loan}
            />
        </div>
    );
};

export default Loan;
