const config = {
    port: 3001,
    database: {
        HOST: '127.0.0.1',
        USER: 'root',
        PASSWORD: '123456',
        DATABASE: 'wallpaper',
    },
    wx: {
        APPID: 'wx83f7894512f1b748',
        APPSECRET: '6c51c7ed2094375c8cc895d2dd1f264e',
    },
    qiniu:{
        ACCESS_KEY:'koT765_hmXu0ZXtyuNKcrOZ3WMgnpjsHmUQOOjRl',
        SECRET_KEY:'iAAiqWJ2X81kOQ0mRLxqB0KWwSstNnv-OtDaPLC8',
        BUCKET:'dev-wallpaper',
        DOMAIN:'https://lining-lo.top'
    }
}

module.exports = config