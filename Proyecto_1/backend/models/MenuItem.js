const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({

  restaurante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurante",
    required: true
  },

  nombre: {
    type: String,
    required: true
  },

  descripcion: String,

  categoria: String,

  precio: {
    type: Number,
    required: true
  },

  disponible: {
    type: Boolean,
    default: true
  },

  fecha_creacion: {
    type: Date,
    default: Date.now
  },

  imagen_url: String,

  total_vendidos: {
    type: Number,
    default: 0
  }

});

module.exports = mongoose.model("menu_items", menuItemSchema);