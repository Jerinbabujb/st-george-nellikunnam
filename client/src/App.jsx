import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Worship from './pages/Worship';
import Organizations from './pages/Organizations';
import NoticeBoard from './pages/NoticeBoard';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Directory from './pages/Directory';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App(){
  return <div className="app-shell"><Header/><main><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/worship" element={<Worship/>}/>
    <Route path="/organizations" element={<Organizations/>}/>
    <Route path="/notice-board" element={<NoticeBoard/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/gallery" element={<Gallery/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/directory" element={<ProtectedRoute><Directory/></ProtectedRoute>}/>
    <Route path="/member" element={<ProtectedRoute role="member"><MemberDashboard/></ProtectedRoute>}/>
    <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>}/>
    <Route path="*" element={<Home/>}/>
  </Routes></main><Footer/></div>;
}
