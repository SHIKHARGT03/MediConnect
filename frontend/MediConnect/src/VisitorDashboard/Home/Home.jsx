import React from "react";
import HeroSection from "./HeroSection";
import SearchByCategory from "./SearchCategory"; 
import FrequentLabTests from "./FrequentLabTests";
import VideoConsultation from "./VideoConsultation";
import Calender from "./Calender";
import CTAAndFooter from "./CTAAndFooter";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <SearchByCategory />
      <FrequentLabTests />
      <VideoConsultation />
      <Calender />
      <CTAAndFooter />
    </div>
  );
};

export default Home;