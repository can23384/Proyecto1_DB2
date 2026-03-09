const mongoose = require("mongoose");

const restauranteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: String,

  categoria: String,

  activo: {
    type: Boolean,
    default: true
  },

  fecha_creacion: {
    type: Date,
    default: Date.now
  },

  direccion: {
    calle: String,
    ciudad: String,
    ubicacion: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: [Number]
    }
  },

  horario: {
    apertura: String,
    cierre: String
  },

  rating_promedio: {
    type: Number,
    default: 0
  },

  total_reseñas: {
    type: Number,
    default: 0
  },

  total_ordenes: {
    type: Number,
    default: 0
  }

});

module.exports = mongoose.model("Restaurante", restauranteSchema);