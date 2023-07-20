import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ExpandedCard from "./Components/ExpandedCard.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="" element={<App />} />
      <Route
          path="pokemons/:id"
          element={<ExpandedCard />}
        />
    </Routes>
  </BrowserRouter>
</React.StrictMode>
)
