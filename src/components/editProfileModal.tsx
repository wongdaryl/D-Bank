"use client";

import React, { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

const EditProfileModal: React.FC<ModalProps> = ({ isOpen, onClose, user }) => {
    const [name, setName] = React.useState("");
    const [dateOfBirth, setDateOfBirth] = React.useState("");
    const [monthlyIncome, setMonthlyIncome] = React.useState(0);

    const handleSubmit = async () => {
        if (dateOfBirth === "") {
            alert("Please enter a valid date of birth");
            return;
        } else if (name === "") {
            alert("Please enter a valid name");
            return;
        } else if (dateOfBirth > new Date().toISOString().split("T")[0]) {
            alert("Date of birth cannot be after today");
            return;
        } else if (monthlyIncome <= 0) {
            alert("Monthly Income cannot be negative or zero");
            return;
        }

        const headers: any = {
            "Content-Type": "application/json",
            "x-user-id": sessionStorage.getItem("userId"),
            "x-user-role": sessionStorage.getItem("role"),
        };
        const res = await fetch(`/api/user/${user?.id}`, {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify({
                name: name,
                dateOfBirth: dateOfBirth,
                monthlyIncome: monthlyIncome,
            }),
        });
        if (res.status === 200) {
            onClose();
            window.location.reload();
        }
    };

    useEffect(() => {
        if (!user || !user.date_of_birth) return;

        setName(user?.name);
        const date = new Date(user?.date_of_birth);
        setDateOfBirth(
            `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        );
        setMonthlyIncome(user?.monthly_income);
    }, [user]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-opacity-25 bg-black">
            <div className="relative w-3/4 mx-auto my-6">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-8 border-b border-solid rounded-t">
                        <h3 className="text-3xl font-semibold">
                            Edit Profile Details
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
                            <label htmlFor="name" className="block w-1/5">
                                Name:
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="flex space-x-4 align-middle mb-2">
                            <label
                                htmlFor="monthlyIncome"
                                className="block w-1/5"
                            >
                                Monthly Income:
                            </label>
                            <input
                                id="amount"
                                type="number"
                                value={monthlyIncome}
                                onChange={(e) =>
                                    setMonthlyIncome(parseFloat(e.target.value))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="flex space-x-4 align-middle mb-2">
                            <label
                                htmlFor="dateOfBirth"
                                className="block w-1/5"
                            >
                                Date of Birth:
                            </label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>

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

export default EditProfileModal;
