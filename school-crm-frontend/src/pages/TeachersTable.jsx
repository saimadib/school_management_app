import React from 'react';
import Table from '../components/TableComponent';

const TeachersTable = ({ teachers,role ,setActiveComponent}) => {
  const columns = ['Name', 'Gender', 'D.O.B.', 'Contact Details','Approved', 'Salary', 'Assigned Class'];
  const data = teachers.map(teacher => ({
    'id':teacher._id,
    'Name': teacher.name,
    'Gender': teacher.gender,
    'D.O.B.': new Date(teacher.dob).toLocaleDateString(),
    'Contact Details': teacher.user.email,
    'Approved': teacher.user.isApproved ? 'Yes' : 'No', 
    'Salary': teacher.salary ? teacher.salary:'Not Assigned',
    'Assigned Class': teacher.assignedClass && teacher.assignedClass.length > 0 ? teacher.assignedClass.map(cls => cls.name).join(', ') : 'Not assigned'
  }));

  return <Table columns={columns} data={data} role={role} type='teacher' setActiveComponent={setActiveComponent} />;
};

export default TeachersTable;
