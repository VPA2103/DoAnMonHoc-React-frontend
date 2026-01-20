import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ThemSuaBlog = () => {
    const { id } = useParams(); // id này là ma_blog lấy từ URL
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        tieu_de: '',
        noi_dung: ''
    });

    useEffect(() => {
        if (isEditMode) {
            loadBlogData();
        }
    }, [id]);

    const loadBlogData = async () => {
        try {
            // GET chi tiết blog là public → không cần token
            const res = await axios.get(`http://localhost:8000/api/blogs/${id}`);
            const { tieu_de, noi_dung } = res.data;
            setFormData({ tieu_de, noi_dung });
        } catch (error) {
            console.error(error);
            alert('Không tải được dữ liệu bài viết');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            tieu_de: formData.tieu_de,
            noi_dung: formData.noi_dung
        };

        const token = localStorage.getItem('token'); 

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        try {
            if (isEditMode) {
                // THÊM config vào đây để gửi token
                await axios.put(`http://localhost:8000/api/blogs/${id}`, data, config);
            } else {
                // THÊM config vào đây để gửi token
                await axios.post('http://localhost:8000/api/blogs', data, config);
            }
            navigate('/user/blog'); 
        } catch (error) {
            alert("Lỗi lưu bài viết");
            console.error(error);
            
            // Log chi tiết hơn để debug
            if (error.response) {
                console.log('Status:', error.response.status);
                console.log('Message:', error.response.data.message || error.response.data);
            }
        }
    };

    return (
        <Container className="mt-4 text-white">
            <h2>{isEditMode ? 'Cập nhật bài viết' : 'Thêm bài viết mới'}</h2>
            <Form onSubmit={handleSubmit} className="mt-3">
                <Form.Group className="mb-3">
                    <Form.Label>Tiêu đề</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="tieu_de" 
                        value={formData.tieu_de} 
                        onChange={handleInputChange} 
                        required 
                        className="bg-dark text-white border-secondary"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Nội dung</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={6} 
                        name="noi_dung" 
                        value={formData.noi_dung} 
                        onChange={handleInputChange}
                        required
                        className="bg-dark text-white border-secondary"
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {isEditMode ? 'Lưu thay đổi' : 'Đăng bài'}
                </Button>
            </Form>
        </Container>
    );
};

export default ThemSuaBlog;