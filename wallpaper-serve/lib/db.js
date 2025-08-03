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
                    url VARCHAR(255) DEFAULT NULL COMMENT '图片地址',
                    video_url VARCHAR(255) DEFAULT NULL COMMENT '视频地址（动态壁纸，允许为空）',
                    type TINYINT UNSIGNED DEFAULT 0 COMMENT '类型: 0-普通、1-专辑、2-动态、3-平板、4-头像',
                    category_id CHAR(21) NOT NULL COMMENT '分类ID',
                    category_name VARCHAR(50) NOT NULL COMMENT '分类名称',
                    labels VARCHAR(150) NOT NULL COMMENT '标签（逗号分隔）',
                    status TINYINT UNSIGNED DEFAULT 0 COMMENT '状态: 0-待审核、1-已通过、2-未通过',
                    is_delete TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除: 0-未删除、1-已删除',
                    sort TINYINT UNSIGNED DEFAULT 100 COMMENT '排序值（0-255）',
                    user_id CHAR(21) NOT NULL COMMENT '上传用户ID',
                    user_name VARCHAR(50) NOT NULL COMMENT '用户名',
                    user_avatar VARCHAR(255) DEFAULT NULL COMMENT '用户头像',
                    count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '查看次数',
                    createdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                    updatedate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                    PRIMARY KEY (id),
                    KEY idx_category (type, category_id, status, is_delete, createdate),
                    KEY idx_user (type, user_id, status, is_delete, createdate),
                    KEY idx_createdate (is_delete, createdate),
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
                    id CHAR(21) PRIMARY KEY COMMENT 'ID）',
                    open_id VARCHAR(100) NOT NULL UNIQUE COMMENT '微信openid（唯一标识）',
                    name VARCHAR(30) DEFAULT NULL COMMENT '用户昵称',
                    avatar_url VARCHAR(255) DEFAULT NULL COMMENT '头像地址',
                    gender TINYINT UNSIGNED DEFAULT 0 COMMENT '性别: 0-未知、1-男、2-女',
                    motto VARCHAR(150) DEFAULT NULL COMMENT '格言',
                    status TINYINT UNSIGNED DEFAULT 1 COMMENT '账号状态: 0-禁用、1-正常、2管理员',
                    createdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                    KEY idx_name (name) COMMENT '昵称索引',
                    KEY idx_createdate (createdate) COMMENT '注册时间索引',
                    KEY idx_openid_status (open_id, status) COMMENT '优化登录场景：通过open_id查询并验证状态'
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='壁纸小程序用户表';`
        },
        {
            name: 'feedback',
            sql: `CREATE TABLE IF NOT EXISTS feedback (
                    id CHAR(21) PRIMARY KEY COMMENT 'ID',
                    user_id CHAR(21) NOT NULL COMMENT '用户ID',
                    wallpaper_id CHAR(21) NOT NULL COMMENT '壁纸ID',
                    category_id CHAR(21) NOT NULL COMMENT '分类ID',
                    type TINYINT UNSIGNED NOT NULL COMMENT '行为类型: 0-点赞、1-收藏、2-下载',
                    status TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '行为状态: 1-有效、0-无效（如取消点赞/收藏）',
                    createdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                    updatedate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                    UNIQUE KEY uk_user_wallpaper_type (user_id, wallpaper_id, type),
                    KEY idx_wallpaper_type (wallpaper_id, type, status),
                    KEY idx_user_type (user_id, type, status, createdate)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户反馈表（点赞/收藏/下载）';`
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
        const sql = `
        SELECT 
          c.id,
          c.name,
          c.cover,
          c.updatedate,
          -- 统计分类下的有效壁纸数（未删除、已通过）
          COUNT(DISTINCT w.id) AS wallpaper_count,
          -- 统计分类下的有效点赞总数
          COUNT(DISTINCT f.id) AS total_likes
        FROM 
          category c
        -- 关联有效壁纸（未删除、已通过审核）
        LEFT JOIN 
          wallpaper w 
          ON c.id = w.category_id 
          AND w.is_delete = 0 
          AND w.status = 1
        -- 关联有效点赞记录（type=0为点赞，status=1为有效）
        LEFT JOIN 
          feedback f 
          ON w.id = f.wallpaper_id 
          AND f.type = 0 
          AND f.status = 1
        -- 原分页条件：类型和状态过滤
        WHERE 
          c.type = ? 
          AND c.status = ?
        -- 按分类分组（核心：确保每个分类只返回一条记录）
        GROUP BY 
          c.id, c.name, c.cover, c.updatedate
        -- 原排序和分页逻辑
        ORDER BY 
          c.sort 
        LIMIT ?, ?;
      `;
        return query(sql, values)
    },

    /**
     * 壁纸相关
     */
    // 根据分类id分页查询壁纸数据
    selecWallpaperPageByCategoryId: async (values) => {
        const sql = `
            SELECT 
                w.id,
                w.description,
                w.url,
                w.video_url,
                w.category_id,
                w.category_name,
                w.labels,
                w.user_id,
                w.user_name,
                w.user_avatar,
                w.count AS view_count,
                w.createdate,
                -- 总互动统计（所有用户）
                COUNT(DISTINCT CASE WHEN f_all.type = 0 AND f_all.status = 1 THEN f_all.id END) AS like_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 1 AND f_all.status = 1 THEN f_all.id END) AS collect_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 2 AND f_all.status = 1 THEN f_all.id END) AS download_count,
                -- 当前用户是否点赞（1=是，0=否）
                MAX(CASE WHEN f_user.type = 0 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_liked,
                -- 当前用户是否收藏（1=是，0=否）
                MAX(CASE WHEN f_user.type = 1 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_collected
            FROM 
                wallpaper w
            -- 关联所有用户的反馈表（用于统计总数量）
            LEFT JOIN 
                feedback f_all 
                ON w.id = f_all.wallpaper_id
            -- 关联当前用户的反馈表（用于判断用户行为）
            LEFT JOIN 
                feedback f_user 
                ON w.id = f_user.wallpaper_id 
                AND f_user.user_id = ?  -- 传入当前登录用户ID
            WHERE 
                w.type = ? 
                AND w.category_id = ?  -- 筛选指定分类下的壁纸
                AND w.status = ? 
                AND w.is_delete = 0
            GROUP BY 
                w.id, w.description, w.url, w.video_url, w.category_id, w.category_name, 
                w.labels, w.user_id, w.user_name, w.user_avatar, w.count, w.createdate
            ORDER BY 
                w.createdate DESC 
            LIMIT ?, ?;
        `
        return query(sql, values)
    },
    // 根据用户名和壁纸类型分页获取数据
    selecWallpaperPageByUserId: async (values) => {
        const sql = `
            SELECT 
                w.id,
                w.description,
                w.url,
                w.video_url,
                w.category_id,
                w.category_name,
                w.labels,
                w.user_id,
                w.user_name,
                w.user_avatar,
                w.count AS view_count,  -- 查看次数
                w.createdate,
                -- 总互动统计（所有用户）
                COUNT(DISTINCT CASE WHEN f_all.type = 0 AND f_all.status = 1 THEN f_all.id END) AS like_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 1 AND f_all.status = 1 THEN f_all.id END) AS collect_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 2 AND f_all.status = 1 THEN f_all.id END) AS download_count,
                -- 当前用户是否点赞（1=是，0=否）
                MAX(CASE WHEN f_user.type = 0 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_liked,
                -- 当前用户是否收藏（1=是，0=否）
                MAX(CASE WHEN f_user.type = 1 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_collected
            FROM 
                wallpaper w
            -- 关联所有用户的反馈表（用于统计总数量）
            LEFT JOIN 
                feedback f_all 
                ON w.id = f_all.wallpaper_id
            -- 关联当前用户的反馈表（用于判断用户行为）
            LEFT JOIN 
                feedback f_user 
                ON w.id = f_user.wallpaper_id 
                AND f_user.user_id = ?  -- 传入当前登录用户ID
            WHERE 
                w.type = ? 
                AND w.user_id = ?  -- 筛选指定用户上传的壁纸
                AND w.status = ? 
                AND w.is_delete = 0
            GROUP BY 
                w.id, w.description, w.url, w.video_url, w.category_id, w.category_name, 
                w.labels, w.user_id, w.user_name, w.user_avatar, w.count, w.createdate
            ORDER BY 
                w.createdate DESC 
            LIMIT ?, ?;
        `
        return query(sql, values)
    },

    /**
     * 用户相关
     */
    // 分页查询用户数据
    selecUserPage: async (values) => {
        const sql = `SELECT id,name,avatar_url,gender,motto,createdate FROM user WHERE status!=0 LIMIT ?,?; `
        return query(sql, values)
    },
    // 根据openid查询用户
    selectUserByOpenId: async (values) => {
        const sql = `SELECT id,name,avatar_url,gender,motto,createdate FROM user WHERE open_id =? AND status!=0; `
        return query(sql, values)
    },
    // 新增用户
    addUser: async (values) => {
        const sql = `INSERT INTO user (id, open_id) VALUES (?,?,?,?,?,?) `
        return query(sql, values)
    },
};