const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  telefone: { type: String, required: true },
  endereco: { type: String, required: true },
  itens: { type: Array, required: true },
  total: { type: Number, required: true },
  numero_pedido: { type: String },
  timestamp: { type: Date, default: Date.now },
});

// Gera um número de pedido aleatório antes de salvar (ex: #123456)
pedidoSchema.pre("save", function () {
  if (!this.numero_pedido) {
    this.numero_pedido = "#" + Math.floor(100000 + Math.random() * 900000);
  }
});

module.exports = mongoose.model("Pedido", pedidoSchema);
