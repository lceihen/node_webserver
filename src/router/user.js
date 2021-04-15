
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { login } = require('./../controller/user')
const handleUserRouter = (req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    console.log(path)
    if (method === 'GET' && path === '/api/user/login') {
        //  const { username, password } = req.body
        const { username, password } = req.query
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                res.setHeader('Set-Cookie', `username=${data.username}`)
                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.cookie.username) {
            return Promise.resolve(new SuccessModel(req.cookie.username))
        }
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}
module.exports = handleUserRouter