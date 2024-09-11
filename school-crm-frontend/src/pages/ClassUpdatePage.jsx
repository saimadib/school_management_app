import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient'; // Adjust the path as needed
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const ClassUpdatePage = ({ id }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    fees: '',
    students: [],
    year: '',
    teacher: ''
  });
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/classes/${id}`);
        const data = response.data;
        setFormData({
          name: data.name,
          fees: data.fees,
          students: data.students.map(student => student.contactDetails.email),
          year: data.year,
          teacher: data.teacher ? data.teacher.contactDetails.email : ''
        });
        setStudentsData(data.students);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      students: formData.students
    };

    apiClient.put(`/classes/${id}`, {
      name: updatedData.name,
      fees: updatedData.fees,
      year: updatedData.year,
      teacher: updatedData.teacher,
      students: updatedData.students
    })
    .then(() => navigate('/dashboard/admin'))
    .catch(error => console.error('Error updating data:', error));
  };

  const handleDelete = (e) => {
    e.preventDefault();
    apiClient.delete(`/classes/${id}`)
      .then(() => navigate('/dashboard/admin'))
      .catch(error => console.error('Error deleting data:', error));
  };

  const handleCancel = () => {
    navigate('/dashboard/admin');
  };

  const getGenderDistribution = () => {
    const genderCounts = { male: 0, female: 0 };
    studentsData.forEach(student => {
      genderCounts[student.gender.toLowerCase()]++;
    });
    return [
      { name: 'Male', value: genderCounts.male },
      { name: 'Female', value: genderCounts.female }
    ];
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Class Details & Analytics</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Students</h3>
        <PieChart width={500} height={300}>
          <Pie
            data={getGenderDistribution()}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            <Cell name="Male" fill="#157ee6" />
            <Cell name="Female" fill="#e6b215" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-gray-700 text-sm font-medium">Class Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter class name"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-gray-700 text-sm font-medium">Fees</label>
          <input
            type="text"
            name="fees"
            value={formData.fees || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter fees"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-gray-700 text-sm font-medium">Year</label>
          <input
            type="text"
            name="year"
            value={formData.year || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter academic year"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-gray-700 text-sm font-medium">Teacher Email</label>
          <input
            type="text"
            name="teacher"
            value={formData.teacher || ''}
            onChange={handleChange}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter teacher email"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block text-gray-700 text-sm font-medium">Student Emails</label>
          <input
            type="text"
            name="students"
            value={formData.students.join(', ')}
            onChange={(e) => handleChange({ target: { name: 'students', value: e.target.value.split(', ').filter(email => email.trim()) } })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter student emails separated by commas"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassUpdatePage;
