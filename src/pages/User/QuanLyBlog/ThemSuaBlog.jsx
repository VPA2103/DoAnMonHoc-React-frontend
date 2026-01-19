import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ThemSuaBlog = () => {
    const { id } = useParams(); // Lấy ID từ URL nếu là sửa
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        tieu_de: '',
        noi_dung: '',
        hinh_anh: null
    });
    const [previewImg, setPreviewImg] = useState('');

    useEffect(() => {
        if (isEditMode) {
            loadBlogData();
        }
    }, [id]);

    const loadBlogData = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/blogs/${id}`);
            const { tieu_de, noi_dung, hinh_anh } = res.data;
            setFormData({ tieu_de, noi_dung, hinh_anh: null }); // Ảnh giữ null để biết có upload mới hay không
            if (hinh_anh) setPreviewImg(`http://localhost:8000/${hinh_anh}`);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, hinh_anh: file });
        setPreviewImg(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('tieu_de', formData.tieu_de);
        data.append('noi_dung', formData.noi_dung);
        if (formData.hinh_anh) {
            data.append('hinh_anh', formData.hinh_anh);
        }
        
        // Laravel PUT method với FormData hơi đặc biệt, nên dùng POST kèm _method
        if (isEditMode) {
            data.append('_method', 'PUT'); 
            await axios.post(`http://localhost:8000/api/blogs/${id}`, data);
        } else {
            await axios.post('http://localhost:8000/api/blogs', data);
        }
        
        navigate('/admin/blog'); // Quay về danh sách
    };

    return (
        <Container className="mt-4">
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
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Ảnh đại diện</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                    {previewImg && (
                        <img src={previewImg} alt="Preview" className="mt-2" style={{height: '150px'}} />
                    )}
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
                    />
                    {/* Gợi ý: Sau này có thể thay textarea bằng React-Quill để soạn thảo đẹp hơn */}
                </Form.Group>

                <Button variant="primary" type="submit">
                    {isEditMode ? 'Lưu thay đổi' : 'Đăng bài'}
                </Button>
            </Form>
        </Container>
    );
};

export default ThemSuaBlog;