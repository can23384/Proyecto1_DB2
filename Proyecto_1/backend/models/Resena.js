const mongoose = require("mongoose");

const resenaSchema = new mongoose.Schema({

  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },

  restaurante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurante",
    required: true
  },

  orden_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orden"
  },

  calificacion: {
    type: Number,
    required: true
  },

  comentario: String,

  visible: {
    type: Boolean,
    default: true
  },

  fecha_creacion: {
    type: Date,
    default: Date.now
  },

  respuesta_restaurante: {
    comentario: String,
    fecha: Date
  }

});

module.exports = mongoose.model("Resena", resenaSchema, "reseñas");