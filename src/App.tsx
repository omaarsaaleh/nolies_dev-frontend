
import { Routes, Route } from "react-router-dom";
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import VerifyAccount from '@/pages/auth/VerifyAccount'
import ForgetPassword from '@/pages/auth/ForgetPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Home from '@/pages/Home'
import Profile from '@/pages/Profile'
import { AuthProtectedRoute } from "@/components/AuthProtectedRoute"
import { UnauthRoute } from "@/components/UnauthRoute"
import { Toaster } from "@/components/ui/sonner"

export default function App() {  

  return (
    <>
      <Routes>
        <Route element={<UnauthRoute />}>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/forget-password' element={<ForgetPassword/>}></Route>
          <Route path='/reset-password' element={<ResetPassword/>}></Route>
        </Route>
        
        {/* public */}
        <Route path='/' element={<Home />}></Route>

        
        <Route element={<AuthProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path='/verify-account' element={<VerifyAccount/>}></Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}