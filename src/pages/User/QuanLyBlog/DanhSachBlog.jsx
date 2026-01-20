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
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            try {
                await axios.delete(`http://localhost:8000/api/blogs/${id}`, config);
                alert("Xóa thành công!");
                fetchBlogs(); 
            } catch (error) {
                console.error(error);
                alert('Lỗi xóa bài viết: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    return (
        <Container className="mt-4 text-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Quản lý Blog</h2>
                <Link to="/user/blog/them" className="btn btn-primary">
                    + Thêm bài viết
                </Link>
            </div>

            <Table striped bordered hover variant="dark" responsive>
                <thead>
                    <tr>
                        <th style={{width: '5%'}}>ID</th>
                        <th style={{width: '15%'}}>Hình ảnh</th>
                        <th style={{width: '40%'}}>Tiêu đề</th>
                        <th style={{width: '15%'}}>Ngày tạo</th>
                        <th style={{width: '25%'}}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <tr key={blog.id || blog.ma_blog}> 
                                <td>{blog.id || blog.ma_blog}</td>
                                
                                {/* --- PHẦN XỬ LÝ ẢNH --- */}
                                <td>
                                    {blog.hinh_anh ? (
                                        <img 
                                            src={`http://localhost:8000/storage/${blog.hinh_anh}`} 
                                            alt="Thumbnail"
                                            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                            
                                            // LOGIC QUAN TRỌNG: Nếu ảnh lỗi -> Ẩn luôn (display: none)
                                            onError={(e) => { 
                                                e.target.style.display = 'none'; 
                                            }}
                                        />
                                    ) : (
                                        <span>Không có ảnh</span>
                                    )}
                                </td>
                                {/* ----------------------- */}

                                <td>{blog.tieu_de}</td>
                                
                                <td>
                                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                                </td>
                                
                                <td>
                                    <Link to={`/user/blog/xem/${blog.id || blog.ma_blog}`} className="btn btn-info btn-sm me-2">
                                        <i className="bi bi-eye"></i> Xem
                                    </Link>
                                    
                                    <Link to={`/user/blog/sua/${blog.id || blog.ma_blog}`} className="btn btn-warning btn-sm me-2">
                                        <i className="bi bi-pencil"></i> Sửa
                                    </Link>
                                    
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(blog.id || blog.ma_blog)}>
                                        <i className="bi bi-trash"></i> Xóa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Chưa có bài viết nào.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default DanhSachBlog;