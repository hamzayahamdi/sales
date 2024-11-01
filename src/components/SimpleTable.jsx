import styled from 'styled-components/macro';
import {Table} from 'antd';

const SimpleTable = styled(Table)`
  flex-grow: 1;

  .ant-spin-nested-loading,
  .ant-spin-container,
  .ant-table-empty,
  .ant-table-container,
  .ant-table-content,
  .ant-table-content table {
    height: 100%;
  }

  .ant-table {
    background: transparent;
    border-radius: 0;
    
    table {
      border-radius: 0 !important;
    }
  }

  .ant-table-placeholder {
    background: transparent !important;
  }

  .ant-table-cell,
  .ant-table-container,
  .ant-table-header {
    border-radius: 0 !important;
  }
  
  .ant-table-thead {
    .ant-table-cell {
      padding: 18px 20px 16px;
      background: transparent !important;
      color: var(--label);
      text-transform: uppercase;
      font-weight: 500;
      font-size: 12px;
      height: 50px;
      border-bottom: 1px solid var(--border);

      &:before {
        display: none;
      }

      .wrapper {
        display: flex;
        gap: 10px;
        align-items: center;
      }
    }
  }

  .ant-table-tbody {
    .ant-table-cell {
      border-color: var(--border);
      color: var(--header);
      font-weight: 500;
      font-size: 15px;
      padding: 16px 24px;
      background: transparent !important;
      transition: none !important;
    }
    
    tr:last-of-type .ant-table-cell {
        border-bottom: 0;
    }
  }

  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: none !important;
  }

  .ant-table-column-sorters {
    justify-content: flex-start;
    gap: 8px;

    .ant-table-column-title {
      flex: unset;
    }
    
    .ant-table-column-sorter.ant-table-column-sorter-full {
      color: var(--label);

      .anticon {
        &.active, &:hover {
          color: var(--header);
        }
      }
    }
  }
`;

export default SimpleTable