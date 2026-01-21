import axiosUser from "./axiosUser";

// 📌 ADMIN – CÔNG THỨC
export const getAllCongThuc = async () => {
  const res = await axiosUser.get("/user/cong-thuc");
  return res.data.data;
};

export const getCongThucById = async (id) => {
  const res = await axiosUser.get(`/user/cong-thuc/${id}`);
  return res.data.data;
};

export const createCongThuc = async (formData) => {
  const res = await axiosUser.post("/user/cong-thuc", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};


export const updateCongThuc = async (id, formData) => {
  const res = await axiosUser.post(
    `/user/cong-thuc/${id}?_method=PUT`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};



export const deleteCongThuc = async (id) => {
  const res = await axiosUser.delete(`/user/cong-thuc/${id}`);
  return res.data;
};

export const getDanhMucs = async () => {
  const res = await axiosUser.get("/user/danh-muc");
  return res.data.data; // ✅ chỉ trả mảng
};
// Hàm này để khớp tên với bên QuanLyBuocNau.jsx
// (Gán nó bằng hàm getAllCongThuc ở trên)
export const getMyCongThucs = getAllCongThuc; 

// Lấy danh sách bước nấu theo ID công thức
export const getBuocNauByCongThuc = async (id) => {
  const res = await axiosUser.get(`/user/buoc-nau/cong-thuc/${id}`);
  return res.data; // Trả về res.data để bên kia lấy .data hoặc .data.data tùy controller
};

// Thêm bước nấu mới
export const createBuocNau = async (formData) => {
  const res = await axiosUser.post("/user/buoc-nau", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Sửa bước nấu (Dùng ?_method=PUT giống cách bạn làm ở trên)
export const updateBuocNau = async (id, formData) => {
  const res = await axiosUser.post(`/user/buoc-nau/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Xóa bước nấu
export const deleteBuocNau = async (id) => {
  const res = await axiosUser.delete(`/user/buoc-nau/${id}`);
  return res.data;
};