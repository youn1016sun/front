import React from "react";
import "../styles/homepage.css";

const HomeSection: React.FC = () => {
  return (
    <section className="section">
      <div className="mascara">
        <h3 className="texto-1">알고리뷰</h3>
        <div className="square"></div>
      </div>
      <h3 className="texto-2">알고리뷰</h3>
    </section>
  );
};

export default HomeSection;