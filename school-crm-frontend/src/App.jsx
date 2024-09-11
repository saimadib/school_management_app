import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUpForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import ClassUpdatePage from './pages/ClassUpdatePage';
import StudentUpdatePage from './pages/StudentUpdatePage';
import TeacherUpdatePage from './pages/TeacherUpdatePAge';
import StudentViewPage from './pages/StudentViewPage';
import ClassViewPage from './pages/ClassesViewPage';
import StudentClassViewPage from './pages/StudentClassViewPage';
import StudentTeacherViewPage from './pages/StudentTeachersViewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/:role" element={<SignUpForm />} />
        <Route path="/dashboard/:role" element={<Dashboard/>}/>
        <Route path="/class/update/:id" element={<ClassUpdatePage/>}/>
        <Route path="/student/update/:id" element={<StudentUpdatePage/>}/>
        <Route path="/teacher/update/:id" element={<TeacherUpdatePage/>}/>
        <Route path="/teacher/student/view/:id" element={<StudentViewPage/>}/>
        <Route path="/teacher/class/view/:id" element={<ClassViewPage/>}/>
        <Route path="/student/class/view/:id" element={<StudentClassViewPage/>}/>
        <Route path="/student/teacher/view/:id" element={<StudentTeacherViewPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
