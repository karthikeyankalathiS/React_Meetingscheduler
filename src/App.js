import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Booking from './components/Booking';
 
import Home from './components/Home';
import Booking from './components/Booking';
import Month from './components/Month';
import Week from './components/week';
import Today from './components/Today';
 
function App() {
  return (
    <div>
      <BrowserRouter>
      {/* <Routes>
        <Route path='/booking' element={<Booking/>} />
      </Routes> */}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/Booking' element={<Booking/>} />
        <Route path='/month' element={<Month/>} />
        <Route path='/week' element={<Week/>} /> 
        <Route path='/today' element={<Today/>}/>            
      </Routes>
      </BrowserRouter>         
    </div>
  );
}
 
export default App;