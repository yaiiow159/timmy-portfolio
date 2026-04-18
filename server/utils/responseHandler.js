const handleSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

// 先集中映射常見資料層錯誤，可避免每條路由重複維護狀態碼對應
const PRISMA_ERROR_MAP = {
  P2002: {
    status: 409,
    message: 'Resource already exists'
  },
  P2025: {
    status: 404,
    message: 'Resource not found'
  }
};

const handleError = (res, error, customMessage = 'Server Error') => {
  console.error(error.message || error);
  const prismaMappedError = error.code ? PRISMA_ERROR_MAP[error.code] : null;
  const statusCode = error.statusCode || prismaMappedError?.status || 500;
  const message = prismaMappedError?.message || customMessage;
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
