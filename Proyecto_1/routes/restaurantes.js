const express = require("express");
const router = express.Router();

const Restaurante = require("../models/Restaurante");

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

module.exports = router;