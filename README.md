# MX Shopify multi-tenant js extension

This repo contains the source code of a shopify extensions that provides, both, a backend side fulfilling the schematic, list_items and item_resolver datasources' traits and also, a frontend with a datatable component retrieving elements from backend.

# Backend

The backend provides a rest api with the following openapi contract:

```
openapi: 3.0.0
info:
  title: shopify-multi-tenant openapi contract
  version: 1.0.0
paths:
  /items:
    get:
      summary: Retrieve a list of items
      parameters:        
        - name: subscription-id
          in: header
          description: Subscription ID
          required: false
          schema:
            type: string
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GenericListResponse"
        '401':
          description: Not authorized
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                status: 401
                title: There was an authorization problem calling API
                detail: '{"errors":"Authorization problem"}'
                instance: /items
                trace_id: 88ffd347271fa6ad57bb8807777fd084
                span_id: b22be4154e4ed077
        '503':
          description: Not available
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                status: 503
                title: Resource not available
                detail: '{"errors":"Not available"}'
                instance: /items
                trace_id: 88ffd347271fa6ad57bb8807777fd084
                span_id: b22be4154e4ed077
        '500':
          description: Generic Error
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                status: 500
                title: Internal Server Error
                instance: /items/3
                trace_id: 0245b7b69433e11d1afc0d6b641454ab
                span_id: 4a70708f100a4ffd
  /items/{id}:
    get:
      summary: Retrieve an item by ID
      parameters:
        - name: id
          in: path
          description: ID of the item to retrieve
          required: true
          schema:
            type: string
        - name: subscription-id
          in: header
          description: Subscription ID
          required: false
          schema:
            type: string
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GenericItem"
        '401':
          description: Not authorized
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                status: 401
                title: There was an authorization problem calling API
                detail: '{"errors":"There was an authorization problem calling this op"}'
                instance: /items/1
                trace_id: 88ffd347271fa6ad57bb8807777fd084
                span_id: b22be4154e4ed077
        '404':
          description: Not Found
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                status: 404
                title: Not found
                instance: /items/3
                trace_id: 0245b7b69433e11d1afc0d6b641454ab
                span_id: 4a70708f100a4ffd
        '500':
          description: Generic Error
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                status: 500
                title: Internal Server Error
                instance: /items/3
                trace_id: 0245b7b69433e11d1afc0d6b641454ab
                span_id: 4a70708f100a4ffd
        '503':
          description: Not available
          content:
            application/problem+json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
              example:
                status: 503
                title: Resource not available
                detail: '{"errors":"Not available"}'
                instance: /items/3
                trace_id: 88ffd347271fa6ad57bb8807777fd084
                span_id: b22be4154e4ed077
  /schematic.json:
    get:
      summary: Retrieve a JSON schematic
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object

components:
  schemas:
    ErrorResponse:
      type: object
      properties:
        status:
          type: integer
        title:
          type: string
        detail:
          type: string
        instance:
          type: string
        trace_id:
          type: string
        space_id:
          type: string
      required:
        - status
        - title
        - detail

    GenericItem:
      $ref: "/schematic.json"
    GenericListResponse:
      type: object
      properties:
        size:
          type: integer
        items:
          type: array
          items:
            $ref: "#/components/schemas/GenericItem"


```

Tech stack is typescript and nestjs. There is an overridable config property called

```
SECRETS_URL=https://extensions-service.beta.de.magnolia-cloud.com/secrets
```
By default, it points to the extension manager secrets endpoint deployed in staging, but it can be overridden, by providing an ENV_VAR

# Frontend

It includes a datagrid component, retrieving products from the extension's rest endpoints

Tech stack is react, mui and vite.


# How to package/start the application.

Everything is ruled using the scripts mentioned in [this package.json file](package.json)

```
"start": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm start",
    "build:backend": "cd backend && npm install -g @nestjs/cli && npm install && nest build",
    "build:frontend": "cd frontend && npm install && npm run build",
    "copy:frontend": "cp -r frontend/dist backend/public",
    "package": "npm run build:frontend && npm run copy:frontend && npm run build:backend"
```

* start:backend starts the backend side (with the frontend files available on dist/public ) 
* start:frontned starts the frontend side (without any backend)
* build:backend builds the backend
* build:frontend builds the frontend
* copy:frontend copies dist content to backend's dist/public folder
* package executes build:frontend, copy:frontend and build:backend

# Build & run as a docker image

Just run this command to build the docker image:

```
docker build . -t mx-shopify-multi-js
```

And this, to execute it:

```
docker run -p 3000:3000 mx-shopify-multi-js:latest
```