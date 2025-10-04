
import { Routes, Route } from "react-router-dom";
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'

export default function App() {  

  return (
    <>
    <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        
    </Routes>
    </>
  );
}