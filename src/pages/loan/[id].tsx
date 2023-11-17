"use client";

import PaymentModal from "@/components/paymentModal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

const Loan = (props: any) => {
    const router = useRouter();
    const { id } = router.query;

    const [loanLoading, setLoanLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const [loan, setLoan] = useState<any>({});
    const [payments, setPayments] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!id) return;
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
            <h1 className="text-2xl font-bold mb-4">Loan ID: {id} Details</h1>
            {loanLoading ? (
                <div className="flex justify-center items-center mt-14">
                    <InfinitySpin color="blue" />
                </div>
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">
                                {loan["currency"]}
                            </td>
                            <td className="border px-4 py-2">
                                ${loan["amount"]}
                            </td>
                            <td className="border px-4 py-2">
                                {new Date(
                                    loan["start_date"]
                                ).toLocaleDateString()}
                            </td>
                            <td className="border px-4 py-2">
                                {new Date(
                                    loan["end_date"]
                                ).toLocaleDateString()}
                            </td>
                            <td className="border px-4 py-2">
                                {loan["interest_rate"]}
                            </td>
                            <td className="border px-4 py-2">
                                ${loan["amount_paid"]}
                            </td>
                            <td className="border px-4 py-2">
                                ${loan["outstanding_amount"]}
                            </td>
                            <td className="border px-4 py-2">
                                {loan["status"]}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}

            {loanLoading ? (
                <></>
            ) : loan["status"] === "active" ? (
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
                    <table className="table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Loan ID</th>
                                <th className="px-4 py-2">Amount</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment: any) => (
                                <tr key={payment.id}>
                                    <td className="border px-4 py-2">
                                        {payment.id}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {payment.loan_id}
                                    </td>
                                    <td className="border px-4 py-2">
                                        ${payment.amount}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {new Date(
                                            payment.date
                                        ).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
