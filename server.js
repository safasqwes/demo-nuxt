/**
 * Node.js 静态文件服务器
 * 用于提供 Nuxt 生成的静态文件
 */

import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件目录（Nuxt 生成的输出目录）
const STATIC_DIR = path.join(__dirname, '.output', 'public');

// 启用 Gzip 压缩
app.use(compression());

// 设置缓存控制头
app.use((req, res, next) => {
  // 对静态资源设置长期缓存
  if (req.url.startsWith('/_nuxt/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.url.endsWith('.html') || req.url === '/') {
    // HTML 文件不缓存，保证内容是最新的
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  } else {
    // 其他文件短期缓存
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  next();
});

// 提供静态文件服务
app.use(express.static(STATIC_DIR, {
  extensions: ['html'],  // 自动添加 .html 扩展名
  index: 'index.html',   // 默认首页
}));

// SPA 回退：所有未匹配的路由返回 200.html（用于客户端路由）
app.get('*', (req, res) => {
  const fallbackPath = path.join(STATIC_DIR, '200.html');
  res.sendFile(fallbackPath, (err) => {
    if (err) {
      // 如果 200.html 不存在，返回 404
      res.status(404).sendFile(path.join(STATIC_DIR, '404.html'));
    }
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).send('服务器内部错误');
});

// 启动服务器
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Node.js 静态文件服务器已启动！');
  console.log('');
  console.log(`📂 静态文件目录: ${STATIC_DIR}`);
  console.log(`🌐 服务器地址: http://localhost:${PORT}`);
  console.log(`📊 Gzip 压缩: 已启用`);
  console.log(`⚡ 缓存策略: 已配置`);
  console.log('');
  console.log('按 Ctrl+C 停止服务器');
  console.log('');
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('\n正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  process.exit(0);
});

