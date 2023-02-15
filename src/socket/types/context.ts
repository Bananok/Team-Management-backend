import { Socket } from 'socket.io';

// Models
import { User } from 'models/user.model';
import { Device } from 'models/device.model';

export interface Context {
  user: User;
  device: Device;
  socket: Socket;
  disconnectTimer: NodeJS.Timeout | null;
}
