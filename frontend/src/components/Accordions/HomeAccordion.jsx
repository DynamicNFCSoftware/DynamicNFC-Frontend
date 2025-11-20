import { useState } from "react";

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="section_faq">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large">
            <div className="faq_comp">
              <h2 className="heading-style-h5">Frequently asked questions</h2>
              <div className="w-dyn-list">
                <div role="list" className="faq_list w-dyn-items">
                  {items.map((item, index) => (
                    <div key={index} role="listitem" className="w-dyn-item">
                      <div className="accordion-item---brix accordion-1---brix">
                        <div
                          className="accordion-trigger---brix"
                          onClick={() => toggleAccordion(index)}
                          style={{ cursor: "pointer" }}
                        >
                          <h3 className="text-size-intermediate text-weight-medium text-color-mildblack">
                            {item.title}
                          </h3>
                          <div className="accordion-arrow-wrap---brix">
                            <div className="libraries-faq_icon w-embed">
                              {/* SVG icon */}
                              <svg
                                width="100%"
                                height="100%"
                                viewBox="0 0 19 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  transform:
                                    openIndex === index
                                      ? "rotate(45deg)"
                                      : "rotate(0deg)",
                                  transition: "transform 0.3s",
                                }}
                              >
                                <path
                                  d="M18.125 9.5C18.125 9.69062 18.0493 9.87344 17.9145 10.0082C17.7797 10.143 17.5969 10.2188 17.4062 10.2188H10.2188V17.4062C10.2188 17.5969 10.143 17.7797 10.0082 17.9145C9.87344 18.0493 9.69062 18.125 9.5 18.125C9.30938 18.125 9.12656 18.0493 8.99177 17.9145C8.85698 17.7797 8.78125 17.5969 8.78125 17.4062V10.2188H1.59375C1.40313 10.2188 1.22031 10.143 1.08552 10.0082C0.950725 9.87344 0.875 9.69062 0.875 9.5C0.875 9.30938 0.950725 9.12656 1.08552 8.99177C1.22031 8.85698 1.40313 8.78125 1.59375 8.78125H8.78125V1.59375C8.78125 1.40313 8.85698 1.22031 8.99177 1.08552C9.12656 0.950725 9.30938 0.875 9.5 0.875C9.69062 0.875 9.87344 0.950725 10.0082 1.08552C10.143 1.22031 10.2188 1.40313 10.2188 1.59375V8.78125H17.4062C17.5969 8.78125 17.7797 8.85698 17.9145 8.99177C18.0493 9.12656 18.125 9.30938 18.125 9.5Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div
                          className="accordion-content---brix"
                          style={{
                            maxHeight: openIndex === index ? "500px" : "0",
                            overflow: "hidden",
                            transition: "max-height 0.3s ease",
                          }}
                        >
                          <div className="text-size-regular pad-down-1rem w-richtext">
                            <p dangerouslySetInnerHTML={{ __html: item.content }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
