global.import = { 
    meta: { 
      env: { 
        VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:5000/api'
      } 
    } 
  };
  
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set up Jest DOM matchers
require('@testing-library/jest-dom');

// Polyfill window.alert so tests don't crash
global.alert = jest.fn();