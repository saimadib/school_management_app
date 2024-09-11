import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { idState  } from '../atom/atom'; // Path to your atoms file

const Table = ({ columns, data, type, role, setActiveComponent }) => {
  const [id, setID] = useRecoilState(idState);

  const handleButtonClick = (id) => {
  
    setID(id);

    if (role === 'admin') {
      if (type === 'class') {
        setActiveComponent('ClassUpdatePage')
      }
      else if (type === 'student') {
        setActiveComponent('StudentUpdatePage')
      }
      else if (type === 'teacher') {
        setActiveComponent('TeacherUpdatePage')
      }
    }
    else if (role == 'teacher') {
      if (type === 'class') {
        setActiveComponent('ClassesViewPage')
      }
      else if (type === 'student') {
        setActiveComponent('StudentViewPage')
      }
    }
    else if (role == 'student') {
      if (type === 'class') {
        setActiveComponent('StudentClassViewPage')
      }
      else if (type === 'teacher') {
        setActiveComponent('StudentTeachersViewPage')
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              {/* Render the hidden field (unique id) */}
              <td style={{ display: 'none' }}>
                {row['id']}
              </td>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row[col]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {/* <button
                  className={`text-blue-600 hover:text-blue-900 ${role === 'admin' ? '' : 'hidden'}`}
                  onClick={() => handleButtonClick(row['id'])}
                >
                  Update
                </button> */}
                <button
                  className={`text-green-600 hover:text-green-900 `}
                  onClick={() => handleButtonClick(row['id'])}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
