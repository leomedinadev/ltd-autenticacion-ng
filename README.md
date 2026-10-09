# Autenticación con Angular

Demo de un flujo completo de autenticación en **Angular 21**: inicio de sesión, registro, recuperación de contraseña y una zona privada protegida, con manejo de access token y refresh token.

## Qué incluye

- **Login y registro** con formularios reactivos y validaciones propias (espacios en blanco, coincidencia de contraseñas, correo disponible).
- **Recuperación de contraseña** en dos pasos: solicitud por correo y cambio con el token recibido.
- **Guards**: `authGuard` protege el dashboard y `redirectGuard` saca de las páginas públicas a quien ya tiene sesión.
- **Interceptor HTTP** que agrega el `Authorization: Bearer` solo a las peticiones marcadas y renueva el access token con el refresh token cuando expiró.
- **Tokens en cookies** (`Secure`, `SameSite=Strict`) y validación de su expiración con `jwt-decode`.
- Estado del usuario con **signals**.

## Stack

- Angular 21 (componentes standalone, signals, carga diferida de rutas)
- Angular Material (iconos) y Tailwind CSS 4
- SweetAlert2 para los avisos
- Vitest para los tests

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/login` | Inicio de sesión | Público (redirige al dashboard si ya hay sesión) |
| `/register` | Registro | Público |
| `/forgot-password` | Solicitar recuperación | Público |
| `/recovery?token=...` | Cambiar contraseña | Público |
| `/dashboard` | Zona privada | Requiere sesión |
| `/not-found` | Página no encontrada | Público |

## Cómo ejecutar

Requiere Node.js 20 o superior.

```bash
npm install
npm start
```

La aplicación queda en `http://localhost:4200`.

### API

La URL del backend se define en `src/environments/` (`API_URL`). Apunta a una API de demostración de un curso (`fake-trello-api`), que puede no estar disponible. Para usar otra, cambia `API_URL`; la API debe exponer estos endpoints bajo `/api/v1/auth`:

`login`, `register`, `is-available`, `recovery`, `change-password`, `refresh-token` y `profile`.

Las cookies se guardan con el atributo `Secure`: los navegadores las aceptan en `localhost`, pero en otro dominio hace falta HTTPS.

## Tests

```bash
npm test
```

Cubren los guards, la validación de expiración de los tokens y la creación de cada página.

## Build

```bash
npm run build
```
