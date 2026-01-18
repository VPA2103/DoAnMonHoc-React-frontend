import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CustomTooltip from '../Tool/CustomTooltip';

const GenderRatioChart = ({ data }) => {
    const COLORS = ['#0d6efd', '#d63384', '#6c757d'];

    

    // Nếu không có data
    if (!data || data.length === 0) {
        return (
            <div className="card shadow-sm border-0 h-100">
                 <div className="card-body d-flex align-items-center justify-content-center text-muted">
                    Chưa có dữ liệu
                </div>
            </div>
        )
    }

    return (
        <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-dark">
                    <i className="bi bi-pie-chart-fill me-2 text-warning"></i>
                    Phân bố giới tính
                </h5>
            </div>
            
            <div className="card-body">
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5} 
                                dataKey="value"
                            >
                               
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default GenderRatioChart;