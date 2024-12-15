import store from 'App/Features/Common/Presentation/Store/store';
import repo, {
  CompileWorkspaceRequest,
} from '../Repository/PlaygroundRespository';
import { Box } from 'Domain/Model/Box';
import {
  CompilationRequest,
  CompilationStatus,
} from 'Domain/Model/CompilationRequest';
import { wait } from 'App/Lib/utils';
import {
  Workspace,
  saveCode,
  clearCode,
} from '../Presentation/ViewModels/PlaygroundSlice';
import Avrgirl from 'avrgirl-arduino';
import { RecordEvent } from 'App/App';
type PortSelectionResponse = {
  success: boolean;
  port: string;
};

const LOG_EVENT_PLAYGROUND_COMPILE = 'PLAYGROUND_COMPILE_EVENT';
const LOG_EVENT_PLAYGROUND_COMPILE_COMPLETED =
  'PLAYGROUND_COMPILE_COMPLETED_EVENT';
const LOG_EVENT_PLAYGROUND_UPLOAD_INIT = 'PLAYGROUND_COMPILE_UPLOAD_INIT';
const LOG_EVENT_PLAYGROUND_UPLOAD_FAILED = 'PLAYGROUND_COMPILE_UPLOAD_FAILED';
const LOG_EVENT_PLAYGROUND_UPLOAD_SUCCESS = 'PLAYGROUND_COMPILE_UPLOAD_SUCCESS';
const LOG_EVENT_PLAYGROUND_SAVE_CODE = 'PLAYGROUND_SAVE_CODE_EVENT';
const LOG_EVENT_PLAYGROUND_CLEAR_CODE = 'PLAYGROUND_CLEAR_CODE_EVENT';

export class PlaygroundUseCases {
  shouldHaveValidUser(): boolean {
    const state = store.getState();
    if (state.app.user) return true;
    return false;
  }

  selectPort(): Promise<PortSelectionResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          port: 'test',
        });
      }, 0);
    });
  }

  compileWorkspace(boxIdentifier: string, src: string) {
    const req: CompileWorkspaceRequest = {
      boxIdentifier: boxIdentifier,
      source: src,
    };
    RecordEvent(LOG_EVENT_PLAYGROUND_COMPILE, { boxIdentifier });
    return repo.compileWorkspace(req);
  }

  async pollCompileStatus(requestId: string): Promise<CompilationRequest> {
    let attempts = 0;
    const waitIntervals = [4, 7, 10, 15];
    let res = await repo.getCompileStatus(requestId);
    while (
      (res.status === CompilationStatus.pending ||
        res.status === CompilationStatus.queued ||
        res.status === CompilationStatus.processing) &&
      attempts <= 20
    ) {
      await wait((attempts < 4 ? waitIntervals[attempts] : 8) * 1000);
      attempts++;
      res = await repo.getCompileStatus(requestId);
    }

    RecordEvent(LOG_EVENT_PLAYGROUND_COMPILE_COMPLETED, {
      attempts,
      status: res.status,
      result: res,
    });

    return res;
  }

  async retrieveCompilerOutput(requestId: string): Promise<ArrayBuffer> {
    return await repo.fetchCompileOutputFile(requestId);
  }

  async uploadToDevice(
    boxInfo: Box,
    data: ArrayBuffer,
    port: SerialPort | null,
  ): Promise<boolean | Error> {
    RecordEvent(LOG_EVENT_PLAYGROUND_UPLOAD_INIT, {});

    return new Promise((resolve, reject) => {
      const avrGirlConfig = {
        board: boxInfo.board,
        port: port,
        debug: false,
        megaDebug: false,
      };

      if (process.env.NODE_ENV !== 'production') {
        // todo move to util method
        avrGirlConfig.debug = true;
        avrGirlConfig.megaDebug = true;
      }

      const avrgirl = new Avrgirl(avrGirlConfig);

      avrgirl.flash(data, (error: Error) => {
        if (error) {
          RecordEvent(LOG_EVENT_PLAYGROUND_UPLOAD_FAILED, { error });
          reject(error);
        } else {
          RecordEvent(LOG_EVENT_PLAYGROUND_UPLOAD_SUCCESS, {});
          resolve(true);
        }
      });
    });
  }

  saveCode(state: Workspace) {
    RecordEvent(LOG_EVENT_PLAYGROUND_SAVE_CODE, {});
    store.dispatch(saveCode(state));
  }

  clearCode() {
    RecordEvent(LOG_EVENT_PLAYGROUND_CLEAR_CODE, {});
    store.dispatch(clearCode());
  }
}

export default new PlaygroundUseCases();
