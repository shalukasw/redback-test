import React, { FC, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import styles from './compilation-widget.module.scss';
import errorIcon from 'Assets/Icons/error.svg';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Button from 'react-bootstrap/esm/Button';

import successImg from 'Assets/Images/compile-success.gif';
import loadingImg from 'Assets/Images/compile-loading.gif';
import compileCodeErrorImg from 'Assets/Images/compile-error-code.svg';
import deviceConnectErrorImg from 'Assets/Images/compile-error-connect.svg';

import { RootState } from 'App/Features/Common/Presentation/Store/store';
import Playground from 'App/Features/Playground/Usecase/Playground';
import { Box } from 'Domain/Model/Box';
import { CompilationStatus } from 'Domain/Model/CompilationRequest';
import { useTranslation } from 'react-i18next';
import { IsAppError } from 'App/Features/Common/Repository/Model/common';

enum Steps {
  PortSelection = 'PortSelection',
  Compile = 'Compile',
  Upload = 'Upload',
}

type StepStatus = 'pending' | 'inprogress' | 'completed' | 'failed';

interface IStep {
  name: Steps;
  status: StepStatus;
  messages: {
    completed: string;
    inprogress: string;
    failed: string;
    pending: string;
  };
  troubleShootMessages: string[];
}

type WidgetState = {
  current: Steps | null;
  steps: IStep[];
};

const widgetSteps: WidgetState = {
  current: null,
  steps: [
    {
      name: Steps.PortSelection,
      status: 'pending',
      messages: {
        completed: 'playgroundWizard.port.success',
        inprogress: 'playgroundWizard.port.progress',
        failed: 'playgroundWizard.port.error',
        pending: '',
      },
      troubleShootMessages: [],
    },
    {
      name: Steps.Compile,
      status: 'pending',
      messages: {
        completed: 'playgroundWizard.compile.success',
        inprogress: 'playgroundWizard.compile.progress',
        failed: 'playgroundWizard.compile.error',
        pending: '',
      },
      troubleShootMessages: [],
    },
    {
      name: Steps.Upload,
      status: 'pending',
      messages: {
        completed: 'playgroundWizard.upload.success',
        inprogress: 'playgroundWizard.upload.progress',
        failed: 'playgroundWizard.upload.error',
        pending: '',
      },
      troubleShootMessages: [],
    },
  ],
};

interface Props {
  handleClose: () => void;
  boxInfo: Box;
  port: SerialPort | null;
  code: string;
}

const ProgressWidget: FC<Props> = function ({
  handleClose,
  boxInfo,
  port,
  code,
}) {
  const { t } = useTranslation();
  const [sections, setSections] = useState<WidgetState>({ ...widgetSteps });
  const playgroundState = useSelector((state: RootState) => state.playground);

  const updateSectionStatus = (
    name: Steps,
    status: StepStatus,
    msg = '',
    troubleShotMessages: string[] = [],
  ) => {
    setSections((prev) => {
      const sections: WidgetState = { steps: [], current: prev.current };
      sections.steps = prev.steps.map((section) => {
        if (section.name === name) {
          if (troubleShotMessages.length) {
            section.troubleShootMessages = troubleShotMessages;
          }
          if (msg != '') {
            section.messages[status] = msg;
          }
          return { ...section, status };
        } else {
          return section;
        }
      });
      return sections;
    });
  };

  async function progressSteps() {
    if (sections.current) return;

    sections.current = Steps.PortSelection;

    try {
      // Port Selection
      updateSectionStatus(Steps.PortSelection, 'inprogress');
      if (!port) {
        await Playground.selectPort();
      }
      // todo handle
      updateSectionStatus(Steps.PortSelection, 'completed');

      // Compile
      sections.current = Steps.Compile;
      updateSectionStatus(Steps.Compile, 'inprogress');
      let request = await Playground.compileWorkspace(boxInfo.identifier, code);
      request = await Playground.pollCompileStatus(request.requestId);
      if (request.status == CompilationStatus.completed) {
        updateSectionStatus(Steps.Compile, 'completed');
      } else {
        if (request.errors && request.errors.length) {
          updateSectionStatus(
            Steps.Compile,
            'failed',
            'playgroundWizard.compile.error',
            ['playgroundWizard.common.errorline3'],
          );
          throw { code: '', message: 'playgroundWizard.compile.error' };
        } else if (request.executionError && request.executionError != '') {
          console.error(request.executionError); // todo log this

          updateSectionStatus(
            Steps.Compile,
            'failed',
            'common.errors.tryagain',
            [],
          );

          throw { code: '', message: 'common.errors.tryagain' };
        }
        throw { code: '', message: 'common.errors.tryagain' };
      }

      // Upload to device
      updateSectionStatus(Steps.Upload, 'inprogress');
      sections.current = Steps.Upload;
      // Fetch Binary
      const codeBuffer = await Playground.retrieveCompilerOutput(
        request.requestId,
      );

      if (playgroundState.boxInfo) {
        try {
          const isUploaded = await Playground.uploadToDevice(
            playgroundState.boxInfo,
            codeBuffer,
            port,
          );
          if (isUploaded) {
            updateSectionStatus(Steps.Upload, 'completed');
          } else {
            throw { code: '', message: 'playgroundWizard.upload.error' };
          }
        } catch (err) {
          updateSectionStatus(
            Steps.Upload,
            'failed',
            'playgroundWizard.upload.error',
            [
              'playgroundWizard.common.errorline2',
              'playgroundWizard.common.errorline4',
            ],
          );
        }
      } else {
        // todo log
        throw { code: '', message: 'common.errors.tryagain' };
      }
    } catch (err) {
      if (IsAppError(err)) {
        if (sections.current)
          updateSectionStatus(sections.current, 'failed', err.message);
      } else {
        // todo: push log!
        if (sections.current) updateSectionStatus(sections.current, 'failed');
      }
    }
  }

  useEffect(() => {
    progressSteps();
  }, []);

  const isSuccess = sections.steps.every(
    (section) => section.status === 'completed',
  );
  const hasErrors = sections.steps.some(
    (section) => section.status === 'failed',
  );

  const currentSection = sections.steps.find((section) => {
    if (section.status === 'failed' || section.status === 'inprogress')
      return section;
  });

  return (
    <Container className="mt-4">
      <Row>
        <Col className="g-0 text-l">
          <div className={styles['progress-widget']}>
            {sections.steps.map((step) => (
              <div
                key={step.name}
                style={{
                  visibility: step.status == 'pending' ? 'hidden' : 'visible',
                }}
                className={styles['progress-widget__section']}
              >
                <div>
                  {step.status === 'completed' && (
                    <div>
                      <i className="bi bi-check-circle-fill"></i>{' '}
                      {t(step.messages[step.status])}
                    </div>
                  )}
                  {(step.status === 'inprogress' ||
                    step.status === 'pending') && (
                    <div>
                      <div
                        role="status"
                        className={`spinner-border  spinner-border-sm me-2  ${styles['progress-spinner']}`}
                      ></div>

                      {t(step.messages[step.status])}
                    </div>
                  )}
                  {step.status === 'failed' && (
                    <div
                      className={`${styles['common-failure-msgblock']} align-items-start`}
                    >
                      <Image
                        className={`me-2 ${styles['icon']}`}
                        src={errorIcon}
                      />
                      <div
                        className={`flex-grow ${styles['error-text-container']}`}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: t(step.messages[step.status]),
                          }}
                        ></span>
                        {step.troubleShootMessages.map((msg) => (
                          <div
                            key={msg}
                            className={`mt-3 ${styles['common-failure-msg']}`}
                          >
                            <i className="bi bi bi-1-circle-fill me-1"></i>
                            {t(msg)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {step.status === 'completed' && step.name != Steps.Upload && (
                  <div className={`${styles['step-divider']}`}></div>
                )}
              </div>
            ))}
            <div>
              <Button
                variant="primary"
                className="text-white px-5 mt-3"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        </Col>
        <Col xs="auto" className="g-0">
          <div
            className={`d-flex justify-content-center align-items-center ${styles.flash_container}`}
          >
            {/* Success */}
            {isSuccess && (
              <Image src={successImg} width={380} height={380} alt="party" />
            )}
            {/* Loading */}
            {!(isSuccess || hasErrors) && (
              <Image
                src={loadingImg}
                width={380}
                height={380}
                alt="loading..."
              />
            )}
            {/* Failure  */}
            {hasErrors && currentSection && (
              <div>
                <Image
                  src={
                    currentSection.name == Steps.Compile
                      ? compileCodeErrorImg
                      : deviceConnectErrorImg
                  }
                  width={300}
                  height={300}
                  alt="loading..."
                />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProgressWidget;
