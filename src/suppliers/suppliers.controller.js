const suppliersService = require("./suppliers.service.js");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("supplier_name", "supplier_email");

// MIDDLEWARE
async function supplierExists(req, res, next) {
  const supplier = await suppliersService.read(req.params.supplierId);
  if (supplier) {
    res.locals.supplier = supplier;
    return next();
  }
  next({ status: 404, message: `Supplier cannot be found.` });
}

const VALID_PROPERTIES = [
  "supplier_name",
  "supplier_address_line_1",
  "supplier_address_line_2",
  "supplier_city",
  "supplier_state",
  "supplier_zip",
  "supplier_phone",
  "supplier_email",
  "supplier_notes",
  "supplier_type_of_goods",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

// CRUDL handlers
async function list(req, res, next) {
  try {
    const data = await suppliersService.list();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function read(req, res) {
  try {
    const { supplier: data } = res.locals;
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function create(req, res) {
  try {
    const data = await suppliersService.create(req.body.data);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}

async function update(req, res) {
  const updatedSupplier = {
    ...req.body.data,
    supplier_id: res.locals.supplier.supplier_id,
  };
  try {
    const data = await suppliersService.update(updatedSupplier);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function destroy(req, res) {
  const { supplier } = res.locals;
  try {
    await suppliersService.destroy(supplier.supplier_id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list: list,
  read: [supplierExists, read],
  create: [hasOnlyValidProperties, hasRequiredProperties, create],
  update: [
    supplierExists,
    hasOnlyValidProperties,
    hasRequiredProperties,
    update,
  ],
  delete: [supplierExists, destroy],
};
