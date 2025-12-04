
import { Routes, Route } from "react-router-dom";
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import VerifyAccountPage from '@/pages/auth/VerifyAccountPage'
import ForgetPasswordPage from '@/pages/auth/ForgetPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import Home from '@/pages/Home'
import CompanySearchPage from '@/pages/companies/CompanySearchPage'
import CompanyPage from '@/pages/companies/CompanyPage'
import { AuthProtectedRoute } from "@/components/routing/AuthProtectedRoute"
import { UnauthRoute } from "@/components/routing/UnauthRoute"
import { Toaster } from "@/components/ui/sonner"
import ProfilePage from '@/components/pages/ProfilePage'
import ChangePasswordPage from "@/pages/profile/ChangePasswordPage";
import WorkplaceVerificationPage from "./pages/profile/WorkplaceVerificationPage";
import WorkExperiencePage from "@/pages/profile/WorkExperiencePage";

export default function App() {  

  return (
    <>
      <Routes>
        <Route element={<UnauthRoute />}>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/signup' element={<SignupPage/>}></Route>
          <Route path='/forget-password' element={<ForgetPasswordPage/>}></Route>
          <Route path='/reset-password' element={<ResetPasswordPage/>}></Route>
        </Route>
        
        {/* public */}
        <Route path='/' element={<Home />}></Route>
        <Route path='/companies' element={<CompanySearchPage />}></Route>
        <Route path='/companies/:slug' element={<CompanyPage />}></Route>

        
        <Route element={<AuthProtectedRoute />}>
          <Route path='/verify-account' element={<VerifyAccountPage/>}></Route>
          <Route path="/profile/" element={<ProfilePage />}>
            <Route index element={<ChangePasswordPage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
            <Route path="workplace-verifications" element={<WorkplaceVerificationPage />} />
            <Route path="work-experiences" element={<WorkExperiencePage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}