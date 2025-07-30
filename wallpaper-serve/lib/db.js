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
            sql: `CREATE TABLE IF NOT EXISTS wallpaper (
                    id CHAR(21) NOT NULL COMMENT 'ID',
                    description VARCHAR(150) DEFAULT NULL COMMENT '摘要（限制50字）',
                    url VARCHAR(255) NOT NULL COMMENT '图片地址',
                    type TINYINT UNSIGNED DEFAULT 0 COMMENT '类型: 0-普通、1-专辑、2-动态、3-平板、4-头像',
                    category_id CHAR(21) NOT NULL COMMENT '分类ID',
                    category_name VARCHAR(50) NOT NULL COMMENT '分类名称',
                    labels VARCHAR(150) NOT NULL COMMENT '标签（逗号分隔）',
                    status TINYINT UNSIGNED DEFAULT 0 COMMENT '状态: 0-待审核、1-已通过、2-未通过',
                    sort TINYINT UNSIGNED DEFAULT 100 COMMENT '排序值（0-255）',
                    user_id CHAR(21) NOT NULL COMMENT '上传用户ID',
                    user_name VARCHAR(50) NOT NULL COMMENT '用户名',
                    user_avatar VARCHAR(255) DEFAULT NULL COMMENT '用户头像',
                    createdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                    PRIMARY KEY (id),
                    KEY idx_type_status (type, status),
                    KEY idx_category (type, category_id, status, createdate),
                    KEY idx_user (type, user_id, status, createdate),
                    KEY idx_createdate (createdate),
                    FULLTEXT KEY ft_labels (labels) COMMENT '标签全文索引'
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='壁纸表';`
        },
        {
            name: 'category',
            sql: `CREATE TABLE IF NOT EXISTS category (
                    id CHAR(21) NOT NULL COMMENT 'ID',
                    name VARCHAR(50) NOT NULL COMMENT '分类名称',
                    cover VARCHAR(255) NOT NULL COMMENT '封面图片URL',
                    type TINYINT UNSIGNED DEFAULT 0 COMMENT '类型: 0-分类、1-专辑',
                    sort TINYINT UNSIGNED DEFAULT 100 COMMENT '排序值(0-255)',
                    status TINYINT UNSIGNED DEFAULT 1 COMMENT '状态: 0-禁用、1-启用',
                    createdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                    updatedate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                    PRIMARY KEY (id),
                    UNIQUE KEY uni_name_type (name, type) COMMENT '分类名称+类型唯一约束',
                    KEY idx_type_status (type, status, sort) COMMENT '类型+状态+排序复合索引',
                    KEY idx_createdate (createdate) COMMENT '创建时间索引'
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='壁纸分类表';`
        },
        {
            name: 'user',
            sql: `CREATE TABLE IF NOT EXISTS user (
                    id CHAR(21) PRIMARY KEY COMMENT 'ID',
                    name VARCHAR(30) DEFAULT NULL COMMENT '用户昵称',
                    avatar_url VARCHAR(255) DEFAULT NULL COMMENT '头像地址',
                    gender TINYINT UNSIGNED DEFAULT 0 COMMENT '性别: 0-未知、1-男、2-女',
                    motto VARCHAR(150) DEFAULT NULL COMMENT '格言',
                    createdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                    KEY idx_name (name) COMMENT '昵称索引',
                    KEY idx_createdate (createdate) COMMENT '创建时间索引'
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';`
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
        const sql = `SELECT id,name,cover,updatedate FROM category WHERE type=? AND status=? ORDER BY sort LIMIT ?,?; `
        return query(sql, values)
    },

    /**
     * 壁纸相关
     */
    // 根据分类id分页查询壁纸数据
    selecWallpaperPageByCategoryId: async (values) => {
        const sql = `SELECT id,description,url,category_id,category_name,labels,user_id,user_name,user_avatar,createdate FROM wallpaper WHERE type=? AND category_id=? AND status=? ORDER BY createdate DESC LIMIT ?,?;`
        return query(sql, values)
    },
    // 根据用户名和壁纸类型分页获取数据
    selecWallpaperPageByUserId: async (values) => {
        const sql = `SELECT id,description,url,category_id,category_name,labels,user_id,user_name,user_avatar,createdate FROM wallpaper WHERE type=? AND user_id=?  AND status=? ORDER BY createdate DESC LIMIT ?,?; `
        return query(sql, values)
    },

    /**
     * 用户相关
     */
    // 分页查询用户数据
    selecUserPage: async (values) => {
        const sql = `SELECT id,name,avatar_url,gender,motto,createdate FROM user LIMIT ?,?; `
        return query(sql, values)
    },
};