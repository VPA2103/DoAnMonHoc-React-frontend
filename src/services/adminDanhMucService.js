import axiosAdmin from "./axiosAdmin";

export const getDanhMucs = async () => {
  const res = await axiosAdmin.get("/admin/danh-muc");
  return res.data.data; // ✅ chỉ trả mảng
};

export const addDanhMuc = async (data) => {
  const res = await axiosAdmin.post("/admin/danh-muc", data);
  return res.data;
};

export const updateDanhMuc = async (id, data) => {
  const res = await axiosAdmin.put(`/admin/danh-muc/${id}`, data);
  return res.data;
};

export const deleteDanhMuc = async (id) => {
  const res = await axiosAdmin.delete(`/admin/danh-muc/${id}`);
  return res.data;
};
