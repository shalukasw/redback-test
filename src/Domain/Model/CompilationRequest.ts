import { Dayjs } from 'dayjs';
import { Box } from '../Model/Box';

export enum CompilationStatus {
  pending = 'pending',
  queued = 'queued',
  processing = 'processing',
  failed = 'failed',
  completed = 'completed',
  terminated = 'terminated',
}

export interface CompilationRequest {
  requestId: string;
  status: CompilationStatus;
  createdAt: Dayjs;
  completedAt: Dayjs;
  userId: string;
  queueMessageId: string;
  // assets: {};
  BoxInfo: Box;
  errors: string[]; // any compile errors (o/p of the compiler)
  executionError: string; // any runtime exceptions/errors during the compilation
}
