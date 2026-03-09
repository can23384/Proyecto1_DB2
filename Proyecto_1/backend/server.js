const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const restaurantesRoutes = require("./routes/restaurantes");
const resenasRoutes = require("./routes/reseñas");
const menuRoutes = require("./routes/menu");
const authRoutes = require("./routes/auth");
const ordenRoutes = require("./routes/ordenes");

const app = express();

app.use(cors());
app.use(express.json());


// conexión a MongoDB
mongoose.connect("mongodb+srv://Eliazar01:789@angelmerida.lg3cogo.mongodb.net/Proyecto01")
.then(() => {
    console.log("Conectado a MongoDB");
})
.catch((error) => {
    console.log("Error de conexión:", error);
});


app.use("/restaurantes", restaurantesRoutes);
app.use("/resenas", resenasRoutes);
app.use("/menu", menuRoutes);
app.use("/auth", authRoutes);
app.use("/ordenes", ordenRoutes);


app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
});

