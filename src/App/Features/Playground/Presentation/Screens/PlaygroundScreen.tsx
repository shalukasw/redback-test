import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useSelector } from 'react-redux';

import Header from 'App/Features/Common/Presentation/Components/Header/Header';
import Container from 'react-bootstrap/Container';
import Menu from '../Components/Menu/Menu';
import styles from './playground.module.scss';
import Editor from '../Components/Editor/Editor';
import CodePlaceholder from '../Components/CodePlaceholder/CodePlaceholder';
import useModal from 'App/Features/Common/Presentation/Hooks/useModal';

import { RootState } from 'App/Features/Common/Presentation/Store/store';
import Blockly, { WorkspaceSvg } from 'blockly/core';
import { useTranslation } from 'react-i18next';
import { Workspace } from '../ViewModels/PlaygroundSlice';
import Playground from '../../Usecase/Playground';
import { useNotification } from 'App/Features/Common/Presentation/Providers/NotificationProvider';
import { RecordPageView } from 'App/App';
import useDeleteConfirmation from 'App/Features/Common/Presentation/Hooks/useDeleteConfirmation';
import { Spinner } from 'react-bootstrap';

const CodePreview = lazy(() => import('../Components/CodePreview/CodePreview'));
const CompilationWidget = lazy(() => import('./CompilationWidget'));

export default function PlaygroundScreen() {
  RecordPageView();
  const { t } = useTranslation();
  const workspace = useRef<WorkspaceSvg>();
  const { ModalComponent, handleShow, show, handleClose } = useModal();
  const [hasCode, setHasCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [selectedSerialPort, setSerialPort] = useState<SerialPort | null>(null);
  const { addNotification } = useNotification();

  const clearAll = () => {
    if (workspace.current) {
      workspace.current.clear();
      Playground.clearCode();
    }
  };

  const { confirmation: clearAllConfirmation, Modal: ClearAllConfirmation } =
    useDeleteConfirmation(
      t('playground.workspace.clearAllDialogue.title'),
      clearAll,
      t('playground.workspace.clearAllDialogue.body'),
    );

  const playgroundState = useSelector((state: RootState) => state.playground);

  const restoreProgram = (state: Workspace) => {
    if (workspace.current) {
      Blockly.serialization.workspaces.load(state, workspace.current);
    }
  };

  // run this only when
  //    1. There is no code available in workspace
  //    2. There is workspace information available in state
  useEffect(() => {
    if (playgroundState.workspace && !hasCode) {
      restoreProgram(playgroundState.workspace);
    }
  }, [playgroundState.workspace, hasCode]);

  useEffect(() => {
    setHasCode(generatedCode.length > 0);
  }, [generatedCode]);

  function showCodeUploadWizard() {
    handleShow();
  }

  const redo = () => {
    if (workspace.current) {
      workspace.current.undo(true);
    }
  };

  const undo = () => {
    if (workspace.current) {
      workspace.current.undo(false);
    }
  };

  const save = () => {
    if (workspace.current) {
      const state = Blockly.serialization.workspaces.save(
        workspace.current,
      ) as Workspace;
      if (Object.keys(state).length === 0) {
        addNotification(t('playground.nothingToSave'), 'info');
        return;
      }

      Playground.saveCode(state);
      addNotification(t('playground.workspaceSaved'), 'success');
    }
  };

  return (
    <>
      <Header />

      <Menu
        handlePortSelection={setSerialPort}
        onPublishButtonClick={showCodeUploadWizard}
        undo={undo}
        redo={redo}
        clearAll={clearAllConfirmation}
        save={save}
      />
      <Container fluid className={styles.playground}>
        <Row>
          <Col className="g-0">
            <Editor
              workspaceRef={workspace}
              onCodeGenerated={setGeneratedCode}
            />
          </Col>

          <Col className={`bg-secondary p-0`} xs="auto">
            {hasCode ? (
              <Suspense fallback={<Spinner />}>
                <CodePreview code={generatedCode} />
              </Suspense>
            ) : (
              <CodePlaceholder />
            )}
          </Col>
        </Row>
      </Container>
      <ModalComponent
        show={show}
        handleClose={handleClose}
        title={t('playgroundWizard.title')}
        dialogClassName="w80"
        backdrop="static"
        keyboard={false}
        headerClassNames="border-0 p-5 pb-2"
        bodyClassNames="px-5 pb-5"
        footerClassNames="border-0 justify-content-start px-5"
      >
        {playgroundState.boxInfo && (
          <Suspense fallback={<Spinner />}>
            <CompilationWidget
              code={generatedCode}
              port={selectedSerialPort}
              boxInfo={playgroundState.boxInfo}
              handleClose={handleClose}
            />
          </Suspense>
        )}
      </ModalComponent>
      <ClearAllConfirmation />
    </>
  );
}
