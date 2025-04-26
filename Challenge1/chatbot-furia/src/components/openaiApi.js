// Integração com OpenAI GPT-3.5/4 (ou compatível)
// ATENÇÃO: nunca exponha sua API Key no frontend em produção!

export async function askOpenAI(message, apiKey) {
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };
  const body = JSON.stringify({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Você é um chatbot divertido, informativo e engajador da FURIA Esports." },
      { role: "user", content: message }
    ],
    max_tokens: 256,
    temperature: 0.6
  });
  try {
    const response = await fetch(endpoint, { method: "POST", headers, body });
    if (!response.ok) throw new Error("Erro na resposta da API OpenAI");
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "[Erro: resposta vazia da IA]";
  } catch (e) {
    return `[Erro IA]: ${e.message}`;
  }
}
