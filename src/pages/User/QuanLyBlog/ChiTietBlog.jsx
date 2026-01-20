import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ChiTietBlog = () => {
    const { id } = useParams(); // ma_blog từ URL
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        loadBlog();
    }, [id]);

    const loadBlog = async () => {
        try {
            // GET public → không cần token
            const res = await axios.get(`http://localhost:8000/api/blogs/${id}`);
            setBlog(res.data);
        } catch (error) {
            console.error(error);
            alert('Không tải được bài viết');
        }
    };

    if (!blog) return <Container className="mt-4 text-white"><h2>Đang tải...</h2></Container>;

    return (
        <Container className="mt-4 text-white">
            <h2>Chi tiết bài viết</h2>
            <Card className="bg-dark text-white mt-3">
                <Card.Body>
                    <Card.Title className="fs-3">{blog.tieu_de}</Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">
                        Ngày tạo: {new Date(blog.created_at).toLocaleDateString('vi-VN')}
                    </Card.Subtitle>
                    <Card.Text style={{ whiteSpace: 'pre-wrap' }}>
                        {blog.noi_dung}
                    </Card.Text>
                    <Link to="/user/blog" className="btn btn-secondary">
                        Quay lại danh sách
                    </Link>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ChiTietBlog;