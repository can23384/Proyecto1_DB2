const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Resena = require("../models/Resena");
const Restaurante = require("../models/Restaurante");

router.get("/restaurante/:id", async (req, res) => {
  try {

    const restauranteId = new mongoose.Types.ObjectId(req.params.id);

    const resenas = await Resena.aggregate([
      {
        $match: {
          restaurante_id: restauranteId,
          visible: true
        }
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "usuario_id",
          foreignField: "_id",
          as: "usuario"
        }
      },
      {
        $unwind: {
          path: "$usuario",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          usuario_id: 1,
          restaurante_id: 1,
          comentario: 1,
          calificacion: 1,
          usuario_nombre: "$usuario.nombre"
        }
      }
    ]);

    res.json(resenas);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo reseñas" });
  }
});

router.post("/", async (req, res) => {

  try {

    const { usuario_id, restaurante_id, calificacion, comentario } = req.body;

    const nuevaResena = new Resena({
      usuario_id,
      restaurante_id,
      calificacion,
      comentario,
      visible: true,
      fecha_creacion: new Date()
    });

    await nuevaResena.save();

    // calcular nuevo rating promedio
    const stats = await Resena.aggregate([
      {
        $match: {
          restaurante_id: new mongoose.Types.ObjectId(restaurante_id),
          visible: true
        }
      },
      {
        $group: {
          _id: "$restaurante_id",
          promedio: { $avg: "$calificacion" },
          total: { $sum: 1 }
        }
      }
    ]);

    const promedio = stats[0]?.promedio || 0;
    const total = stats[0]?.total || 0;

    await Restaurante.findByIdAndUpdate(
      restaurante_id,
      {
        rating_promedio: promedio,
        total_reseñas: total
      }
    );

    res.status(201).json({
      message: "Reseña creada correctamente",
      rating_promedio: promedio
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error creando reseña"
    });

  }

});

module.exports = router;

