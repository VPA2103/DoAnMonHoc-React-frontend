// src/pages/User/CongThuc/StepsSection.jsx
// ⇨ File mới: Component riêng xử lý phần "Các bước nấu" (dynamic)

import React from "react";

const StepsSection = ({ steps, setSteps }) => {
  const addStep = () => {
    setSteps([...steps, { noi_dung: "", hinh_anh: null, preview: "" }]);
  };

  const removeStep = (index) => {
    if (steps.length === 1) {
      alert("Phải có ít nhất 1 bước nấu!");
      return;
    }
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    if (field === "hinh_anh") {
      newSteps[index].hinh_anh = value;
      newSteps[index].preview = value ? URL.createObjectURL(value) : "";
    } else {
      newSteps[index][field] = value;
    }
    setSteps(newSteps);
  };

  return (
    <>
      <hr className="my-5" />
      <h5 className="fw-bold text-primary mb-4">Các bước nấu</h5>

      {steps.map((step, index) => (
        <div key={index} className="border rounded p-4 mb-4 position-relative shadow-sm">
          <h6 className="fw-bold">Bước {index + 1}</h6>

          <button
            type="button"
            className="btn btn-danger btn-sm position-absolute top-0 end-0 mt-2 me-2"
            onClick={() => removeStep(index)}
          >
            Xóa bước
          </button>

          <div className="mb-3">
            <label className="form-label fw-semibold">Mô tả bước <span className="text-danger">*</span></label>
            <textarea
              className="form-control"
              rows="4"
              value={step.noi_dung}
              onChange={(e) => updateStep(index, "noi_dung", e.target.value)}
              placeholder="Mô tả chi tiết bước thực hiện..."
              required={index === 0} // Bắt buộc ít nhất bước đầu
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Ảnh minh họa bước (tùy chọn)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => updateStep(index, "hinh_anh", e.target.files[0])}
            />
            {step.preview && (
              <div className="mt-3 text-center">
                <img
                  src={step.preview}
                  alt={`Preview bước ${index + 1}`}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="mb-4 text-center">
        <button type="button" className="btn btn-outline-primary btn-lg" onClick={addStep}>
          + Thêm bước nấu
        </button>
      </div>
    </>
  );
};

export default StepsSection;