

const handleUserRouter=(req,res)=>{
    const method=req.method
    const url=req.url
    const path=url.split('?')[0]
    console.log(path)
    if(method==='POST' && path ==='/api/user/login'){
        console.log("ing")
        return {
            msg:'这是登陆的接口'
        }
    }
}
module.exports=handleUserRouter