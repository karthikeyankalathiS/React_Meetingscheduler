import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Booking from './components/Booking';
 
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/booking' element={<Booking/>} />
      </Routes>
      </BrowserRouter>         
    </div>
  );
}
 
export default App;