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
        <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {role.charAt(0).toUpperCase() + role.slice(1)} Profile
            </h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-gray-600 font-semibold">Name:</p>
                    <p className="text-gray-900">{profileData.name || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600 font-semibold">Gender:</p>
                    <p className="text-gray-900">{profileData.gender || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600 font-semibold">Date of Birth:</p>
                    <p className="text-gray-900">{profileData.dob ? new Date(profileData.dob).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600 font-semibold">Phone:</p>
                    <p className="text-gray-900">{profileData.contactDetails?.phone || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600 font-semibold">Email:</p>
                    <p className="text-gray-900">{profileData.contactDetails?.email || 'N/A'}</p>
                </div>
                {role === 'teacher' && (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600 font-semibold">Salary:</p>
                            <p className="text-gray-900">${profileData.salary || 'N/A'}</p>
                        </div>
                    </>
                )}
                {role === 'student' && (
                    <>
                        <div className="flex items-center justify-between">
                            <p className="text-gray-600 font-semibold">Fees Paid:</p>
                            <p className={`text-gray-900 ${profileData.feesPaid ? 'text-green-500' : 'text-red-500'}`}>
                                {profileData.feesPaid ? 'Yes' : 'No'}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
