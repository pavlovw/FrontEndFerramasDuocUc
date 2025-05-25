import { useSearchParams } from 'react-router-dom';

const WebpayRespuesta = () => {
  const [searchParams] = useSearchParams();
  const estado = searchParams.get('estado');
  const orden = searchParams.get('orden');

  const mensajes = {
    AUTHORIZED: '✅ Pago exitoso.',
    CANCELED: '❌ Pago cancelado por el usuario.',
    REJECTED: '❌ Pago rechazado.',
    FAILED: '❌ Pago fallido.',
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Resultado del Pago</h1>
      <p>
        {mensajes[estado] || `Estado desconocido: ${estado}`} Orden #{orden}
      </p>
    </div>
  );
};

export default WebpayRespuesta;
