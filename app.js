const { resolve } = require('path')
const { get, set } = require('./src/db/redis')
const querystring = require('querystring')
const handleBlogRouter = require("./src/router/blog")
const handleUserRouter = require("./src/router/user")
const SESSION_DATA = []
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('() is', d.toGMTString())
    return d.toGMTString()
}
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}
const serverHandle = (req, res) => {
    res.setHeader('Content-type', 'application/json')

    const url = req.url
    req.path = url.split('?')[0]
    req.query = querystring.parse(url.split('?')[1])

    console.log("query:", req.query)
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }

    // }
    // else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]
    // console.log("req.session", req.session)

    let needSetCookie = false
    let userId = req.cookie.userid

    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        set(userId, {})

    }
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {

        if (sessionData == null) {
            set(req.sessionId, {})
            req.session = {}
        } else {
            req.session = sessionData
        }
        console.log('req.session', req.session)
        return getPostData(req)
    }).then(postData => {
        req.body = postData

        //没有promise之前
        // const blogData = handleBlogRouter(req, res)
        // if(blogData){
        //     res.end(
        //         JSON.stringify(blogData)
        //     )
        //     return
        // }
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {

            blogResult.then(blogData => {
                //  console.log("blogData", blogData)
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        const userData = handleUserRouter(req, res)
        if (userData) {
            userData.then(userResult => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userResult)
                )
            })
            return
        }

        res.writeHead(404, { "Content-type": "text/plain" })
        res.write("404 Not Found\n")
        res.end()

    })

}
module.exports = serverHandle