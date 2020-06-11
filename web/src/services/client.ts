import { createDfuseClient, DfuseClient } from '@dfuse/client';

const client = createDfuseClient({
  apiKey: 'web_0123456789abcdef',
  authUrl: 'null://',
  network: 'localhost:8080',
  secure: false,
});

export const getDfuseClient = (): DfuseClient => client;
