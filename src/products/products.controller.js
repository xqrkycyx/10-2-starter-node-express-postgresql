const productsService = require("./products.service");

async function productExists(req, res, next) {
  const product = await productsService.read(req.params.productId);
  if (product) {
    res.locals.product = product;
    return next();
  }
  next({ status: 404, message: `Product cannot be found.` });
}

function read(req, res) {
  try {
    const { product: data } = res.locals;
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const data = await productsService.list();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function listOutOfStockCount(req, res, next) {
  try {
    res.json({ data: await productsService.listOutOfStockCount() });
  } catch (error) {
    next(error);
  }
}

async function listPriceSummary(req, res, next) {
  try {
    res.json({ data: await productsService.listPriceSummary() });
  } catch (error) {
    next(error);
  }
}

async function listTotalWeightByProduct(req, res, next) {
  try {
    res.json({ data: await productsService.listTotalWeightByProduct() });
  } catch (error) {
    next(error);
  }
}
async function listTotalInventoryDollarValueByProduct(req, res, next) {
  try {
    res.json({
      data: await productsService.listTotalInventoryDollarValueByProduct(),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
};

module.exports = {
  read: [productExists, read],
  list: [list],
  listOutOfStockCount: listOutOfStockCount,
  listPriceSummary: listPriceSummary,
  listTotalWeightByProduct: listTotalWeightByProduct,
  listTotalInventoryDollarValueByProduct:
    listTotalInventoryDollarValueByProduct,
};
