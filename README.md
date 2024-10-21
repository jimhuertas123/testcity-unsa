# Proyecto TestCity

Este proyecto está dividido en dos partes principales: el cliente y el servidor. A continuación, se proporciona una breve descripción de cada una de estas partes.

## TestCity Client

El client de TestCity es un frontend que se encuentra en [`testcity-client/`](testcity-client/).

## TestCity Server

El servidor de TestCity se encuentra en [`testcity-server/`](testcity-server/). Esta aplicación está construida utilizando el framework NestJS.

- `README.md`: Documentación del servidor.
- `repositories/`: Directorio que contiene los repositorios de datos.

## Cómo Empezar

### Database
Se usa MySQL para guardan la información de la contruccion de la ciudad y los reportes de las pruebas de la misma.

- `Mysql`: Versión 9.0.1 for macos13.6 on arm64 (Homebrew)

#### Previo

- Crear la base de datos con el nombre de **testcitydb**

### Server (Backend)
Para iniciar el servidor, navega al directorio [`testcity-server/`](testcity-server/) y ejecuta los siguientes comandos:

```sh
yarn
yarn start:dev
```

#### Previo

- crear el archivo `testcity-server/.env`:
```sql
DB_PASSWORD = password123
DB_NAME     = db123
DB_HOST     = localhost
DB_PORT     = 3306
DB_USERNAME = your_db
```

### Client (Frontend)
Para iniciar el client, navega al directorio [`testcity-client/`](testcity-client/) y ejecuta los siguientes comandos:

```sh
yarn
yarn dev
```

