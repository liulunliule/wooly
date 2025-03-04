import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
    const navigate = useNavigate("");
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-3 rounded-full">
                        <svg
                            className="w-12 h-12 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Thanh toán thành công!
                </h1>

                <p className="text-gray-600 text-center mb-6">
                    Cảm ơn bạn đã thực hiện thanh toán. Giao dịch của bạn đã
                    được xử lý thành công.
                </p>

                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="flex justify-between text-sm ">
                        <span className="text-gray-600">Ngày:</span>
                        <span className="text-gray-800 font-medium">
                            {new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Nút hành động */}
                <div className="flex justify-center">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
                        onClick={() => navigate("/")}
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;
