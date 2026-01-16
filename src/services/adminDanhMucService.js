import axiosAdmin from "./axiosAdmin";

export const getDanhMucs = () =>
  axiosAdmin.get("/admin/danh-muc");

export const addDanhMuc = (data) =>
  axiosAdmin.post("/admin/danh-muc", data);

export const updateDanhMuc = (id, data) =>
  axiosAdmin.put(`/admin/danh-muc/${id}`, data);

export const deleteDanhMuc = (id) =>
  axiosAdmin.delete(`/admin/danh-muc/${id}`);
