import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CTAAndFooter = () => {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* CTA Section */}
      <div
        className="py-5"
        style={{
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Container>
          <Row className="align-items-center justify-content-between">
            <Col md="auto" className="text-md-start text-center mb-3 mb-md-0">
              <h3 style={{ fontWeight: "600", color: "#000", margin: 0 }}>
                Ready to take control of your health?
              </h3>
            </Col>
            <Col md="auto" className="text-md-end text-center">
              <Button
                as={Link}
                to="/visitor/book"
                className="px-4 py-2"
                style={{
                  backgroundColor: "#6a1b9a",
                  border: "none",
                  color: "#fff",
                  fontWeight: "500",
                  fontSize: "1rem",
                }}
              >
                Book Your Appointment
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer Section */}
      <footer
        className="py-4"
        style={{
          backgroundColor: "#000000",
          color: "#ffffff",
        }}
      >
        <Container>
          <Row className="align-items-center justify-content-between">
            {/* Left: MediConnect Brand */}
            <Col md="auto" className="text-md-start text-center mb-3 mb-md-0">
              <h3 style={{ fontWeight: "bold", margin: 0 }}>MediConnect</h3>
            </Col>

            {/* Right: Page Links */}
            <Col
              md="auto"
              className="text-md-end text-center d-flex flex-wrap justify-content-md-end justify-content-center gap-3"
            >
              <Link
                to="/visitor/know"
                className="text-white mx-3"
                style={{ fontWeight: "600", textDecoration: "none" }}
              >
                About Us
              </Link>
              <Link
                to="/visitor/dashboard"
                className="text-white mx-2"
                style={{ fontWeight: "400", textDecoration: "none" }}
              >
                Home
              </Link>
              <Link
                to="/visitor/book"
                className="text-white mx-2"
                style={{ fontWeight: "400", textDecoration: "none" }}
              >
                Book Appointment
              </Link>
              <Link
                to="/visitor/lab"
                className="text-white mx-2"
                style={{ fontWeight: "400", textDecoration: "none" }}
              >
                Book Lab Test
              </Link>
              <Link
                to="/visitor/records"
                className="text-white mx-2"
                style={{ fontWeight: "400", textDecoration: "none" }}
              >
                Medical Records
              </Link>
              <Link
                to="/visitor/schedule"
                className="text-white mx-2"
                style={{ fontWeight: "400", textDecoration: "none" }}
              >
                Schedule
              </Link>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default CTAAndFooter;
