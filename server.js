require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const produtoRoutes = require("./routes/produtoRoutes"); // Importa as rotas de produtos
const pedidoRoutes = require("./routes/pedidoRoutes"); // Importa as rotas de pedidos

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configurações ---

// Habilitar CORS para permitir que a página (front-end) se comunique com este servidor
app.use(cors());

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// --- Conexão com o MongoDB ---
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error(
    "❌ Erro: A variável de ambiente MONGODB_URI não foi definida. Crie um arquivo .env e adicione-a."
  );
  process.exit(1); // Encerra a aplicação se a string de conexão não estiver presente
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso!"))
  .catch((err) => {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
    process.exit(1); // Encerra o processo para o Render tentar reiniciar
  });

// Servir arquivos estáticos (HTML, CSS, JS, e as imagens que vamos salvar)
app.use(express.static(__dirname)); // Serve a pasta 'c:\loja2'
app.use("/images", express.static(path.join(__dirname, "images"))); // Torna a pasta 'images' acessível via URL

// --- Rotas da API ---
// Diz ao Express para usar o arquivo de rotas para qualquer requisição que comece com '/api/produtos'
app.use("/api/produtos", produtoRoutes);
app.use("/api/pedidos", pedidoRoutes); // Adiciona a nova rota de pedidos

// --- Iniciar o Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Sua loja está acessível em http://localhost:3000/index.html");
});
