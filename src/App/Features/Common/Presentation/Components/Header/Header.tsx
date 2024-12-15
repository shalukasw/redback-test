import React from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import styles from './header.module.scss';
import codePlaygroundImg from 'Assets/Images/join_shape_face.svg';
import logo from 'Assets/Images/bugbox-logo.svg';
import CircleButton from '../Buttons/circle/CircleButton';
import { useTranslation } from 'react-i18next';
import CONSTANTS from '../../../../../../constants';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { RootState } from '../../Store/store';
import { useSelector } from 'react-redux';
import { getFirstLetter } from 'App/Lib/utils';

import UserinfoPopover from 'App/Features/Common/Presentation/Components/GuestUserInfo/GuestUserInfo';

const Header = () => {
  const { t } = useTranslation();
  const currentUser = useSelector((state: RootState) => state.app.user);

  const gotoBotShop = () => {
    window.open(CONSTANTS.BOT_SHOP_URL, '_blank');
  };
  const gotoContactus = () => {
    window.open(CONSTANTS.SUPPORT_URL, '_blank');
  };

  const username = currentUser?.username as string;

  return (
    <Navbar
      bg="light"
      expand="lg"
      className={`sticky-top ${styles.bug_navbar}`}
    >
      <Container fluid>
        <Navbar.Brand href={CONSTANTS.BUGBOX_URL} target="_blank">
          <Image
            src={logo}
            className="m-2"
            alt="Bugbox"
            height={40}
            width={147}
          />
        </Navbar.Brand>
        <div
          className={`${styles.vertical_line} border-2 border-start border-secondary-subtle`}
        ></div>
        <Navbar.Brand>
          <Image
            src={codePlaygroundImg}
            className="m-2"
            height={26}
            width={26}
            alt="Code Playground"
          />
          {t('navItem.codePlayground')}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Item>
              <Button
                className="btn btn-action-outline-secondary"
                size="lg"
                onClick={gotoContactus}
              >
                <i className="bi bi-envelope" style={{ padding: '0px' }}></i>
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button
                className="btn btn-action-outline-primary mx-lg-3"
                size="lg"
                onClick={gotoBotShop}
              >
                <i className="bi bi-cart"></i>
                {t('navItem.botShop')}
              </Button>
            </Nav.Item>
            {currentUser?.guestUserInfo && (
              <Nav.Item>
                <OverlayTrigger
                  placement="bottom"
                  trigger="click"
                  overlay={(props) =>
                    UserinfoPopover({
                      ...props,
                      guestUserInfo: currentUser.guestUserInfo,
                    })
                  }
                  rootClose={true}
                >
                  <span>
                    <CircleButton label={username}>
                      <div
                        className={`bg-secondary text-white ${styles.circle}`}
                      >
                        {getFirstLetter(username)}
                      </div>
                    </CircleButton>
                  </span>
                </OverlayTrigger>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
