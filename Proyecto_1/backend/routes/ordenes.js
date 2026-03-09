const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Orden = require("../models/Orden");
const Usuario = require("../models/Usuario");
const Restaurante = require("../models/Restaurante");

router.post("/", async (req, res) => {

  try {

    const { usuario_id, restaurante_id, items } = req.body;

    const usuario = await Usuario.findById(usuario_id);

    const direccion = usuario.direccion_principal;

    const formattedItems = items.map(item => {

      const subtotal = Number(item.precio_unitario) * Number(item.cantidad);

      return {
        menu_item_id: new mongoose.Types.ObjectId(item.menu_item_id),
        nombre: item.nombre,
        precio_unitario: Number(item.precio_unitario),
        cantidad: Number(item.cantidad),
        subtotal: subtotal
      };

    });

    const total = formattedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const nuevaOrden = new Orden({

      usuario_id: new mongoose.Types.ObjectId(usuario_id),

      restaurante_id: new mongoose.Types.ObjectId(restaurante_id),

      items: formattedItems,

      total: total,

      estado: "creada",

      fecha_creacion: new Date(),

      fecha_actualizacion: new Date(),

      direccion_entrega: {
        calle: direccion.calle,
        ciudad: direccion.ciudad,
        ubicacion: {
          type: "Point",
          coordinates: direccion.ubicacion.coordinates
        }
      }

    });

    const ordenGuardada = await nuevaOrden.save();

    await Restaurante.findByIdAndUpdate(
  restaurante_id,
  { $inc: { total_ordenes: 1 } }
);

    res.status(201).json({
      message: "Orden creada correctamente",
      orden: ordenGuardada
    });

  } catch (error) {

    console.log("ERROR CREANDO ORDEN:");
    console.log(JSON.stringify(error.errInfo, null, 2));

    res.status(500).json({
      error: "Error creando orden"
    });

  }

});

router.get("/restaurante/:id", async (req, res) => {

  try {

    const restauranteId = new mongoose.Types.ObjectId(req.params.id);

    const ordenes = await Orden.aggregate([

      {
        $match: {
          restaurante_id: restauranteId
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
        $unwind: "$usuario"
      },

      {
        $project: {

          usuario_nombre: "$usuario.nombre",

          items: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                nombre: "$$item.nombre",
                cantidad: "$$item.cantidad"
              }
            }
          },

          total: 1,

          estado: 1,

          fecha_creacion: 1,

          direccion_entrega: {
            calle: "$direccion_entrega.calle",
            ciudad: "$direccion_entrega.ciudad"
          }

        }
      },

      {
        $sort: {
          fecha_creacion: -1
        }
      }

    ]);

    res.json(ordenes);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo ordenes"
    });

  }

});

router.patch("/:id", async (req, res) => {

  try {

    const { estado, total, direccion_entrega } = req.body;

    const ordenActualizada = await Orden.findByIdAndUpdate(

      req.params.id,

      {
        ...(estado && { estado }),
        ...(total && { total }),
        ...(direccion_entrega && { direccion_entrega }),
        fecha_actualizacion: new Date()
      },

      { new: true }

    );

    if (!ordenActualizada) {
      return res.status(404).json({
        error: "Orden no encontrada"
      });
    }

    res.json({
      message: "Orden actualizada",
      orden: ordenActualizada
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error actualizando orden"
    });

  }

});

router.delete("/:id", async (req, res) => {

  try {

    const orden = await Orden.findByIdAndDelete(req.params.id);

    if (!orden) {
      return res.status(404).json({
        error: "Orden no encontrada"
      });
    }

    res.json({
      message: "Orden eliminada correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error eliminando orden"
    });

  }

});

module.exports = router;