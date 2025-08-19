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
                    description VARCHAR(800) DEFAULT NULL COMMENT '摘要（限制200字）',
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
                    KEY idx_wallpaper_user_type_status (user_id, type, is_delete, status, createdate)
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
                    gender TINYINT UNSIGNED DEFAULT NULL COMMENT '性别: null-未知、1-男、0-女',
                    motto VARCHAR(800) DEFAULT NULL COMMENT '格言，限200字',
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
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    user_id CHAR(21) NOT NULL COMMENT '用户ID',
                    wallpaper_id CHAR(21) NOT NULL COMMENT '壁纸ID',
                    category_id CHAR(21) NOT NULL COMMENT '分类ID',
                    type TINYINT UNSIGNED NOT NULL COMMENT '行为类型: 0-点赞、1-收藏、2-下载',
                    status TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '行为状态: 1-有效、0-无效（如取消点赞/收藏）',
                    createdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                    updatedate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                    KEY idx_user_type (user_id ,wallpaper_id , type),
                    KEY idx_feedback_wallpaper_type_status (wallpaper_id, type, status)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户反馈表（点赞/收藏/下载）';`
        },
        {
            name: 'problem',
            sql: `CREATE TABLE IF NOT EXISTS problem (
                    ID INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '反馈记录唯一ID',
                    type TINYINT NOT NULL COMMENT '0表示问题反馈，1表示壁纸需求',
                    content TEXT NOT NULL COMMENT '反馈的具体内容',
                    user_id CHAR(21) NOT NULL COMMENT '用户ID',
                    createdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                    PRIMARY KEY (ID)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='问题反馈表，用于记录壁纸需求和问题反馈';`
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
                w.type,
                w.category_id,
                c.name AS category_name,
                w.labels,
                w.user_id,
                u.name AS user_name,
                u.avatar_url AS user_avatar,
                w.count AS view_count,
                w.createdate,
                -- 总互动统计（所有用户）
                COUNT(DISTINCT CASE WHEN f_all.type = 0 AND f_all.status = 1 THEN f_all.id END) AS like_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 1 AND f_all.status = 1 THEN f_all.id END) AS collect_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 2 AND f_all.status = 1 THEN f_all.id END) AS download_count,
                -- 当前用户行为判断
                MAX(CASE WHEN f_user.type = 0 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_liked,       -- 是否点赞
                MAX(CASE WHEN f_user.type = 1 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_collected,  -- 是否收藏
                MAX(CASE WHEN f_user.type = 2 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_downloaded  -- 是否下载
            FROM 
                wallpaper w
            LEFT JOIN 
                category c ON w.category_id = c.id
            LEFT JOIN 
                user u ON w.user_id = u.id
            LEFT JOIN 
                feedback f_all ON w.id = f_all.wallpaper_id
            LEFT JOIN 
                feedback f_user ON w.id = f_user.wallpaper_id AND f_user.user_id = ?  -- 当前用户ID
            WHERE 
                w.type = ?  -- 壁纸类型
                AND w.category_id = ?  -- 分类ID
                AND w.status = ?  -- 状态（如1-已通过）
                AND w.is_delete = 0
            GROUP BY 
                w.id, w.description, w.url, w.video_url, w.category_id, c.name,
                w.labels, w.user_id, u.name, u.avatar_url, w.count, w.createdate
            ORDER BY 
                w.createdate DESC 
            LIMIT ?, ?;  -- 分页参数
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
                w.type,
                w.category_id,
                c.name AS category_name,
                w.labels,
                w.user_id,
                u.name AS user_name,
                u.avatar_url AS user_avatar,
                w.count AS view_count,
                w.createdate,
                -- 总互动统计（所有用户）
                COUNT(DISTINCT CASE WHEN f_all.type = 0 AND f_all.status = 1 THEN f_all.id END) AS like_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 1 AND f_all.status = 1 THEN f_all.id END) AS collect_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 2 AND f_all.status = 1 THEN f_all.id END) AS download_count,
                -- 当前用户行为判断
                MAX(CASE WHEN f_user.type = 0 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_liked,       -- 是否点赞
                MAX(CASE WHEN f_user.type = 1 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_collected,  -- 是否收藏
                MAX(CASE WHEN f_user.type = 2 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_downloaded  -- 是否下载
            FROM 
                wallpaper w
            LEFT JOIN 
                category c ON w.category_id = c.id
            LEFT JOIN 
                user u ON w.user_id = u.id
            LEFT JOIN 
                feedback f_all ON w.id = f_all.wallpaper_id
            LEFT JOIN 
                feedback f_user ON w.id = f_user.wallpaper_id AND f_user.user_id = ?  -- 当前登录用户ID（参数1）
            WHERE 
                w.type IN (?, ?)  -- 参数2、3：类型值（普通+专辑传0,1；其他类型传单个值如2,2）
                AND w.user_id = ?  -- 指定上传用户的壁纸（参数3）
                AND w.status = ?  -- 壁纸状态（参数4，如1-已通过）
                AND w.is_delete = 0  -- 未删除
            GROUP BY 
                w.id, w.description, w.url, w.video_url, w.category_id, c.name,
                w.labels, w.user_id, u.name, u.avatar_url, w.count, w.createdate
            ORDER BY 
                w.createdate DESC 
            LIMIT ?, ?;  -- 分页参数（参数5：偏移量，参数6：条数）
        `
        return query(sql, values)
    },
    // 查找用户下载|收藏的壁纸
    selectUserWallpapers: async (values) => {
        const sql = `
            SELECT
                w.id,
                w.description,
                w.url,
                w.video_url,
                w.type,
                w.category_id,
                c.name AS category_name,
                w.labels,
                w.user_id,
                u.name AS user_name,
                u.avatar_url AS user_avatar,
                w.count AS view_count,
                w.createdate,
                -- 总互动统计
                COUNT(DISTINCT CASE WHEN f_all.type = 0 AND f_all.status = 1 THEN f_all.id END) AS like_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 1 AND f_all.status = 1 THEN f_all.id END) AS collect_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 2 AND f_all.status = 1 THEN f_all.id END) AS download_count,
                -- 当前用户行为判断
                MAX(CASE WHEN f_user.type = 0 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_liked,
                MAX(CASE WHEN f_user.type = 1 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_collected,
                MAX(CASE WHEN f_user.type = 2 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_downloaded,
                MAX(f_user.createdate) AS last_action_time
            FROM
                -- 子查询：先筛选有效壁纸
                (SELECT * FROM wallpaper WHERE is_delete = 0 AND status = 1) w
            INNER JOIN category c ON w.category_id = c.id
            INNER JOIN user u ON w.user_id = u.id
            LEFT JOIN feedback f_all ON w.id = f_all.wallpaper_id
            INNER JOIN feedback f_user ON w.id = f_user.wallpaper_id 
                AND f_user.user_id = ?
            WHERE
                f_user.type = ?
                AND f_user.status = 1
            GROUP BY
                w.id
            ORDER BY
                last_action_time DESC
            LIMIT ?, ?;
            `;
        return query(sql, values)
    },
    // 更新壁纸的查看次数
    updateWallpaperViewCount: async (values) => {
        const sql = `
            UPDATE wallpaper 
            SET count = count + 1,  -- 查看次数自增 1
                updatedate = CURRENT_TIMESTAMP  -- 同步更新时间
            WHERE 
                id = ?  -- 目标壁纸 ID
                AND is_delete = 0  -- 确保壁纸未删除
                AND status = 1;    -- 确保壁纸已通过审核（可选）`
        return query(sql, values)
    },
    // 根据排序类型（下载|点赞|收藏）分页查找壁纸
    selectWallpaperBySort: async (values) => {
        // values参数顺序：[userId, sortType, offset, limit]
        // sortType: 0-点赞量 1-收藏量 2-下载量

        // 根据排序类型动态生成排序字段
        const sortFieldMap = {
            0: 'like_count DESC',       // 按点赞量降序
            1: 'collect_count DESC',    // 按收藏量降序
            2: 'download_count DESC'    // 按下载量降序
        };

        // 默认按下载量排序
        const sortField = sortFieldMap[values[1]] || 'download_count DESC';

        const sql = `
            SELECT 
                w.id,
                w.description,
                w.url,
                w.video_url,
                w.type,
                w.category_id,
                c.name AS category_name,
                w.labels,
                w.user_id,
                u.name AS user_name,
                u.avatar_url AS user_avatar,
                w.count AS view_count,
                w.createdate,
                -- 总互动统计（所有用户）
                COUNT(DISTINCT CASE WHEN f_all.type = 0 AND f_all.status = 1 THEN f_all.id END) AS like_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 1 AND f_all.status = 1 THEN f_all.id END) AS collect_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 2 AND f_all.status = 1 THEN f_all.id END) AS download_count,
                -- 当前用户行为判断
                MAX(CASE WHEN f_user.type = 0 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_liked,
                MAX(CASE WHEN f_user.type = 1 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_collected,
                MAX(CASE WHEN f_user.type = 2 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_downloaded
            FROM 
                wallpaper w
            LEFT JOIN 
                category c ON w.category_id = c.id
            LEFT JOIN 
                user u ON w.user_id = u.id
            LEFT JOIN 
                feedback f_all ON w.id = f_all.wallpaper_id
            LEFT JOIN 
                feedback f_user ON w.id = f_user.wallpaper_id AND f_user.user_id = ?  -- 当前用户ID
            WHERE 
                w.type IN (0, 1)  -- 限制壁纸类型：普通、专辑
                AND w.status = 1  -- 已通过审核
                AND w.is_delete = 0  -- 未删除
            GROUP BY 
                w.id, w.description, w.url, w.video_url, w.category_id, c.name,
                w.labels, w.user_id, u.name, u.avatar_url, w.count, w.createdate
            ORDER BY 
                ${sortField},  -- 动态排序字段
                w.createdate DESC  -- 次要排序：时间降序
            LIMIT ?, ?;  -- 分页参数
        `;

        return query(sql, [
            values[0],  // 用户ID
            values[2],  // 偏移量（offset）
            values[3]   // 每页数量（limit）
        ]);
    },
    // 随机分页查找所有类型壁纸
    selectAllWallpaperByRand: async (values) => {
        const sql = `
            SELECT 
                w.id,
                w.description,
                w.url,
                w.video_url,
                w.type,
                w.category_id,
                c.name AS category_name,
                w.labels,
                w.user_id,
                u.name AS user_name,
                u.avatar_url AS user_avatar,
                w.count AS view_count,
                w.createdate,
                -- 总互动统计（所有用户）
                COUNT(DISTINCT CASE WHEN f_all.type = 0 AND f_all.status = 1 THEN f_all.id END) AS like_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 1 AND f_all.status = 1 THEN f_all.id END) AS collect_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 2 AND f_all.status = 1 THEN f_all.id END) AS download_count,
                -- 当前用户行为判断
                MAX(CASE WHEN f_user.type = 0 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_liked,
                MAX(CASE WHEN f_user.type = 1 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_collected,
                MAX(CASE WHEN f_user.type = 2 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_downloaded
            FROM 
                wallpaper w
            LEFT JOIN 
                category c ON w.category_id = c.id
            LEFT JOIN 
                user u ON w.user_id = u.id
            LEFT JOIN 
                feedback f_all ON w.id = f_all.wallpaper_id
            LEFT JOIN 
                feedback f_user ON w.id = f_user.wallpaper_id AND f_user.user_id = ?  -- 当前用户ID
            WHERE 
                w.status = 1  -- 已通过审核
                AND w.is_delete = 0  -- 未删除
            GROUP BY 
                w.id, w.description, w.url, w.video_url, w.category_id, c.name,
                w.labels, w.user_id, u.name, u.avatar_url, w.count, w.createdate
            ORDER BY 
                RAND()  -- 随机排序
            LIMIT ?,?;  -- 分页参数
        `;
        return query(sql, values)
    },
    // 根据关键字查找各类型壁纸数量
    selectSearchCount: async (values) => {
        const sql = `
            SELECT 
                COUNT(w.id) AS total_count,
                COALESCE(SUM(CASE WHEN w.type IN (0, 1) THEN 1 ELSE 0 END), 0) AS normal_album_count,
                COALESCE(SUM(CASE WHEN w.type = 4 THEN 1 ELSE 0 END), 0) AS avatar_count,
                COALESCE(SUM(CASE WHEN w.type = 3 THEN 1 ELSE 0 END), 0) AS tablet_count
            FROM 
                (SELECT 1) AS dummy  -- 常量表，确保至少一行
            LEFT JOIN 
                wallpaper w ON 
                    w.status = 1 
                    AND w.is_delete = 0 
                    AND w.labels LIKE CONCAT('%', ?, '%');
        `
        return query(sql, values)
    },
    // 根据关键词分页查找壁纸
    selectWallpaperBySearch: async (values) => {
        const sql = `
            SELECT 
                w.id,
                w.description,
                w.url,
                w.video_url,
                w.type,
                w.category_id,
                c.name AS category_name,
                w.labels,
                w.user_id,
                u.name AS user_name,
                u.avatar_url AS user_avatar,
                w.count AS view_count,
                w.createdate,
                -- 总互动统计
                COUNT(DISTINCT CASE WHEN f_all.type = 0 AND f_all.status = 1 THEN f_all.id END) AS like_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 1 AND f_all.status = 1 THEN f_all.id END) AS collect_count,
                COUNT(DISTINCT CASE WHEN f_all.type = 2 AND f_all.status = 1 THEN f_all.id END) AS download_count,
                -- 当前用户行为判断
                MAX(CASE WHEN f_user.type = 0 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_liked,
                MAX(CASE WHEN f_user.type = 1 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_collected,
                MAX(CASE WHEN f_user.type = 2 AND f_user.status = 1 THEN 1 ELSE 0 END) AS is_downloaded
            FROM 
                wallpaper w
            LEFT JOIN 
                category c ON w.category_id = c.id
            LEFT JOIN 
                user u ON w.user_id = u.id
            LEFT JOIN 
                feedback f_all ON w.id = f_all.wallpaper_id
            LEFT JOIN 
                feedback f_user ON w.id = f_user.wallpaper_id AND f_user.user_id = ?  -- 参数1：当前用户ID
            WHERE 
                w.status = 1 
                AND w.is_delete = 0 
                -- 关键字搜索条件
                AND w.labels LIKE CONCAT('%', ?, '%')  -- 参数2：搜索关键字
                -- 类型筛选条件（根据传入参数动态匹配）
                AND (
                    -- 当参数为-1时，查询全部类型；否则按指定类型筛选
                    ? = -1 OR  -- 参数3：类型筛选标识（-1=全部，10=普通+专辑，4=头像，3=平板）
                    (
                        -- 普通+专辑（type=0或1）
                        (? = 10 AND w.type IN (0, 1)) OR
                        -- 头像（type=4）
                        (? = 4 AND w.type = 4) OR
                        -- 平板（type=3）
                        (? = 3 AND w.type = 3)
                    )
                )
            GROUP BY 
                w.id, w.description, w.url, w.video_url, w.category_id, c.name,
                w.labels, w.user_id, u.name, u.avatar_url, w.count, w.createdate
            ORDER BY 
                w.createdate DESC  -- 按创建时间倒序（最新在前）
            LIMIT ?, ?;  -- 参数4：分页偏移量；参数5：每页条数
        `
        return query(sql, values)
    },


    /**
     * 用户相关
     */
    // 分页查询用户数据
    selecUserPage: async (values) => {
        const sql = `
            SELECT 
                u.id,
                u.name,
                u.avatar_url,
                u.gender,
                u.motto,
                u.createdate,
                -- 作品总数（仅有效作品）
                (SELECT COUNT(*) FROM wallpaper w WHERE w.user_id = u.id AND w.is_delete = 0 AND w.status = 1) AS total_works,
                -- 专辑+普通作品数量
                (SELECT COUNT(*) FROM wallpaper w WHERE w.user_id = u.id AND w.type IN (0,1) AND w.is_delete = 0 AND w.status = 1) AS normal_album_works,
                -- 头像/平板数量
                (SELECT COUNT(*) FROM wallpaper w WHERE w.user_id = u.id AND w.type = 4 AND w.is_delete = 0 AND w.status = 1) AS avatar_works,
                (SELECT COUNT(*) FROM wallpaper w WHERE w.user_id = u.id AND w.type = 3 AND w.is_delete = 0 AND w.status = 1) AS tablet_works,
                -- 总获赞/下载数（包含已删除作品）
                (SELECT COUNT(f.id) FROM feedback f JOIN wallpaper w ON f.wallpaper_id = w.id 
                WHERE w.user_id = u.id AND f.type = 0 AND f.status = 1) AS total_likes,
                (SELECT COUNT(f.id) FROM feedback f JOIN wallpaper w ON f.wallpaper_id = w.id 
                WHERE w.user_id = u.id AND f.type = 2 AND f.status = 1) AS total_downloads,
                -- 前三张作品URL（按sort排序）
                MAX(CASE WHEN r.rank = 1 THEN r.url END) AS work_url_1,
                MAX(CASE WHEN r.rank = 2 THEN r.url END) AS work_url_2,
                MAX(CASE WHEN r.rank = 3 THEN r.url END) AS work_url_3
            FROM 
                user u
            -- 关联按sort排序的作品（每个用户前3张）
            LEFT JOIN (
                -- 子查询：按sort+createdate生成排序序号
                SELECT 
                    w1.user_id,
                    w1.url,
                    -- 排序逻辑：先按sort升序（值越小越靠前），再按createdate降序（最新在前）
                    (SELECT COUNT(*) FROM wallpaper w2 
                    WHERE w2.user_id = w1.user_id 
                    AND w2.type IN (0,1) 
                    AND w2.is_delete = 0 
                    AND w2.status = 1 
                    -- 核心：w2的sort优先级高于w1，或sort相等时w2的createdate更新
                    AND (
                        w2.sort < w1.sort OR 
                        (w2.sort = w1.sort AND w2.createdate >= w1.createdate)
                    )
                    ) AS rank  -- 符合条件的作品数量即当前作品的排序序号
                FROM 
                    wallpaper w1
                WHERE 
                    w1.type IN (0,1) 
                    AND w1.is_delete = 0 
                    AND w1.status = 1
            ) r ON u.id = r.user_id AND r.rank <= 3  -- 只取前3张
            WHERE 
                u.status != 0 
                AND (SELECT COUNT(*) FROM wallpaper w WHERE w.user_id = u.id AND w.type IN (0,1) AND w.is_delete = 0 AND w.status = 1) != 0
            GROUP BY 
                u.id, u.name, u.avatar_url, u.gender, u.motto, u.createdate
            ORDER BY 
                total_works DESC
            LIMIT 
                ?,?;
        `
        return query(sql, values)
    },
    // 根据openid查询用户
    selectUserByOpenId: async (values) => {
        const sql = `SELECT id,name,avatar_url,gender,motto,createdate FROM user WHERE open_id =? AND status!=0; `
        return query(sql, values)
    },
    // 新增用户
    addUser: async (values) => {
        const sql = `INSERT INTO user (id, open_id) VALUES (?,?) `
        return query(sql, values)
    },
    // 修改用户信息
    updateUser: async (values) => {
        const sql = `UPDATE user SET name = ?, avatar_url = ?, gender = ?, motto = ? WHERE id = ?;`
        return query(sql, values)
    },

    /**
     * 反馈相关（点赞|收藏|下载）
     */
    // 新增反馈
    addFeedBack: async (values) => {
        const sql = `INSERT INTO feedback (user_id,wallpaper_id,category_id,type,status) VALUES (?,?,?,?,?);`
        return query(sql, values)
    },
    // 修改反馈状态
    updateFeedBackStatus: async (values) => {
        const sql = `
            UPDATE feedback 
            SET status = 1 - status, 
                updatedate = CURRENT_TIMESTAMP 
            WHERE 
                user_id = ? 
                AND wallpaper_id = ? 
                AND type = ?
        `;
        return query(sql, values)
    },
    // 查找用户是否点赞|收藏|下载
    selectFeedBackByUserId: async (values) => {
        const sql = `
            SELECT 
            COUNT(*) AS action_count  -- 为计数结果起别名，方便前端取值
            FROM 
            feedback 
            WHERE 
            user_id = ?          -- 用户ID条件
            AND wallpaper_id = ?         -- 壁纸ID条件
            AND type = ?             -- 行为类型条件（0-点赞、1-收藏、2-下载）
        `;
        return query(sql, values)
    },


    /**
     * 问题反馈相关（需求壁纸、问题反馈）
     */
    // 新增问题反馈
    addProblem: async (values) => {
        const sql = `INSERT INTO problem (user_id, type, content) VALUES (?, ?, ?)`;
        return query(sql, values)
    },
};

