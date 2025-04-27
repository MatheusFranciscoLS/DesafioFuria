// Utilitário para buscar jogos da API FURIA
// Usado para componentes visuais (ex: Agenda de Jogos Modal)

/**
 * Busca a lista de jogos da API
 * @returns {Promise<Array>} Array de jogos ou []
 */
export async function fetchJogos() {
  try {
    const res = await fetch("http://localhost:3031/api/jogos");
    if (!res.ok) return [];
    const data = await res.json();
    return data.jogos || [];
  } catch {
    return [];
  }
}
