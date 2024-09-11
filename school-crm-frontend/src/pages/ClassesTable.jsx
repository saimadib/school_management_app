import React from 'react';
import Table from '../components/TableComponent'; 

const ClassesTable = ({ classes ,role}) => {
  const columns = ['Class Name', 'Year', 'Teacher', 'Student Fees', 'Student List'];
  const data = classes.map(cls => ({
    'id':cls._id,
    'Class Name': cls.name,
    'Year': cls.year,
    'Teacher': cls.teacher ? cls.teacher.contactDetails.email : 'Not assigned',  // Check if teacher is assigned
    'Student Fees': cls.fees,
    'Student List': cls.students && cls.students.length > 0 ? cls.students.map(student => student.contactDetails.email).join(' ') : 'Not assigned' // Check if students are assigned
  }));  

  return <Table columns={columns} data={data} type='class' role={role}/>;
};

export default ClassesTable;