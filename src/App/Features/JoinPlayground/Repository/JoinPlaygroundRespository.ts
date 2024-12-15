import apiClient from 'App/Lib/APIClient';
import { Box } from 'Domain/Model/Box';

import { IGuestCoder, IUser } from 'Domain/Model/User';

export type GenerateCoderNameResponse = {
  coder: IGuestCoder;
};

export type JoinWithCoderNameRequest = {
  coderName: string;
  userId?: string;
};

export type JoinWithCoderNameResponse = {
  coder: IUser;
  playgroundInfo: {
    box: Box;
  };
};

export interface IJoinPlaygroundRepository {
  generateNewName(): Promise<GenerateCoderNameResponse>;
  joinWithCodername(
    coderName: string,
    userId: string | undefined,
  ): Promise<JoinWithCoderNameResponse>;
}

export class JoinPlaygroundRepository implements IJoinPlaygroundRepository {
  async generateNewName(): Promise<GenerateCoderNameResponse> {
    const response = await apiClient.post<object, GenerateCoderNameResponse>(
      '/coder/generate',
      {},
    );
    return response;
  }

  async joinWithCodername(
    name: string,
    userId: string | undefined,
  ): Promise<JoinWithCoderNameResponse> {
    const req: JoinWithCoderNameRequest = { coderName: name };
    if (userId && userId != '') {
      req.userId = userId;
    }

    const response = await apiClient.post<
      JoinWithCoderNameRequest,
      JoinWithCoderNameResponse
    >('/playground/new', req);
    return response;
  }
}

export default new JoinPlaygroundRepository();
