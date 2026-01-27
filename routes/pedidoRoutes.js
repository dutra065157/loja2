const express = require("express");
const router = express.Router();
const Pedido = require("../models/pedidoModel"); // Importa o modelo do pedido

// Rota para buscar todos os pedidos (GET /api/pedidos)
router.get("/", async (req, res) => {
  try {
    // Busca todos os pedidos, ordenando pelos mais recentes primeiro
    const pedidos = await Pedido.find().sort({ timestamp: -1 });
    res.status(200).json(pedidos);
  } catch (error) {
    res
      .status(500)
      .json({ detail: "Erro ao buscar os pedidos: " + error.message });
  }
});

// Rota para criar um novo pedido (POST /api/pedidos)
router.post("/", async (req, res) => {
  try {
    // Os dados do pedido vêm do corpo da requisição (req.body)
    const novoPedido = new Pedido(req.body);

    // Salva o pedido no banco de dados
    const pedidoSalvo = await novoPedido.save();

    // Retorna o pedido salvo com o status 201 (Criado)
    res.status(201).json(pedidoSalvo);
  } catch (error) {
    res
      .status(400)
      .json({ detail: "Erro ao criar o pedido: " + error.message });
  }
});

module.exports = router;
