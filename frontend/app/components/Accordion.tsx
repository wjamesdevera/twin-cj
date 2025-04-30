"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./accordion.module.scss";

interface AccordionItem {
  title: React.ReactNode;
  content: React.ReactNode;
  required?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  initialOpenIndex?: number; // the index of the item that's initially opened
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  initialOpenIndex = null,
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selections, setSelections] = useState<{ [key: number]: boolean }>({});
  const contentRefs = useRef<HTMLDivElement[]>([]);
  const itemRefs = useRef<HTMLDivElement[]>([]);

  // used to open d accordion item that's specified in initialOpenIndex ^^
  useEffect(() => {
    if (initialOpenIndex !== null) {
      const timer = setTimeout(() => {
        setActiveIndex(initialOpenIndex);
        setTimeout(() => {
          document.getElementById("booking-accordion")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 500);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [initialOpenIndex]);

  const handleSelection = (index: number) => {
    setSelections((prev) => ({ ...prev, [index]: true }));
  };

  const toggleAccordion = (index: number) => {
    if (items[index].required && !selections[index]) {
      return;
    }

    setActiveIndex(activeIndex === index ? null : index);

    setTimeout(() => {
      itemRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 500);
  };

  return (
    <div className={`${styles.accordion} ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles.accordionItem} ${
            activeIndex === index ? styles.active : ""
          }`}
          ref={(el) => {
            if (el) itemRefs.current[index] = el;
          }}
        >
          <div
            className={styles.accordionHeader}
            onClick={() => toggleAccordion(index)}
          >
            <h3>{item.title}</h3>
            <span>{activeIndex === index ? "-" : "+"}</span>
          </div>

          <div
            className={styles.accordionContent}
            ref={(el) => {
              if (el) contentRefs.current[index] = el;
            }}
            style={{
              maxHeight:
                activeIndex === index
                  ? contentRefs.current[index]?.scrollHeight + "px"
                  : "0px",
              transition: "max-height 0.7s ease-in-out",
            }}
          >
            <div onChange={() => handleSelection(index)}>{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
