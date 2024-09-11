import React from 'react';
import Table from '../components/TableComponent'; 

const ClassesTable = ({ classes ,role,setActiveComponent}) => {
  const columns = ['Class Name', 'Year', 'Teacher', 'Student Fees', 'Total Student'];
  const data = classes.map(cls => ({
    'id':cls._id,
    'Class Name': cls.name,
    'Year': cls.year,
    'Teacher': cls.teacher ? cls.teacher.contactDetails.email : 'Not assigned',  // Check if teacher is assigned
    'Student Fees': cls.fees,
    'Total Student': cls.students && cls.students.length > 0 ? cls.students.length : 'Not assigned' // Check if students are assigned
  }));  

  return <Table columns={columns} data={data} type='class' role={role} setActiveComponent={setActiveComponent}/>;
};

export default ClassesTable;