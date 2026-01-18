import { useState, useEffect } from "react";
import { Modal, Button, Form, Collapse } from "react-bootstrap"; // Import thêm Collapse cho mượt
import axios from "axios"; 

const SuaProfile = ({ show, handleClose, currentUser }) => {
  const SERVER_URL = "http://127.0.0.1:8000/storage/"; 

  const [formData, setFormData] = useState({
    ten_nguoi_dung: '',
    email: '',
    newAvatarFile: null,
    // Thêm các trường mật khẩu
    mat_khau_cu: '',
    mat_khau_moi: '',
    mat_khau_moi_confirmation: ''
  });

  const [previewAvatar, setPreviewAvatar] = useState('https://placehold.co/100');
  
  // State quản lý việc có muốn đổi pass hay không
  const [isChangePass, setIsChangePass] = useState(false);

  useEffect(() => {
    if (currentUser && show) {
      setFormData({
        ten_nguoi_dung: currentUser.ten_nguoi_dung || '',
        email: currentUser.email || '',
        newAvatarFile: null,
        mat_khau_cu: '',
        mat_khau_moi: '',
        mat_khau_moi_confirmation: ''
      });
      setIsChangePass(false); // Reset trạng thái đổi pass khi mở lại modal

      if (currentUser.anh_dai_dien) {
        const isFullUrl = currentUser.anh_dai_dien.startsWith('http');
        setPreviewAvatar(isFullUrl ? currentUser.anh_dai_dien : `${SERVER_URL}${currentUser.anh_dai_dien}`);
      } else {
        setPreviewAvatar('https://placehold.co/100');
      }
    }
  }, [currentUser, show]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, newAvatarFile: file });
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const dataToSend = new FormData();

      dataToSend.append("ten_nguoi_dung", formData.ten_nguoi_dung);
      
      if (formData.newAvatarFile) {
        dataToSend.append("anh_dai_dien", formData.newAvatarFile);
      }

      // --- LOGIC GỬI MẬT KHẨU ---
      if (isChangePass) {
        if (!formData.mat_khau_cu || !formData.mat_khau_moi) {
           alert("Vui lòng nhập đầy đủ thông tin mật khẩu");
           return;
        }
        if (formData.mat_khau_moi !== formData.mat_khau_moi_confirmation) {
            alert("Mật khẩu mới và xác nhận không khớp!");
            return;
        }

        dataToSend.append("mat_khau_cu", formData.mat_khau_cu);
        dataToSend.append("mat_khau_moi", formData.mat_khau_moi);
        dataToSend.append("mat_khau_moi_confirmation", formData.mat_khau_moi_confirmation);
      }
      // ---------------------------

      const response = await axios.post(
        "http://127.0.0.1:8000/api/profile/edit",
        dataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedInfo = response.data.data || response.data.user;
        const oldUser = JSON.parse(localStorage.getItem("user")) || {};

        if (updatedInfo) {
            const mergedUser = { ...oldUser, ...updatedInfo };
            localStorage.setItem("user", JSON.stringify(mergedUser));
        }

        alert(response.data.message || "Cập nhật thành công!"); // Hiện thông báo từ server
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg"> {/* Tăng size modal */}
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Chỉnh sửa hồ sơ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
            {/* Cột trái: Avatar */}
            <div className="col-md-4 text-center border-end">
                <div
                className="rounded-circle overflow-hidden d-inline-block border mb-3"
                style={{ width: "150px", height: "150px" }}
                >
                <img
                    src={previewAvatar}
                    alt="Avatar"
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/100'; }}
                />
                </div>
                <div>
                <Form.Label
                    htmlFor="avatar-upload"
                    className="btn btn-outline-danger w-100 fw-semibold"
                    style={{ cursor: "pointer" }}
                >
                    Đổi ảnh đại diện
                </Form.Label>
                <Form.Control
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="d-none"
                />
                </div>
            </div>

            {/* Cột phải: Form thông tin */}
            <div className="col-md-8 ps-md-4">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Tên hiển thị</Form.Label>
                        <Form.Control
                        type="text"
                        name="ten_nguoi_dung"
                        value={formData.ten_nguoi_dung}
                        onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Email</Form.Label>
                        <Form.Control
                        type="email"
                        value={formData.email}
                        disabled
                        className="bg-light text-muted"
                        />
                    </Form.Group>

                    <hr className="my-4"/>

                    {/* --- KHU VỰC ĐỔI MẬT KHẨU --- */}
                    <div className="mb-3">
                        <Form.Check 
                            type="switch"
                            id="change-pass-switch"
                            label="Đổi mật khẩu"
                            checked={isChangePass}
                            onChange={(e) => setIsChangePass(e.target.checked)}
                            className="fw-bold text-primary"
                        />
                    </div>

                    <Collapse in={isChangePass}>
                        <div>
                            <div className="p-3 bg-light rounded border mb-3">
                                <Form.Group className="mb-2">
                                    <Form.Label>Mật khẩu hiện tại</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="mat_khau_cu"
                                        value={formData.mat_khau_cu}
                                        onChange={handleInputChange}
                                        placeholder="Nhập mật khẩu cũ..."
                                    />
                                </Form.Group>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="mb-2">
                                            <Form.Label>Mật khẩu mới</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="mat_khau_moi"
                                                value={formData.mat_khau_moi}
                                                onChange={handleInputChange}
                                                placeholder="Tối thiểu 6 ký tự"
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-2">
                                            <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="mat_khau_moi_confirmation"
                                                value={formData.mat_khau_moi_confirmation}
                                                onChange={handleInputChange}
                                                placeholder="Xác nhận lại"
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Collapse>
                    {/* ----------------------------- */}

                </Form>
            </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          style={{ backgroundColor: "#FE2C55", border: "none" }}
          className="px-4 fw-bold"
        >
          Lưu thay đổi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuaProfile;