const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password_hash: {
    type: String,
    required: true
  },

  telefono: String,

  rol: {
    type: String,
    enum: ["cliente", "admin", "owner"],
    default: "cliente"
  },

  activo: {
    type: Boolean,
    default: true
  },

  fecha_registro: {
    type: Date,
    default: Date.now
  },

  ultima_conexion: Date,

  direccion_principal: {

    calle: String,
    ciudad: String,
    referencia: String,

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

module.exports = mongoose.model("usuarios", usuarioSchema);