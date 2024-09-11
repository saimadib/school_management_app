import React from 'react';
import Table from '../components/TableComponent'; 

const StudentsTable = ({ students,role ,setActiveComponent}) => {
  const columns = ['Name', 'Gender', 'D.O.B.', 'Contact Details', 'Approved', 'Class'];
  const data = students.map(student => ({
    'id':student._id,
    'Name': student.name,
    'Gender': student.gender,
    'D.O.B.': new Date(student.dob).toLocaleDateString(),
    'Contact Details': student.user.email,
    'Approved': student.user.isApproved ? 'Yes' : 'No', 
    'Class': student.classes && student.classes.length > 0 ? student.classes.map(cls => cls.name).join(', ') : 'Not assigned'
  }));

  return <Table columns={columns} data={data} type='student' role={role} setActiveComponent={setActiveComponent}/>;
};

export default StudentsTable;
