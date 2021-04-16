
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { login } = require('./../controller/user')
const { set } = require('./../db/redis')
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('() is', d.toGMTString())
    return d.toGMTString()
}
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
                req.session.username = data.username
                req.session.realName = data.realname
                set(req.sessionId, req.session)
                return new SuccessModel()
            }
            return new ErrorModel('登录失败')
        })
    }
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.username) {
            return Promise.resolve(new SuccessModel({ session: req.session }))
        }
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}
module.exports = handleUserRouter