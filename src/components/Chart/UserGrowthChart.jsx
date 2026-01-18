import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import CustomTooltip from '../Tool/CustomTooltip';

const UserGrowthChart = ({ data }) => {

    if (!data || data.length === 0) {
        return (
            <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex align-items-center justify-content-center">
                    <p className="text-muted">Chưa có dữ liệu tăng trưởng.</p>
                </div>
            </div>
        );
    }


    return (
        <div className="card shadow-sm border-0 h-100">
            {/* Header của Card */}
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <div>
                    <h5 className="mb-0 fw-bold text-primary">
                        <i className="bi bi-graph-up-arrow me-2"></i>
                        Tăng trưởng người dùng
                    </h5>
                    <small className="text-muted">Số lượng đăng ký mới trong 7 ngày qua</small>
                </div>
                <div className="dropdown">
                    <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button">
                        7 Ngày
                    </button>
                </div>
            </div>

            <div className="card-body">
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6f42c1" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#6f42c1" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />

                            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />

                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#888' }} dx={-10} />

                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6f42c1', strokeWidth: 1, strokeDasharray: '3 3' }} />

                            <Area
                                type="monotone"
                                dataKey="newUsers"
                                stroke="#6f42c1" 
                                strokeWidth={3} 
                                fillOpacity={1}
                                fill="url(#colorNewUsers)"
                                name="Người dùng mới"
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="card-footer bg-white border-0 text-muted small text-center pb-3">
                <i className="bi bi-arrow-up-circle-fill text-success me-1"></i>
                Tăng trưởng <strong>12%</strong> so với tuần trước
            </div>
        </div>
    );
};

export default UserGrowthChart;