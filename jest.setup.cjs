require('@testing-library/jest-dom');
global.alert = jest.fn();

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;