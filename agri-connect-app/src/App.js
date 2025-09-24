import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Products from "./pages/Products/index.jsx";
import ProductDetailComponent from './components/Product/Products/ProductDetailComponent.jsx';
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashbord";  
import AuthRoutes from "./Routes/AuthRoutes";
import FarmerDashboard from "./pages/FarmerDashboard";
import FertilizerDashboard from "./pages/FertilizerDashboard";
import MachineryDashboard from "./pages/MachineDashbord";
import PricePrediction from "./pages/PricePrediction/PricePrediction.jsx";
import AgriWeatherDashboard from "./pages/AgriWeatherDashboard/AgriWeatherDashboard.jsx";
import Chat from "./pages/Chat/Chat.jsx";



function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>

          {/* Guest Routes */}
          <Route index path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/priceprediction" element={<PricePrediction />} />
          <Route path="/weather" element={<AgriWeatherDashboard />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetailComponent />} />
          <Route path="/contact" element={<Contact />} />
          

          {/* Protected Routes */}
          <Route element={<AuthRoutes />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/farmer" element={<FarmerDashboard />} />
            <Route path="/FertilizerVender" element={<FertilizerDashboard />} />
            <Route path="/MachineryVendor" element={<MachineryDashboard />} />
            <Route path="/chat/:userId?/:email?" element={<Chat />} />
              
          </Route>

          {/* SignIn SignUp */}
          <Route path="/sign-in" element={<SignIn/>} />
          <Route path="/sign-up" element={<SignUp/>} />

          {/* Authenticate Routes */}
          


          

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
