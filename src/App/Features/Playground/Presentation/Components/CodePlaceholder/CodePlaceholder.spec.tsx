import React from 'react';
import { render } from '@testing-library/react';
import CodePlaceholder from './CodePlaceholder';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));
describe('CodePlaceholder', () => {
  test('displays the correct title text', () => {
    const { getByText } = render(<CodePlaceholder />);
    const titleElement = getByText('playground.codePreviewPlaceholder');
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the code placeholders', () => {
    const { container } = render(<CodePlaceholder />);
    const skeletons = container.getElementsByClassName(
      'react-loading-skeleton',
    );
    expect(skeletons).toHaveLength(13);
  });
});
