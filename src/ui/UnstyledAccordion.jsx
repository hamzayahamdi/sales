import styled from 'styled-components/macro';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

export const UnstyledAccordion = styled(Accordion)`
  margin: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  color: var(--text) !important;
`;

export const UnstyledAccordionSummary = styled(AccordionSummary)`
  min-height: unset !important;
  padding: 0;
  
  .MuiAccordionSummary-content {
    margin: 0 !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    button {
      will-change: transform;
    }
    
    &.Mui-expanded button {
        transform: rotate(180deg);
    }
  }
`;

export const UnstyledAccordionDetails = styled(AccordionDetails)`
  padding: 0;
`;