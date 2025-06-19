import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Compra = () => {
  const { id } = useParams(); // id de la publicación
  const userId = localStorage.getItem('user_id');
  const [publicacion, setPublicacion] = useState(null);
  const [comprador, setComprador] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [comprasUltimos30, setComprasUltimos30] = useState(0);
  const [desglose, setDesglose] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [usarCashback, setUsarCashback] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Campos de envío
  const [localidadEnvio, setLocalidadEnvio] = useState('');
  const [direccionEnvio, setDireccionEnvio] = useState('');
  const [alturaEnvio, setAlturaEnvio] = useState('');
  const [entrecallesEnvio, setEntrecallesEnvio] = useState('');
  const [erroresEnvio, setErroresEnvio] = useState('');

  useEffect(() => {
    axios.get(`https://web-autopartes-backend.onrender.com/publicaciones/${id}`)
      .then(res => {
        setPublicacion(res.data);
        // Traer datos del vendedor
        if (res.data.user_id) {
          axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${res.data.user_id}`)
            .then(resVendedor => setVendedor(resVendedor.data));
        }
      });
    axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}`)
      .then(res => setComprador(res.data));
    axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}/compras-ultimos-30`)
      .then(res => setComprasUltimos30(res.data.comprasUltimos30 || 0));
  }, [id, userId]);

  useEffect(() => {
    if (!publicacion || !comprador) return;
    const precioUnitario = parseFloat(publicacion.precio) || 0;
    const subtotal = precioUnitario * cantidad;

    // Descuentos por constancia AFIP y certificado de estudio (sobre el comprador)
    let descuentoPorcentaje = 0;
    let descuentosAplicados = [];
    let descuentosNoAplicados = [];

    if (comprador.aprobado_constancia_afip) {
      descuentoPorcentaje += 0.05;
      descuentosAplicados.push('Constancia AFIP/ARCA aprobada: -5%');
    } else {
      descuentosNoAplicados.push('Constancia AFIP/ARCA aprobada: -5%');
    }
    if (comprador.aprobado_certificado_estudio) {
      descuentoPorcentaje += 0.05;
      descuentosAplicados.push('Certificado de estudio aprobado: -5%');
    } else {
      descuentosNoAplicados.push('Certificado de estudio aprobado: -5%');
    }

    // Total con descuentos
    const totalConDescuentos = subtotal * (1 - descuentoPorcentaje);

    // Cupón para próxima compra
    let porcentajeCupon = comprasUltimos30 > 10 ? 0.05 : 0.03;
    const cupon = totalConDescuentos * porcentajeCupon;

    // Cashback
    const cashbackDisponible = Number(comprador.cashback) || 0;
    let cashbackAplicado = 0;
    let total = totalConDescuentos;
    if (usarCashback && cashbackDisponible > 0) {
      cashbackAplicado = Math.min(cashbackDisponible, totalConDescuentos);
      total = totalConDescuentos - cashbackAplicado;
    }

    setDesglose({
      precioUnitario,
      cantidad,
      subtotal,
      descuentoPorcentaje,
      totalConDescuentos,
      totalSinCashback: totalConDescuentos,
      total,
      descuentosAplicados,
      descuentosNoAplicados,
      cupon,
      porcentajeCupon: porcentajeCupon * 100,
      cashbackAplicado,
      cashbackDisponible
    });
  }, [publicacion, comprador, comprasUltimos30, cantidad, usarCashback]);

  if (!publicacion || !comprador || !desglose) return (
    <div className="text-center py-10 text-gray-800 dark:text-gray-100">Cargando...</div>
  );

  // Detectar si requiere envío (soporta true/false, 'si', 'sí', 'SI', 'true')
  const requiereEnvio = publicacion.envio === true ||
    publicacion.envio === 'true' ||
    publicacion.envio === 'si' ||
    publicacion.envio === 'sí' ||
    publicacion.envio === 'SI' ||
    publicacion.envio === 'Sí';

  // Validar campos de envío
  const validarCamposEnvio = () => {
    if (!requiereEnvio) return true;
    if (!localidadEnvio || !direccionEnvio || !alturaEnvio || !entrecallesEnvio) {
      setErroresEnvio('Debes completar todos los datos de envío.');
      return false;
    }
    setErroresEnvio('');
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mt-10 p-0 rounded-lg shadow-lg overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)'
      }}
    >
      {/* Encabezado visual atractivo */}
      <div className="relative">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700 flex items-center justify-center">
          <span className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide">
            Confirmar compra
          </span>
        </div>
        <div className="absolute left-1/2 -bottom-6 transform -translate-x-1/2">
          <div className="rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-gray-100 dark:bg-gray-900 w-20 h-20 flex items-center justify-center">
            {publicacion.fotos && publicacion.fotos.length > 0 ? (
              <img
                src={publicacion.fotos[0]}
                alt={publicacion.nombre_producto}
                className="object-cover w-16 h-16 rounded-full"
              />
            ) : (
              <span className="text-gray-400 text-3xl">🛒</span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-14 pb-2 px-6 bg-white dark:bg-gray-800 rounded-b-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">{publicacion.nombre_producto}</h2>
        <div className="mb-4 flex flex-wrap gap-4 justify-center">
          <div className="text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded shadow-sm">
            <strong>Precio unitario:</strong> ${desglose.precioUnitario.toFixed(2)}
          </div>
          <div className="text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded shadow-sm">
            <strong>Cantidad:</strong>{' '}
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={e => {
                const val = Math.max(1, parseInt(e.target.value) || 1);
                setCantidad(val);
              }}
              className="w-16 px-2 py-1 border rounded text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <div className="mb-2 text-gray-800 dark:text-gray-100 text-lg text-center">
          <strong>Subtotal:</strong> ${desglose.subtotal.toFixed(2)}
        </div>
        {desglose.descuentoPorcentaje > 0 && (
          <div className="mb-2 text-green-700 dark:text-green-400 text-center">
            <strong>Descuento aplicado:</strong> -{(desglose.descuentoPorcentaje * 100).toFixed(0)}% (${(desglose.subtotal * desglose.descuentoPorcentaje).toFixed(2)})
          </div>
        )}
        <div className="mb-2 text-gray-800 dark:text-gray-100 text-lg text-center">
          <strong>Total a pagar:</strong> ${desglose.totalConDescuentos.toFixed(2)}
        </div>
        <div className="mb-2 text-gray-800 dark:text-gray-100 text-center">
          <strong>Cashback disponible:</strong> ${Number(desglose.cashbackDisponible).toFixed(2)}
          {desglose.cashbackDisponible > 0 && (
            <label className="ml-3 inline-flex items-center">
              <input
                type="checkbox"
                checked={usarCashback}
                onChange={e => setUsarCashback(e.target.checked)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm">Pagar usando cashback acumulado</span>
            </label>
          )}
        </div>
        {usarCashback && desglose.cashbackAplicado > 0 && (
          <div className="mb-2 text-green-700 dark:text-green-400 text-center">
            <strong>Cashback aplicado:</strong> -${desglose.cashbackAplicado.toFixed(2)}
          </div>
        )}
        <div className="mb-2 text-gray-800 dark:text-gray-100 text-lg text-center">
          <strong>Total final a pagar:</strong> ${desglose.total.toFixed(2)}
        </div>
        <div className="mb-4">
          <strong className="text-gray-800 dark:text-gray-100">Descuentos informativos:</strong>
          {desglose.descuentosAplicados.length > 0 ? (
            <ul className="text-green-700 dark:text-green-400 list-disc list-inside">
              {desglose.descuentosAplicados.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-500 ml-2">Ninguno</span>
          )}
          {desglose.descuentosNoAplicados.length > 0 && (
            <>
              <div className="mt-2 text-gray-500 dark:text-gray-400">
                <strong>Descuentos no aplicados:</strong>
                <ul className="list-disc list-inside">
                  {desglose.descuentosNoAplicados.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        <div className="mb-2 text-blue-700 dark:text-blue-400 text-center">
          <strong>
            ¡Obtendrás un cupón de {desglose.porcentajeCupon}% (${desglose.cupon.toFixed(2)}) para tu próxima compra!
            {comprasUltimos30 > 10 && (
              <span className="ml-2 text-green-700 dark:text-green-400 font-semibold">(¡5% por más de 10 compras en 30 días!)</span>
            )}
          </strong>
        </div>

        {/* Campos de envío si corresponde */}
        {requiereEnvio && (
          <div className="mb-4 bg-blue-50 dark:bg-blue-900 p-4 rounded shadow">
            <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-2">Datos para el envío</h3>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Localidad"
                value={localidadEnvio}
                onChange={e => setLocalidadEnvio(e.target.value)}
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                required
              />
              <input
                type="text"
                placeholder="Dirección"
                value={direccionEnvio}
                onChange={e => setDireccionEnvio(e.target.value)}
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                required
              />
              <input
                type="text"
                placeholder="Altura"
                value={alturaEnvio}
                onChange={e => setAlturaEnvio(e.target.value)}
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                required
              />
              <input
                type="text"
                placeholder="Entre calles"
                value={entrecallesEnvio}
                onChange={e => setEntrecallesEnvio(e.target.value)}
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            {erroresEnvio && (
              <div className="mt-2 text-red-600 dark:text-red-400">{erroresEnvio}</div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 text-white rounded font-bold shadow-lg transition-all duration-200"
            disabled={loading}
            onClick={async () => {
              // Validar campos de envío si corresponde
              if (requiereEnvio && !validarCamposEnvio()) return;

              setLoading(true);
              try {
                await axios.post('https://web-autopartes-backend.onrender.com/ventas', {
                  vendedor_id: publicacion.user_id,
                  comprador_id: comprador.id,
                  publicacion_id: publicacion.id,
                  cantidad,
                  monto: desglose.total,
                  localidad_envio: requiereEnvio ? localidadEnvio : null,
                  direccion_envio: requiereEnvio ? direccionEnvio : null,
                  altura_envio: requiereEnvio ? alturaEnvio : null,
                  entrecalles_envio: requiereEnvio ? entrecallesEnvio : null
                });
                const nuevoCashback = (Number(desglose.cashbackDisponible) - Number(desglose.cashbackAplicado)) + Number(desglose.cupon);
                await axios.put(`https://web-autopartes-backend.onrender.com/usuarios/${userId}/cashback`, {
                  cashback: nuevoCashback
                });
                alert('¡Compra realizada! Tu cupón se ha actualizado.');
                navigate('/micuenta');
              } catch {
                alert('Error al realizar la compra');
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Procesando...' : 'Comprar'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2 bg-gray-500 text-white rounded font-bold shadow-lg transition-all duration-200"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Volver
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Compra;