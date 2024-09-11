import React from 'react';
import apiClient from '../api/apiClient';
import { useEffect, useState } from 'react';

export const TeacherDashboard = () => {

    const [data, setData] = useState({}); // For school details (students, teachers, classes)

    // Fetch the school details (students, teachers, classes)
    useEffect(() => {
        apiClient.get(`/analytics/teacherDetails`)
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);


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
            </div>
        </div>
    );
};
