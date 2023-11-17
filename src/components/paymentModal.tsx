import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: any;
}

const PaymentModal: React.FC<ModalProps> = ({ isOpen, onClose, loan }) => {
    const [amount, setAmount] = React.useState(0);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        const res = await fetch(`/api/payment/loan/${loan.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: loan.user_id,
                amount: amount,
                loanId: loan.id,
            }),
        });
        if (res.status === 201) {
            onClose();
            window.location.reload();
        } else {
            const data = await res.json();
            alert(data.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-opacity-25 bg-black">
            <div className="relative w-3/4 mx-auto my-6">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
                        <h3 className="text-3xl font-semibold">
                            Make payment for Loan ID {loan.id}
                        </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={onClose}
                        >
                            <span className=" h-6 w-6 text-2xl">×</span>
                        </button>
                    </div>

                    <div className="relative p-6 flex-auto space-y-4">
                        <div className="flex space-x-3">
                            <p>
                                Outstanding amount:{" "}
                                <strong>${loan.outstanding_amount}</strong>
                            </p>

                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
                                onClick={() => {
                                    setAmount(loan.outstanding_amount);
                                }}
                            >
                                Pay Max Amount
                            </button>
                        </div>

                        <div className="flex space-x-4 align-middle mb-2">
                            <label htmlFor="amount" className="block">
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

export default PaymentModal;
