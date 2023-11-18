import { useState } from "react";
import { SortConfig, SortableTh } from "./sortableTh";

interface Payment {
    id: number;
    loan_id: number;
    amount: number;
    date: string;
}

const PaymentTable: React.FC<{ payments: Payment[] }> = ({ payments }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: "date",
        direction: "asc",
    });

    const requestSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedPayment = [...payments].sort((a: any, b: any) => {
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
                            label="ID"
                            sortKey="id"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                        <SortableTh
                            label="Loan ID"
                            sortKey="loan_id"
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
                            label="Date"
                            sortKey="date"
                            requestSort={requestSort}
                            sortConfig={sortConfig}
                        />
                    </tr>
                </thead>
                <tbody>
                    {sortedPayment.map((payment) => (
                        <tr key={payment.id}>
                            <td className="border px-4 py-2">{payment.id}</td>
                            <td className="border px-4 py-2">
                                {payment.loan_id}
                            </td>
                            <td className="border px-4 py-2">
                                ${payment.amount}
                            </td>
                            <td className="border px-4 py-2">
                                {new Date(payment.date).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default PaymentTable;
