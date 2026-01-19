import React, { useState, useEffect } from 'react';

const FeedBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://127.0.0.1:8000';

    const fetchBlogs = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Vui lòng đăng nhập để xem bảng tin.");
            }

            const response = await fetch(`${API_BASE_URL}/api/feed/blogs?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Lỗi tải dữ liệu.');

            const result = await response.json();

            if (result.status) {
                setBlogs(result.data.data);
                setPagination({
                    current_page: result.data.current_page,
                    last_page: result.data.last_page,
                    total: result.data.total
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(pagination.current_page);
    }, [pagination.current_page]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setPagination(prev => ({ ...prev, current_page: newPage }));
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2 className="mb-4 text-center fw-bold text-primary">Bảng Tin Theo Dõi</h2>

                    {loading && (
                        <div className="text-center my-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {!loading && !error && blogs.length === 0 && (
                        <div className="alert alert-info text-center">Chưa có bài viết nào.</div>
                    )}

                    {!loading && !error && (
                        <div className="d-flex flex-column gap-4">
                            {blogs.map((blog) => (
                                <div key={blog.ma_blog} className="card shadow-sm border-0">
                                    <div className="card-body">
                                        {/* Header: Avatar + Tên */}
                                        <div className="d-flex align-items-center mb-3">
                                            <img 
                                                src={blog.anh_dai_dien ? `${API_BASE_URL}/${blog.anh_dai_dien}` : 'https://via.placeholder.com/50'} 
                                                alt={blog.ten_nguoi_dung}
                                                className="rounded-circle me-3 border"
                                                width="50"
                                                height="50"
                                                style={{ objectFit: 'cover' }}
                                                onError={(e) => {e.target.src = 'https://via.placeholder.com/50'}}
                                            />
                                            <div>
                                                <h6 className="card-title mb-0 fw-bold">{blog.ten_nguoi_dung}</h6>
                                                <small className="text-muted">{formatDate(blog.created_at)}</small>
                                            </div>
                                        </div>

                                        {/* Nội dung */}
                                        <h4 className="card-title text-dark">{blog.tieu_de}</h4>
                                        <p className="card-text text-secondary">{blog.noi_dung}</p>

                                        <hr />
                                        
                                        {/* Footer Actions */}
                                        <div className="d-flex gap-3">
                                            <button className="btn btn-outline-danger btn-sm">
                                                <i className="bi bi-heart"></i> Yêu thích
                                            </button>
                                            <button className="btn btn-outline-primary btn-sm">
                                                <i className="bi bi-chat"></i> Bình luận
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && pagination.last_page > 1 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                    >
                                        Trước
                                    </button>
                                </li>
                                <li className="page-item active">
                                    <span className="page-link">
                                        {pagination.current_page} / {pagination.last_page}
                                    </span>
                                </li>
                                <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                    >
                                        Sau
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedBlogs;