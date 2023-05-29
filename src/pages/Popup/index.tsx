import React from 'react';
import { createRoot } from 'react-dom/client';

import Popup from './Popup';
import './index.css';

const container = document.getElementById('app-container');
if (!container) {
  console.error("Could not find element with ID 'app-container'");
} else {
  const root = createRoot(container);
  root.render(<Popup />);
}
