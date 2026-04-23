import { useState } from "react";

const NFCCardsAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div className="faq-section" style={{backgroundColor: "#1d1e1f"}}>
      <div className="section-heading-wrapper" style={{"paddingTop":"50px"}}>
        <h2 className="section-heading max-900">
          Frequently asked questions about NFC business cards
        </h2>
      </div>

      <div className="faq-container flex-center w-container">
        <div className="faq-wrapper">
          {items.map((item, index) => (
            <div key={index} className="faq-row">
              <div className="faq-question" onClick={() => toggleAccordion(index)} style={{ cursor: "pointer" }}>
                <h3 className="question">
                  <strong>{item.title}</strong>
                </h3>
                <div className="faq-btn">
                  <img
                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899a5425821785_faq-btn.svg"
                    alt=""
                    style={{
                      transform: openIndex === index ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  />
                </div>
              </div>

              <div
                className="faq-answer"
                style={{
                  maxHeight: openIndex === index ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}
              >
                <p dangerouslySetInnerHTML={{ __html: item.content }} style={{ color: "white" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="faq-overlay"></div>
      </div>
    </div>
  );
};

export default NFCCardsAccordion;
