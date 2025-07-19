/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {number} statusCode
 * @param   {string} results

 */
exports.success = (message, results, statusCode) => {
  return {
    message,
    error: false,
    code: statusCode,
    results,
  };
};

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {number} statusCode
 */
exports.error = (message, statusCode) => {
  return {
    message,
    code: statusCode,
    error: true,
  };
};
