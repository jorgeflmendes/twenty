import { ThemeProvider } from '@emotion/react';
import { render, screen, waitFor } from '@testing-library/react';
import { THEME_LIGHT } from 'twenty-ui';
import CSVViewer from './CSVViewer';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({
      id: 'mock-id',
      name: 'mock-name',
    }),
    text: async () =>
      Promise.resolve(`
      id,name
      1,John
      2,Jane
      1,John
    `),
    headers: {
      get: () => 'application/json',
    },
  } as unknown as Response),
);

describe('CSVViewer', () => {
  it('does not show a warning for duplicate keys in CSV', async () => {
    const csvUrl = 'mock-csv-url';

    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    render(
      <ThemeProvider theme={THEME_LIGHT}>
        <CSVViewer documentUrl={csvUrl} />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    expect(consoleWarnSpy).not.toHaveBeenCalledWith(
      expect.stringMatching(/same key/),
    );

    consoleWarnSpy.mockRestore();
  });

  it('renders CSV data correctly', async () => {
    const csvUrl = 'mock-csv-url';

    render(
      <ThemeProvider theme={THEME_LIGHT}>
        <CSVViewer documentUrl={csvUrl} />
      </ThemeProvider>,
    );

    await waitFor(() => {
      const cellsWithOne = screen.getAllByText('1');
      expect(cellsWithOne.length).toBe(2);

      const cellsWithJohn = screen.getAllByText('John');
      expect(cellsWithJohn.length).toBe(2);

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });
});
