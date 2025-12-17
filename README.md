
BlackMarkPet API
=================

Descripción
-----------

API backend para una tienda (BlackMarkPet). Implementada con Express y Sequelize (Postgres). Este README documenta cómo instalar, configurar y usar las APIs disponibles en el proyecto.

Tecnologías
-----------

- Node.js + Express
- Sequelize (Postgres)
- transbank-sdk (pagos)
- JWT para autenticación

Instalación y ejecución
-----------------------

Requisitos previos:

- Node.js (v16+ recomendable)
- npm
- Una base de datos Postgres accesible

Pasos:

1. Instalar dependencias:

	 npm install

2. Configurar variables de entorno (opcional):

	 - Puedes crear un archivo `.env` en la carpeta `Backend-Bmp-Express` para variables como `PORT` y credenciales del servicio de pagos. Este proyecto incluye `config/config.json` para Sequelize; modifica ese archivo o usa variables de entorno según tu flujo.

3. Ejecutar migraciones (si las usas):

	 npx sequelize-cli db:migrate

4. (Opcional) Cargar datos por defecto si tienes seeders:

	 npx sequelize-cli db:seed:all

5. Iniciar el servidor:

	 node server.js

Por defecto el servidor escucha en el puerto `3001` si `PORT` no está definido.

Punto de entrada de la API
-------------------------

Base URL: http://localhost:3001/api

Rutas disponibles
------------------

Todas las rutas están montadas en `server.js` con las siguientes bases:

- `POST /api/auth` -> autenticación
- `GET/POST/PUT/DELETE /api/productos` -> productos
- `GET/POST/PUT/DELETE /api/orders` -> pedidos/ventas
- `GET/POST/PUT/DELETE /api/users` -> usuarios
- `GET /api/dashboard` -> estadísticas
- `POST /api/payment` -> pagos

Detalle de endpoints
---------------------

**Autenticación** (`/api/auth`)

- `POST /api/auth/register`
	- Descripción: Registrar un nuevo usuario.
	- Body (JSON):
		- `name` (string)
		- `email` (string)
		- `password` (string)
	- Respuesta: usuario creado y/o token JWT según la implementación.

- `POST /api/auth/login`
	- Descripción: Autenticar usuario y recibir token.
	- Body (JSON):
		- `email` (string)
		- `password` (string)
	- Respuesta: `{ token: <jwt>, user: { ... } }` o error 401 en credenciales inválidas.

Nota: Las rutas que requieren autenticación esperan un header `Authorization: Bearer <token>`.

**Productos** (`/api/productos`)

- `GET /api/productos`
	- Descripción: Listar todos los productos.
	- Query params: opcionales según implementación (paginación, filtros).

- `GET /api/productos/:id`
	- Descripción: Obtener detalle de un producto por `id`.

- `POST /api/productos`
	- Descripción: Crear un nuevo producto.
	- Body (JSON) típico:
		- `name` (string)
		- `description` (string)
		- `price` (number)
		- `stock` (number)
		- `image` (string) - URL o nombre

- `PUT /api/productos/:id`
	- Descripción: Actualizar un producto por `id`.
	- Body: campos a actualizar (mismos que en `POST`).

- `DELETE /api/productos/:id`
	- Descripción: Eliminar un producto por `id`.

**Pedidos / Orders** (`/api/orders`)

- `POST /api/orders`
	- Descripción: Crear una orden/compra.
	- Body (JSON) ejemplo:
		- `userId` (number)
		- `items`: array de objetos `{ productId, quantity, price }`
		- `total` (number)
	- Respuesta: orden creada con su `id`.

- `GET /api/orders/user/:userId`
	- Descripción: Obtener historial de compras de un usuario.

- `GET /api/orders`
	- Descripción: Listar todas las ventas (administrador).

- `GET /api/orders/:id`
	- Descripción: Obtener detalle de una venta por `id`.

- `PUT /api/orders/:id`
	- Descripción: Actualizar estado de la orden (por ejemplo `status: 'Enviado'`).
	- Body: `{ status: '...' }` u otros campos según implementación.

- `DELETE /api/orders/:id`
	- Descripción: Eliminar una venta por `id`.

**Usuarios** (`/api/users`)

- `GET /api/users`
	- Descripción: Obtener lista de usuarios.

- `POST /api/users`
	- Descripción: Crear un usuario (alternativa a `/api/auth/register`).
	- Body: datos del usuario (`name`, `email`, `password`, etc.).

- `PUT /api/users/:id`
	- Descripción: Actualizar datos de usuario por `id`.

- `DELETE /api/users/:id`
	- Descripción: Eliminar un usuario por `id`.

**Dashboard** (`/api/dashboard`)

- `GET /api/dashboard/`
	- Descripción: Obtener métricas básicas del sistema (ventas totales, usuarios, productos, etc.).
	- Respuesta: objeto con estadísticas (campos dependientes de `dashboardController.getStats`).

**Pagos** (`/api/payment`)

- `POST /api/payment/init`
	- Descripción: Iniciar transacción de pago (integración con `transbank-sdk`).
	- Body: datos de la transacción (monto, orden, URLs de retorno) según la integración.

- `POST /api/payment/commit`
	- Descripción: Finalizar/confirmar transacción.
	- Body: datos de confirmación según la pasarela.

Mensajes de error y códigos HTTP
--------------------------------

- Éxito: 200 / 201
- Creación: 201
- No autorizado: 401
- No encontrado: 404
- Error servidor: 500

Notas y recomendaciones
----------------------

- Revisa `server.js` para ver las rutas base y middlewares. (La aplicación monta las rutas en `/api/*`).
- El archivo de configuración de Sequelize es `config/config.json`.
- Asegúrate de no exponer credenciales en repositorios públicos. Usa `.env` para credenciales sensibles.

Archivos relevantes
------------------

- Rutas: [Backend-Bmp-Express/routes](Backend-Bmp-Express/routes)
- Controladores: [Backend-Bmp-Express/controllers](Backend-Bmp-Express/controllers)
- Modelos: [Backend-Bmp-Express/models](Backend-Bmp-Express/models)
- Configuración de Sequelize: [Backend-Bmp-Express/config/config.json](Backend-Bmp-Express/config/config.json#L1-L1)
- Punto de entrada: [Backend-Bmp-Express/server.js](Backend-Bmp-Express/server.js#L1-L1)
