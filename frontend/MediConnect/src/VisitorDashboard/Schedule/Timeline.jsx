// frontend/src/Schedule/Timeline.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getUpcomingBookingsForPatient,
  getPastBookingsForPatient,
} from "../../api/booking";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const BRAND = "#6f42c1";
const LIGHT_PURPLE = "#ede7fa";
const LINE_COLOR = "#e0e0e0";

function TimelineHorizontal({ title, bookings }) {
  // Sort: past (<= today) first, then upcoming (> today)
  const today = new Date();
  const [scroll, setScroll] = useState(0);
  const containerRef = useRef(null);
  const [hospitalNames, setHospitalNames] = useState({});

  const { past, upcoming } = useMemo(() => {
    const p = [], u = [];
    bookings.forEach((b) => {
      const d = new Date(`${b.date}T${b.time || "00:00"}`);
      if (d <= today) p.push({ ...b, _date: d });
      else u.push({ ...b, _date: d });
    });
    // Sort past: nearest to today last, upcoming: nearest to today first
    p.sort((a, b) => b._date - a._date);
    u.sort((a, b) => a._date - b._date);
    return { past: p.slice(0, 4).reverse(), upcoming: u.slice(0, 2) };
  }, [bookings]);

  const timelineItems = [...past, ...upcoming];

  // Scroll logic
  const scrollBy = 180; // px per item
  const maxScroll = Math.max(0, (timelineItems.length - 6) * scrollBy);

  const handleScroll = (dir) => {
    let newScroll = scroll + dir * scrollBy;
    newScroll = Math.max(0, Math.min(newScroll, maxScroll));
    setScroll(newScroll);
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: newScroll, behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Fetch hospital names for all unique hospitalIds in timelineItems
    const idsToFetch = timelineItems
      .map((item) => item.hospitalId)
      .filter((id) => id && !hospitalNames[id]);
    if (idsToFetch.length === 0) return;
    idsToFetch.forEach(async (id) => {
      try {
        const res = await axios.get(`http://localhost:5000/api/hospitals/${id}`);
        setHospitalNames((prev) => ({ ...prev, [id]: res.data.name }));
      } catch {
        setHospitalNames((prev) => ({ ...prev, [id]: "Unknown Hospital" }));
      }
    });
    // eslint-disable-next-line
  }, [timelineItems]);

  return (
    <div className="timeline-section">
      <div className="timeline-title">{title}</div>
      <div className="timeline-scroll-btns">
        <button
          className="timeline-btn"
          onClick={() => handleScroll(-1)}
          disabled={scroll === 0}
        >
          &#8592;
        </button>
        <button
          className="timeline-btn"
          onClick={() => handleScroll(1)}
          disabled={scroll === maxScroll}
        >
          &#8594;
        </button>
      </div>
      <div className="timeline-horizontal-outer">
        <div className="timeline-horizontal" ref={containerRef}>
          {timelineItems.map((item, idx) => {
            const isPast = idx < past.length;
            const isFilled = isPast;
            return (
              <div className="timeline-item-h" key={item._id || idx}>
                {/* Circle and line */}
                <div className="timeline-circle-row">
                  <div
                    className="timeline-circle"
                    style={{
                      background: isFilled ? BRAND : "#fff",
                      border: `3px solid ${BRAND}`,
                    }}
                  ></div>
                  {idx < timelineItems.length - 1 && (
                    <div className="timeline-line"></div>
                  )}
                </div>
                {/* Info box */}
                <div className="timeline-info-box">
                  <div className="timeline-date">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <div className="timeline-hospital">
                    {hospitalNames[item.hospitalId] || "-"}
                  </div>
                  <div className="timeline-dept">{item.department || "-"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        .timeline-section {
          width: 100vw;
          max-width: 100vw;
          min-height: 24vh;
          margin: 0 auto 40px auto;
          padding: 0 0 10px 0;
          background: none;
        }
        .timeline-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: ${BRAND};
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 18px;
          text-align: left;
          padding-left: 3vw;
        }
        .timeline-scroll-btns {
          position: absolute;
          right: 5vw;
          top: 0;
          display: flex;
          gap: 10px;
        }
        .timeline-btn {
          background: #fff;
          border: 1.5px solid ${BRAND};
          color: ${BRAND};
          border-radius: 50%;
          width: 36px;
          height: 36px;
          font-size: 1.3rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        .timeline-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .timeline-horizontal-outer {
          overflow-x: auto;
          padding: 0 3vw;
        }
        .timeline-horizontal {
          display: flex;
          align-items: flex-start;
          gap: 0;
          min-width: 1080px;
          padding: 30px 0 0 0;
          position: relative;
        }
        .timeline-item-h {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 180px;
          max-width: 180px;
          position: relative;
        }
        .timeline-circle-row {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .timeline-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(111,66,193,0.07);
          transition: background 0.2s;
        }
        .timeline-line {
          flex: 1;
          height: 4px;
          background: ${LINE_COLOR};
          margin-left: 0;
          margin-right: 0;
        }
        .timeline-info-box {
          margin-top: 18px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(111,66,193,0.07);
          padding: 10px 12px;
          min-width: 120px;
          max-width: 150px;
          text-align: center;
          font-size: 0.97rem;
          color: #222;
        }
        .timeline-date {
          font-weight: 700;
          color: ${BRAND};
          font-size: 1.05rem;
        }
        .timeline-hospital {
          font-weight: 500;
          color: #444;
          margin-top: 2px;
        }
        .timeline-dept {
          font-size: 0.95rem;
          color: #666;
          margin-top: 2px;
        }
        @media (max-width: 900px) {
          .timeline-horizontal { min-width: 700px; }
          .timeline-item-h { min-width: 120px; max-width: 120px; }
        }
        @media (max-width: 600px) {
          .timeline-horizontal { min-width: 400px; }
          .timeline-item-h { min-width: 80px; max-width: 100px; }
          .timeline-info-box { min-width: 70px; max-width: 100px; font-size: 0.8rem; }
        }
      `}</style>
    </div>
  );
}

const Timeline = ({ patientId, bookings = [] }) => {
  // Split bookings by type
  const doctorBookings = useMemo(
    () => bookings.filter((b) => b.type === "appointment"),
    [bookings]
  );
  const labBookings = useMemo(
    () => bookings.filter((b) => b.type === "labTest"),
    [bookings]
  );

  return (
    <div style={{ width: "100vw", minHeight: "50vh", background: "none", padding: "0 0 40px 0" }}>
      <TimelineHorizontal title="Doctor Appointments" bookings={doctorBookings} />
      <TimelineHorizontal title="Lab Tests" bookings={labBookings} />
    </div>
  );
};

export default Timeline;
