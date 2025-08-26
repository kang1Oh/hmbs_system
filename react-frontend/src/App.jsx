import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import PublicRoute from "./components/PublicRoutes";

// STUDENT PAGES
import EquipmentPage from './pages/EquipmentPage';
import About from './pages/AboutPage';
import CartPage from './pages/CartPage';
import BorrowRequestForm from './pages/BorrowRequestForm';
import StudentLoginPage from './pages/StudentLoginPage';
import TransactionPage from './pages/TransactionPage';

// STAFF AND ADMIN PAGES
import StaffLoginPage from './pages/StaffLoginPage';
import InventoryPage from './pages/CRUDInventoryPage';
import AddtoInventory from './pages/AddNewItemAdmin';
import RegistryPage from "./pages/CRUDUserPageAdmin";

import RequeststoAdmin from "./pages/RequestAdminPage";
import RequestDetailsAdmin from "./pages/RequestDetailsAdmin";
import RequestApprovedAdmin from "./pages/RequestApprovedAdmin";

import RequeststoInstructor from "./pages/RequestInstructorPage";
import RequeststoProgHead from "./pages/RequestProgHeadPage";
import RequestDetailsInstructor from "./pages/RequestDetailsInstructor";
import RequestDetailsProgHead from "./pages/RequestDetailsProgHead";

const ROLES = {
  ADMIN: '1',
  INSTRUCTOR: '2',
  PROGRAM_HEAD: '3',
  STUDENT: '4',
};


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><StudentLoginPage /></PublicRoute>} />
        <Route path="/staff-login" element={<PublicRoute><StaffLoginPage /></PublicRoute>} />

        {/* Student Protected Routes */}
        <Route path="/equipment" element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]}><EquipmentPage /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]}><About /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]}><CartPage /></ProtectedRoute>} />
        <Route path="/borrow-request" element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]}><BorrowRequestForm /></ProtectedRoute>} />
        <Route path="/transaction" element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]}><TransactionPage /></ProtectedRoute>} />

        {/* Admin Protected Routes (role_id = '1') */}
        <Route path="/requests-admin" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><RequeststoAdmin /></ProtectedRoute>} />
        <Route path="/request-details-admin/:id" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><RequestDetailsAdmin /></ProtectedRoute>} />
        <Route path="/request-approved-admin/:id" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><RequestApprovedAdmin /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><InventoryPage /></ProtectedRoute>} />
        <Route path="/add-to-inventory" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AddtoInventory /></ProtectedRoute>} />
        <Route path="/registry" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><RegistryPage /></ProtectedRoute>} />

        {/* Staff Protected Routes (role_id = '2' for Instructor, '3' for Program Head) */}
        <Route path="/requests-instructor" element={<ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}><RequeststoInstructor /></ProtectedRoute>} />
        <Route path="/requests-programhead" element={<ProtectedRoute allowedRoles={[ROLES.PROGRAM_HEAD]}><RequeststoProgHead /></ProtectedRoute>} />
        <Route path="/request-details-instructor/:id" element={<ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}><RequestDetailsInstructor /></ProtectedRoute>} />
        <Route path="/request-details-programhead/:id" element={<ProtectedRoute allowedRoles={[ROLES.PROGRAM_HEAD]}><RequestDetailsProgHead /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
