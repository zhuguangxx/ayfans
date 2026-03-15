-- 安阳市球迷协会数据库表结构

-- 新闻文章表
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  image_url TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'association', -- 'association' 协会新闻, 'club' 俱乐部新闻
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 会员用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(10),
  id_card VARCHAR(20),
  phone VARCHAR(20) UNIQUE NOT NULL,
  is_annual_card BOOLEAN DEFAULT FALSE,
  expire_date DATE,
  points_total INTEGER DEFAULT 0,
  points_count INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  level VARCHAR(20) DEFAULT '铁杆会员',
  password VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 比赛场次表
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  opponent VARCHAR(200) NOT NULL,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  match_type VARCHAR(50) NOT NULL, -- 'league' 联赛, 'cup' 杯赛, 'national' 国家队, 'second_home' 第二主场
  venue VARCHAR(200),
  is_home BOOLEAN DEFAULT TRUE,
  result VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 积分记录表
CREATE TABLE IF NOT EXISTS point_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  match_id INTEGER REFERENCES matches(id),
  points INTEGER NOT NULL,
  reason VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 关于协会单页面表
CREATE TABLE IF NOT EXISTS about (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) DEFAULT '关于协会',
  content TEXT,
  image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 初始化关于协会数据
INSERT INTO about (title, content) VALUES ('关于协会', '这里是安阳市球迷协会的简介...');

-- 开启 RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "Public can read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public can read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public can read about" ON about FOR SELECT USING (true);

-- 会员只能读写自己的数据
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own password" ON users FOR UPDATE USING (true);

-- 积分记录只能读取自己的
CREATE POLICY "Users can read own points" ON point_records FOR SELECT USING (true);
