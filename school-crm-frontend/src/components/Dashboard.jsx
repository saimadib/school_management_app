import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeachersTable from '../pages/TeachersTable';
import StudentsTable from '../pages/StudentsTable';
import ClassesTable from '../pages/ClassesTable';
import Add from './Add';
import Profile from './Profile';
import {
    getStudentTeachers,
    getStudentClasses,
    getTeacherStudents,
    getAllStudents,
    getAllTeachers,
    getAllClasses,
    getTeachersClasses
} from '../api/apiClient';

import ClassUpdatePage from '../pages/ClassUpdatePage';
import ClassViewPage from '../pages/ClassesViewPage';
import StudentClassViewPage from '../pages/StudentClassViewPage'
import StudentTeacherViewPage from '../pages/StudentTeachersViewPage';
import StudentUpdatePage from '../pages/StudentUpdatePage';
import StudentViewPage from '../pages/StudentViewPage';
import TeacherUpdatePage from '../pages/TeacherUpdatePage';

import { AdminDashboard } from '../pages/AdminDashboard';
import { TeacherDashboard } from '../pages/TeacherDashboard';
import { StudentDashboard } from '../pages/StudentDashboard';

import { useRecoilValue } from 'recoil';
import { idState } from '../atom/atom';

function Dashboard() {

    const id = useRecoilValue(idState);

    const { role } = useParams(); // Extract role from URL parameters

    const navigate = useNavigate();

    const [activeComponent, setActiveComponent] = React.useState('Dashboard'); // Initialize with 'dashboard'
    // States for holding fetched data
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleListItemClick = (componentName) => {
        setActiveComponent(componentName);
    };

    const handleAddClick = (componentName) => {
        if (componentName === 'My Classes') {
            setActiveComponent('Add Classes')
        } else if (componentName === 'My Teachers') {
            setActiveComponent('Add Teachers')
        } else if (componentName === 'My Students') {
            setActiveComponent('Add Students')
        }
    };

    // Fetch data based on the activeComponent and user role
    useEffect(() => {

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                let studentsData = [];
                let teachersData = [];
                let classesData = [];

                // Role-based API calls
                if (role === 'student') {
                    if (activeComponent === 'My Teachers') {
                        const response = await getStudentTeachers();
                        teachersData = response.data;
                        setTeachers(teachersData);
                    } else if (activeComponent === 'My Classes') {
                        const response = await getStudentClasses();
                        classesData = response.data;
                        setClasses(classesData);
                    }
                } else if (role === 'teacher') {
                    if (activeComponent === 'My Students') {
                        const response = await getTeacherStudents();
                        studentsData = response.data;
                        setStudents(studentsData);
                    } else if (activeComponent === 'My Classes') {
                        const response = await getTeachersClasses();
                        classesData = response.data;
                        setClasses(classesData);
                    }
                } else if (role === 'admin') {
                    if (activeComponent === 'My Students') {
                        const response = await getAllStudents();
                        studentsData = response.data;
                        setStudents(studentsData);
                    } else if (activeComponent === 'My Teachers') {
                        const response = await getAllTeachers();
                        teachersData = response.data;
                        setTeachers(teachersData);
                    } else if (activeComponent === 'My Classes') {
                        const response = await getAllClasses();
                        classesData = response.data;
                        setClasses(classesData);
                    }
                }

                setLoading(false);
            } catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };

        if (activeComponent !== 'Dashboard' && role) {
            fetchData();
        }
    }, [activeComponent, role]);

    const handleLogout = () => {
        // Remove the token from local storage
        localStorage.removeItem('token');
        // Redirect to the home page
        navigate('/');
    };

    const renderActiveComponent = () => {

        if (error) {
            return <div>{error}</div>; // Handle errors gracefully
        }

        switch (activeComponent) {
            case 'Dashboard':
                if (role === 'admin') {
                    return <AdminDashboard />;
                }
                else if (role === 'student') {
                    return <StudentDashboard/>
                } else if (role === 'teacher') {
                    return <TeacherDashboard/>
                }
            case 'My Teachers':
                return <TeachersTable teachers={teachers} role={role} setActiveComponent={setActiveComponent} />;
            case 'My Students':
                return <StudentsTable students={students} role={role} setActiveComponent={setActiveComponent} />;
            case 'My Classes':
                return <ClassesTable classes={classes} role={role} setActiveComponent={setActiveComponent} />;
            case 'Add Classes':
                return <Add type="classes" />;
            case 'Add Teachers':
                return <Add type="teachers" />;
            case 'Add Students':
                return <Add type="students" />;
            case 'Profile':
                return <Profile role={role} />;
            case 'Logout':
                handleLogout();
                return null;
            case 'ClassUpdatePage':
                return <ClassUpdatePage id={id} />;
            case 'StudentUpdatePage':
                return <StudentUpdatePage id={id} />;
            case 'TeacherUpdatePage':
                return <TeacherUpdatePage id={id} />;
            case 'ClassesViewPage':
                return <ClassViewPage id={id} />;
            case 'StudentViewPage':
                return <StudentViewPage id={id} />;
            case 'StudentClassViewPage':
                return <StudentClassViewPage id={id} />;
            case 'StudentTeachersViewPage':
                return <StudentTeacherViewPage id={id} />;
            default:
                return null;
        }
    };

    const sidebarItems = {
        teacher: [
            { name: 'Dashboard' },
            { name: 'My Classes' },
            { name: 'My Students' },
            { name: 'Profile' },
            { name: 'Logout' },
        ],
        student: [
            { name: 'Dashboard' },
            { name: 'My Classes' },
            { name: 'My Teachers' },
            { name: 'Profile' },
            { name: 'Logout' },
        ],
        admin: [
            { name: 'Dashboard' },
            { name: 'My Classes' },
            { name: 'My Teachers' },
            { name: 'My Students' },
            { name: 'Profile' },
            { name: 'Logout' },
        ],
    };

    // Get the items for the current role
    const items = sidebarItems[role] || [];

    return (
        <div>
            <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div class="px-3 py-3 lg:px-5 lg:pl-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span class="sr-only">Open sidebar</span>
                                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <a href="/dashboard/:role" class="flex ms-2 md:me-24">
                                <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Academy</span>
                            </a>
                        </div>
                        <div class="flex items-center">
                            <div class="flex items-center ms-3">
                                <div>
                                    <button type="button" class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                        <span class="sr-only">Open user menu</span>
                                        <img class="w-8 h-8 rounded-full" src="https://www.svgrepo.com/show/345418/account-circle.svg" alt="user photo" />
                                    </button>
                                </div>
                                <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                                    <div class="px-4 py-3" role="none">
                                        <p class="text-sm text-gray-900 dark:text-white" role="none">
                                            Neil Sims
                                        </p>
                                        <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                            neil.sims@flowbite.com
                                        </p>
                                    </div>
                                    <ul class="py-1" role="none">
                                        <li>
                                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</a>
                                        </li>
                                        <li>
                                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</a>
                                        </li>
                                        <li>
                                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Earnings</a>
                                        </li>
                                        <li>
                                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul class="space-y-2 font-medium">
                        {items.map((item, index) => (
                            <li key={index}>
                                <a
                                    onClick={() => handleListItemClick(item.name)}
                                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    {/* Add your icons here based on item.name if needed */}
                                    <span className="flex-1 ms-3 whitespace-nowrap">{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            {['My Classes', 'My Teachers', 'My Students'].includes(activeComponent) && (
                                 <h2 className="text-xl font-semibold">{activeComponent}</h2>
                            )}
                           
                            {['My Classes', 'My Teachers', 'My Students'].includes(activeComponent) && role === 'admin' && (
                                <button className="bg-blue-500 text-white px-4 py-1.5 rounded" onClick={() => handleAddClick(activeComponent)}>
                                    Add
                                </button>
                            )}
                        </div>

                        {renderActiveComponent()}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Dashboard;
