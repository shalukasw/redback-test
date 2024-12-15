import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import useDeleteConfirmation from './useDeleteConfirmation';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

describe('useDeleteConfirmation', () => {
  test('should call the callback when confirmation is triggered', () => {
    const callback = jest.fn();
    const TestComponent = () => {
      const { confirmation, Modal } = useDeleteConfirmation(
        'Delete Item',
        callback,
        'Are you sure you want to delete this item?',
      );

      return (
        <div>
          <button onClick={confirmation}>Open Modal</button>
          <Modal />
        </div>
      );
    };

    const { getByText } = render(<TestComponent />);
    fireEvent.click(getByText('Open Modal'));
    fireEvent.click(getByText('common.labels.yes'));

    expect(callback).toHaveBeenCalled();
    expect(callback).toBeCalledTimes(1);
  });

  test('should close the modal when cancel is clicked', () => {
    const callback = jest.fn();
    const TestComponent = () => {
      const { confirmation, Modal } = useDeleteConfirmation(
        'Delete Item',
        callback,
        'Are you sure you want to delete this item?',
      );

      return (
        <div>
          <button onClick={confirmation}>Open Modal</button>
          <Modal />
        </div>
      );
    };

    const { getByText, queryByText } = render(<TestComponent />);
    fireEvent.click(getByText('Open Modal'));
    expect(
      queryByText('Are you sure you want to delete this item?'),
    ).toBeInTheDocument();
    expect(queryByText('Delete Item')).toBeInTheDocument();

    fireEvent.click(getByText('common.labels.cancel'));

    expect(
      queryByText('Are you sure you want to delete this item?'),
    ).not.toBeInTheDocument();
    expect(queryByText('Delete Item')).not.toBeInTheDocument();
  });

  test('should not render description when null', () => {
    const callback = jest.fn();
    const TestComponent = () => {
      const { confirmation, Modal } = useDeleteConfirmation(
        'Delete Item',
        callback,
        null,
      );

      return (
        <div>
          <button onClick={confirmation}>Open Modal</button>
          <Modal />
        </div>
      );
    };

    const { queryByText, getByText } = render(<TestComponent />);
    fireEvent.click(getByText('Open Modal'));

    expect(queryByText('Delete Item')).toBeInTheDocument();
    expect(
      queryByText('Are you sure you want to delete this item?'),
    ).not.toBeInTheDocument();
  });
});
