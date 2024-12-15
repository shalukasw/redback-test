import React from 'react';
import { Popover } from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/esm/Overlay';

import { IGuestCoder } from 'Domain/Model/User';

interface Props extends OverlayInjectedProps {
  guestUserInfo: IGuestCoder;
}

const UserinfoPopover = (props: Props) => {
  const { guestUserInfo, ...overlayProps } = props;

  return (
    <Popover {...overlayProps} id="popover-basic">
      <Popover.Header as="h3">{guestUserInfo.name}</Popover.Header>
      <Popover.Body>
        <p>
          {guestUserInfo?.description}
          {guestUserInfo?.link && (
            <a href={guestUserInfo?.link} rel="noreferrer" target="_blank">
              Know More
            </a>
          )}
        </p>
      </Popover.Body>
    </Popover>
  );
};

export default UserinfoPopover;
