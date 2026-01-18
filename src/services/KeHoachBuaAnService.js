import axiosUser from "./axiosUser";

// ✅ LẤY TẤT CẢ
export const getAllKeHoach = async () => {
  const res = await axiosUser.get("/ke-hoach");
  return res.data.data;
};

export const getKeHoachById = async (id) => {
  const res = await axiosUser.get(`/ke-hoach/${id}`);
  return res.data.data;
};


// ✅ THÊM
export const createKeHoach = async (data) => {
  const res = await axiosUser.post("/user/ke-hoach", data);
  return res.data;
};

// ✅ SỬA
export const updateKeHoach = (id, data) => {
  return axiosUser.put(`/user/ke-hoach/${id}`, data);
};

// ✅ XÓA
export const deleteKeHoach = async (id) => {
  const res = await axiosUser.delete(`/user/ke-hoach/${id}`);
  return res.data;
};
