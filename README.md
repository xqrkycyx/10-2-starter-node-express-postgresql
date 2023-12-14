# Module 11 Changes + Notes (Deploying server + database):

ASSORTED NOTES:

1. Had to add `package-lock.json` to `.gitignore` to fix build failures on Render (refer back to [summary of learnings about package registries and dependency resolution](https://docs.google.com/document/d/1cC-ahdywh2xn9Kmi8FsLuZZm2wUM6eXJ_3vACR95cwQ/edit?usp=sharing) for detailed explanation of problem.)

Local development:

- Make a copy of `.env.sample` and name it `.env` (and ensure `.env` is properly excluded in `.gitignore`)
- Create dev DB on ElephantSQL and copy the connection URL
- In local `.env` file, assign the connection URL to const `DEVELOPMENT_DATABASE_URL`
- Migrate and seed dev db: `npm run migrate:dev && npm run seed:dev`
- Start server: `npm run start:dev`
- DB troubleshooting: connect to dev db using DBeaver to see tables/records

Deploying to production:

- Create production DB on ElephantSQL and copy the connection URL
- In local `.env` file, assign the connection URL to const `PRODUCTION_DATABASE_URL`
- On Render, create environment variable `PRODUCTION_DATABASE_URL` and paste the connection URL as the value (**do not** include enclosing quotes with URL)
- Migrate and seed prod db: `npm run migrate:prod` && `npm run seed:prod`
- DB troubleshooting: connect to dev db using DBeaver to see tables/records

# Database-connected Server: Node.js, Express & PostgreSQL

This project runs a basic REST API using Node.js, Express, & PostgreSQL (ElephantSQL), with distinct instances for development and production.

# Using the API (Making requests to endpoints)

## GET endpoints for individual resources:

- All products: [/products](https://rest-server-node-express-knex-postgresql.onrender.com/products)
- Single product: [/products/1](https://rest-server-node-express-knex-postgresql.onrender.com/products/1)
- All suppliers: [/suppliers](https://rest-server-node-express-knex-postgresql.onrender.com/suppliers)
- Single supplier: [/suppliers/1](https://rest-server-node-express-knex-postgresql.onrender.com/suppliers/1)
- All categories: [/categories](https://rest-server-node-express-knex-postgresql.onrender.com/categories)
- (^^ There is no endpoint to return info for a single category)

## GET endpoints for aggregate data:

- All out of stock products: [/products/out-of-stock-count](https://rest-server-node-express-knex-postgresql.onrender.com/products/out-of-stock-count)
- Mix, max and average price for each supplier: [/products/price-summary](https://rest-server-node-express-knex-postgresql.onrender.com/products/price-summary)
- Current weight of inventory per product: [/products/total-weight-by-product](https://rest-server-node-express-knex-postgresql.onrender.com/products/total-weight-by-product)
- Current dollar value of inventory per product: [/total-inventory-dollar-value-by-product](https://rest-server-node-express-knex-postgresql.onrender.com/products/total-inventory-dollar-value-by-product)

## POST /suppliers (CREATE new supplier):

`curl --location 'https://rest-server-node-express-knex-postgresql.onrender.com/suppliers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": {
        "supplier_name": "Frances Ha",
        "supplier_address_line_1": "201 Mission St",
        "supplier_address_line_2": "Ste 3000",
        "supplier_city": "San Francisco",
        "supplier_state": "CA",
        "supplier_zip": "94103",
        "supplier_phone": "5184568252",
        "supplier_email": "frances.halady@gmail.com",
        "supplier_notes": "pays on time",
        "supplier_type_of_goods": "kitchenware"
    }
}'`

## PUT /suppliers (UPDATE existing supplier):

`curl --location --request PUT 'https://rest-server-node-express-knex-postgresql.onrender.com/suppliers/6' \
--header 'Content-Type: application/json' \
--data-raw '{
    "data": {
        "supplier_name": "Frances Halady",
        "supplier_address_line_1": "201 Mission St",
        "supplier_address_line_2": "Ste 3000",
        "supplier_city": "San Francisco",
        "supplier_state": "CA",
        "supplier_zip": "94103",
        "supplier_phone": "5184568252",
        "supplier_email": "frances.halady@gmail.com",
        "supplier_notes": "pays on time",
        "supplier_type_of_goods": "kitchenware"
    }
}'
`

## DELETE /suppliers (DESTROY existing supplier)

`curl --location --request DELETE 'https://rest-server-node-express-knex-postgresql.onrender.com/suppliers/6'`

## Existing files

As you work through the Node.js, Express & PostgreSQL module, you will be writing code that allows your controllers to connect to and query your PostgreSQL database via [Knex](http://knexjs.org/). The table below describes the files and folders in the starter code:

| Folder/file path                 | Description                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `src/app.js`                     | Directs requests to the appropriate routers.                                                                          |
| `src/server.js`                  | Starts the server on `localhost:5000` by default.                                                                     |
| `src/products/`                  | A folder that contains the `products.controller.js` and `products.router.js` files for the `products` resource.       |
| `src/categories/`                | A folder that contains the `categories.controller.js` and `categories.router.js` files for the `categories` resource. |
| `src/suppliers/`                 | A folder that contains the `suppliers.controller.js` and `suppliers.router.js` files for the `suppliers` resource.    |
| `src/db/`                        | A folder where you will add migration and seed files for your database later on.                                      |
| `src/db/fixtures`                | A folder containing sample data you will seed your database with later on.                                            |
| `src/errors/methodNotAllowed.js` | An error handler for forbidden request methods                                                                        |
| `.env.sample`                    | A sample environment configuration file                                                                               |

In the `*.controller.js` files, the route handlers return hard-coded data for now, but later on, you will modify the controllers to manipulate and return data from a PostgreSQL database.

This starter code closely follows the best practices and patterns established in the Robust Server Structure module.

## Database setup

1. Set up a new ElephantSQL database instance by following the instructions in the "PostgreSQL: Creating & Deleting Databases" checkpoint.
1. After setting up your database instance, connect DBeaver to your new database instance by following the instructions in the "PostgreSQL: Installing DBeaver" checkpoint.

## Installation

1. Fork and clone this repository.
1. Run `cp .env.sample .env`.
1. Update your `.env` file with a connection URL to your ElephantSQL database instance. The connection URL can be found in your ElephantSQL database instance details (e.g. `"postgres://myfakedatabase:8t6FiWqSDF8GsR--7mrun245I9TofnWd@fakepostgres.db.elephantsql.com:5432/myfakedatabase"`).
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.
1. In your browser or Postman, navigate to `localhost:5000/products`. If your server is running properly, you should get back the following json response:

```json
{
  "data": [
    {
      "product_title": "product 1"
    },
    {
      "product_title": "product 2"
    }
  ]
}
```

If you have trouble getting the server to run, reach out for assistance.
