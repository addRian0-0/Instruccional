import { CONTENIDOS_MOCK } from '../data/mockGuionDidactico';
import { AreaComputacion } from '../data/enum';

const GRAPHQL_API_URL =
  process.env.REACT_APP_GRAPHQL_API_URL || 'http://localhost:3001/graphql';

const SHOULD_USE_MOCK =
  process.env.REACT_APP_USE_MOCK_GUION === 'true' ||
  process.env.NODE_ENV === 'production';

export const COURSE_TO_TIPO_MATERIA = {
  'Teoría de Lenguajes': 'TEORIA_DE_LENGUAJES',
  Compiladores: 'COMPILADORES',
  'Teoría de la Computación.': 'TEORIA_DE_LA_COMPUTACION',
};

const TIPO_MATERIA_TO_AREA = {
  TEORIA_DE_LENGUAJES: AreaComputacion.TEORIA_DE_LENGUAJES,
  COMPILADORES: AreaComputacion.COMPILADORES,
  TEORIA_DE_LA_COMPUTACION: AreaComputacion.TEORIA_COMPUTACION,
};

function agruparContenidosPorUnidad(contenidos) {
  const unidades = new Map();

  contenidos.forEach((contenido) => {
    const key = contenido.unidad_id;

    if (!unidades.has(key)) {
      unidades.set(key, {
        unidad: {
          unidad_id: contenido.unidad.unidad_id,
          nombre: contenido.unidad.nombre,
        },
        contenidos: [],
      });
    }

    unidades.get(key).contenidos.push(contenido);
  });

  return Array.from(unidades.values());
}

function fetchUnidadesDesdeMock(tipoMateria) {
  const area = TIPO_MATERIA_TO_AREA[tipoMateria];
  const contenidos = CONTENIDOS_MOCK.filter((contenido) => contenido.area === area);
  return agruparContenidosPorUnidad(contenidos);
}

function normalizarRespuestaApi(unidades) {
  return (unidades || []).map((unidad) => ({
    unidad: {
      unidad_id: unidad.id,
      nombre: unidad.nombre,
    },
    contenidos: (unidad.contenidos || []).map((contenido) => ({
      contenido_id: contenido.id,
      titulo: contenido.titulo,
      descripcion: contenido.descripcion,
      tipo: contenido.tipo ? contenido.tipo.toLowerCase() : 'leccion',
      tipoMateria: contenido.tipoMateria,
      orden: contenido.orden,
      url_recurso: contenido.url_recurso,
      contenido: contenido.contenido,
      unidad_id: contenido.unidadId,
      unidad: {
        unidad_id: unidad.id,
        nombre: unidad.nombre,
      },
    })),
  }));
}

export async function fetchUnidadesPorMateria(tipoMateria) {
  if (SHOULD_USE_MOCK) {
    return fetchUnidadesDesdeMock(tipoMateria);
  }

  const response = await fetch(GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query UnidadesPorMateria($tipoMateria: TipoMateria!) {
          unidades(tipoMateria: $tipoMateria) {
            id
            nombre
            contenidos {
              id
              titulo
              descripcion
              tipo
              tipoMateria
              orden
              url_recurso
              contenido
              unidadId
            }
          }
        }
      `,
      variables: { tipoMateria },
    }),
  });

  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }

  const payload = await response.json();

  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message || 'Error consultando GraphQL');
  }

  return normalizarRespuestaApi(payload.data?.unidades);
}
