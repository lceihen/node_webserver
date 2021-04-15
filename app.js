const { resolve } = require('path')

const querystring = require('querystring')
const handleBlogRouter = require("./src/router/blog")
const handleUserRouter = require("./src/router/user")
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
    getPostData(req).then(postData => {
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
        console.log("blogResultok", blogResult)
        if (blogResult) {

            blogResult.then(blogData => {
                //  console.log("blogData", blogData)
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        const userData = handleUserRouter(req, res)
        if (userData) {
            userData.then(userResult => {
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