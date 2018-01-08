const express = require('express');
const router = express.Router();
const tenant_company = require('../controllers/tenant_company');

router.get('/', tenant_company.findAll);
router.get('/:id', tenant_company.findById)
router.put('/:id', tenant_company.updateLogoUrl)
router.delete('/:id', tenant_company.removeLogoUrl)

module.exports = router
