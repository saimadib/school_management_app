import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import apiClient from '../api/apiClient';

const Add = ({ type }) => {
 
  const [formData, setFormData] = useState({});
  const navigate = useNavigate(); // Initialize the navigate hook

  // Handle input change for dynamic form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fields for Classes
const classFields = [
  { label: 'Name', name: 'name', type: 'text', placeholder: 'Enter class name', required: true },
  { label: 'Year', name: 'year', type: 'number', placeholder: 'Enter class year', required: true },
  { label: 'Teacher', name: 'teacher', type: 'text', placeholder: 'Enter teacher email', required: false },
  { label: 'Students', name: 'students', type: 'text', placeholder: 'Enter student email', required: false },
  { label: 'Fees', name: 'fees', type: 'number', placeholder: 'Enter class fees', required: true },
];

// Fields for Students
const studentFields = [
  { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter student email', required: true },
  { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter student password', required: true },
  { label: 'Name', name: 'name', type: 'text', placeholder: 'Enter student name', required: true },
  { label: 'Gender', name: 'gender', type: 'text', placeholder: 'Enter student gender', required: true },
  { label: 'Date of Birth', name: 'dob', type: 'date', placeholder: 'Enter student date of birth', required: true },
  { label: 'Phone', name: 'phone', type: 'text', placeholder: 'Enter phone number', required: true },
  { label: 'Fees Paid', name: 'feesPaid', type: 'checkbox', placeholder: 'Is fees paid?', required: false },
];

// Fields for Teachers
const teacherFields = [
  { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter teacher email', required: true },
  { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter teacher password', required: true },
  { label: 'Name', name: 'name', type: 'text', placeholder: 'Enter teacher name', required: true },
  { label: 'Gender', name: 'gender', type: 'text', placeholder: 'Enter teacher gender', required: true },
  { label: 'Date of Birth', name: 'dob', type: 'date', placeholder: 'Enter teacher date of birth', required: true },
  { label: 'Phone', name: 'phone', type: 'tel', placeholder: 'Enter teacher phone number', required: true },
  { label: 'Salary', name: 'salary', type: 'number', placeholder: 'Enter teacher salary', required: false },
];

  // Fields based on type
  const fields = type === 'classes' ? classFields : type === 'students' ? studentFields : teacherFields;

   // Handle form submit
   const handleSubmit = async (e) => {
    e.preventDefault();
      
    apiClient.post(`/${type}`, formData)
          .then(() => {
              // Redirect to the table page after successful update
              navigate('/dashboard/admin/#');
          })
          .catch(error => console.error('Error updating data:', error));

  };

  return (
    <div className="p-8 sm:ml-64">
      <div className="w-full max-w-2xl p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {`Add ${type}`}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <div key={index}>
                <label className="block text-gray-700 mb-2 font-medium">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none transition-all"
            >
              Add {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;