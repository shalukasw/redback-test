import React from 'react';
import { render, fireEvent, renderHook, waitFor } from '@testing-library/react';
import useModal, { Props } from './useModal';

describe('useModal', () => {
  let handleCloseMock: jest.Mock;
  let props: Props;

  beforeEach(() => {
    handleCloseMock = jest.fn();
    props = {
      show: false,
      handleClose: handleCloseMock,
      children: 'Modal Content',
      title: 'Modal Title',
      footer: () => <div>Modal Footer</div>,
      headerClassNames: 'header-class',
      bodyClassNames: 'body-class',
      footerClassNames: 'footer-class',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns the expected properties and methods', () => {
    const { result } = renderHook(() => useModal());
    const { ModalComponent, handleShow, handleClose, show } = result.current;

    expect(typeof handleShow).toBe('function');
    expect(typeof handleClose).toBe('function');
    expect(typeof ModalComponent).toBe('function');
    expect(show).toBe(false);
  });

  test('ModalComponent renders the modal with the correct props', () => {
    const { result } = renderHook(() => useModal());
    const { ModalComponent } = result.current;

    const { getByText, getByRole } = render(
      <ModalComponent {...props} show={true} />,
    );

    const modalTitle = getByText('Modal Title');
    const modalContent = getByText('Modal Content');
    const modalFooter = getByText('Modal Footer');
    const modal = getByRole('dialog');

    const modalHeader = modal.querySelector('.header-class');
    const modalBody = modal.querySelector('.body-class');
    const modalFooterElement = modal.querySelector('.footer-class');

    expect(modalTitle).toBeInTheDocument();
    expect(modalContent).toBeInTheDocument();
    expect(modalFooter).toBeInTheDocument();
    expect(modalHeader).toBeInTheDocument();
    expect(modalBody).toBeInTheDocument();
    expect(modalFooterElement).toBeInTheDocument();
  });

  test('ModalComponent calls handleClose when closed', () => {
    const { result } = renderHook(() => useModal());
    const { ModalComponent } = result.current;

    const { getByRole } = render(
      <ModalComponent {...props} show={true} closeButton />,
    );

    const modal = getByRole('dialog');
    const closeButton = modal.querySelector('.btn-close');
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton as Element);
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  test('ModalComponent should not have close button', () => {
    const { result } = renderHook(() => useModal());
    const { ModalComponent } = result.current;

    const { getByRole } = render(
      <ModalComponent {...props} show={true} closeButton={false} />,
    );

    const modal = getByRole('dialog');

    const closeButton = modal.querySelector('.btn-close');

    expect(closeButton).toBeNull();
  });

  test('should render ModalComponent when handleShow is called', () => {
    const TestComponent = () => {
      const { handleShow, show, ModalComponent } = useModal();

      return (
        <div>
          <button onClick={handleShow}>Open Modal</button>
          <ModalComponent {...props} show={show} />
        </div>
      );
    };

    const { getByText, queryByRole, unmount } = render(<TestComponent />);

    expect(queryByRole('dialog')).toBeNull();

    fireEvent.click(getByText('Open Modal'));

    expect(queryByRole('dialog')).toBeInTheDocument();
    unmount();
  });

  test('should hide ModalComponent when handleShow is called', async () => {
    const TestComponent = () => {
      const { handleClose, show, handleShow, ModalComponent } = useModal();

      return (
        <div>
          <button onClick={handleShow}>Open Modal</button>
          <button onClick={handleClose}>Close Modal</button>
          <ModalComponent {...props} show={show} />
        </div>
      );
    };

    const { getByText, queryByRole, unmount } = render(<TestComponent />);

    fireEvent.click(getByText('Open Modal'));
    expect(queryByRole('dialog')).toBeInTheDocument();

    fireEvent.click(getByText('Close Modal'));

    await waitFor(() => {
      expect(queryByRole('dialog')).not.toBeInTheDocument();
    });
    unmount();
  });
});
