/**
 * Global error handling middleware
 * Must be the last middleware registered in server.js
 */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
    console.error('🔴 Error:', err.message)
    const status = err.status || err.statusCode || 500
    res.status(status).json({
        message: err.message || 'Internal server error.',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    })
}
