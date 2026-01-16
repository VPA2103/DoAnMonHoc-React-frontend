import Dropdown from "react-bootstrap/Dropdown";

const AdminHeader = () => {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
      <span className="navbar-brand fw-bold">ADMIN PANEL</span>

      <div className="ms-auto">
        <Dropdown>
          <Dropdown.Toggle variant="dark">
            <i className="bi bi-person-circle me-1"></i> Admin
          </Dropdown.Toggle>

          <Dropdown.Menu align="end">
            <Dropdown.Item>Hồ sơ</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger">
              Đăng xuất
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </nav>
  );
};

export default AdminHeader;
