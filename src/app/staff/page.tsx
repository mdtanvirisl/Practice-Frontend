"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopBar from "../components/topbar/page";
import StaffCard from '../components/staffcard/page';

export default function Product() {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaffs = async () => {
            try {
                const token = localStorage.getItem('token'); // Fetch token from localStorage
                if (!token) {
                    throw new Error("No token found! Please login first.");
                }

                const response = await axios.get('http://localhost:3444/user/all_staffs', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setStaffs(response.data); // Update state with the fetched data
            } catch (err) {
                console.error("Error fetching staff data:", err);
            } finally {
                setLoading(false); // Set loading to false regardless of success or error
            }
        };

        fetchStaffs();
    }, []);

    if (loading) {
        return (
            <>
                <TopBar />
                <div className="flex justify-center items-center h-screen">
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <TopBar />
            <div className="grid grid-cols-2 gap-5 m-3">
                {staffs.map((staff: any, index: number) => (
                    <div key={index}>
                        <StaffCard data={staff} />
                    </div>
                ))}
            </div>
        </>
    );
}
