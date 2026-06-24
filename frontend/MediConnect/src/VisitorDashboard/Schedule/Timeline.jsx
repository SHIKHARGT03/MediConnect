// frontend/src/Schedule/Timeline.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const BRAND = "#6f42c1";
const LINE_COLOR = "#d8d0ee";

function TimelineHorizontal({ title, bookings }) {
  const [windowStart, setWindowStart] = useState(0);
  const [hospitalNames, setHospitalNames] = useState({});
  const containerRef = useRef(null);

  const sortedBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...bookings]
      .filter((b) => b?.date)
      .map((b) => ({
        ...b,
        _date: new Date(`${b.date}T${b.time || "00:00"}`),
        _isPast: new Date(`${b.date}T${b.time || "00:00"}`) <= today,
      }))
      .sort((a, b) => a._date - b._date);
  }, [bookings]);

  const visibleCount = 7;
  const maxStart = Math.max(0, sortedBookings.length - visibleCount);
  const firstUpcomingIndex = useMemo(() => {
    return sortedBookings.findIndex((item) => !item._isPast);
  }, [sortedBookings]);

  useEffect(() => {
    const initialStart = firstUpcomingIndex >= 0 ? Math.max(0, firstUpcomingIndex - 3) : 0;
    setWindowStart(initialStart);
  }, [firstUpcomingIndex]);

  const visibleItems = useMemo(() => {
    return sortedBookings.slice(windowStart, windowStart + visibleCount);
  }, [sortedBookings, windowStart]);

  useEffect(() => {
    containerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [windowStart]);

  useEffect(() => {
    const idsToFetch = visibleItems
      .map((item) => item.hospitalId)
      .filter((id) => id && !hospitalNames[id]);

    if (!idsToFetch.length) return;

    idsToFetch.forEach(async (id) => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/hospitals/${id}`);
        setHospitalNames((prev) => ({ ...prev, [id]: res.data.name }));
      } catch {
        setHospitalNames((prev) => ({ ...prev, [id]: "Unknown Hospital" }));
      }
    });
  }, [visibleItems, hospitalNames]);

  const handleScroll = (dir) => {
    setWindowStart((prev) => Math.max(0, Math.min(prev + dir, maxStart)));
  };

  return (
    <div className="timeline-section">
      <div className="timeline-title-row">
        <div className="timeline-title">{title}</div>
        <div className="timeline-nav">
          <button className="timeline-btn" onClick={() => handleScroll(-1)} disabled={windowStart === 0}>
            ‹
          </button>
          <button className="timeline-btn" onClick={() => handleScroll(1)} disabled={windowStart >= maxStart}>
            ›
          </button>
        </div>
      </div>

      <div className="timeline-track" ref={containerRef}>
        {visibleItems.length ? (
          visibleItems.map((item, index) => {
            const isPast = item._isPast;
            const showLine = index < visibleItems.length - 1;

            return (
              <div className="timeline-node" key={item.bookingId || `${item.date}-${index}`}>
                <div className="timeline-dot-row">
                  <div className={`timeline-dot ${isPast ? "filled" : ""}`} />
                  {showLine ? <div className="timeline-line" /> : null}
                </div>
                <div className="timeline-card">
                  <div className="timeline-date">{new Date(item.date).toLocaleDateString()}</div>
                  <div className="timeline-hospital">{hospitalNames[item.hospitalId] || "Loading hospital..."}</div>
                  <div className="timeline-dept">{item.department || "-"}</div>
                  <div className="timeline-time">{item.time || "Time TBD"}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="timeline-empty">No visits to display yet.</div>
        )}
      </div>

      <style>{`
        .timeline-section {
          width: 100%;
          margin: 0 auto 28px;
          padding: 0 24px 8px;
          box-sizing: border-box;
        }
        .timeline-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          gap: 16px;
        }
        .timeline-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: ${BRAND};
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }
        .timeline-nav {
          display: flex;
          gap: 8px;
        }
        .timeline-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid ${BRAND};
          background: #fff;
          color: ${BRAND};
          font-size: 1.15rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 3px 10px rgba(111, 66, 193, 0.12);
        }
        .timeline-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 5px 14px rgba(111, 66, 193, 0.16);
        }
        .timeline-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .timeline-track {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 10px 2px 10px;
          scroll-behavior: smooth;
          scrollbar-width: none;
          align-items: flex-start;
        }
        .timeline-track::-webkit-scrollbar {
          display: none;
        }
        .timeline-node {
          min-width: 176px;
          max-width: 176px;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }
        .timeline-dot-row {
          display: flex;
          align-items: center;
          width: 100%;
          margin-bottom: 12px;
        }
        .timeline-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid ${BRAND};
          background: #fff;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .timeline-dot.filled {
          background: ${BRAND};
          box-shadow: 0 0 0 3px rgba(111, 66, 193, 0.16);
        }
        .timeline-line {
          flex: 1;
          height: 2px;
          background: ${LINE_COLOR};
          margin-left: 4px;
        }
        .timeline-card {
          width: 100%;
          background: #fff;
          border: 1px solid #ece9f7;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
          padding: 14px 12px;
          text-align: center;
          min-height: 132px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .timeline-date {
          font-size: 0.95rem;
          font-weight: 800;
          color: ${BRAND};
          margin-bottom: 4px;
        }
        .timeline-hospital {
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 3px;
        }
        .timeline-dept {
          font-size: 0.84rem;
          color: #666;
          margin-bottom: 3px;
        }
        .timeline-time {
          font-size: 0.82rem;
          color: #777;
        }
        .timeline-empty {
          padding: 24px 10px;
          color: #777;
          font-weight: 600;
        }
        @media (max-width: 700px) {
          .timeline-node { min-width: 132px; max-width: 132px; }
          .timeline-card { min-height: 100px; }
        }
      `}</style>
    </div>
  );
}

const Timeline = ({ bookings = [] }) => {
  const doctorBookings = useMemo(
    () => bookings.filter((b) => b.type === "appointment"),
    [bookings]
  );
  const labBookings = useMemo(
    () => bookings.filter((b) => b.type === "labTest"),
    [bookings]
  );

  return (
    <div style={{ width: "100%", minHeight: "50vh", background: "none", padding: "18px 0 40px" }}>
      <h2 style={{ textAlign: "center", fontWeight: 800, color: "#111", marginBottom: "22px", textTransform: "uppercase" }}>
        TIMELINE
      </h2>
      <TimelineHorizontal title="DOCTOR APPOINTMENTS" bookings={doctorBookings} />
      <TimelineHorizontal title="LAB TESTS" bookings={labBookings} />
    </div>
  );
};

export default Timeline;
