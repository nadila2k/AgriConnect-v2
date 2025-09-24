import Slider from "../../components/Slider"
import AboutUsComponent from '../../components/About/Sector';
import FarmerChart from "../../components/Charts/FarmerChart";

const Home = () => {
  return (
    <>
      <Slider />
      <FarmerChart />
    
      <AboutUsComponent />
    </>
  )
}

export default Home