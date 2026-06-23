
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
    <div className="ml-predict-shell">
      <style>{`
        .ml-predict-shell {
          min-height: calc(100vh - 70px);
          display: flex;
          background: #111118;
        }

        .ml-predict-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .ml-predict-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }

        @media (max-width: 900px) {
          .ml-predict-shell {
            flex-direction: column;
          }
        }
      `}</style>
      <Sidebar />

      <div className="ml-predict-content">
        <div className="ml-predict-scroll">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="diabetes" element={<Diabetes />} />
            <Route path="heart" element={<Heart />} />
            <Route path="breast-cancer" element={<BreastCancer />} />
            <Route path="brain-stroke" element={<BrainStroke />} />
          </Routes>
        </div>

        <div style={{ flexShrink: 0 }}>
          <Disclaimer />
        </div>
      </div>
    </div>
  );
};

export default MLPredict;
