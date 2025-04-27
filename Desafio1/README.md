# FURIA Fan Chat

Bem-vindo ao chat interativo de fãs da FURIA! 🦁🔥  
Aqui você acompanha jogos, consulta estatísticas, interage com outros fãs e recebe informações em tempo real do time de CS da FURIA.

## 🚀 Funcionalidades Principais

- Chat global em tempo real (Firebase)
- Tela de login moderna: escolha entre Google ou Anônimo
- Autenticação obrigatória: só usuários autenticados acessam o chat
- Modais para agenda de jogos e placares recentes (acesso fácil pela interface)
- Comandos inteligentes para fãs (veja abaixo)
- Status de jogos ao vivo (mock)
- Experiência reativa: após login, acesso imediato ao chat
- Logout seguro: ao sair, retorna para a tela de login

## 💬 Comandos do Chat

| Comando                       | O que faz                                             | Exemplo                |
|-------------------------------|-------------------------------------------------------|------------------------|
| `/elenco [modalidade]`        | Mostra elenco de uma modalidade                       | `/elenco cs2`          |
| `/estatisticas [nick]`        | Estatísticas de um jogador                            | `/estatisticas art`    |
| `/modalidades`                | Mostra modalidades disponíveis                        | `/modalidades`         |
| `/curiosidades [modalidade]`  | Curiosidades sobre uma modalidade                     | `/curiosidades valorant`|
| `/help` ou `/comandos`        | Lista todos os comandos                               | `/help`                |

> ⚡ **Agora a agenda de jogos e os placares recentes são acessados pelos botões na barra lateral do chat!**
> Basta clicar em "Agenda de Jogos" ou "Placares Recentes" para abrir os modais com as informações atualizadas.

> Mensagens de erro são sempre orientativas, sugerindo o próximo passo para o fã.

## 🖼️ Demonstração

- Prints ou GIFs mostrando:
  - Tela de login com botões "Entrar com Google" e "Entrar como Anônimo"
  - Chat em funcionamento após login
  - Logout retornando à tela de login
  - Abertura dos modais de agenda de jogos e placares recentes
  - Interação do fã com o bot e comandos
- [Link para vídeo de demonstração (YouTube/Drive)](URL_DO_VIDEO)

## 🛠️ Como rodar localmente

### Pré-requisitos
- Node.js >= 18
- Conta no Firebase ([crie aqui](https://console.firebase.google.com/))

### Passos
1. Clone o repositório
2. Instale as dependências em `/frontend` e `/backend`
3. Configure o Firebase (`/frontend/.env.example`)
4. Rode `npm start` em cada pasta

#### Observações importantes
- **Login obrigatório:** Você só acessa o chat após autenticação (Google ou Anônimo).
- **Popups bloqueados:** Se o botão "Entrar com Google" não abrir, desative bloqueadores de popup/extensões para localhost.
- **Logout:** Ao sair, você retorna automaticamente à tela de login.
- **Erros 400 ou ERR_BLOCKED_BY_CLIENT** ao sair são normais e não afetam o funcionamento.

## 📡 APIs principais (backend)

- `GET /api/elenco/:modalidade`
- `GET /api/jogos`
- `GET /api/placares`
- `GET /api/modalidades`
- `GET /api/estatisticas/:jogador`
- `GET /api/curiosidades/:modalidade`
- `GET /api/noticias`

Todas retornam mensagens amigáveis e status apropriados para facilitar a experiência do fã.

> **Observação:**
> - Para informações de jogos futuros e placares, utilize os modais na interface.
> - O bot responde dúvidas sobre comandos, jogadores, curiosidades e mais!

## 🌟 Expansão futura

- Canais temáticos
- Ranking de fãs
- Integração com APIs de e-sports oficiais
- Reações e perfis customizados

---

## 📄 Licença

MIT

---

> Dúvidas ou sugestões? Abra uma issue ou entre em contato!
