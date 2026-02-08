
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Diabetes from "./Diabetes";
import Heart from "./Heart";
import Disclaimer from "./Disclaimer";
import Sidebar from "./Sidebar";
import BreastCancer from "./BreastCancer";
import BrainStroke from "./BrainStroke";

const MLPredict = () => {
  return (
    <div style={{height: "100vh", display: "flex", minHeight: 0}}>
      <Sidebar />

      <div style={{width: "71%", display: "flex", flexDirection: "column", minHeight: 0}}>
        <div style={{flex: 1, minHeight: 0, overflowY: "auto", paddingBottom: "96px"}}>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="diabetes" element={<Diabetes />} />
            <Route path="heart" element={<Heart />} />
            <Route path="breast-cancer" element={<BreastCancer />} />
            <Route path="brain-stroke" element={<BrainStroke />} />
          </Routes>
        </div>

        <div style={{flexShrink: 0}}>
          <Disclaimer />
        </div>
      </div>
    </div>
  );
};

export default MLPredict;
