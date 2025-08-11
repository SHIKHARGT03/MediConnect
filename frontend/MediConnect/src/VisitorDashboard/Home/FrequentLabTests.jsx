import React from 'react';
import { FaTint, FaVial, FaMicroscope, FaHeartbeat } from 'react-icons/fa';

const labTests = [
  {
    name: 'Blood Test',
    subtext: 'Basic health indicators',
    icon: <FaTint size={28} color="#6f42c1" />,
  },
  {
    name: 'Thyroid Profile',
    subtext: 'Hormonal balance check',
    icon: <FaMicroscope size={28} color="#6f42c1" />,
  },
  {
    name: 'Diabetes Check',
    subtext: 'Blood sugar test',
    icon: <FaVial size={28} color="#6f42c1" />,
  },
  {
    name: 'Liver Function',
    subtext: 'Organ performance test',
    icon: <FaHeartbeat size={28} color="#6f42c1" />,
  },
];

const FrequentLabTests = () => {
  return (
    <section style={{ background: '#f9f9ff', padding: '60px 0' }}>
      <div className="container text-center">
        <h2 style={{ fontWeight: 'bold', color: '#000000', fontSize: '2rem', marginBottom: '10px' }}>
          Popular Lab Tests
        </h2>
        <p style={{ color: '#000000', fontSize: '1rem', marginBottom: '40px' }}>
          Quick access to the most commonly booked diagnostic tests
        </p>

        <div className="row g-4">
          {labTests.map((test, index) => (
            <div className="col-md-3 col-sm-6" key={index}>
              <div
                className="card h-100 d-flex flex-column align-items-center"
                style={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '18px',
                  boxShadow: '0 6px 24px rgba(111,66,193,0.07)',
                  padding: '36px 28px 28px 28px',
                  minHeight: '270px',
                  transition: 'transform 0.2s',
                }}
              >
                <div className="mb-4">{test.icon}</div>
                <div className="text-center w-100">
                  <h5 style={{ margin: 0, fontWeight: 'bold', color: '#000000', fontSize: '1.25rem' }}>
                    {test.name}
                  </h5>
                  <div style={{ height: '18px' }} /> {/* breathing space */}
                  <p style={{ margin: 0, color: '#6c757d', fontSize: '1rem' }}>{test.subtext}</p>
                </div>
                <div className="d-flex justify-content-center mt-auto w-100">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: '#6f42c1',
                      color: '#ffffff',
                      borderRadius: '8px',
                      width: '100%',
                      fontWeight: 600,
                      fontSize: '1rem',
                      marginTop: '32px',
                      boxShadow: '0 2px 8px rgba(111,66,193,0.07)',
                      transition: 'background 0.2s',
                    }}
                  >
                    Book Your Slot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FrequentLabTests;
