import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import { Row, Col, Spinner, OverlayTrigger } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './JoinScreen.module.css';
import faceshape from 'Assets/Images/join_shape_face.svg';
import bg from 'Assets/Images/join_bg_bots_lg.png';
import logo from 'Assets/Images/bugbox-logo.svg';
import { useNotification } from 'App/Features/Common/Presentation/Providers/NotificationProvider';
import UserinfoPopover from 'App/Features/Common/Presentation/Components/GuestUserInfo/GuestUserInfo';
import { RootState } from 'App/Features/Common/Presentation/Store/store';
import JoinPlaygroundUseCase, {
  API_ERROR_NAME_NOT_FOUND,
  API_ERROR_NAME_DUPLICATE,
} from '../../Usecase/JoinPlayground';
import { RecordPageView } from 'App/App';
import { IsAppError } from 'App/Features/Common/Repository/Model/common';
import { IGuestCoder } from 'Domain/Model/User';

type StateName =
  | 'Uninitialized'
  | 'NoName'
  | 'userNameVerify'
  | 'UserNameLoaded'
  | 'UserNameRegenerated'
  | 'CoderSelected';

type JoinPlaygroundState = {
  current: StateName;
  status: 'loading' | 'active' | 'error';
  generatedCoder: IGuestCoder | null;
  error: string | null;
};

export default function JoinScreen() {
  RecordPageView();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [state, setState] = useState<JoinPlaygroundState>({
    current: 'Uninitialized',
    status: 'loading',
    generatedCoder: null,
    error: null,
  });

  const loginState = useSelector((state: RootState) => state.app.current);
  const currentUser = useSelector((state: RootState) => state.app.user);

  const gotoNextState = (coder: IGuestCoder | null) => {
    let nextState: StateName = 'Uninitialized';

    switch (state.current) {
      case 'Uninitialized':
        nextState = coder ? 'UserNameLoaded' : 'NoName';
        break;
      case 'NoName':
        nextState = 'userNameVerify';
        break;
      case 'UserNameLoaded':
      case 'UserNameRegenerated':
      case 'userNameVerify':
      default:
        nextState = coder ? 'UserNameRegenerated' : 'CoderSelected';
        break;
    }

    setState({
      ...state,
      current: nextState,
      status: 'active',
      generatedCoder: coder,
    });
  };

  useEffect(() => {
    if (state.current == 'Uninitialized') {
      if (currentUser) {
        gotoNextState(currentUser.guestUserInfo);
      } else {
        gotoNextState(null);
      }
    }
  }, []);

  useEffect(() => {
    if (state.current == 'CoderSelected' && loginState == 'LoggedIn') {
      navigate('/playground');
    }
  }, [state, loginState, navigate]);

  const triggerGenerateCoderName = () => {
    JoinPlaygroundUseCase.generateNewCoder()
      .then((res) => {
        gotoNextState(res.coder);
      })
      .catch(() => {
        addNotification(t('join.error.creatingName'), 'danger');
        state.error = t('join.error.creatingName');
      });
  };

  const goToPlay = () => {
    if (state.generatedCoder) {
      JoinPlaygroundUseCase.coderSelected(state.generatedCoder, currentUser?.id)
        .then(() => {
          gotoNextState(null);
        })
        .catch((err) => {
          if (
            IsAppError(err) &&
            (err.code == API_ERROR_NAME_NOT_FOUND ||
              err.code == API_ERROR_NAME_DUPLICATE)
          ) {
            addNotification(t('join.error.joiningNoName'), 'danger');
          } else {
            addNotification(t('join.error.joining'), 'danger');
          }
        });
    }
  };

  const CoderNameWithInfo = () => {
    if (state.generatedCoder) {
      return (
        <div className={styles.usernameBlock}>
          <label>{state.generatedCoder?.name}</label>
          {state.generatedCoder && (
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              overlay={(props) =>
                UserinfoPopover({
                  ...props,
                  guestUserInfo: state.generatedCoder as IGuestCoder,
                })
              }
              rootClose={true}
            >
              <a href="#">
                <i className="bi bi-info-circle"></i>
              </a>
            </OverlayTrigger>
          )}
        </div>
      );
    }
  };

  return (
    <>
      <section className="vh-100 overflow-auto">
        {state.current == 'Uninitialized' ||
          (state.status == 'loading' && (
            // todo: Global overlay
            <div
              className={`d-flex opacity-50 position-fixed top-0 vh-100 vw-100 justify-content-center align-items-center h-100 ${styles.overlay}`}
            >
              <Spinner
                animation="border"
                variant="primary"
                role="status"
              ></Spinner>
            </div>
          ))}
        <Container fluid className={`h-100 text-center`}>
          <Row className="align-items-center pt-md-4">
            <Col md={{ span: 7 }} sm={{ span: 6 }}>
              <Image fluid src={bg}></Image>
            </Col>
            <Col md={{ span: 5 }} sm={{ span: 6 }}>
              <div className={`${styles.formContainer}`}>
                <div
                  className={`d-flex shadow-lg border justify-content-center ${styles.form}`}
                >
                  <Stack className="align-items-center pb-4">
                    <img
                      className={`mx-auto mb-4`}
                      src={faceshape}
                      width={64}
                      height={56}
                      alt="face shape"
                    />
                    <h5
                      className="fw-semibold text-wrap mx-auto pb-3"
                      style={{ width: '12rem' }}
                    >
                      {t('join.welcome')}
                    </h5>
                    {state.current == 'NoName' ? (
                      <div className="d-flex flex-column">
                        <div
                          style={{ visibility: 'hidden' }}
                          className={styles.usernameBlock}
                        >
                          {' '}
                          A
                        </div>
                        <Form.Text>{t('join.actionLabel')}</Form.Text>
                        <Button
                          type="submit"
                          className="btn btn-primary btn-lg mt-2"
                          onClick={triggerGenerateCoderName}
                        >
                          {t('join.btnCreateUserName')}
                        </Button>
                      </div>
                    ) : null}

                    {state.current == 'userNameVerify' ? (
                      <div className="d-flex flex-column">
                        {state.error != '' ? (
                          <Form.Text>{t('join.userNameLabel')}</Form.Text>
                        ) : (
                          <Form.Text>{t('join.error.creatingName')}</Form.Text>
                        )}
                        {CoderNameWithInfo()}
                        <Button
                          type="submit"
                          className="btn btn-primary btn-lg mt-2"
                          variant="bugbox"
                          onClick={goToPlay}
                        >
                          {t('join.btnGotoPlayground')}
                        </Button>
                      </div>
                    ) : null}

                    {state.current == 'UserNameLoaded' &&
                    state.generatedCoder ? (
                      <div className="d-flex flex-column">
                        <Form.Text>{t('join.useuserNameLabel')}</Form.Text>
                        {CoderNameWithInfo()}
                        <Button
                          type="submit"
                          className="btn mt-2"
                          size="lg"
                          variant="primary"
                          onClick={goToPlay}
                        >
                          {t('join.btnGotoPlayground')}
                        </Button>

                        <div className="mt-auto d-flex flex-column pt-3">
                          <Form.Text>{t('join.userNameNotYou')}</Form.Text>

                          <Button
                            type="submit"
                            className="btn mt-2"
                            size="lg"
                            variant="outline-primary"
                            onClick={triggerGenerateCoderName}
                          >
                            {t('join.btnCreateUserName')}
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {state.current == 'UserNameRegenerated' ? (
                      <div className="d-flex flex-column">
                        <Form.Text>{t('join.msgNewNameCreated')}</Form.Text>
                        {CoderNameWithInfo()}
                        <Button
                          type="submit"
                          className="btn mt-2"
                          size="lg"
                          variant="primary"
                          onClick={goToPlay}
                        >
                          {t('join.btnGotoPlayground')}
                        </Button>
                      </div>
                    ) : null}

                    <img
                      className="mx-auto mt-auto"
                      src={logo}
                      width="175px"
                      height="48px"
                      alt="face shape"
                    />
                  </Stack>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
