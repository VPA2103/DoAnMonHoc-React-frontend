import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ChiTietBlog = () => {
    // Lấy id từ URL. Lưu ý: nếu URL là /xem/:ma_blog thì đổi id thành ma_blog
    const { id } = useParams(); 
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        if (id) {
            loadBlog();
        }
    }, [id]);

    const loadBlog = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/blogs/${id}`);
            setBlog(res.data);
        } catch (error) {
            console.error("Lỗi tải chi tiết:", error);
        }
    };

    if (!blog) return (
        <Container className="mt-4 text-white">
            <h2 className="text-center">Đang tải dữ liệu...</h2>
        </Container>
    );

    // Xử lý đường dẫn ảnh (Quan trọng)
    const imageUrl = blog.hinh_anh 
        ? `http://localhost:8000/storage/${blog.hinh_anh}` 
        : null;

    return (
        <Container className="mt-4 text-white">
            <h2 className="mb-3">Chi tiết bài viết</h2>
            
            <Card className="bg-dark text-white mt-3 border-secondary shadow">
                
                {/* Hiển thị hình ảnh (Đã sửa link) */}
                {imageUrl && (
                    <div style={{ maxHeight: '400px', overflow: 'hidden', borderBottom: '1px solid #555' }}>
                        <Card.Img 
                            variant="top" 
                            src={imageUrl} 
                            alt={blog.tieu_de}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                    </div>
                )}

                <Card.Body className="p-4">
                    {/* Tiêu đề */}
                    <Card.Title className="fs-2 fw-bold text-warning mb-3">
                        {blog.tieu_de}
                    </Card.Title>

                    {/* Ngày giờ & Tác giả */}
                    <Card.Subtitle className="mb-4 text-muted border-bottom border-secondary pb-3">
                        <i className="bi bi-calendar3"></i> Ngày đăng: {
                            // Ưu tiên created_at (chuẩn Laravel), nếu không có thì tìm ngay_tao
                            new Date(blog.created_at || blog.ngay_tao).toLocaleDateString('vi-VN')
                        }
                        <span className="mx-2">|</span> 
                        <i className="bi bi-person"></i> Tác giả: {blog.tac_gia || "Admin"}
                    </Card.Subtitle>

                    {/* Nội dung chính */}
                    <Card.Text style={{ 
                        whiteSpace: 'pre-wrap', // Giữ định dạng xuống dòng
                        lineHeight: '1.8',      // Giãn dòng dễ đọc hơn
                        fontSize: '1.1rem',
                        textAlign: 'justify'    // Căn đều 2 bên
                    }}>
                        {blog.noi_dung}
                    </Card.Text>

                    {/* Nút quay lại */}
                    <div className="mt-5">
                        <Link to="/user/blog" className="btn btn-secondary">
                            <i className="bi bi-arrow-left"></i> Quay lại danh sách
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ChiTietBlog;