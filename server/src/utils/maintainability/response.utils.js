class ApiResponse {
    static success(res, data, message = 'Success', statusCode = 200) {
      return res.status(statusCode).json({
        status: 'success',
        message,
        data
      });
    }
  
    static error(res, message = 'Error occurred', statusCode = 500, stack = null) {
      const response = {
        status: 'error',
        message
      };
  
      if (stack && process.env.NODE_ENV === 'development') {
        response.stack = stack;
      }
  
      return res.status(statusCode).json(response);
    }
  
    static paginate(res, data, page, limit, total) {
      return res.status(200).json({
        status: 'success',
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }
  }
  
  module.exports = ApiResponse;