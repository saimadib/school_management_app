import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient'; // Adjust the path as needed

const StudentViewPage = () => {
    const { id } = useParams();  // Retrieve the ID from the URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        classes: [],
        dob: '',
        email: '',
        isApproved: ''
    });

    useEffect(() => {
        // Fetch the current details based on the ID using the API client
        apiClient.get(`/students/det/${id}`)

            .then(response => {
                // Map the response data to the formData state
                const data = response.data;
                setFormData({
                    name: data.name || '',
                    gender: data.gender || '',
                    classes: data.classes || [],
                    dob: data.dob ? new Date(data.dob).toISOString().slice(0, 10) : '',
                    email: data.user?.email || '',
                    isApproved: data.user.isApproved ? 'Yes' : 'No'
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

   
    const handleCancel = () => {
        // Redirect to the table page without updating
        navigate('/dashboard/teacher');
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold">Update Details</h2>
            <form >
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Approved</label>
                    <select
                        name="isApproved"
                        value={formData.isApproved || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">DOB</label>
                    <input
                        type="text"
                        name="dob"
                        value={formData.dob || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Classes</label>
                    {/* Handle students field here if needed */}
                    <input
                        type="text"
                        name="Classes"
                        value={formData.classes.join(', ')} // Displaying student IDs or names
                        onChange={(e) => handleChange({ target: { name: 'classes', value: e.target.value.split(', ') } })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    />
                </div>            
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                >
                    Close
                </button>
            </form>
        </div>
    );
};

export default StudentViewPage;
