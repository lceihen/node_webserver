
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { loginCheck } = require('./../controller/user')
const handleUserRouter = (req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    console.log(path)
    if (method === 'POST' && path === '/api/user/login') {
        const { username, password } = req.body
        const result = loginCheck(username, password)
        return result.then(data => {
            if (data.username) {
                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }
}
module.exports = handleUserRouter