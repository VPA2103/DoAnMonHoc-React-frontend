import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import UserGrowthChart from '../../../components/Chart/UserGrowthChart';
import GenderRatioChart from '../../../components/Chart/GenderRatioChart';
import UserList from './UserList';

export default function AdminDashboard() {

    const genderData = [
    { name: 'Nam', value: 540 },
    { name: 'Nữ', value: 420 },
    { name: 'Khác', value: 50 }, // Tùy chọn
];

    const userGrowthData = [
        { date: 'Thứ 2', newUsers: 150 },
        { date: 'Thứ 3', newUsers: 230 },
        { date: 'Thứ 4', newUsers: 180 },
        { date: 'Thứ 5', newUsers: 290 },
        { date: 'Thứ 6', newUsers: 350 },
        { date: 'Thứ 7', newUsers: 420 },
        { date: 'Chủ Nhật', newUsers: 380 },
    ];

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                

                <div className="col py-3">
                    <div className="container-fluid">
                        <h2 className="mb-4 text-primary fw-bold">Tổng quan Mạng Xã Hội</h2>
                        <div className="row mb-4">
                            <div className="col-12 col-lg-8 mb-4 mb-lg-0">
                                <UserGrowthChart data={userGrowthData} />
                            </div>

                            <div className="col-12 col-lg-4">
                                <GenderRatioChart data={genderData} />
                            </div>
                        </div>

                        <div className="card shadow-sm border-0">
                            <UserList/>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}