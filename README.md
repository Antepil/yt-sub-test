
# 📺 YouTube 字幕提取器 (YouTube Subtitle Extractor)

这是一个简单、强大的工具，可以帮你一键提取 YouTube 视频的字幕（支持人工字幕和自动生成字幕），并下载为 `.srt` 或 `.txt` 格式。

✅ **无需安装任何软件，直接在浏览器中运行（推荐）**
✅ **支持中英双语等多种语言**
✅ **纯净无广告**

---

## 🚀 方法一：使用 GitHub Codespaces 运行 (推荐小白)

不需要在你的电脑上安装 Python 或 Node.js，直接利用 GitHub 提供的免费云电脑运行。

### 1. 启动云环境
点击项目页面右上角的绿色按钮 **Code** -> 选择 **Codespaces** -> 点击 **Create codespace on main**。
等待 1-2 分钟，直到出现 VS Code 的网页编辑器界面。

### 2. 安装并启动后端 (Backend)
在网页底部的终端 (Terminal) 中，依次输入以下命令（每次输入一行，按回车）：

```bash
cd backend
# 安装系统必备工具 (FFmpeg)
sudo apt-get update && sudo apt-get install -y ffmpeg
# 安装 Python 依赖
pip install -r requirements.txt
# 启动后端服务
python main.py

```

当看到 `Application startup complete` 或 `Uvicorn running on...` 时，说明后端已启动。**请不要关闭这个终端窗口。**

### 3. 安装并启动前端 (Frontend)

点击终端面板右上角的 **+** 号（新建一个终端窗口），然后输入：

```bash
cd frontend
# 安装前端依赖
npm install
# 启动网页
npm run dev

```

### ⚠️ 关键步骤：配置端口 (必看！)

如果不做这一步，前端无法连接后端，会报错。

1. 点击终端面板顶部的 **PORTS (端口)** 标签。
2. 找到 **8000** 端口 (后端)。
3. 在 `Visibility` (可见性) 一列，右键点击 `Private`，选择 **Port Visibility -> Public** (公开)。
4. 现在，点击 **5173** 端口 (Frontend) 后面的 🌐 地球图标，即可打开网页开始使用！

---

## 💻 方法二：部署到本地电脑 (Mac/Windows)

如果你想在自己的电脑上长期使用，且不受云端 IP 限制，建议部署在本地。

### 准备工作

请确保你的电脑已安装：

* [Python 3.8+](https://www.python.org/downloads/)
* [Node.js](https://nodejs.org/)
* [FFmpeg](https://ffmpeg.org/download.html) (必须配置到环境变量中)

### 步骤 1：启动后端

打开终端 (Terminal 或 CMD)，进入项目文件夹：

```bash
cd youtube-subtitle-extractor/backend

# 创建虚拟环境 (可选，推荐)
python -m venv venv
# Mac/Linux 激活虚拟环境: source venv/bin/activate
# Windows 激活虚拟环境: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动服务
python main.py

```

### 步骤 2：启动前端

打开一个新的终端窗口，进入项目文件夹：

```bash
cd youtube-subtitle-extractor/frontend

# 安装依赖
npm install

# 启动网页
npm run dev

```

启动后，浏览器通常会自动打开 `http://localhost:5173`，你就可以使用了！

---

## ❓ 常见问题 (FAQ)

**Q: 点击“获取字幕”报错，提示 IP Blocked?**

> **A:** YouTube 对云服务器（如 GitHub Codespaces、Vercel、AWS）的 IP 非常敏感。如果你在 Codespaces 上遇到此错误，说明该 IP 被临时拉黑了。
> **解决方法：** 请使用 **方法二** 在本地电脑运行，因为家庭宽带 IP 通常不会被封锁。

**Q: 下载的字幕没有时间轴？**

> **A:** 请选择 `.srt` 格式下载。`.txt` 格式是为了方便阅读纯文本笔记，故意去除了时间轴。

**Q: 为什么一直是 "Loading..."?**

> **A:** 检查后端终端是否有报错。另外，请确保在 Codespaces 中已将 **8000 端口设置为 Public**。

---

## 🛠 技术栈

* **Backend:** Python, FastAPI, yt-dlp
* **Frontend:** React, Vite, TailwindCSS

```

---

### 如何在 Trae / VS Code 中添加这个文件？

1.  在左侧文件列表中，鼠标右键点击最顶部的文件夹（根目录）。
2.  选择 **New File (新建文件)**。
3.  命名为 `README.md`。
4.  将上面的代码块内容全部粘贴进去。
5.  保存，然后提交到 GitHub：
    ```bash
    git add README.md
    git commit -m "Add instruction manual"
    git push
    ```

这样，别人（或者未来的你）打开 GitHub 仓库主页时，就能直接看到这份漂亮的说明书了！

```
