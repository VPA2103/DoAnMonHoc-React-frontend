import axiosAdmin from "./axiosAdmin";

export const createKeHoachBuaAn = (data)=>{
    axiosAdmin.post("/admin/ke-hoach-bua-an",data);
}