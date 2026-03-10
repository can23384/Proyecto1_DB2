const express = require("express");
const router = express.Router();

const Restaurante = require("../models/Restaurante");
const Orden = require("../models/Orden");
const Resena = require("../models/Resena");

// GET todos los restaurantes
router.get("/", async (req, res) => {
  try {

    const restaurantes = await Restaurante.find();

    res.json(restaurantes);

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo restaurantes" });
  }
});



router.get("/:id/info", async (req, res) => {
  try {

    const restaurante = await Restaurante.findById(
      req.params.id,
      {
        nombre: 1,
        descripcion: 1,
        categoria: 1,
        "direccion.calle": 1,
        "direccion.ciudad": 1,
        horario: 1,
        rating_promedio: 1
      }
    );

    if (!restaurante) {
      return res.status(404).json({ error: "Restaurante no encontrado" });
    }

    res.json(restaurante);

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo información del restaurante" });
  }
});

router.patch("/:id/activo", async (req, res) => {

  try {

    const { activo } = req.body;

    const restaurante = await Restaurante.findByIdAndUpdate(

      req.params.id,

      { activo: activo },

      { new: true }

    );

    if (!restaurante) {
      return res.status(404).json({
        error: "Restaurante no encontrado"
      });
    }

    res.json({
      message: "Estado actualizado",
      restaurante
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error actualizando estado"
    });

  }

});

router.post("/", async (req, res) => {

  try {

    const {
      nombre,
      descripcion,
      categoria,
      calle,
      ciudad,
      lat,
      lng,
      apertura,
      cierre
    } = req.body;

    const nuevoRestaurante = new Restaurante({

      nombre: nombre,

      descripcion: descripcion || "",

      categoria: categoria,

      activo: req.body.activo ?? true,

      fecha_creacion: new Date(),

      direccion: {
        calle: calle,
        ciudad: ciudad,
        ubicacion: {
          type: "Point",
          coordinates: [Number(lng), Number(lat)]
        }
      },

      horario: {
        apertura: apertura || "",
        cierre: cierre || ""
      }

      // rating_promedio = 0 (default)
      // total_reseñas = 0 (default)
      // total_ordenes = 0 (default)

    });

    const restauranteGuardado = await nuevoRestaurante.save();

    res.status(201).json({
      message: "Restaurante creado correctamente",
      restaurante: restauranteGuardado
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error creando restaurante"
    });

  }

});

router.delete("/:id", async (req, res) => {

  try {

    const restaurante = await Restaurante.findByIdAndDelete(req.params.id);

    if (!restaurante) {
      return res.status(404).json({
        error: "Restaurante no encontrado"
      });
    }

    res.json({
      message: "Restaurante eliminado correctamente"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error eliminando restaurante"
    });

  }

});

// ─── AGREGACIONES SIMPLES ───────────────────────────────────────

router.get("/agregaciones/count-activos", async (req, res) => {
  try {
    const total = await Restaurante.countDocuments({ activo: true });
    res.json({ total_activos: total });
  } catch (error) {
    res.status(500).json({ error: "Error en count" });
  }
});

router.get("/agregaciones/ciudades", async (req, res) => {
  try {
    const ciudades = await Restaurante.distinct("direccion.ciudad");
    res.json(ciudades);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo ciudades" });
  }
});

router.get("/agregaciones/por-categoria", async (req, res) => {
  try {
    const resultado = await Restaurante.aggregate([
      { $group: { _id: "$categoria", total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error en agregación" });
  }
});

// ─── AGREGACIONES COMPLEJAS ─────────────────────────────────────

router.get("/agregaciones/mejor-calificados", async (req, res) => {
  try {
    const resultado = await Resena.aggregate([
      { $match: { visible: true } },
      {
        $group: {
          _id: "$restaurante_id",
          rating_promedio: { $avg: "$calificacion" },
          total_reseñas: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "restaurantes",
          localField: "_id",
          foreignField: "_id",
          as: "restaurante"
        }
      },
      { $unwind: "$restaurante" },
      {
        $project: {
          nombre: "$restaurante.nombre",
          categoria: "$restaurante.categoria",
          ciudad: "$restaurante.direccion.ciudad",
          rating_promedio: { $round: ["$rating_promedio", 2] },
          total_reseñas: 1
        }
      },
      { $sort: { rating_promedio: -1 } },
      { $limit: 10 }
    ]);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error en agregación" });
  }
});

router.get("/agregaciones/platillos-mas-vendidos", async (req, res) => {
  try {
    const resultado = await Orden.aggregate([
      { $match: { estado: { $in: ["entregada", "pagada"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menu_item_id",
          nombre: { $first: "$items.nombre" },
          total_vendido: { $sum: "$items.cantidad" },
          ingresos: { $sum: "$items.subtotal" }
        }
      },
      { $sort: { total_vendido: -1 } },
      { $limit: 10 }
    ]);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error en agregación" });
  }
});

router.get("/agregaciones/ingresos-por-restaurante", async (req, res) => {
  try {
    const resultado = await Orden.aggregate([
      { $match: { estado: { $in: ["entregada", "pagada"] } } },
      {
        $group: {
          _id: "$restaurante_id",
          total_ingresos: { $sum: "$total" },
          total_ordenes: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "restaurantes",
          localField: "_id",
          foreignField: "_id",
          as: "restaurante"
        }
      },
      { $unwind: "$restaurante" },
      {
        $project: {
          nombre: "$restaurante.nombre",
          total_ingresos: 1,
          total_ordenes: 1,
          ticket_promedio: { $divide: ["$total_ingresos", "$total_ordenes"] }
        }
      },
      { $sort: { total_ingresos: -1 } }
    ]);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "Error en agregación" });
  }
});
module.exports = router;