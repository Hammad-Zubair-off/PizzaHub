import logo from './logo.svg';
import './App.css';
import bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar';
import {BrowserRouter, Route, Navigate, Routes} from 'react-router-dom'
import Homescreen from './screens/Homescreen';
import Loginscreen from './screens/Loginscreen';
import Cartscreen from './screens/Cartscreen';
import About from './screens/About';
import Registerscreen from './screens/Registerscreen';
import Admin from './screens/Admin';
import ProductList from './screens/ProductList';
import EditProduct from './screens/EditProduct';
import AddProduct from './screens/AddProduct';
import ProfileScreen from './screens/ProfileScreen';
import AdminDashboard from './screens/AdminDashboard';
import UserManagement from './screens/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AdminLogin from './screens/AdminLogin';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar/>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Homescreen/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/login' element={<Loginscreen/>} />
          <Route path='/register' element={<Registerscreen/>} />
          <Route path='/admin/login' element={<AdminLogin/>} />
          
          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<ProfileScreen/>} />
            <Route path='/cart' element={<Cartscreen/>} />
          </Route>
          
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path='/admin/*' element={<AdminDashboard/>} />
            <Route path='/dashboard' element={<AdminDashboard/>} />
            <Route path='/users' element={<UserManagement/>} />
            <Route path='/productList' element={<ProductList/>} />
            <Route path='/edit' element={<EditProduct/>} />
            <Route path='/add' element={<AddProduct/>} />
          </Route>
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
