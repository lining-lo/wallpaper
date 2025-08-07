// 后端 Node.js 生成七牛上传凭证的接口（修正版）
const qiniu = require('qiniu');
const config = require('../config/default');

const accessKey = config.qiniu.ACCESS_KEY;
const secretKey = config.qiniu.SECRET_KEY;
const domain = config.qiniu.DOMAIN;
const bucket = config.qiniu.BUCKET;

module.exports = function (app) {
    app.post('/getQiniuToken', (req, res) => {
        try {
            const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
            const options = {
                scope: bucket,
                expires: 3600,
                returnBody: JSON.stringify({
                    key: '$(key)',
                    url: `https://${domain}/$(key)`
                }),
                // 不配置 saveKey，由前端指定 key
            };

            const putPolicy = new qiniu.rs.PutPolicy(options);
            const uploadToken = putPolicy.uploadToken(mac);

            res.json({
                code: 200,
                message: { token: uploadToken },
            });

        } catch (error) {
            console.error('生成七牛凭证失败:', error);
            res.status(500).json({
                code: 500,
                message: '生成上传凭证失败',
                error: error.message
            });
        }
    });
}
