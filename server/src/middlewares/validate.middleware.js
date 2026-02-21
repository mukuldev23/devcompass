function validate(schema, target = 'query') {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors
      });
    }

    req[target] = result.data;
    return next();
  };
}

module.exports = validate;
