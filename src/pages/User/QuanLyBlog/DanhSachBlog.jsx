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
            // GET danh sách là public → không cần token
            const res = await axios.get('http://localhost:8000/api/blogs');
            setBlogs(res.data);
        } catch (error) {
            console.error("Lỗi tải blog:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa?')) {
            const token = localStorage.getItem('token');

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            try {
                await axios.delete(`http://localhost:8000/api/blogs/${id}`, config);
                fetchBlogs(); // Reload danh sách
            } catch (error) {
                console.error(error);
                alert('Lỗi xóa bài viết');
                if (error.response) {
                    console.log('Status:', error.response.status);
                    console.log('Message:', error.response.data.message || error.response.data);
                }
            }
        }
    };

    return (
        <Container className="mt-4 text-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Quản lý Blog</h2>
                <Link to="/user/blog/them" className="btn btn-primary">
                    + Thêm bài viết
                </Link>
            </div>

            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tiêu đề</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog.ma_blog}>
                            <td>{blog.ma_blog}</td>
                            <td>{blog.tieu_de}</td>
                            <td>{new Date(blog.created_at).toLocaleDateString('vi-VN')}</td>
                            <td>
                                <Link to={`/user/blog/xem/${blog.ma_blog}`} className="btn btn-info btn-sm me-2">
                                    Xem
                                </Link>
                                <Link to={`/user/blog/sua/${blog.ma_blog}`} className="btn btn-warning btn-sm me-2">
                                    Sửa
                                </Link>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(blog.ma_blog)}>
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