import Hero_image from "~/assets/hero_img.jpg";

function Hero() {
    return (
        <div className="relative flex flex-col sm:flex-row border border-gray-400 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 p-4 shadow-2xl">
            {/* Ánh sáng lấp lánh */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-transparent to-pink-400 opacity-50 blur-2xl"></div>

            {/* Hero left */}
            <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 relative z-10">
                <div className="text-white text-center sm:text-left">
                    {/* Thanh gạch ngang */}
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <p className="w-8 md:w-11 h-[3px] bg-white"></p>
                        <p className="font-medium text-lg md:text-xl uppercase tracking-widest">
                            🌟 SỰ LỰA CHỌN HOÀN HẢO 🌟
                        </p>
                    </div>

                    {/* Tiêu đề lòe loẹt */}
                    <h1 className="prata-regular text-4xl sm:py-3 lg:text-6xl leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-white drop-shadow-lg">
                        Đan yêu thương
                    </h1>
                    <h1 className="prata-regular text-4xl sm:py-3 lg:text-6xl leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-yellow-400 drop-shadow-lg">
                        Dệt ấm áp
                    </h1>

                    {/* Nút mua ngay phát sáng */}
                    <div className="flex items-center gap-2 justify-center sm:justify-start mt-6">
                        <p className="font-semibold text-xl md:text-2xl animate-pulse">
                            ⚡ MUA NGAY ⚡
                        </p>
                        <p className="w-10 md:w-12 h-[2px] bg-white"></p>
                    </div>
                </div>
            </div>

            {/* Hero-right (ảnh có hiệu ứng glow) */}
            <div className="w-full sm:w-1/2 relative">
                <img
                    className="w-full h-full object-cover rounded-xl border-4 border-white shadow-lg "
                    src={Hero_image}
                    alt="Hero Banner"
                />
            </div>
        </div>
    );
}

export default Hero;
