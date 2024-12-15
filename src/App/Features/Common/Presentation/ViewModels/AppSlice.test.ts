import { coderJoined, AppSlice, AppState } from './AppSlice';

describe('AppSlice', () => {
  describe('reducer', () => {
    test('should handle coderJoined', () => {
      const initialState: AppState = {
        user: null,
        current: 'LoggedOff',
      };

      const newUser = {
        id: 1,
        name: 'Minion Bob',
      };

      const action = {
        type: coderJoined.type,
        payload: newUser,
      };

      const nextState = AppSlice.reducer(initialState, action);

      expect(nextState.current).toBe('LoggedIn');
      expect(nextState.user).toBe(newUser);
    });
  });

  describe('actions', () => {
    test('should create a coderJoined action', () => {
      const newUser = {
        id: 1,
        name: 'Minion Bob',
      };

      const expectedAction = {
        type: coderJoined.type,
        payload: newUser,
      };

      expect(coderJoined(newUser)).toEqual(expectedAction);
    });
  });
});
