import store from 'App/Features/Common/Presentation/Store/store';
import { coderJoined } from 'App/Features/Common/Presentation/ViewModels/AppSlice';
import {
  initPlayground,
  resetPlayground,
} from 'App/Features/Playground/Presentation/ViewModels/PlaygroundSlice';
import { IGuestCoder } from 'Domain/Model/User';
import repo, {
  GenerateCoderNameResponse,
} from '../Repository/JoinPlaygroundRespository';

import { RecordEvent } from 'App/App';

const LOG_EVENT_PLAYGROUND_GENERATE_CODER = 'PLAYGROUND_GENERATE_CODER_EVENT';
const LOG_EVENT_PLAYGROUND_JOIN = 'PLAYGROUND_JOIN_EVENT';

export const API_ERROR_NAME_NOT_FOUND = 'NAME_NOT_FOUND';
export const API_ERROR_NAME_DUPLICATE = 'NAME_DUPLICATE';

export class JoinPlaygroundUseCase {
  async generateNewCoder(): Promise<GenerateCoderNameResponse> {
    RecordEvent(LOG_EVENT_PLAYGROUND_GENERATE_CODER, {});
    const coder = await repo.generateNewName();
    store.dispatch(resetPlayground());
    return coder;
  }

  async coderSelected(coder: IGuestCoder, userId: string | undefined) {
    RecordEvent(LOG_EVENT_PLAYGROUND_JOIN, {});

    const res = await repo.joinWithCodername(coder.name, userId);

    store.dispatch(initPlayground(res.playgroundInfo));
    store.dispatch(coderJoined(res.coder));
  }
}

export default new JoinPlaygroundUseCase();
