const handleSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

const handleError = (res, error, customMessage = 'Server Error') => {
  console.error(error.message || error);
  const statusCode = error.statusCode || 500;
  const message = error.message || customMessage;
  return res.status(statusCode).json({ msg: message });
};

const handleNotFound = (res, message = 'Resource not found') => {
  return res.status(404).json({ msg: message });
};

const handleBadRequest = (res, message = 'Bad request') => {
  return res.status(400).json({ msg: message });
};

module.exports = {
  handleSuccess,
  handleError,
  handleNotFound,
  handleBadRequest
};
