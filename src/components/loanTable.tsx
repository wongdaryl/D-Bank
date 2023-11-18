import { useState } from "react";
import { SortableTh, SortConfig } from "./sortableTh";

interface Loan {
    id: number;
    user_id: number;
    type: string;
    currency: string;
    amount: number;
    start_date: string;
    end_date: string;
    interest_rate: number;
    amount_paid: number;
    outstanding_amount: number;
    status: string;
}

const LoanTable: React.FC<{ loans: Loan[] }> = ({ loans }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: "status",
        direction: "asc",
    });

    const requestSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedLoans = [...loans].sort((a: any, b: any) => {
        if (sortConfig.direction === "asc") {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        if (sortConfig.direction === "desc") {
            return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        }
        return 0;
    });

    return (
        <>
            <table className="table-auto">
                <thead>
                    <tr>
                        <SortableTh
                            label="UserId"
                            sortKey="user_id"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                        <SortableTh
                            label="Type"
                            sortKey="type"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                        <SortableTh
                            label="Curr"
                            sortKey="currency"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                        <SortableTh
                            label="Amount"
                            sortKey="amount"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                        <SortableTh
                            label="Start Date"
                            sortKey="start_date"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                        <SortableTh
                            label="End Date"
                            sortKey="end_date"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                        <SortableTh
                            label="Interest Rate"
                            sortKey="interest_rate"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                        <SortableTh
                            label="Paid"
                            sortKey="amount_paid"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                        <SortableTh
                            label="Outstanding"
                            sortKey="outstanding_amount"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                        <SortableTh
                            label="Status"
                            sortKey="status"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                        <th className="px-4 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedLoans.map((loan) => (
                        <tr key={loan.id}>
                            <td className="border px-4 py-2">{loan.user_id}</td>
                            <td className="border px-4 py-2">{loan.type}</td>
                            <td className="border px-4 py-2">
                                {loan.currency}
                            </td>
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
        </>
    );
};

export default LoanTable;
