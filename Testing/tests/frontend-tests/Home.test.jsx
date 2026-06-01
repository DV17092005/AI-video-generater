import {
 render,
 screen
} from
"@testing-library/react";

/** @jest-environment jsdom */
// Mock CSS imports to avoid parsing CSS in Jest
jest.mock('../../../frontend/styles.css', () => ({}));

import '@testing-library/jest-dom';

import App from "../../../frontend/App";

test(
 "renders title",
 () => {

  render(<App />);

  expect(
   screen.getByText(
    /Build stunning short videos from text, images, and voice./i
   )
  ).toBeInTheDocument();
 }
);