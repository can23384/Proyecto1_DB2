const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({
        error: "Email o contraseña incorrectos"
      });
    }

    // comparación directa (sin hash)
    if (password !== usuario.password_hash) {
      return res.status(401).json({
        error: "Email o contraseña incorrectos"
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        error: "Usuario desactivado"
      });
    }

    res.json({
      message: "Login exitoso",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error en login"
    });

  }

});

module.exports = router;

router.post("/register", async (req, res) => {

  try {

    const { nombre, email, password, telefono, rol, direccion } = req.body;

    // verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({
        error: "El email ya está registrado"
      });
    }

    // validar rol permitido
    const rolesPermitidos = ["cliente", "owner"];

    const rolFinal = rolesPermitidos.includes(rol) ? rol : "cliente";

    const nuevoUsuario = new Usuario({
      nombre: nombre,
      email: email,
      password_hash: password,
      telefono: telefono,
      rol: rolFinal,
      activo: true,
      fecha_registro: new Date(),

      direccion_principal: {
        calle: direccion.calle,
        ciudad: direccion.ciudad,
        referencia: direccion.referencia,

        ubicacion: {
          type: "Point",
          coordinates: [
            direccion.lng,
            direccion.lat
          ]
        }
      }

    });

    await nuevoUsuario.save();

    res.status(201).json({
      message: "Usuario registrado correctamente",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error registrando usuario"
    });

  }

});