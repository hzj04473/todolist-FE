import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// API 모킹
jest.mock('./utils/api', () => ({
  get: jest.fn(() =>
    Promise.resolve({
      status: 200,
      data: { data: [] },
    })
  ),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('App Component', () => {
  it('matches snapshot', async () => {
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
