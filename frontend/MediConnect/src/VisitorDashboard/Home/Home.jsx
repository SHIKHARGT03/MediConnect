import React from "react";
import HeroSection from "./HeroSection";
import SearchByCategory from "./SearchCategory"; 
import FrequentLabTests from "./FrequentLabTests";
import VideoConsultation from "./VideoConsultation";
import CTAAndFooter from "./CTAAndFooter";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <SearchByCategory />
      <FrequentLabTests />
      <VideoConsultation />
      <CTAAndFooter />
    </div>
  );
};

export default Home;