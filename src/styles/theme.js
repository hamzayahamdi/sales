import {createGlobalStyle} from 'styled-components';
import theme from 'styled-theming';

const ThemeStyles = createGlobalStyle`
  :root {
    --body: ${theme('theme', {
      light: 'var(--body-light)',
      dark: 'var(--body-dark)'
    })};
    --widget: ${theme('theme', {
        light: 'var(--widget-light)',
        dark: 'var(--widget-dark)'
    })};
    --header: ${theme('theme', {
        light: 'var(--header-light)',
        dark: 'var(--header-dark)'
    })};
    --text: ${theme('theme', {
        light: 'var(--text-light)',
        dark: 'var(--text-dark)'
    })};
    --label: ${theme('theme', {
        light: 'var(--label-light)',
        dark: 'var(--label-dark)'
    })};
    --border: ${theme('theme', {
        light: 'var(--border-light)',
        dark: 'var(--border-dark)'
    })};
    --input-focus-border: ${theme('theme', {
      light: 'var(--sidebar)',
      dark: 'var(--turquoise)'
    })};
    --input-bg: ${theme('theme', {
        light: 'var(--header-dark)',
        dark: 'transparent'
    })};
    --tick: ${theme('theme', {
        light: 'var(--label)',
        dark: 'var(--border-light)'
    })};
    --cartesian-grid: ${theme('theme', {
        light: 'var(--text-dark)',
        dark: 'var(--label-light)'
    })};
    --sidebar: ${theme('theme', {
        light: 'var(--sidebar-light)',
        dark: 'var(--sidebar-dark)'
    })};
    --logo-icon: ${theme('theme', {
        light: '#FAF8F0',
        dark: '#DEE4DF'
    })};
    --heatmap-darkest: ${theme('theme', {
        light: 'var(--sidebar-light)',
        dark: 'var(--heatmap-max-dark)'
    })};
    --page: ${theme('theme', {
        light: 'var(--page-light)',
        dark: '#1D1D1D'
    })};
    --scrollbar: ${theme('theme', {
        light: '#dee4df',
        dark: 'var(--border)'
    })};
  }
`;

export default ThemeStyles