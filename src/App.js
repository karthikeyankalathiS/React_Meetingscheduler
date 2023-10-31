import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Booking from './components/Booking';
 
import Home from './components/Home';
import Booking from './components/Booking';
 
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/Booking' element={<Booking/>} />
      </Routes>
      </BrowserRouter>         
    </div>
  );
}
 
export default App;