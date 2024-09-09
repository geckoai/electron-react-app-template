import path from 'path';

export const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://${process.env.HOST}:${process.env.PORT}`
    : `file:///${path.join(__dirname, '..', 'renderer', 'index.html')}`;
