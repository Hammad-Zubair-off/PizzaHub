import logo from './logo.svg';
import './App.css';
import bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar';
import {BrowserRouter,Link,Route,Navigate,Routes} from 'react-router-dom'
import Homescreen from './screens/Homescreen';
import Loginscreen from './screens/Loginscreen';
import Cartscreen from './screens/Cartscreen';
import About from './screens/About';
import Registerscreen from './screens/Registerscreen';
import Admin from './screens/Admin';
import ProductList from './screens/ProductList';
import EditProduct from './screens/EditProduct';
import AddProduct from './screens/AddProduct';
function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
<Route path='/' element={<Homescreen/>} />
<Route path='admin' element={<Admin/>} />
<Route path='productList' element={<ProductList/>} />
<Route path='edit' element={<EditProduct/>} />
<Route path='edit' element={<EditProduct/>} />
<Route path='add' element={<AddProduct/>} />     
<Route path='cart' element={<Cartscreen/>} />
<Route path='Registerscreen' element={<Registerscreen/>}/>
<Route path='About' element={<About/>}/>

        </Routes>
  
    </div>
  );
}

export default App;
