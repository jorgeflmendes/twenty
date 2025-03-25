import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

const StyledCsvTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme?.background?.primary || '#fff'};
  color: ${({ theme }) => theme?.font?.color?.primary || '#000'};
`;

const StyledCsvTd = styled.td`
  border: 1px solid ${({ theme }) => theme?.border?.color || '#ccc'};
  padding: 8px;
`;

const CSVViewer = ({ documentUrl }) => {
  const [data, setData] = useState([]);
  const theme = useTheme() || {};

  useEffect(() => {
    const fetchCSV = async () => {
      const response = await fetch(documentUrl);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const csvText = await response.text();
      const parsed = Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
      });

      setData(parsed.data);
    };

    fetchCSV();
  }, [documentUrl]);

  return (
    <StyledCsvTable theme={theme}>
      <tbody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, colIndex) => (
                <StyledCsvTd key={`cell-${rowIndex}-${colIndex}`} theme={theme}>
                  {cell}
                </StyledCsvTd>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <StyledCsvTd
              colSpan="100%"
              theme={theme}
              style={{ textAlign: 'center' }}
            >
              No data available
            </StyledCsvTd>
          </tr>
        )}
      </tbody>
    </StyledCsvTable>
  );
};

CSVViewer.propTypes = {
  documentUrl: PropTypes.string.isRequired,
};

export default CSVViewer;
