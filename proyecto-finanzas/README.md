# Fluxus - LOGIN_SISTEMA_INMOBILIARIO

Sistema de autenticación para el módulo de Crédito MiVivienda.

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar ambos servicios
```bash
npm run start
```
(O separado: `npm run server` en Terminal 1 y `npm run dev` en Terminal 2)

### 3. Abrir en navegador
```
http://localhost:5173
```

**Credenciales de prueba:**
- Usuario: `usuario1`
- Contraseña: `hash123`

---

## 📝 Cambios Realizados

### Nuevos archivos:
- `src/services/authService.js` - Servicio de autenticación
- `src/views/dashboard.vue` - Pantalla principal (protegida)

### Modificados:
- `src/views/login-page.vue` - Login mejorado con validaciones y estilos
- `src/router/index.js` - Protección de rutas con guard
- `vite.config.js` - Config Vite + alias @
- `package.json` - Scripts: dev, build, server, start

---

## 🗄️ Base de Datos - Login

**Ubicación:** `server/db.json`

### Estructura de usuarios:
```json
{
  "users": [
    {
      "id": "d4de",
      "username": "usuario1",
      "password_hash": "hash123",
      "email": "usuario1@email.com",
      "rol": true,
      "created_at": "2024-06-01T12:00:00Z"
    }
  ]
}
```

**Campos:**
- `username` - Identificador para login
- `password_hash` - Contraseña
- `email` - Correo usuario
- `rol` - true = Agente
- `id` - ID único (generado por json-server)

---

## ✅ Funcionalidades

✓ Autenticación contra db.json  
✓ Dashboard principal personalizado  
✓ Protección de rutas  
✓ Logout  
✓ Diseño responsivo  
✓ Validaciones en formularios  

---

## 📋 Scripts Disponibles

```bash
npm run dev       # Desarrollo (Vite)
npm run server    # Backend json-server
npm run start     # Ambos servicios
npm run build     # Build producción
```

---

## 🔗 Puertos

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
