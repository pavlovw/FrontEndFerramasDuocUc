import { useSearchParams, useNavigate } from 'react-router-dom';

const WebpayRespuesta = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const estado = searchParams.get('estado');
  const orden = searchParams.get('orden');

  const mensajes = {
    AUTHORIZED: '✅ Pago exitoso.',
    CANCELED: '❌ Pago cancelado por el usuario.',
    REJECTED: '❌ Pago rechazado.',
    FAILED: '❌ Pago fallido.',
  };

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1>Resultado del Pago</h1>

      {estado ? (
        <p data-testid="resultado-pago">
          {mensajes[estado] || `Estado desconocido: ${estado}`} Orden #{orden}
        </p>
      ) : (
        <p>Error: No se recibió respuesta de Webpay.</p>
      )}

      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#2e8b57',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/productos')}
      >
        Volver a Productos
      </button>
    </div>
  );
};

export default WebpayRespuesta;
