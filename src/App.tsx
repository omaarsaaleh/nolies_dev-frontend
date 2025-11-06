
import { Routes, Route } from "react-router-dom";
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import VerifyAccount from '@/pages/auth/VerifyAccount'
import ForgetPassword from '@/pages/auth/ForgetPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Home from '@/pages/Home'
import Profile from '@/pages/Profile'
import CompanySearch from '@/pages/CompanySearch'
import CompanyPage from '@/pages/CompanyPage'
import { AuthProtectedRoute } from "@/components/routing/AuthProtectedRoute"
import { UnauthRoute } from "@/components/routing/UnauthRoute"
import { Toaster } from "@/components/ui/sonner"
import ChangePassword from "@/components/profile/ChangePassword";
import WorkplaceVerificationCard from "@/components/profile/WorkplaceVerificationCard";
import WorkExperiencesCard from "@/components/profile/WorkExperiencesCard";

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
        <Route path='/companies' element={<CompanySearch />}></Route>
        <Route path='/companies/:slug' element={<CompanyPage />}></Route>

        
        <Route element={<AuthProtectedRoute />}>
          <Route path='/verify-account' element={<VerifyAccount/>}></Route>
          <Route path="/profile/" element={<Profile />}>
            <Route index element={<ChangePassword />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="workplace-verifications" element={<WorkplaceVerificationCard />} />
            <Route path="work-experiences" element={<WorkExperiencesCard />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}