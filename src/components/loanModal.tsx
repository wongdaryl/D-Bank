import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: any;
}

const LoanModal: React.FC<ModalProps> = ({ isOpen, onClose, userId }) => {
    const [amount, setAmount] = React.useState(0);
    const [type, setType] = React.useState("Car");
    const [currency, setCurrency] = React.useState("SGD");
    const [startDate, setStartDate] = React.useState(
        new Date().toISOString().split("T")[0]
    );
    const [endDate, setEndDate] = React.useState("");
    const [interestRate, setInterestRate] = React.useState(0);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (startDate === "" || endDate === "") {
            alert("Please enter a valid start and end date");
            return;
        } else if (startDate > endDate) {
            alert("Start date cannot be after end date");
            return;
        } else if (startDate < new Date().toISOString().split("T")[0]) {
            alert("Start date cannot be before today");
            return;
        } else if (interestRate < 0) {
            alert("Interest rate cannot be negative");
            return;
        } else if (amount <= 0) {
            alert("Amount cannot be negative or zero");
            return;
        }

        const res = await fetch(`/api/loan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                type: type,
                amount: amount,
                currency: currency,
                startDate: startDate,
                endDate: endDate,
                interestRate: interestRate,
            }),
        });
        if (res.status === 201) {
            onClose();
            window.location.reload();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-opacity-25 bg-black">
            <div className="relative w-3/4 mx-auto my-6">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-8 border-b border-solid rounded-t">
                        <h3 className="text-3xl font-semibold">
                            Apply for a new loan
                        </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={onClose}
                        >
                            <span className=" h-6 w-6 text-2xl">×</span>
                        </button>
                    </div>

                    <div className="relative p-8 flex-auto space-y-4">
                        <div className="flex space-x-4 align-middle mb-2">
                            <label htmlFor="amount" className="block w-1/5">
                                Amount:
                            </label>
                            <input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(parseFloat(e.target.value))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="flex space-x-4 align-middle mb-2">
                            <label htmlFor="type" className="block w-1/5">
                                Type:
                            </label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            >
                                <option value="car">Car</option>
                                <option value="home">Home</option>
                                <option value="business">Business</option>
                                <option value="personal">Personal</option>
                            </select>
                        </div>

                        <div className="flex space-x-4 align-middle mb-2">
                            <label htmlFor="currency" className="block w-1/5">
                                Currency:
                            </label>
                            <select
                                id="currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            >
                                <option value="SGD">SGD</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>

                        <div className="flex space-x-4 align-middle mb-2">
                            <label htmlFor="startDate" className="block w-1/5">
                                Start Date:
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="flex space-x-4 align-middle mb-2">
                            <label htmlFor="endDate" className="block w-1/5">
                                End Date:
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="flex space-x-4 align-middle mb-2">
                            <label
                                htmlFor="interestRate"
                                className="block w-1/5"
                            >
                                Interest Rate:
                            </label>
                            <input
                                id="interestRate"
                                type="number"
                                value={interestRate}
                                onChange={(e) =>
                                    setInterestRate(parseFloat(e.target.value))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end p-6 border-t border-solid rounded-b">
                        <button
                            className="text-blue-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                        <button
                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanModal;
