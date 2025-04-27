// Utilitário para buscar placares da API FURIA
// Usado para componentes visuais (ex: Placares Modal)

/**
 * Busca a lista de placares da API
 * @returns {Promise<Array>} Array de placares ou []
 */
export async function fetchPlacares() {
  try {
    const res = await fetch("http://localhost:3031/api/placares");
    if (!res.ok) return [];
    const data = await res.json();
    return data.placares || [];
  } catch {
    return [];
  }
}
