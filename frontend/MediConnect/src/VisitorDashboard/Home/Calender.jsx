import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Container, Row, Col, Card } from "react-bootstrap";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const Calender = () => {
  return (
    <div
      className="py-5"
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <Container>
        <h2
          className="text-center mb-5"
          style={{
            fontWeight: "bold",
            color: "#000000",
            fontSize: "2rem",
          }}
        >
          Upcoming Appointments
        </h2>
        <Row className="justify-content-center align-items-start">
          <Col
            md={6}
            className="d-flex justify-content-center mb-4 mb-md-0"
          >
            <div
              className="shadow p-4 rounded calendar-container"
              style={{
                width: "100%",
                maxWidth: "520px",
                backgroundColor: "#ffffff",
              }}
            >
              <Calendar
                localizer={localizer}
                events={[]} // No events
                views={["month"]}
                defaultView="month"
                toolbar={true}
                selectable={false}
                onSelectSlot={() => {}} // No-op
                onSelectEvent={() => {}} // No-op
                style={{ height: 430 }}
                popup={false}
                drilldownView={null} // Prevents day drilldown
                onDrillDown={() => {}} // Prevents drilldown on header click
                components={{
                  toolbar: undefined, // Use default toolbar for month/year navigation
                }}
                dayPropGetter={() => ({
                  style: {
                    backgroundColor: "#fff",
                    color: "#000",
                    cursor: "default",
                  },
                })}
                dateCellWrapper={({ children }) => (
                  <div style={{ color: "#000", cursor: "default" }}>{children}</div>
                )}
              />
            </div>
          </Col>
          <Col md={6}>
            <Card
              className="shadow rounded border-0 p-4 d-flex justify-content-center align-items-center text-center"
              style={{
                minHeight: "430px",
                backgroundColor: "#ffffff",
              }}
            >
              <p
                style={{
                  color: "#444",
                  fontSize: "1.1rem",
                  margin: 0,
                }}
              >
                Your upcoming appointments will appear here once scheduled.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
      <style>{`
        .rbc-month-view {
          background: #fff;
        }
        .rbc-date-cell {
          color: #000 !important;
        }
        .rbc-selected,
        .rbc-today {
          background: #fff !important;
          color: #000 !important;
        }
        .rbc-off-range {
          color: #bbb !important;
        }
        .rbc-toolbar button {
          background: #fff !important;
          color: #000 !important;
          border: 1px solid #ddd !important;
        }
        .rbc-toolbar button:focus {
          outline: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
};

export default Calender;
