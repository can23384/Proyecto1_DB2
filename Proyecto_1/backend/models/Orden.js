const mongoose = require("mongoose");

const ordenSchema = new mongoose.Schema({

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

  total: {
    type: Number,
    required: true
  },

  estado: {
    type: String,
    enum: [
      "creada",
      "pagada",
      "preparando",
      "en_camino",
      "entregada",
      "cancelada"
    ],
    default: "creada"
  },

  metodo_pago: String,

  fecha_creacion: {
    type: Date,
    default: Date.now
  },

  fecha_actualizacion: Date,

  items: [
    {
      menu_item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem"
      },

      nombre: String,
      precio_unitario: Number,
      cantidad: Number,
      subtotal: Number
    }
  ],

  direccion_entrega: {

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

  }

});

module.exports = mongoose.model("ordenes", ordenSchema);