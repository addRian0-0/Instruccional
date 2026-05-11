// pages/Login.jsx
import React from 'react';
import { guardarUsuarioLogueado } from '../utils/localStorage';
import { iniciarSesionAlumno } from '../services/authApi';

const Login = ({ onNavigate, onLoginSuccess }) => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

  const [error, setError] = React.useState('');
  const [cargando, setCargando] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      setCargando(false);
      return;
    }

    try {
      const usuario = await iniciarSesionAlumno(formData);

      // Guardar usuario logueado
      guardarUsuarioLogueado(usuario);

      alert('¡Bienvenido/a!');
      setFormData({ email: '', password: '' });

      // Redirigir según tipo de usuario
      if (onLoginSuccess) {
        onLoginSuccess(usuario);
      } else {
        switch (usuario.tipo) {
          case 'estudiante':
            onNavigate('StudentDashboard');
            break;
          case 'profesor':
            onNavigate('TeacherDashboard');
            break;
          case 'admin':
            onNavigate('AdminDashboard');
            break;
          default:
            onNavigate('Inicio');
        }
      }
    } catch (submitError) {
      setError(submitError.message || 'No fue posible iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto fade-in">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-3xl font-bold text-[#6b2132] mb-2 text-center">Iniciar Sesión</h2>
        <p className="text-center text-gray-600 text-sm mb-6">Accede a tu plataforma de aprendizaje</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <i data-lucide="alert-circle" className="w-5 h-5"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="tu@correo.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b2132] transition"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Ingresa tu contraseña"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b2132] transition"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 bg-[#6b2132] text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
            >
              <i data-lucide="log-in" className="w-5 h-5"></i>
              {cargando ? 'Entrando...' : 'Iniciar Sesión'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('Inicio')}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
            >
              <i data-lucide="home" className="w-5 h-5"></i>
              Volver
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
            <p className="font-semibold mb-1">Acceso con backend</p>
            <p>Inicia sesión con una cuenta registrada desde este formulario.</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          ¿No tienes cuenta? <button onClick={() => onNavigate('Registrarse')} className="text-[#6b2132] font-semibold hover:underline">Regístrate aquí</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
