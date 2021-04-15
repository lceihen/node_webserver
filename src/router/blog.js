const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const handleBlogRouter = (req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    const id = req.query.id
    if (method === 'GET' && path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // const listData=getList(author,keyword)
        // return new SuccessModel(listData)
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }
    if (method === 'GET' && path === '/api/blog/detail') {
        // const data = getDetail(id)
        // return new SuccessModel(data)
        const data = getDetail(id)
        return data.then(data => {
            return new SuccessModel(data)
        })
    }
    if (method === 'POST' && path === '/api/blog/new') {
        // const data = newBlog(req.body)
        // return new SuccessModel(data)
        req.body.author = 'zhangsan'
        const data = newBlog(req.body)
        return data.then(res => {
            return new SuccessModel(res)
        })
    }
    if (method === 'POST' && path === '/api/blog/update') {
        const result = updateBlog(id, req.body)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel("更新博客失败")
            }
        })

    }
    if (method === 'POST' && path === '/api/blog/del') {
        const author = 'lceihen'
        const result = delBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel('删除博客失败')
            }
        })
    }
}
module.exports = handleBlogRouter