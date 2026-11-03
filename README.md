# Tienda Online: Django + React

Guía para preparar y ejecutar el proyecto en Windows con PowerShell.

## Requisitos

- Python instalado y disponible como `python` en PowerShell.
- Node.js LTS (incluye `npm`).
- MySQL Server iniciado.

## 1. Preparar la base de datos

Entra a MySQL con una cuenta que pueda crear bases de datos:

```powershell
mysql -u root -p
```

En la consola de MySQL, crea la base que espera Django:

```sql
CREATE DATABASE django_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

La conexión está configurada en `tienda_online/settings.py`. Si tu usuario, contraseña, host o puerto de MySQL son distintos, actualiza allí los valores de `DATABASES` antes de continuar.

## 2. Instalar y preparar Django

Abre PowerShell en la carpeta raíz del proyecto (donde está `manage.py`) y ejecuta:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
```

Si PowerShell bloquea la activación del entorno, permite scripts solo para la terminal actual y actívalo otra vez:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

Para administrar usuarios desde Django Admin, crea un superusuario:

```powershell
python manage.py createsuperuser
```

## 3. Instalar React

Abre una segunda terminal PowerShell en la raíz del proyecto:

```powershell
cd frontend
npm install
```

El archivo `frontend/.env` ya apunta a Django en `http://127.0.0.1:8000`. Si cambias el host o puerto del backend, actualiza `VITE_BASE_API_URL` y reinicia Vite.

## 4. Ejecutar la aplicación

Inicia Django en una terminal, desde la raíz del proyecto y con el entorno virtual activo:

```powershell
python manage.py runserver
```

Inicia React en la segunda terminal:

```powershell
cd frontend
npm run dev
```

Abre **http://127.0.0.1:5173**. Puedes crear una cuenta en `/register` y después iniciar sesión en `/login`. El dashboard protegido aparece en `/dashboard`.

## Endpoints del backend

- `POST /api/v1/auth/register/`: crea una cuenta con `username`, `email` y `password`.
- `POST /api/v1/auth/token/`: obtiene tokens JWT enviando `email` y `password`.
- `POST /api/v1/auth/token/refresh/`: renueva el access token.
- `GET /api/v1/auth/me/`: devuelve los datos del usuario autenticado.
- `GET /api/v1/soap/capital/MX/`: consulta la capital mediante un servicio SOAP; requiere `Authorization: Bearer <access>`.
- `/api/v1/users/`: CRUD administrativo de usuarios; requiere permisos de administrador.
- `/admin/`: panel administrativo de Django.

El dashboard consume una frase de DummyJSON desde el navegador y ofrece un botón para consultar el servicio SOAP. Ambos servicios externos requieren conexión a Internet.
