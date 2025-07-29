# Docker 部署说明

## 快速部署

### 前置条件

1. 确保已安装 Docker 和 Docker Compose
2. 启动 Docker 守护进程：
   - macOS: 启动 Docker Desktop 应用
   - Linux: `sudo systemctl start docker`
   - Windows: 启动 Docker Desktop 应用

### 使用 Docker Compose（推荐）

2. 在项目根目录执行：
```bash
docker-compose up -d
```

3. 访问应用：
   - 本地访问：http://localhost:8084
   - 服务器访问：http://your-server-ip:8084

### 使用 Docker 命令

1. 构建镜像：
```bash
docker build -t ymx-factory-system .
```

2. 运行容器：
```bash
docker run -d -p 8084:80 --name ymx-factory-system ymx-factory-system
```

## 管理命令

### 查看运行状态
```bash
docker-compose ps
```

### 查看日志
```bash
docker-compose logs -f
```

### 停止服务
```bash
docker-compose down
```

### 重新构建并启动
```bash
docker-compose up -d --build
```

## 故障排除

### Docker 守护进程未运行
如果遇到 "Cannot connect to the Docker daemon" 错误：
1. 确保 Docker Desktop 已启动（macOS/Windows）
2. 或启动 Docker 服务（Linux）：`sudo systemctl start docker`

### 端口被占用
如果端口 8084 被占用，可以修改 docker-compose.yml 中的端口映射：
```yaml
ports:
  - "8085:80"  # 改为其他端口
```

### 构建失败
如果构建过程中出现错误，尝试：
```bash
docker system prune -f
docker compose up -d --build --no-cache
```

## 注意事项

- 应用运行在端口 8084
- 容器内使用 nginx 服务静态文件
- docs 目录已挂载以确保 logo 图片正常显示
- 适用于演示环境，未包含数据库等中间件