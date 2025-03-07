import { Link } from "react-router-dom";
import Logo from "~/assets/Logo";
import Wooly_Logo from "~/assets/Logo/Wooly_logo.png";

function Footer() {
  return (
    <div>
      <div className="mt-20">
        <hr />
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  text-sm">
          <div>
            {/* <img src={Wooly_Logo} alt="" className="mb-5 w-32" /> */}
            <Logo className="mb-5 w-32" />
            <p className="w-full md:w-2/3  text-gray-600">
              Tạo Nên Sắc Màu Cuộc Sống, Biến sợi len thành nghệ thuật, mang ấm
              áp đến bạn" 🌿 "Chạm vào từng sợi len, cảm nhận sự tinh tế"
            </p>
          </div>
          <div>
            <p className="text-xl font-medium mb-5"> Về chúng tôi</p>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>
                <Link to="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/collection">Sản phẩm</Link>
              </li>
              <li>Tin tức</li>
              <li>
                <Link to="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xl font-medium mb-5"> CHÍNH SÁCH</p>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>Hướng dẫn mua hàng</li>
              <li>Chính sách thanh toán</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025@ wooly.com - All right reserve
        </p>
      </div>
    </div>
  );
}

export default Footer;
