import apiClient from 'App/Lib/APIClient';

import { CompilationRequest } from 'Domain/Model/CompilationRequest';
import dayjs from 'dayjs';

export type CompileWorkspaceRequest = {
  boxIdentifier: string;
  source: string;
};

export type CompileWorkspaceResponse = CompilationRequest;

export type CompileStatusRequest = {
  coderName: string;
};

export type CompileStatusResponse = CompilationRequest;

export interface IPlaygroundRepository {
  compileWorkspace(
    req: CompileWorkspaceRequest,
  ): Promise<CompileWorkspaceResponse>;
  getCompileStatus(requestId: string): Promise<CompileStatusResponse>;
}

export class PlaygroundRepository implements IPlaygroundRepository {
  async compileWorkspace(
    req: CompileWorkspaceRequest,
  ): Promise<CompileWorkspaceResponse> {
    const srcBlob = new Blob([req.source], { type: 'text/plain' });
    const postBody = new FormData();
    postBody.append('source', srcBlob, 'srcfile');
    postBody.append('boxIdentifier', req.boxIdentifier);

    const response = await apiClient.post<object, CompileWorkspaceResponse>(
      '/api/playground/compile',
      postBody,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    // todo diff types and parser method
    response.createdAt = dayjs(response.createdAt);
    return response;
  }

  async getCompileStatus(requestId: string): Promise<CompileStatusResponse> {
    const response = await apiClient.get<CompileStatusResponse>(
      '/api/playground/compile?id=' + requestId,
    );
    // todo diff types and parser method
    response.createdAt = dayjs(response.createdAt);
    response.completedAt = dayjs(response.completedAt);
    return response;
  }

  async fetchCompileOutputFile(requestId: string): Promise<ArrayBuffer> {
    const response = await apiClient.get<ArrayBuffer>(
      '/api/playground/compile-output?id=' + requestId,
      {
        responseType: 'arraybuffer',
        timeout: 30000,
      },
    );
    return response;
  }
}

export default new PlaygroundRepository();
