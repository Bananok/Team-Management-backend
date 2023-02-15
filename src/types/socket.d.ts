import { RequestContext } from 'api/types/request-context';

declare global {
  namespace SocketIO {
    export interface Socket {
      request: {
        context: RequestContext;
        headers: {
          [headerName: string]: string;
        };
      } & any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }
}
