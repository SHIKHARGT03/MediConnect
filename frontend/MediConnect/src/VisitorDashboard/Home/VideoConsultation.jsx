import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const VideoConsultation = () => {
  const sectionTitleStyle = {
    color: "#6a1b9a",
    fontWeight: "bold",
    fontSize: "2.6rem", // Larger title
    marginBottom: "18px",
    lineHeight: 1.15,
  };

  const subTextStyle = {
    color: "#333",
    fontSize: "1.15rem",
    marginBottom: "28px",
  };

  const buttonStyle = {
    backgroundColor: "white",
    color: "black",
    border: "2px solid #6a1b9a",
    padding: "12px 24px",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "0.3s",
  };

  const buttonHoverStyle = {
    backgroundColor: "#6a1b9a",
    color: "white",
    border: "2px solid #6a1b9a",
  };

  const benefitTitleStyle = {
    fontWeight: "600",
    fontSize: "1.1rem",
    marginTop: "10px",
    marginBottom: "10px",
  };

  const benefitDescStyle = {
    color: "#333",
    fontSize: "0.95rem",
  };

  const tickStyle = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#6f42c1",
  };

  const [hover, setHover] = React.useState(false);

  return (
    <div>
      {/* Top Section: Image + Text */}
      <div style={{ backgroundColor: "#ffffff", padding: "90px 0" }}> {/* Increased section height */}
        <Container>
          <Row
            className="align-items-start"
            style={{ rowGap: "40px" }}
          >
            <Col
              md={6}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "60px",
              }}
            >
              <img
                src="/Home/2.jpg"
                alt="Video Consultation"
                className="img-fluid rounded shadow"
                style={{
                  maxWidth: "520px", // Increased image width
                  width: "100%",
                  height: "370px",   // Increased image height
                  objectFit: "cover",
                  marginLeft: 0,
                  marginRight: "auto",
                  display: "block",
                }}
              />
            </Col>
            <Col
              md={6}
              className="text-center text-md-start"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                paddingLeft: "0px",
                marginTop: 0,
              }}
            >
              <div style={{ marginTop: 0 }}>
                <h2 style={sectionTitleStyle}>
                  Connect with Experts Within Seconds
                </h2>
                <p style={subTextStyle}>
                  Speak to top doctors from the comfort of your home.
                </p>
                <Button
                  style={hover ? buttonHoverStyle : buttonStyle}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  Book Your Video Consultation
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Bottom Section: Benefits */}
      <div style={{ backgroundColor: "#f4f4f4", padding: "60px 0" }}>
        <Container>
          <Row className="text-center">
            <Col md={4} className="mb-4">
              <div style={tickStyle}>✔</div>
              <h5 style={benefitTitleStyle}>Consult Top Doctors 24x7</h5>
              <p style={benefitDescStyle}>
                Connect instantly with a 24x7 specialist or choose to video
                visit a particular doctor.
              </p>
            </Col>
            <Col md={4} className="mb-4">
              <div style={tickStyle}>✔</div>
              <h5 style={benefitTitleStyle}>Convenient and Easy</h5>
              <p style={benefitDescStyle}>
                Start an instant consultation within 2 minutes or schedule a
                video call as per your convenience.
              </p>
            </Col>
            <Col md={4} className="mb-4">
              <div style={tickStyle}>✔</div>
              <h5 style={benefitTitleStyle}>100% Safe Consultations</h5>
              <p style={benefitDescStyle}>
                Be assured that your online consultation will be fully private
                and secured.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default VideoConsultation;
