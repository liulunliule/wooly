import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "~/redux/features/accountSlice";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Female, HelpOutline, Male } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getOtp, changePassword } from "~/redux/features/authSlice";

function Profile() {
  const dispatch = useDispatch();
  const { user: userData, status } = useSelector((state) => state.account);

  // State mặc định
  const [user, setUser] = useState({
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123 456 789",
    address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUserProfile());
    }
  }, [status, dispatch]);

  // Cập nhật dữ liệu khi có API
  useEffect(() => {
    if (userData) {
      setUser((prev) => ({
        avatar: userData.avatar || prev.avatar,
        name: userData.name || "Chưa cập nhật",
        email: userData.email || "Chưa cập nhật",
        gender: userData.gender || "Chưa cập nhật",
        phone: userData.phone || "Chưa cập nhật",
        address: userData.address || "Chưa cập nhật",
      }));
    }
  }, [userData]);

  // Hàm hiển thị giá trị (nếu null => "Chưa cập nhật")
  const displayValue = (value) => value || "Chưa cập nhật";

  // State modal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [newAvatar, setNewAvatar] = useState(user.avatar);
  const [editedUser, setEditedUser] = useState(user);

  // State cho đổi mật khẩu
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Cập nhật email mặc định khi modal đổi mật khẩu được mở
  useEffect(() => {
    if (isChangePasswordModalOpen) {
      setEmail(user.email); // Đặt email mặc định là email của người dùng
    }
  }, [isChangePasswordModalOpen, user.email]);

  useEffect(() => {
    setEditedUser(user);
    setNewAvatar(user.avatar);
  }, [user]);

  // Xử lý mở & đóng modal
  const openAvatarModal = () => setIsAvatarModalOpen(true);
  const closeAvatarModal = () => setIsAvatarModalOpen(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);
  const openChangePasswordModal = () => setIsChangePasswordModalOpen(true);
  const closeChangePasswordModal = () => setIsChangePasswordModalOpen(false);

  // Xử lý upload ảnh
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewAvatar(imageUrl);
    }
  };

  const saveAvatar = () => {
    setUser((prev) => ({ ...prev, avatar: newAvatar }));
    closeAvatarModal();
  };

  // Xử lý cập nhật thông tin cá nhân
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    setUser(editedUser);
    closeEditModal();
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async () => {
    const data = {
      email,
      oldPassword,
      newPassword,
      otp,
    };

    const response = await dispatch(changePassword(data));
    const status = response?.meta?.requestStatus;

    // if (status === "fulfilled") {
    //   toast.success("Đổi mật khẩu thành công!");
    //   closeChangePasswordModal();
    // } else {
    //   toast.error("Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin!");
    // }
  };

  // Xử lý lấy OTP
  const handleGetOTP = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email trước khi lấy OTP!");
      return;
    }

    const response = await dispatch(getOtp(email));
    const status = response?.meta?.requestStatus;

    // if (status === "fulfilled") {
    //   toast.success("OTP đã được gửi đến email của bạn!");
    // } else {
    //   toast.error("Gửi OTP thất bại. Vui lòng kiểm tra lại email!");
    // }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Thông Tin Cá Nhân</h1>

      {status === "loading" ? (
        <p>Đang tải...</p>
      ) : status === "failed" ? (
        <p className="text-red-500">Lỗi khi lấy thông tin người dùng</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center">
            <Avatar
              src={newAvatar}
              alt="Avatar"
              sx={{ width: 128, height: 128, cursor: "pointer" }}
              onClick={openAvatarModal}
            />
          </div>

          <div className="flex-1">
            <p className="text-xl font-semibold mb-2">
              {displayValue(user.name)}
            </p>
            <p className="text-gray-700">
              🚻 Giới tính:
              {user.gender === "MALE" ? (
                <span className="bg-blue-200 text-blue-700 p-2 rounded-full">
                  <Male />
                </span>
              ) : user.gender === "FEMALE" ? (
                <span className="bg-pink-200 text-pink-700 p-2 rounded-full">
                  <Female />
                </span>
              ) : (
                <span className="bg-gray-200 text-gray-700 p-2 rounded-full">
                  <HelpOutline />
                </span>
              )}
            </p>
            <p className="text-gray-700">📧 {displayValue(user.email)}</p>
            <p className="text-gray-700">📞 {displayValue(user.phone)}</p>
            <p className="text-gray-700">📍 {displayValue(user.address)}</p>
            <Button
              variant="contained"
              color="success"
              onClick={openEditModal}
              sx={{ mt: 2 }}
            >
              Chỉnh sửa hồ sơ
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={openChangePasswordModal}
              sx={{ mt: 2, ml: 2 }}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      )}

      {/* Modal thay đổi ảnh đại diện */}
      <Dialog open={isAvatarModalOpen} onClose={closeAvatarModal}>
        <DialogTitle>Thay đổi ảnh đại diện</DialogTitle>
        <DialogContent>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {newAvatar && (
            <Avatar
              src={newAvatar}
              alt="New Avatar"
              sx={{ width: 128, height: 128, mt: 2, mx: "auto" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAvatarModal} color="secondary">
            Hủy
          </Button>
          <Button onClick={saveAvatar} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal chỉnh sửa hồ sơ */}
      <Dialog open={isEditModalOpen} onClose={closeEditModal}>
        <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Họ và tên"
            name="name"
            value={editedUser.name || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            name="email"
            value={editedUser.email || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Số điện thoại"
            name="phone"
            value={editedUser.phone || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Địa chỉ"
            name="address"
            value={editedUser.address || ""}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Giới tính"
            name="gender"
            value={editedUser.gender || ""}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal} color="secondary">
            Hủy
          </Button>
          <Button onClick={saveProfile} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal đổi mật khẩu */}
      <Dialog
        open={isChangePasswordModalOpen}
        onClose={closeChangePasswordModal}
      >
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          {/* Trường nhập Email và nút Gửi OTP */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleGetOTP} // Gán hàm handleGetOTP vào đây
              sx={{ mt: 1 }}
            >
              Get OTP
            </Button>
          </Box>

          {/* Các trường nhập khác */}
          <TextField
            fullWidth
            margin="dense"
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Mật khẩu cũ"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeChangePasswordModal} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Profile;
