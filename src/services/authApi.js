import { getGraphqlApiUrl } from './apiConfig';

const GRAPHQL_API_URL = getGraphqlApiUrl();

export const GRUPOS_DISPONIBLES = ['TC-01', 'TC-02', 'TC-03', 'TC-04'];

async function graphqlRequest(query, variables) {
  const response = await fetch(GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }

  const payload = await response.json();

  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message || 'Error en la solicitud');
  }

  return payload.data;
}

function normalizarUsuario(alumno) {
  return {
    id: alumno.id,
    nombre: alumno.nombre,
    apellido: alumno.apellido,
    email: alumno.email,
    grupo: alumno.grupo,
    tipo: 'estudiante',
  };
}

export async function iniciarSesionAlumno({ email, password }) {
  const data = await graphqlRequest(
    `
      mutation IniciarSesion($datos: LoginAlumnoInput!) {
        iniciarSesion(datos: $datos) {
          id
          nombre
          apellido
          email
          grupo
        }
      }
    `,
    {
      datos: {
        email,
        password,
      },
    },
  );

  return normalizarUsuario(data.iniciarSesion);
}

export async function registrarAlumno({ nombre, apellido, email, password, grupo }) {
  const data = await graphqlRequest(
    `
      mutation CrearAlumno($datos: CreateAlumnoInput!) {
        crearAlumno(datos: $datos) {
          id
          nombre
          apellido
          email
          grupo
        }
      }
    `,
    {
      datos: {
        nombre,
        apellido,
        email,
        password,
        grupo,
      },
    },
  );

  return normalizarUsuario(data.crearAlumno);
}
