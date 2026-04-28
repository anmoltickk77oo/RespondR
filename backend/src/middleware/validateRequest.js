const logger = require('../utils/logger');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e) {
    // ZodError has .issues (and sometimes .errors)
    const issues = e.issues || e.errors;
    
    if (issues) {
      console.log('❌ Validation Error Details:', JSON.stringify(issues, null, 2));
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors: issues.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    
    logger.error('Unexpected Validation Middleware Error: %o', e);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error during validation'
    });
  }
};

module.exports = validate;
