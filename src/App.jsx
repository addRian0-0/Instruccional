// App.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Course from './pages/Course';
import OtherCourse from './pages/OtherCourse';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import GenericPage from './pages/GenericPage';
import SearchResults from './pages/SearchResults';
import { mockFiles } from './data/mockData';
import { cerrarSesion, obtenerUsuarioLogueado } from './utils/localStorage';
import './index.css';

const PROTECTED_COURSE_VIEWS = new Set([
  'Teoría de la Computación.',
  'Ambientes de Programacion.',
  'Compiladores',
  'Contexto Nacional III',
  'Sistemas Operativos',
  'SO en Red',
  'Teoría de Lenguajes',
  'UDF Maestria',
]);

function App() {
  const [currentView, setCurrentView] = useState('Inicio');
  const [currentPeriod, setCurrentPeriod] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  // Verificar si hay usuario logueado al cargar
  useEffect(() => {
    const usuario = obtenerUsuarioLogueado();
    if (usuario) {
      setUsuarioLogueado(usuario);
      
      // Redirigir al dashboard correspondiente
      if (usuario.tipo === 'estudiante') {
        setCurrentView('StudentDashboard');
      } else if (usuario.tipo === 'profesor') {
        setCurrentView('TeacherDashboard');
      } else if (usuario.tipo === 'admin') {
        setCurrentView('AdminDashboard');
      }
    }
  }, []);

  useEffect(() => {
    const contentArea = document.getElementById('contentArea');
    if (contentArea) {
      contentArea.scrollTop = 0;
    }
  }, [currentView]);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [currentView]);

  const handleLoginSuccess = (usuario) => {
    setUsuarioLogueado(usuario);

    // Redirigir según tipo
    if (usuario.tipo === 'estudiante') {
      setCurrentView('StudentDashboard');
    } else if (usuario.tipo === 'profesor') {
      setCurrentView('TeacherDashboard');
    } else if (usuario.tipo === 'admin') {
      setCurrentView('AdminDashboard');
    }
  };

  const handleLogout = () => {
    cerrarSesion();
    setUsuarioLogueado(null);
    setCurrentView('Inicio');
  };

  const handleNavigate = (view) => {
    if (!usuarioLogueado && PROTECTED_COURSE_VIEWS.has(view)) {
      setCurrentView('Iniciar Sesión');
      return;
    }

    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'Inicio':
        return <Home onNavigate={handleNavigate} usuarioLogueado={usuarioLogueado} />;

      case 'Teoría de la Computación.':
        return usuarioLogueado ? (
          <Course
            courseName={currentView}
            currentPeriod={currentPeriod}
            onPeriodChange={setCurrentPeriod}
          />
        ) : (
          <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        );

      // Las demás materias usan el componente genérico
      case 'Ambientes de Programacion.':
      case 'Compiladores':
        return usuarioLogueado ? (
          <Course
            courseName={currentView}
            currentPeriod={currentPeriod}
            onPeriodChange={setCurrentPeriod}
          />
        ) : (
          <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        );
      case 'Contexto Nacional III':
      case 'Sistemas Operativos':
      case 'SO en Red':
      case 'Teoría de Lenguajes':
      case 'UDF Maestria':
        return usuarioLogueado ? (
          <OtherCourse courseName={currentView} />
        ) : (
          <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        );

      case 'Contacto':
        return <Contact />;

      case 'Registrarse':
        return <Register onNavigate={handleNavigate} />;

      case 'Iniciar Sesión':
        return <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;

      case 'Estudiante dashboard':
        return usuarioLogueado ? (
          <StudentDashboard usuario={usuarioLogueado} onNavigate={handleNavigate} onLogout={handleLogout} />
        ) : (
          <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        );

      case 'TeacherDashboard':
        return usuarioLogueado && usuarioLogueado.tipo === 'profesor' ? (
          <TeacherDashboard usuario={usuarioLogueado} onNavigate={handleNavigate} onLogout={handleLogout} />
        ) : (
          <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        );

      case 'AdminDashboard':
        return usuarioLogueado && usuarioLogueado.tipo === 'admin' ? (
          <AdminDashboard usuario={usuarioLogueado} onNavigate={handleNavigate} onLogout={handleLogout} />
        ) : (
          <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        );

      case 'Presentaciones':
      case 'Sobre Mi':
      case 'Tesis':
        return <GenericPage pageName={currentView} />;

      case 'Resultados':
        return <SearchResults query={searchQuery} files={mockFiles} />;

      default:
        return <Home onNavigate={handleNavigate} usuarioLogueado={usuarioLogueado} />;
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentView('Resultados');
  };

  return (
    <div className="flex h-screen overflow-hidden text-gray-800 bg-gray-50">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        usuarioLogueado={usuarioLogueado}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col relative min-w-0 bg-gray-50">
        <Header
          title={currentView}
          onSearch={handleSearch}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          usuarioLogueado={usuarioLogueado}
        />

        <div id="contentArea" className="flex-1 overflow-y-auto p-6 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
