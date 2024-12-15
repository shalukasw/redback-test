import React, { FC, useCallback, useEffect, useRef } from 'react';
import Blockly, { WorkspaceSvg } from 'blockly/core';
import locale from 'blockly/msg/en';
import 'blockly/blocks';
import createWorkspace from 'App/Lib/Blockly/workspace';
import './blockly.css';
import { BlockCreate } from 'blockly/core/events/events';
import { inoGenerator } from 'App/Lib/Blockly/inogen';
import styles from './editor.module.scss';
import Playground from 'App/Features/Playground/Usecase/Playground';
import { Workspace } from '../../ViewModels/PlaygroundSlice';

Blockly.setLocale(locale);

interface Props {
  workspaceRef: React.MutableRefObject<WorkspaceSvg | undefined>;
  onCodeGenerated: (code: string) => void;
}
const Editor: FC<Props> = ({ workspaceRef: workspace, onCodeGenerated }) => {
  const container = useRef<HTMLDivElement>({} as HTMLDivElement);
  const toolbox = useRef<HTMLDivElement>({} as HTMLDivElement);

  useEffect(() => {
    workspace.current = createWorkspace(container.current as HTMLDivElement);
    return () => {
      workspace.current?.dispose();
    };
  }, [workspace, toolbox]);

  const generateCode = useCallback(() => {
    if (workspace.current) {
      const blocks = workspace.current.getAllBlocks(false);
      const hasBlocks = blocks.length !== 0;
      const code = inoGenerator.workspaceToCode(workspace.current);
      onCodeGenerated(hasBlocks ? code : '');
    }
  }, [onCodeGenerated, workspace]);

  const autoSaveBlocks = useCallback(() => {
    if (workspace.current) {
      const state = Blockly.serialization.workspaces.save(
        workspace.current,
      ) as Workspace;
      Playground.saveCode(state);
    }
  }, [workspace]);

  const listenEvents = useCallback(
    (event: BlockCreate) => {
      if (!event.isUiEvent) {
        generateCode();
        autoSaveBlocks();
      }
    },
    [autoSaveBlocks, generateCode],
  );

  useEffect(() => {
    if (workspace.current) {
      workspace.current.addChangeListener(listenEvents);
      return () => {
        workspace.current?.removeChangeListener(listenEvents);
      };
    }
  }, [listenEvents, workspace]);

  useEffect(() => {
    if (workspace && workspace.current) {
      renderCanvasBg(workspace);
      workspace.current.addChangeListener((event: BlockCreate) => {
        // todo BlocklyEvent
        if (
          event.type == Blockly.Events.BLOCK_CHANGE ||
          event.type == Blockly.Events.BLOCK_CREATE ||
          event.type == Blockly.Events.BLOCK_DELETE
        ) {
          renderCanvasBg(workspace);
        }
      });
    }
  }, [workspace]);
  return (
    <>
      <div ref={container} className={styles.workspace} />
    </>
  );
};

function renderCanvasBg(
  workspace: React.MutableRefObject<Blockly.WorkspaceSvg | undefined>,
) {
  if (workspace.current) {
    const workspaceSVG =
      workspace.current.getCanvas().parentElement?.parentElement;

    const toolbox = workspace.current.getToolbox();

    if (workspaceSVG && toolbox) {
      const toolboxWidth = toolbox.getWidth();
      const canvasWidth = workspace.current.getParentSvg().getBBox().width - 20;
      if (workspace.current.getAllBlocks(false).length > 0) {
        workspaceSVG.style.backgroundImage = 'none';
      } else {
        workspaceSVG.style.backgroundImage = 'url("workspace-placeholder.svg")';
        workspaceSVG.style.backgroundRepeat = 'no-repeat';

        let rp = 50; // fixed right padding
        let w = 400; // max image width
        if (canvasWidth - toolboxWidth + 100 > w) {
          // if available space is > 600,
          rp = (canvasWidth - toolboxWidth - 400) / 2; // calculate right padding.
        } else {
          w = canvasWidth - toolboxWidth - 2 * rp; // else calculate width based.
        }
        workspaceSVG.style.backgroundSize = `${w}px auto`;
        workspaceSVG.style.backgroundPosition = `center right ${rp}px`;
      }
    }
  }
}
export default Editor;
