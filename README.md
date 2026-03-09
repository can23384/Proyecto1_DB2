# FoodRadar 🍽️

FoodRadar es una aplicación web para buscar restaurantes, ver su menú,
realizar órdenes y dejar reseñas. El sistema incluye autenticación de
usuarios, gestión de restaurantes, menú, órdenes y reseñas.

## Tecnologías

-   Frontend: React + Vite
-   Backend: Node.js + Express
-   Base de datos: MongoDB
-   ODM: Mongoose

------------------------------------------------------------------------

## Características

### Usuarios

-   Registro de usuarios
-   Inicio de sesión
-   Dirección de entrega guardada
-   Visualización de restaurantes
-   Realización de órdenes
-   Creación de reseñas

### Restaurantes

-   Crear restaurante
-   Activar / desactivar restaurante
-   Obtener información del restaurante
-   Mostrar rating promedio y total de reseñas
-   Contador automático de órdenes

### Menú

-   Crear item de menú
-   Editar item de menú
-   Eliminar item de menú
-   Mostrar menú del restaurante

### Órdenes

-   Crear orden
-   Actualizar estado de orden
-   Eliminar orden
-   Ver órdenes de un restaurante

### Reseñas

-   Crear reseñas
-   Mostrar reseñas de un restaurante
-   Actualización automática del rating promedio y total de reseñas

------------------------------------------------------------------------

## Instalación

### Clonar repositorio

git clone https://github.com/can23384/Proyecto1_DB2.git cd Proyecto_1

### Instalar backend

cd backend npm install

### Instalar frontend

en la raiz:
npm install

------------------------------------------------------------------------

## Ejecutar el proyecto

### Backend

cd backend node server.js

Servidor: http://localhost:3000

### Frontend
en la raiz:
npm run dev

Aplicación: http://localhost:5173

------------------------------------------------------------------------


## Base de datos

Colecciones utilizadas:

-   usuarios
-   restaurantes
-   menu_items
-   ordenes
-   resenas

Las colecciones utilizan validaciones con JSON Schema para mantener la
integridad de los datos.

------------------------------------------------------------------------

## Autores
Estuardo Andrés Castro Bonifaz - 23890 

Eliazar José Pablo Canastuj Matías - 23384 

Ángel de Jesús Mérida Jiménez - 23661 
