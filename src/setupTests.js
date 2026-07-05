// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

Object.defineProperty(window, 'TextEncoder', {
  writable: true,
  value: require('util').TextEncoder,
});

Object.defineProperty(window, 'TextDecoder', {
  writable: true,
  value: require('util').TextDecoder,
});

jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    save: jest.fn(),
    addImage: jest.fn(),
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    splitTextToSize: jest.fn(() => []),
    output: jest.fn(() => ''),
  })),
}));

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({}),
}));
