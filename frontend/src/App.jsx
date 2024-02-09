import * as React from 'react';
import ProductsGrid from './ProductsGrid.jsx';
import { HashRouter, Route, Routes } from 'react-router-dom';
import ProductSelect from './ProductsSelect.jsx';

const App = () => (
  <HashRouter>
    <Routes>
      <Route
        exact
        path="/"
        element={<ProductsGrid />}
      />
      <Route
        exact
        path="/combo"
        element={<ProductSelect />}
      />
    </Routes>
  </HashRouter>
);

export default App;