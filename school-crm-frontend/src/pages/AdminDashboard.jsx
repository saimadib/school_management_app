import React from 'react';
import apiClient from '../api/apiClient';
import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { useRef } from 'react';

export const AdminDashboard = () => {

    const [data, setData] = useState({}); // For school details (students, teachers, classes)
    const [viewType, setViewType] = useState('monthly'); // Toggle between monthly/yearly
    const [month, setMonth] = useState('January'); 
    const [year, setYear] = useState(new Date().getFullYear()); 
    const [analyticsData, setAnalyticsData] = useState({}); // For expenses and income analytics

    // Fetch the school details (students, teachers, classes)
    useEffect(() => {
        apiClient.get(`/analytics/schoolDetails`)
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Fetch analytics data (dummy data in this case)
    useEffect(() => {
        // Here you can update the API endpoint or dummy data to fetch analytics based on view type
        const fetchAnalyticsData = () => {
            apiClient.post(`/analytics/expense`, {
                viewType,
                month,
                year
            })
                .then(response => setAnalyticsData(response.data))
                .catch(error => console.error('Error fetching data:', error));

        };

        fetchAnalyticsData();
    }, [viewType, month, year]);

    // Handle view type toggle (monthly/yearly)
    const handleToggleViewType = (event) => {
        setViewType(event.target.value);
    };

    const chartRef = useRef(null); // To store the chart instance

    useEffect(() => {
        const ctx = document.getElementById('barChart').getContext('2d');

        // Create a new chart instance and save it in the ref
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expense'], // x-axis labels
                datasets: [
                    {
                        label: 'Amount',
                        data: [analyticsData.income, analyticsData.expense],
                        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                        borderWidth: 0.5,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        // Cleanup function to destroy the chart instance on component unmount
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [analyticsData]);

    return (
        <div className="p-6 max-w-7xl mx-auto rounded-lg ">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Classes */}
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-md hover:bg-blue-100 transition-colors">
                    <svg className="w-7 h-7 text-blue-600 mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 5h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C8.4.842 6.949 0 5.5 0A3.5 3.5 0 0 0 2 3.5c.003.52.123 1.033.351 1.5H2a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2ZM8.058 5H5.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM11 13H9v7h2v-7Zm-4 0H2v5a2 2 0 0 0 2 2h3v-7Zm6 0v7h3a2 2 0 0 0 2-2v-5h-5Z" />
                    </svg>
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-blue-800">Total Classes</h5>
                    <p className="mb-3 font-normal text-blue-600 text-3xl">{data.totalClasses}</p>
                </div>

                {/* Total Students */}
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg shadow-md hover:bg-green-100 transition-colors">
                    <svg className="w-7 h-7 text-green-600 mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5Zm0 6a3 3 0 0 0 3-3V4a3 3 0 0 0-6 0v1a3 3 0 0 0 3 3Zm0 2a5 5 0 0 1 5 5v1a5 5 0 0 1-10 0v-1a5 5 0 0 1 5-5Zm0 6a3 3 0 0 0 3-3v-1a3 3 0 0 0-6 0v1a3 3 0 0 0 3 3Z" />
                    </svg>
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-green-800">Total Students</h5>
                    <p className="mb-3 font-normal text-green-600 text-3xl">{data.totalStudents}</p>
                </div>

                {/* Total Teachers */}
                <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md hover:bg-yellow-100 transition-colors">
                    <svg className="w-7 h-7 text-yellow-600 mb-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 6a6 6 0 0 0-6 6v1a6 6 0 0 0 12 0v-1a6 6 0 0 0-6-6Z" />
                    </svg>
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-yellow-800">Total Teachers</h5>
                    <p className="mb-3 font-normal text-yellow-600 text-3xl">{data.totalTeachers}</p>
                </div>
            </div>
            {/* Analytics Card */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Expense & Income Analytics</h3>
                    <div className="flex items-center">
                        <select
                            value={viewType}
                            onChange={handleToggleViewType}
                            className="border border-gray-300 p-2 rounded-md mr-4"
                        >
                            <option value="monthly">Monthly View</option>
                            <option value="yearly">Yearly View</option>
                        </select>

                        {/* Month and Year Selection for Monthly View */}
                        {viewType === 'monthly' && (
                            <div className="flex space-x-2">
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                >
                                    <option value="January">January</option>
                                    <option value="February">February</option>
                                    <option value="March">March</option>
                                    <option value="April">April</option>
                                    <option value="May">May</option>
                                    <option value="June">June</option>
                                    <option value="July">July</option>
                                    <option value="August">August</option>
                                    <option value="September">September</option>
                                    <option value="October">October</option>
                                    <option value="November">November</option>
                                    <option value="December">December</option>
                                </select>

                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="border border-gray-300 p-2 rounded-md"
                                >
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <option key={index} value={new Date().getFullYear() - index}>
                                            {new Date().getFullYear() - index}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Year Selection for Yearly View */}
                        {viewType === 'yearly' && (
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="border border-gray-300 p-2 rounded-md"
                            >
                                {Array.from({ length: 5 }, (_, index) => (
                                    <option key={index} value={new Date().getFullYear() - index}>
                                        {new Date().getFullYear() - index}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {/* Analytics Data */}
                <div className="max-w-xl w-full bg-white rounded-lg shadow dark:bg-gray-800 p-6">
                    {/* Income, Expense, and Profit Section */}
                    <div className="flex justify-between border-gray-200 border-b dark:border-gray-700 pb-3">
                        <dl>
                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Profit</dt>
                            <dd className="leading-none text-3xl font-bold text-gray-900 dark:text-white">₹{analyticsData.profit}</dd>
                        </dl>
                        <div>
                            <span className="bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md dark:bg-green-900 dark:text-green-300">
                                <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4" />
                                </svg>
                                Profit rate 23.5%
                            </span>
                        </div>
                    </div>

                    {/* Income and Expense Data */}
                    <div className="grid grid-cols-2 py-3">
                        <dl>
                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Income</dt>
                            <dd className="leading-none text-xl font-bold text-green-500 dark:text-green-400">₹{analyticsData.income}</dd>
                        </dl>
                        <dl>
                            <dt className="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Expense</dt>
                            <dd className="leading-none text-xl font-bold text-red-600 dark:text-red-500">-₹{analyticsData.expense}</dd>
                        </dl>
                    </div>

                    {/* Bar Chart */}
                    <div className="mt-4">
                        <canvas id="barChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};
