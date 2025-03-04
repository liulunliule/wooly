import React from "react";
import { useNavigate } from "react-router-dom";

function PaymentFailed() {
    const navigate = useNavigate("");

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                {/* Icon thất bại */}
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-3 rounded-full">
                        <svg
                            className="w-12 h-12 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                </div>

                {/* Tiêu đề */}
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Thanh toán không thành công
                </h1>

                {/* Thông báo */}

                {/* Thông tin giao dịch */}
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <p className="text-gray-600 text-center mb-6 font-medium">
                        Rất tiếc, giao dịch của bạn không thể thực hiện được lúc
                        này. Vui lòng kiểm tra lại thông tin thanh toán.
                    </p>
                </div>

                {/* Nút hành động */}
                <div className="flex justify-center gap-4">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
                        onClick={() => navigate("/checkout")}
                    >
                        Thử lại
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
                        onClick={() => navigate("/")}
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentFailed;
