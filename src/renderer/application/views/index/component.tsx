import { Button } from '@packages/components';
import { sendMessage } from './ipc';

export const Component = () => {
  return (
    <div style={{ background: 'red', width: '100vw', height: '100vh' }}>
      333ddfssdsas
      <Button
        children="text"
        onClick={() => {
          sendMessage({ type: 'xx', msg: 'Hello World' });
        }}
      />
    </div>
  );
};
