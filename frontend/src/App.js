import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'; // Use Navigate instead of Redirect
import Home from "./component/Home";
import LoginForm from './component/LoginForm';
import NotFound from "./component/NotFound";
import RegisterForm from './component/RegisterForm';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path='/register' element={<RegisterForm />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
