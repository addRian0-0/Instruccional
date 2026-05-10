// components/Sidebar.jsx
import React from 'react';
import { cerrarSesion } from '../utils/localStorage';

const Sidebar = ({ currentView, onNavigate, isMobileOpen, onMobileClose, usuarioLogueado, onLogout }) => {
  const courses = [
    { name: 'Compiladores', icon: 'code-2' },
    { name: 'Teoría de la Computación.', icon: 'book-open' },  // nombre exacto
  ];

  const generalPages = [
    { name: 'Contacto', icon: 'mail' },
    { name: 'Presentaciones', icon: 'presentation' },
    { name: 'Sobre Mi', icon: 'user' },
    { name: 'Tesis', icon: 'file-text' },
  ];

  const authPages = [
    { name: 'Registrarse', icon: 'user-plus' },
    { name: 'Iniciar Sesión', icon: 'log-in' },
  ];

  const handleNavigation = (view) => {
    onNavigate(view);
    onMobileClose();
  };

  const handleLogout = () => {
    cerrarSesion();
    if (onLogout) {
      onLogout();
    }
    handleNavigation('Inicio');
  };

  return (
    <>
      {/* Overlay para cel */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      <aside className={`
        w-72 bg-gray-900 text-white flex flex-col shadow-2xl transition-all duration-300 z-40 flex-shrink-0
        ${isMobileOpen ? 'fixed left-0 top-0 h-full' : 'hidden lg:flex'}
      `}>
        {/* Perfil de la profa o usuario logueado */}
        <div 
          className={`
            p-6 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors
            ${usuarioLogueado ? 'bg-blue-900' : 'bg-gray-800'}
          `}
          onClick={() => !usuarioLogueado && handleNavigation('Inicio')}
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden border-2 border-[#6b2132]">
              <img 
                src={usuarioLogueado 
                  ? `https://ui-avatars.com/api/?name=${usuarioLogueado.nombre}+${usuarioLogueado.apellido}&background=random`
                  : "https://ui-avatars.com/api/?name=Sara+Mendez&background=random"
                } 
                alt={usuarioLogueado ? `${usuarioLogueado.nombre}` : "Sara Méndez"} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight text-gray-100">
                {usuarioLogueado 
                  ? `${usuarioLogueado.nombre} ${usuarioLogueado.apellido}`
                  : 'Sara Méndez García'
                }
              </h2>
              <p className="text-xs text-gray-400">
                {usuarioLogueado 
                  ? usuarioLogueado.tipo === 'estudiante' 
                    ? `Grupo ${usuarioLogueado.grupo}`
                    : usuarioLogueado.tipo === 'profesor'
                    ? 'Docente'
                    : 'Administrador'
                  : 'Docente IPN'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Menú de Navegación */}
        <nav className="flex-1 overflow-y-auto custom-scroll py-4">
          
          {!usuarioLogueado ? (
            <>
              {/* Menú sin autenticar */}
              <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Cursos
              </div>
              <ul className="space-y-1">
                {courses.map((course) => (
                  <li key={course.name}>
                    <button
                      onClick={() => handleNavigation(course.name)}
                      className={`
                        w-full text-left px-6 py-3 hover:bg-[#6b2132] hover:bg-opacity-80 
                        transition flex items-center gap-3 text-sm
                        ${currentView === course.name ? 'bg-gray-800 border-l-4 border-[#6b2132]' : ''}
                      `}
                    >
                      <i data-lucide={course.icon} className="w-4 h-4"></i>
                      {course.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                General
              </div>
              <ul className="space-y-1">
                {generalPages.map((page) => (
                  <li key={page.name}>
                    <button
                      onClick={() => handleNavigation(page.name)}
                      className="w-full text-left px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3 text-sm text-gray-300"
                    >
                      <i data-lucide={page.icon} className="w-4 h-4"></i>
                      {page.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Autenticación
              </div>
              <ul className="space-y-1">
                {authPages.map((page) => (
                  <li key={page.name}>
                    <button
                      onClick={() => handleNavigation(page.name)}
                      className={`
                        w-full text-left px-6 py-3 hover:bg-[#6b2132] hover:bg-opacity-80 
                        transition flex items-center gap-3 text-sm
                        ${currentView === page.name ? 'bg-gray-800 border-l-4 border-[#6b2132]' : 'text-gray-300'}
                      `}
                    >
                      <i data-lucide={page.icon} className="w-4 h-4"></i>
                      {page.name}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : usuarioLogueado.tipo === 'estudiante' ? (
            <>
              {/* Menú de estudiante */}
              <div className="px-4 mb-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Mi Aula
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleNavigation('StudentDashboard')}
                    className={`
                      w-full text-left px-6 py-3 hover:bg-blue-700 
                      transition flex items-center gap-3 text-sm
                      ${currentView === 'StudentDashboard' ? 'bg-gray-800 border-l-4 border-blue-500' : ''}
                    `}
                  >
                    <i data-lucide="book-open" className="w-4 h-4"></i>
                    Mi Dashboard
                  </button>
                </li>
              </ul>

              <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                General
              </div>
              <ul className="space-y-1">
                {generalPages.map((page) => (
                  <li key={page.name}>
                    <button
                      onClick={() => handleNavigation(page.name)}
                      className="w-full text-left px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3 text-sm text-gray-300"
                    >
                      <i data-lucide={page.icon} className="w-4 h-4"></i>
                      {page.name}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : usuarioLogueado.tipo === 'profesor' ? (
            <>
              {/* Menú de profesor */}
              <div className="px-4 mb-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Gestión
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleNavigation('TeacherDashboard')}
                    className={`
                      w-full text-left px-6 py-3 hover:bg-purple-700 
                      transition flex items-center gap-3 text-sm
                      ${currentView === 'TeacherDashboard' ? 'bg-gray-800 border-l-4 border-purple-500' : ''}
                    `}
                  >
                    <i data-lucide="clipboard-list" className="w-4 h-4"></i>
                    Panel Profesor
                  </button>
                </li>
              </ul>

              <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                General
              </div>
              <ul className="space-y-1">
                {generalPages.map((page) => (
                  <li key={page.name}>
                    <button
                      onClick={() => handleNavigation(page.name)}
                      className="w-full text-left px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3 text-sm text-gray-300"
                    >
                      <i data-lucide={page.icon} className="w-4 h-4"></i>
                      {page.name}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : usuarioLogueado.tipo === 'admin' ? (
            <>
              {/* Menú de admin */}
              <div className="px-4 mb-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
                Administración
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleNavigation('AdminDashboard')}
                    className={`
                      w-full text-left px-6 py-3 hover:bg-red-700 
                      transition flex items-center gap-3 text-sm
                      ${currentView === 'AdminDashboard' ? 'bg-gray-800 border-l-4 border-red-500' : ''}
                    `}
                  >
                    <i data-lucide="shield" className="w-4 h-4"></i>
                    Panel Admin
                  </button>
                </li>
              </ul>

              <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                General
              </div>
              <ul className="space-y-1">
                {generalPages.map((page) => (
                  <li key={page.name}>
                    <button
                      onClick={() => handleNavigation(page.name)}
                      className="w-full text-left px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3 text-sm text-gray-300"
                    >
                      <i data-lucide={page.icon} className="w-4 h-4"></i>
                      {page.name}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </nav>

        {/* Botón de Cerrar Sesión si está autenticado */}
        {usuarioLogueado && (
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <i data-lucide="log-out" className="w-4 h-4"></i>
              Cerrar Sesión
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;