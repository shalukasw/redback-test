import reducer, {
  initPlayground,
  saveCode,
  clearCode,
  resetPlayground,
  PlaygroundState,
  Workspace,
} from './PlaygroundSlice';

describe('PlaygroundSlice', () => {
  const BOX_INFO = {
    identifier: 'POLLY_VER1',
    name: 'Bugbox Polly',
    board: 'nano',
    boardDetails: {
      fqbn: 'arduino:avr:nano',
      processor: 'ATmega328P',
      bootloader: 'old',
      baud: 57600,
      protocol: 'stk500v1',
      productId: ['0x6001', '0x7523'],
      signature: ['0x1e', '0x95', '0x0f'],
    },
    blockTemplateName: '',
  };

  const CODE: Workspace = {
    blocks: {
      languageVersion: 0,
      blocks: [
        {
          type: 'comment',
          id: 'y4cL.jZ1yY7wS.o}c{}/',
          x: 43,
          y: 11,
          fields: {
            NAME: 'add comment here',
          },
        },
      ],
    },
  };

  describe('reducer', () => {
    test('should initialize box state correctly', () => {
      const initialState: PlaygroundState = {
        error: null,
        boxInfo: null,
        workspace: undefined,
      };
      const boxInfo = BOX_INFO;

      const nextState = reducer(initialState, initPlayground({ box: boxInfo }));

      expect(nextState).toEqual({
        error: null,
        boxInfo: boxInfo,
        workspace: undefined,
      });
    });

    test('should save code correctly', () => {
      const initialState: PlaygroundState = {
        error: null,
        boxInfo: null,
        workspace: undefined,
      };

      const code: Workspace = CODE;

      const nextState = reducer(initialState, saveCode(code));

      expect(nextState).toEqual({
        error: null,
        boxInfo: null,
        workspace: code,
      });
    });

    test('should clear code correctly', () => {
      const initialState: PlaygroundState = {
        error: null,
        boxInfo: null,
        workspace: {
          blocks: {
            blocks: [
              {
                fields: { NAME: 'add comment here' },
                id: 'y4cL.jZ1yY7wS.o}c{}/',
                type: 'comment',
                x: 43,
                y: 11,
              },
            ],
            languageVersion: 0,
          },
        },
      };

      const nextState = reducer(initialState, clearCode());

      expect(nextState).toEqual({
        error: null,
        boxInfo: null,
        workspace: undefined,
      });
    });

    test('should reset box state correctly', () => {
      const initialState: PlaygroundState = {
        error: null,
        boxInfo: BOX_INFO,
        workspace: CODE,
      };

      const nextState = reducer(initialState, resetPlayground());

      expect(nextState).toEqual({
        error: null,
        boxInfo: null,
        workspace: undefined,
      });
    });
  });

  describe('actions', () => {
    test('should create the initPlayground action correctly', () => {
      const payload = {
        boxInfo: BOX_INFO,
      };
      const action = initPlayground(payload);
      expect(action.type).toEqual('playground/initPlayground');
      expect(action.payload).toEqual(payload);
      expect(action.payload).toHaveProperty('boxInfo', BOX_INFO);
    });

    test('should create the saveCode action correctly', () => {
      const payload = CODE;
      const action = saveCode(payload);
      expect(action.type).toEqual('playground/saveCode');
      expect(action.payload).toEqual(payload);
    });

    test('should create the clearCode action correctly', () => {
      const action = clearCode();
      expect(action.type).toEqual('playground/clearCode');
      expect(action.payload).toBeUndefined();
    });

    test('should create the resetPlayground action correctly', () => {
      const action = resetPlayground();
      expect(action.type).toEqual('playground/reset');
      expect(action.payload).toBeUndefined();
    });
  });
});
