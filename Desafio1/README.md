# FURIA Fan Chat

![Vercel Deploy](https://img.shields.io/badge/deploy-vercel-brightgreen?logo=vercel)
![React](https://img.shields.io/badge/frontend-react-blue?logo=react)
![Firebase](https://img.shields.io/badge/backend-firebase-orange?logo=firebase)

Bem-vindo ao chat interativo de fãs da FURIA GG! 🦁🔥
Aqui você acompanha jogos, consulta estatísticas, interage com outros fãs e recebe informações em tempo real de todas as modalidades da FURIA GG (CS, Valorant, Rocket League, Rainbow Six, Kings League, e muito mais).

[🔗 Acesse a versão online (Vercel)](https://challenge1-furia.vercel.app)

---

## 📚 Tecnologias Utilizadas

| Camada     | Tecnologia            |
|------------|-----------------------|
| Frontend   | React + Vite          |
| Backend    | Firebase (Firestore/Auth) |
| Deploy     | Vercel                |
| Estilo     | CSS customizado       |

---

## 🚀 Funcionalidades Principais

- Chat global em tempo real (Firebase)
- Tela de login moderna: escolha entre Google ou Anônimo
- Autenticação obrigatória: só usuários autenticados acessam o chat
- Modais para agenda de jogos e placares recentes (acesso fácil pela interface)
- Quiz e Enquete interativos com feedback sonoro
- Ranking dos fãs mais ativos com badges e XP
- Comandos inteligentes para fãs (veja abaixo)
- Status de jogos ao vivo (mock)
- Experiência reativa: após login, acesso imediato ao chat
- Logout seguro: ao sair, retorna para a tela de login
- Código limpo, sem variáveis ou funções não utilizadas
- Tratamento robusto de erros e mensagens orientativas
- Áudio local para feedback do quiz em `/frontend/public/sounds/error.mp3` (adicione seu próprio efeito sonoro!)
- Organização dos componentes e melhores práticas de React

---

## 💬 Comandos do Chat

| Comando                       | O que faz                                             | Exemplo                |
|-------------------------------|-------------------------------------------------------|------------------------|
| `/elenco [modalidade]`        | Mostra elenco de uma modalidade                       | `/elenco csgo2`          |
| `/estatisticas [nick]`        | Estatísticas de um jogador                            | `/estatisticas art`    |
| `/modalidades`                | Mostra modalidades disponíveis                        | `/modalidades`         |
| `/curiosidades [modalidade]`  | Curiosidades sobre uma modalidade                     | `/curiosidades valorant`|
| `/help` ou `/comandos`        | Lista todos os comandos                               | `/help`                |

> ⚡ **Agora a agenda de jogos e os placares recentes são acessados pelos botões na barra lateral do chat!**
> Basta clicar em "Agenda de Jogos" ou "Placares Recentes" para abrir os modais com as informações atualizadas.

> Mensagens de erro são sempre orientativas, sugerindo o próximo passo para o fã.

---

## 🛠️ Como rodar localmente

### Pré-requisitos
- Node.js >= 18
- Conta no Firebase ([crie aqui](https://console.firebase.google.com/))

### Passos
1. Clone o repositório
2. Instale as dependências em `/frontend` e `/backend`:
   - `cd frontend && npm install`
   - `cd ../backend && npm install`
3. Configure o Firebase em `/frontend/.env` (use o exemplo `.env.example`)
4. Rode o frontend:
   - `cd frontend && npm run dev`
5. (Opcional) Rode o backend localmente se desejar:
   - `cd backend && npm start`
6. Para o quiz funcionar com feedback sonoro de erro, coloque um arquivo `.mp3` de efeito sonoro em `frontend/public/sounds/error.mp3`.

#### Observações importantes
- **Login obrigatório:** Você só acessa o chat após autenticação (Google ou Anônimo).
- **Popups bloqueados:** Se o botão "Entrar com Google" não abrir, desative bloqueadores de popup/extensões para localhost.
- **Logout:** Ao sair, você retorna automaticamente à tela de login.
- **Erros 400 ou ERR_BLOCKED_BY_CLIENT** ao sair são normais e não afetam o funcionamento.

---

## 📡 Arquitetura e Backend

O frontend está totalmente integrado ao Firebase (Firestore e Auth), dispensando a necessidade de backend próprio para o chat e autenticação.

Caso queira expandir, há um backend Node.js disponível na pasta `/backend` para futuras integrações, rotas customizadas ou tarefas administrativas. Ele não é obrigatório para o funcionamento atual.

### Exemplos de rotas (backend opcional)
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

---

## 📱 Mobile: Em desenvolvimento!

> **Atenção:** O site já funciona em celulares, mas a responsividade e a experiência mobile ainda não estão 100% finalizadas. Melhorias de usabilidade para dispositivos móveis estão em andamento e serão lançadas em breve!

## 🧹 Manutenção e Boas Práticas

- O código foi revisado para remover todas as variáveis e funções não utilizadas.
- Todos os componentes estão organizados, documentados e seguem boas práticas de React.
- Linting e limpeza constantes para garantir manutenibilidade.
- Tratamento de erros orientativo para o usuário.
- Feedback sonoro local para respostas erradas no quiz (adicione seu próprio efeito em `/frontend/public/sounds/error.mp3`).

---

## 🌟 Expansão futura

- Canais temáticos
- Ranking de fãs
- Integração com APIs de e-sports oficiais
- Reações e perfis customizados
- Deploy do backend para novas integrações

---

## 📄 Licença

MIT

---

> Dúvidas ou sugestões? Abra uma [issue](https://github.com/MatheusFranciscoLS/Challenge1Furia/issues) ou entre em contato!

---

## 🖼️ Demonstração

### Prints do Sistema

- Tela de login com botões "Entrar com Google" e "Entrar como Anônimo"
- Chat em funcionamento após login
- Logout retornando à tela de login
- Abertura dos modais de agenda de jogos e placares recentes
- Interação do fã com o bot e comandos

### Vídeo de Demonstração

[Link para vídeo de demonstração (YouTube/Drive)](URL_DO_VIDEO)

### Screenshots

![Tela de Login](/frontend/public/prints/Principal.png)

![Página Inicial](/frontend/public/prints/Inicio.png)

![Chat em funcionamento](/frontend//public/prints/chat.png)

![Ranking dos Fãs](/frontend/public/prints/ranking.png)

![Mural de Recados](/frontend/public/prints/mural.png)

![Página de Placares](/frontend/public/prints/placar.png)

![Modal de Agenda](/frontend/public/prints/Agenda.png)

![Página de Quiz/Enquete](/frontend/public/prints/quiz.png)

![Interação com o Bot](/frontend/public/prints/bot.png)

> **Observação:** A agenda de jogos e os placares exibem até 12 cards por vez. Para alterar esse limite, basta modificar o número no código (`.slice(0, 12)`).

---

**Desenvolvido por fãs, para fãs!**
