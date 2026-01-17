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
