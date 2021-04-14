let MYSQL_CONF
const env = process.env.NODE_ENV
if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'lc9800481',
        port: '3306',
        database: 'myblog'
    }
}
if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'lc9800481',
        port: '3306',
        database: 'myblog'
    }
}

module.exports = {
    MYSQL_CONF
}