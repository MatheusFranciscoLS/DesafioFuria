/**
 * Lista de modalidades oficiais da FURIA GG.
 * Cada modalidade possui:
 *   - key: identificador único (string)
 *   - label: nome para exibição (string)
 * O valor "all" representa a opção para exibir todas as modalidades.
 * @type {Array<{key: string, label: string}>}
 */
export const furiaModalidades = [
  { key: "all", label: "Todas" },            // Exibe todos os eventos/modalidades
  { key: "apex", label: "Apex Legends" },    // Battle Royale
  { key: "cs2", label: "CS:GO 2" },          // Counter-Strike 2
  { key: "fut7", label: "Fut7" },            // Futebol de 7
  { key: "lol", label: "LoL" },              // League of Legends
  { key: "pubg", label: "PUBG" },            // Battle Royale
  { key: "rainbowsix", label: "Rainbow Six" },// FPS
  { key: "valorant", label: "Valorant" },    // FPS
  { key: "rocketleague", label: "Rocket League" }, // Esporte eletrônico de carros
];
