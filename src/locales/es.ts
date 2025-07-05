export const es = {
  common: {
    loading: 'Cargando...',
    error: 'Error',
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    search: 'Buscar',
    filter: 'Filtrar',
    analyze: 'Analizar',
    analyzing: 'Analizando...',
    analyzeNow: 'Analizar Ahora',
    viewOriginal: 'Ver Artículo Original',
    readMore: 'Leer Más',
    showLess: 'Mostrar Menos',
    noResults: 'No se encontraron resultados',
    tryAgain: 'Intentar de Nuevo',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    settings: 'Configuración',
    language: 'Idioma',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro'
  },
  header: {
    title: 'Cazador de Sesgos',
    articleAnalyzer: 'Analizador de Artículos',
    dashboard: 'Panel de Control',
    sourceDirectory: 'Directorio de Fuentes',
    apiSettings: 'Configuración de API'
  },
  analyzer: {
    hero: {
      badge: 'Detección de Sesgos con IA',
      title: 'Descubre Sesgos',
      subtitle: 'Mediáticos Ocultos',
      description: 'Analiza cualquier artículo de noticias al instante con nuestra IA avanzada para detectar sesgos políticos, lenguaje emocional y veracidad. Ve cómo diferentes fuentes enmarcan la misma historia.',
      placeholder: 'Pega cualquier URL de artículo de noticias aquí...',
      examples: 'Prueba estos artículos de ejemplo:'
    },
    analysis: {
      complete: 'Análisis Completo',
      aiResults: 'Resultados de detección de sesgos con IA',
      source: 'Fuente',
      author: 'Autor',
      published: 'Publicado',
      politicalBias: 'Sesgo Político',
      factuality: 'Veracidad',
      emotionalLanguage: 'Lenguaje Emocional',
      politicalLeaning: 'Inclinación política detectada en el contenido',
      reliabilityAssessment: 'Evaluación de confiabilidad y precisión',
      emotionalIntensity: 'Intensidad emocional en el lenguaje'
    },
    bias: {
      left: 'Izquierda',
      centerLeft: 'Centro-Izquierda',
      center: 'Centro',
      centerRight: 'Centro-Derecha',
      right: 'Derecha',
      high: 'Alto',
      medium: 'Medio',
      low: 'Bajo',
      highlyReliable: 'Muy Confiable',
      moderatelyReliable: 'Moderadamente Confiable',
      lessReliable: 'Menos Confiable'
    },
    coverage: {
      title: 'Cobertura Comparativa',
      description: 'Cómo diferentes fuentes enmarcan esta historia',
      factuality: 'Veracidad',
      tone: 'Tono',
      positive: 'positivo',
      negative: 'negativo',
      neutral: 'neutral',
      noResults: 'No se encontró cobertura comparativa',
      tryRecent: 'Intenta analizar un artículo más reciente o popular'
    },
    highlights: {
      title: 'Análisis de Contenido',
      emotionalLanguage: 'Lenguaje Emocional',
      potentialBias: 'Sesgo Potencial'
    },
    social: {
      title: 'Reacciones en Redes Sociales',
      interactions: 'interacciones',
      topComments: 'Comentarios Principales:'
    },
    errors: {
      title: 'Error de Análisis',
      extractionFailed: 'No se pudo extraer el contenido del artículo de la URL proporcionada',
      analysisGeneral: 'Ocurrió un error durante el análisis'
    }
  },
  dashboard: {
    hero: {
      badge: 'Análisis Personal',
      title: 'Tus Análisis',
      subtitle: 'de Lectura',
      description: 'Rastrea tus patrones de consumo de noticias, exposición a sesgos y hábitos de lectura a lo largo del tiempo.'
    },
    stats: {
      articlesAnalyzed: 'Artículos Analizados',
      biasAlerts: 'Alertas de Sesgo',
      sourcesTracked: 'Fuentes Rastreadas',
      readingStreak: 'Racha de Lectura',
      days: 'días'
    },
    charts: {
      biasHistory: 'Historial de Exposición a Sesgos',
      lastDays: 'Últimos 5 días de patrones de lectura',
      topSources: 'Fuentes Principales',
      mostRead: 'Fuentes de noticias más leídas',
      articles: 'artículos'
    },
    bias: {
      left: 'Izquierda',
      center: 'Centro',
      right: 'Derecha'
    }
  },
  sources: {
    title: 'Directorio de Fuentes de Noticias',
    description: 'Explora calificaciones de sesgo y puntuaciones de veracidad para las principales organizaciones de noticias en todo el mundo.',
    search: 'Buscar fuentes de noticias...',
    allBias: 'Todos los Tipos de Sesgo',
    politicalBias: 'Sesgo Político',
    factuality: 'Veracidad',
    category: 'Categoría',
    verifiedSource: 'Fuente Verificada',
    country: 'País',
    categories: {
      international: 'Internacional',
      national: 'Nacional',
      business: 'Negocios',
      technology: 'Tecnología',
      sports: 'Deportes',
      entertainment: 'Entretenimiento'
    }
  },
  api: {
    title: 'Configuración de API',
    configured: '¡Claves de API Configuradas!',
    ready: 'Tus claves de NewsAPI y GNews ya están configuradas y listas para usar.',
    newsApiKey: 'Clave de NewsAPI',
    gnewsApiKey: 'Clave de GNews',
    newsApiPlaceholder: 'Obtener de newsapi.org',
    gnewsPlaceholder: 'Obtener de gnews.io',
    information: 'Información de API:',
    newsApiInfo: '100 solicitudes/día (nivel gratuito)',
    gnewsInfo: '100 solicitudes/día (nivel gratuito)',
    localStorage: 'Las claves de API se almacenan localmente en tu navegador',
    updateKeys: 'Actualizar Claves',
    saved: '¡Guardado!'
  }
};