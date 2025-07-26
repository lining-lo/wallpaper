const mysql = require('mysql2/promise');
const config = require('../config/default');

// 工具函数：将 undefined 转换为 null（避免数据库参数错误）
const sanitizeValues = (values) => {
    return values.map(value => value === undefined ? null : value);
};

// 创建连接池
const pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USER,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 封装通用查询方法
const query = async (sql, values = []) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const safeValues = sanitizeValues(values); // 处理参数
        const [results] = await connection.execute(sql, safeValues);
        await connection.commit();
        return results;
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Database error:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
};

// 创建数据库
const createDatabase = async () => {
    const createDatabaseSql = `CREATE DATABASE IF NOT EXISTS ${config.database.DATABASE} DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;`;
    const tempPool = mysql.createPool({
        host: config.database.HOST,
        user: config.database.USER,
        password: config.database.PASSWORD
    });
    try {
        const connection = await tempPool.getConnection();
        await connection.execute(createDatabaseSql);
        connection.release();
        console.log('Database created successfully');
    } catch (error) {
        console.error('Error creating database:', error);
        throw error;
    } finally {
        await tempPool.end();
    }
};

// 创建数据表
const createTables = async () => {
    const tables = [
        {
            name: 'wallpaper',
            sql: `create table if not exists wallpaper(
                    id VARCHAR(100) NOT NULL,
                    title VARCHAR(100) NOT NULL COMMENT '壁纸标题',
                    description VARCHAR(2000) DEFAULT NULL COMMENT '壁纸描述',
                    url VARCHAR(100) NOT NULL COMMENT '图片地址',
                    type INT DEFAULT 0 COMMENT '类型 0-普通 1-专辑',
                    category_id VARCHAR(100) NOT NULL COMMENT '分类ID',
                    status INT DEFAULT 0 COMMENT '状态 0-待审核 1-已通过 2-未通过',
                    recommend INT DEFAULT 0 COMMENT '是否推荐 0-否 1-是',
                    user_id VARCHAR(100) NOT NULL COMMENT '上传用户ID',
                    user_name VARCHAR(100) NOT NULL COMMENT '用户名',
                    user_avatar VARCHAR(255) DEFAULT NULL COMMENT '用户头像',
                    createdate VARCHAR(100) NOT NULL COMMENT '创建时间',
                    PRIMARY KEY (id)
                );`
        },
        {
            name: 'category',
            sql: `create table if not exists category(
                    id VARCHAR(100) NOT NULL,
                    name VARCHAR(100) NOT NULL COMMENT '分类名称',
                    cover VARCHAR(100) NOT NULL COMMENT '封面',
                    type INT DEFAULT 0 COMMENT '类型 0-分类 1-专辑',
                    sort INT DEFAULT 10 COMMENT '排序值',
                    status INT DEFAULT 1 COMMENT '状态 0-禁用 1-启用',
                    createdate VARCHAR(100) NOT NULL COMMENT '创建时间',
                    updatedate VARCHAR(100) NOT NULL COMMENT '更新时间',
                    PRIMARY KEY (id)
                );`
        },
    ];

    for (const table of tables) {
        try {
            await query(table.sql);
            console.log(`Table ${table.name} created successfully`);
        } catch (error) {
            console.error(`Error creating table ${table.name}:`, error);
            throw error;
        }
    }
};

// 初始化数据库
const initDatabase = async () => {
    try {
        await createDatabase();
        await createTables();
        console.log('Database initialization completed');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
};

initDatabase()

// 数据库操作方法
module.exports = {
    /**
     * 分类相关
     */
    // 分页查询分类数据
    selecCategoryPage: async (values) => {
        const sql = `SELECT * FROM category WHERE type=? ORDER BY sort LIMIT ?,?; `
        return query(sql, values)
    },

    /**
     * 壁纸相关
     */
    // 根据分类id分页查询壁纸数据
    selecWallpaperPageByCategoryId: async (values) => {
        const sql = `SELECT * FROM wallpaper WHERE type=? AND category_id=? AND status=? ORDER BY createdate DESC LIMIT ?,?; `
        return query(sql, values)
    },
};