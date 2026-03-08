const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const MenuItem = require("../models/MenuItem");

router.get("/restaurante/:id", async (req, res) => {

  try {

    const restauranteId = new mongoose.Types.ObjectId(req.params.id);

    const menu = await MenuItem.aggregate([
      {
        $match: {
          restaurante_id: restauranteId,
          disponible: true
        }
      },
      {
        $project: {
          nombre: 1,
          precio: 1
        }
      },
      {
        $limit: 10
      }
    ]);

    res.json(menu);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error obteniendo menú" });

  }

});

router.get("/restaurante/:id/todos", async (req, res) => {

  try {

    const restauranteId = new mongoose.Types.ObjectId(req.params.id);

    const menu = await MenuItem.aggregate([
      {
        $match: {
          restaurante_id: restauranteId,
          disponible: true
        }
      },
      {
        $project: {
          nombre: 1,
          descripcion: 1,
          categoria: 1,
          precio: 1,
          imagen_url: 1,
          total_vendidos: 1
        }
      },
      {
        $sort: {
          categoria: 1,
          nombre: 1
        }
      }
    ]);

    res.json(menu);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo menú completo"
    });

  }

});


router.patch("/:id", async (req, res) => {

  try {

    const {
      nombre,
      descripcion,
      categoria,
      precio,
      disponible,
      imagen_url
    } = req.body;

    const menuActualizado = await MenuItem.findByIdAndUpdate(

      req.params.id,

      {
        ...(nombre && { nombre }),
        ...(descripcion && { descripcion }),
        ...(categoria && { categoria }),
        ...(precio && { precio }),
        ...(disponible !== undefined && { disponible }),
        ...(imagen_url && { imagen_url })
      },

      { new: true }

    );

    if (!menuActualizado) {
      return res.status(404).json({
        error: "Item de menú no encontrado"
      });
    }

    res.json({
      message: "Item de menú actualizado",
      item: menuActualizado
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error actualizando item del menú"
    });

  }

});

router.delete("/:id", async (req, res) => {

  try {

    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        error: "Item de menú no encontrado"
      });
    }

    res.json({
      message: "Item eliminado correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error eliminando item"
    });

  }

});

router.post("/", async (req, res) => {

  try {

    const {
      restaurante_id,
      nombre,
      descripcion,
      categoria,
      precio
    } = req.body;

    const nuevoItem = new MenuItem({

      restaurante_id: new mongoose.Types.ObjectId(restaurante_id),

      nombre: nombre,

      descripcion: descripcion || "",

      categoria: categoria || "",

      precio: Number(precio),

      disponible: true,

      fecha_creacion: new Date(),

      imagen_url: "",

      total_vendidos: 0

    });

    const itemGuardado = await nuevoItem.save();

    res.status(201).json({
      message: "Item de menú creado correctamente",
      item: itemGuardado
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error creando item del menú"
    });

  }

});

module.exports = router;