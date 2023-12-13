const knex = require("../db/connection");

function list() {
  return knex("products").select("*");
}

function read(productId) {
  // Original method:
  // return knex("products").select("*").where({ product_id: productId }).first();

  // 10-9: REWRITE WITH JOINS ACROSS THREE TABLES: products, products_categories, categories tables
  // (Recall the analogous SQL query from 9-4: sequential joins of 3 tables: employees + employees_projects + projects
  // https://overview.thinkful.com/curriculum/BACK_END-501/be-backend-web-development/be-creating-relations/be-joining-tables
  return knex("products as p")
    .join("products_categories as pc", "p.product_id", "pc.product_id")
    .join("categories as c", "pc.category_id", "c.category_id")
    .select("p.*", "c.*")
    .where({ "p.product_id": productId })
    .first();
}

function listOutOfStockCount() {
  return knex("products")
    .select("product_quantity_in_stock as out_of_stock")
    .count("product_id")
    .where({ product_quantity_in_stock: 0 })
    .groupBy("out_of_stock");
}

function listPriceSummary() {
  return knex("products")
    .select("supplier_id")
    .min("product_price")
    .max("product_price")
    .avg("product_price")
    .groupBy("supplier_id");
}

function listTotalWeightByProduct() {
  return knex("products")
    .select(
      "product_sku",
      "product_title",
      knex.raw(
        "sum(product_weight_in_lbs * product_quantity_in_stock) as total_weight_in_lbs"
      )
    )
    .groupBy("product_title", "product_sku");
}

function listTotalInventoryDollarValueByProduct() {
  return knex("products")
    .select(
      "product_sku",
      "product_title",
      knex.raw(
        "sum(product_quantity_in_stock  * product_price) as total_dollar_value"
      )
    )
    .groupBy("product_sku", "product_title")
    .orderBy("total_dollar_value", "desc");
}

module.exports = {
  list,
  read,
  listOutOfStockCount,
  listPriceSummary,
  listTotalWeightByProduct,
  listTotalInventoryDollarValueByProduct,
};
