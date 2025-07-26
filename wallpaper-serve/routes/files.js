//引入附件上传插件
var multer = require('multer');

//生成随机数
function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

//创建multer配置对象
const storage = multer.diskStorage({
    //保存路径
    destination: function (request, file, callback) {
        callback(null, './data/photo')//注意这里的文件路径,不是相对路径，直接填写从项目根路径开始写就行了
    },
    //保存在 destination 中的文件名
    filename: function (request, file, callback) {
        //正则匹配后缀名
        let type = file.originalname.replace(/.+\./, ".")
        callback(null, Date.now() + random(1, 100) + type)
    }
})

//创建multer中间件实例
const upload = multer({ storage: storage })

//暴露接口
module.exports = function (app) {
    app.post('/profile', upload.single('file'), function (request, response, next) {
        let name = request.file.filename;
        let imgurl = '/photo/' + name;
        response.send(imgurl);
    })
}