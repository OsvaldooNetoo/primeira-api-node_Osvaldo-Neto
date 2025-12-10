const http = require("http");

// Armazena em memória local os inputs dos usuários do método POST
let usuarios = [];

// Função para enviar resposta
function sendJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// função createServer utilizada pçara criar o servidor HTTP
const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Rota para listar usuários
  if (method === "GET" && url === "/usuarios") {
    return sendJSON(res, 200, usuarios);
  }

  // Rota para adicionar usuário
  if (method === "POST" && url === "/usuarios") {
    let body = "";

    // Junta os blocos de dados recebidos
    req.on("data", chunk => {
      body += chunk.toString();
    });

    // bloco utilizado quando todos os dados foram recebidos
    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        if (!data.nome || !data.email) {
          return sendJSON(res, 400, { erro: "Envie nome e email" });
        }

        usuarios.push({
          id: usuarios.length + 1,
          nome: data.nome,
          email: data.email,
        });

        return sendJSON(res, 201, { mensagem: "Usuário adicionado com sucesso" });
      } catch (err) {
        return sendJSON(res, 400, { erro: "JSON inválido" });
      }
    });

    return;
  }


  sendJSON(res, 404, { erro: "Rota não encontrada" });
});


server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});