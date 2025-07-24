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
        // {
        //     name: 'comment',
        //     sql: `create table if not exists comment(
        //             id VARCHAR(100) NOT NULL,
        //             type int NOT NULL COMMENT '类型（-1所有、0文章、1说说、2留言墙、3树洞、4相册）',
        //             type_id VARCHAR(100) NOT NULL COMMENT '所属类型的ID（文章ID、说说ID、留言墙ID、树洞ID）',
        //             user_id VARCHAR(100) NOT NULL COMMENT '评论者ID',
        //             user_name VARCHAR(100) COMMENT '用户名称',
        //             user_type INT NOT NULL COMMENT '用户类型 (0登录用户，1游客)',
        //             user_imgurl VARCHAR(100) COMMENT '用户头像',
        //             createdate VARCHAR(100) NOT NULL COMMENT '创建时间',
        //             content VARCHAR(100) NOT NULL COMMENT '评论内容',
        //             replier_id VARCHAR(100) COMMENT '回复者ID',
        //             replier_name VARCHAR(100) COMMENT '回复者名称',
        //             PRIMARY KEY (id)
        //         );`
        // },
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
// module.exports = {

// };