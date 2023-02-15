import path from 'path';

export const generateActionName = (filename: string): string => {
  return `${path.dirname(filename).split(path.sep).pop()}.${path.basename(filename).split('.').shift()}`;
};
