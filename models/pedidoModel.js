const mongoose = require("mongoose");

// Função para gerar um número de pedido simples
function gerarNumeroPedido() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${timestamp}-${random}`;
}

const pedidoSchema = new mongoose.Schema({
  numero_pedido: {
    type: String,
    default: gerarNumeroPedido,
    unique: true,
  },
  itens: { type: Array, required: true },
  total: { type: Number, required: true },
  cliente: { type: String, required: true },
  telefone: { type: String, required: true },
  endereco: { type: String, required: true },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Pedido = mongoose.model("Pedido", pedidoSchema);

module.exports = Pedido;
