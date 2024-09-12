import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient'; // Adjust the path as needed

const dummyAdminData = {
    name: 'Admin User',
    gender: 'Male',
    dob: '14/05/2001',
    contactDetails: {
        phone: '12345678',
        email: 'admin@example.com',
    },
    salary: 'N/A',
    assignedClass: [],
};

const Profile = ({ role }) => {
    const { id } = useParams(); // Get the ID from URL params if needed for profile fetching
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                let response;

                switch (role) {
                    case 'student':
                        response = await apiClient.get(`/students/detail/me`);
                        setProfileData(response.data);
                        break;
                    case 'teacher':
                        response = await apiClient.get(`/teachers/detail/me`);
                        setProfileData(response.data);
                        break;
                    case 'admin':
                        // Use dummy data for admin
                        setProfileData(dummyAdminData);
                        break;
                    default:
                        throw new Error('Invalid role');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [role, id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    if (!profileData) return <p>No data available</p>;

    return (
        <div className="p-8 bg-white shadow-lg rounded-lg max-w-lg mx-auto mt-12 border border-gray-200">
            <div className="text-center mb-6">
                <img
                    src='../assets/user-profile-circle-solid.svg'
                    className="w-24 h-24 rounded-full mx-auto border-2 border-gray-300 shadow-md"
                />
                <h2 className="text-3xl font-semibold text-gray-900 mt-4">
                    {role.charAt(0).toUpperCase() + role.slice(1)} Profile
                </h2>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 4v1m0 4v1m0 4v1m-8-8h1m4 0h1m4 0h1m4 0h1m-8-4v1m0 4v1m0 4v1" />
                        </svg>
                        <p className="text-gray-600 font-medium">Name:</p>
                    </div>
                    <p className="text-gray-800">{profileData.name || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16m-7 5h7" />
                        </svg>
                        <p className="text-gray-600 font-medium">Gender:</p>
                    </div>
                    <p className="text-gray-800">{profileData.gender || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 4v1m0 4v1m0 4v1m-8-8h1m4 0h1m4 0h1m4 0h1m-8-4v1m0 4v1m0 4v1" />
                        </svg>
                        <p className="text-gray-600 font-medium">Date of Birth:</p>
                    </div>
                    <p className="text-gray-800">{profileData.dob ? new Date(profileData.dob).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16m-7 5h7" />
                        </svg>
                        <p className="text-gray-600 font-medium">Phone:</p>
                    </div>
                    <p className="text-gray-800">{profileData.contactDetails?.phone || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v6h6V3H5zm8 0v6h6V3h-6zM5 15v6h6v-6H5zm8 0v6h6v-6h-6z" />
                        </svg>
                        <p className="text-gray-600 font-medium">Email:</p>
                    </div>
                    <p className="text-gray-800">{profileData.contactDetails?.email || 'N/A'}</p>
                </div>
                {role === 'teacher' && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v6h6V3H5zm8 0v6h6V3h-6zM5 15v6h6v-6H5zm8 0v6h6v-6h-6z" />
                            </svg>
                            <p className="text-gray-600 font-medium">Salary:</p>
                        </div>
                        <p className="text-gray-800">${profileData.salary || 'N/A'}</p>
                    </div>
                )}
                {role === 'student' && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v6h6V3H5zm8 0v6h6V3h-6zM5 15v6h6v-6H5zm8 0v6h6v-6h-6z" />
                            </svg>
                            <p className="text-gray-600 font-medium">Fees Paid:</p>
                        </div>
                        <p className={`text-gray-800 ${profileData.feesPaid ? 'text-green-600' : 'text-red-600'}`}>
                            {profileData.feesPaid ? 'Yes' : 'No'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

};

export default Profile;
