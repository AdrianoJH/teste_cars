import CarList from "../components/CarList";
import "../styles/global.scss";
import React from "react";

function HomePage() {
  return (
    <React.StrictMode>
      <CarList />
    </React.StrictMode>
  );
}

export default HomePage;
