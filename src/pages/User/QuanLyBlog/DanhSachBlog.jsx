import React, { useState, useEffect } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DanhSachBlog = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/blogs');
            setBlogs(res.data);
        } catch (error) {
            console.error("Lỗi tải blog:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
            await axios.delete(`http://localhost:8000/api/blogs/${id}`);
            fetchBlogs(); // Load lại danh sách
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Quản lý Blog</h2>
                <Link to="/admin/blog/them" className="btn btn-primary">
                    + Thêm bài viết
                </Link>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tiêu đề</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog.id}>
                            <td>{blog.id}</td>
                            <td>
                                {blog.hinh_anh && (
                                    <img 
                                        src={`http://localhost:8000/${blog.hinh_anh}`} 
                                        alt="thumb" 
                                        style={{ width: '80px', height: '50px', objectFit: 'cover' }} 
                                    />
                                )}
                            </td>
                            <td>{blog.tieu_de}</td>
                            <td>{new Date(blog.created_at).toLocaleDateString('vi-VN')}</td>
                            <td>
                                <Link to={`/admin/blog/sua/${blog.id}`} className="btn btn-warning btn-sm me-2">
                                    Sửa
                                </Link>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(blog.id)}>
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default DanhSachBlog;