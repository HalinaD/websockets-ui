import { registerPlayer } from '../playerManager';
import WebSocket from 'ws';

export function handleRegistration(
  ws: WebSocket,
  data: { type: string; data: string; id: number },
) {
  let response;
  if (data.type === 'reg') {
    response = {};
    try {
      const registrationData = JSON.parse(data.data);
      if (
        typeof registrationData.name !== 'string' ||
        typeof registrationData.password !== 'string'
      ) {
        throw new Error('Invalid registration data');
      }
      const registrationResponse = registerPlayer(
        registrationData.name,
        registrationData.password,
      );
      response = {
        name: registrationData.name,
        index: registrationResponse.index,
        error: registrationResponse.error,
        errorText: registrationResponse.errorText,
      };
    } catch (error) {
      console.error('Error processing registration data:', error);
      response = {
        name: '',
        index: '',
        error: true,
        errorText: 'Invalid registration data',
      };
    }
  }

  ws.send(
    JSON.stringify({ type: 'reg', data: JSON.stringify(response), id: 0 }),
  );
}
