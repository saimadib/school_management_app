import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient'; // Adjust the path as needed

const StudentClassViewPage = () => {
  const { id } = useParams();  // Retrieve the ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    fees: '',
    students: [],
    year: '',
    teacher: ''
  });

  useEffect(() => {
    // Fetch the current details based on the ID using the API client
    apiClient.get(`/classes/${id}`)
      .then(response => {
        const data = response.data;
        setFormData({
          name: data.name,
          fees: data.fees,
          students: data.students.map(student => student.contactDetails.email), // Extract student emails
          year: data.year,
          teacher: data.teacher ? data.teacher.contactDetails.email : '' // Extract teacher email
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
    navigate('/dashboard/student');
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold"> Details</h2>
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
          <label className="block text-gray-700">Fees</label>
          <input
            type="text"
            name="fees"
            value={formData.fees || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Year</label>
          <input
            type="text"
            name="year"
            value={formData.year || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Teacher Email</label>
          <input
            type="text"
            name="teacher"
            value={formData.teacher || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Student Emails</label>
          <input
            type="text"
            name="students"
            value={formData.students.join(', ')} // Displaying student emails
            onChange={(e) => handleChange({ target: { name: 'students', value: e.target.value.split(', ').filter(email => email.trim()) } })}
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

export default StudentClassViewPage;
