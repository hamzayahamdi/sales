import { createGlobalStyle } from 'styled-components';

const ThemeStyles = createGlobalStyle`
  :root {
    // Light theme variables
    --background: #ffffff;
    --text-primary: #333333;
    --text-secondary: #666666;
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --border-color: #dee2e6;
  }

  [data-theme='dark'] {
    // Dark theme variables
    --background: #1a1a1a;
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
    --primary-color: #0056b3;
    --secondary-color: #545b62;
    --border-color: #2d2d2d;
  }

  body {
    background-color: var(--background);
    color: var(--text-primary);
    transition: all 0.3s ease;
  }
`;

export default ThemeStyles;