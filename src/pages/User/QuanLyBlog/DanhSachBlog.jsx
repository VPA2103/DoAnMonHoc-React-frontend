import React, { useState, useEffect } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Badge from "react-bootstrap/Badge";

const DanhSachBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Chưa đăng nhập");
        return;
      }

      const res = await axios.get(
        "http://127.0.0.1:8000/api/user/blogs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs(res.data);
    } catch (error) {
      console.error("Lỗi tải blog:", error);
      alert("Không tải được danh sách blog");
    } finally {
      setLoading(false);
    }
  };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`http://127.0.0.1:8000/api/blogs/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert("Xóa thành công!");
                fetchBlogs();
            } catch (error) {
                alert('Lỗi xóa bài viết: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 1 ? 0 : 1;
        const token = localStorage.getItem('token');

        try {
            await axios.put(
                `http://127.0.0.1:8000/api/blogs/${id}/trang-thai`,
                { trang_thai: newStatus },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert("Đã đổi trạng thái!");
            fetchBlogs();
        } catch (error) {
            console.error(error);
            alert("Lỗi cập nhật trạng thái!");
        }
    };

    // Hàm render ảnh để code gọn hơn
    const renderImage = (img) => {
        if (!img) return <span>Không có ảnh</span>;
        return (
            <img 
                src={`http://127.0.0.1:8000/storage/${img}`} 
                alt="Thumb"
                style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
            />
        );
    };

  return (
    <Container className="mt-4 text-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Blog của tôi</h2>
        <Link to="/user/blog/them" className="btn btn-primary">
          + Thêm bài viết
        </Link>
      </div>

            <Table striped bordered hover variant="dark" responsive>
                <thead>
                    {/* QUAN TRỌNG: Không để khoảng trắng giữa các thẻ th */}
                    <tr>
                        <th style={{ width: '5%' }}>ID</th>
                        <th style={{ width: '15%' }}>Hình ảnh</th>
                        <th style={{ width: '35%' }}>Tiêu đề</th>
                        <th style={{ width: '10%' }}>Trạng thái</th>
                        <th style={{ width: '15%' }}>Ngày tạo</th>
                        <th style={{ width: '20%' }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <tr key={blog.id || blog.ma_blog}>
                                <td>{blog.id || blog.ma_blog}</td>
                                <td>{renderImage(blog.hinh_anh)}</td>
                                <td>{blog.tieu_de}</td>
                                <td className="text-center">
                                    <Badge bg={blog.trang_thai === 1 ? "success" : "secondary"}>
                                        {blog.trang_thai === 1 ? "Published" : "Draft"}
                                    </Badge>
                                    <div className="mt-2">
                                        <Button
                                            size="sm"
                                            variant={blog.trang_thai === 1 ? "outline-warning" : "outline-success"}
                                            onClick={() => handleToggleStatus(blog.id || blog.ma_blog, blog.trang_thai)}
                                        >
                                            {blog.trang_thai === 1 ? "Ẩn bài" : "Đăng bài"}
                                        </Button>
                                    </div>
                                </td>
                                <td>
                                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Link to={`/user/blog/xem/${blog.id || blog.ma_blog}`} className="btn btn-info btn-sm">
                                            <i className="bi bi-eye"></i>
                                        </Link>
                                        <Link to={`/user/blog/sua/${blog.id || blog.ma_blog}`} className="btn btn-warning btn-sm">
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(blog.id || blog.ma_blog)}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">Chưa có bài viết nào.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default DanhSachBlog;
