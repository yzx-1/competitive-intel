# 竞品情报分析小队

> AI 数字团队笔试作品 · 动态Planner + 信源分级 + Critic反向验证 + Resolver闭环

## 在线Demo

部署后填写链接：https://your-project.vercel.app

## 项目介绍

输入任意品类（硬件/软件/消费品/SaaS），由5个AI Agent协作完成完整竞品调研：

```
Planner  →  动态规划每轮搜索词，基于已知信息决定下一步查什么
Analyst  →  基于信源分级情报库生成结构化分析，每条结论标注置信度
Critic   →  反向搜索（challenge + verify双轨），主动找茬，同时给Resolver指派搜索词
Resolver →  执行Critic指派的补充搜索，对每个矛盾点给出✅/⚠️/❌裁定
Strategist → 以Resolver更新结论为准，生成最终战略报告
```

### 架构亮点

- **动态规划**：Planner每轮读已有信息，决定下一步搜什么，而非固定关键词
- **信源分级**：自动识别高/中/低置信度来源，权威来源和用户内容区别对待
- **反向验证闭环**：Critic不只做正向搜索，专门用负面措辞找反驳证据
- **Resolver机制**：Critic发现矛盾 → Resolver补充搜索 → 更新结论 → Strategist以最新结论为准，实现真正的调研闭环
- **API Key安全**：Key存在Vercel环境变量，前端完全不可见

## 项目结构

```
├── index.html        # 前端页面（单文件，所有UI逻辑）
├── api/
│   ├── search.js     # Tavily搜索代理（Serverless Function）
│   └── llm.js        # LLM调用代理（支持DeepSeek/Qwen/OpenAI）
├── vercel.json       # Vercel路由配置
└── README.md
```

## 本地运行

直接打开 `index.html`（需要自行填入 Tavily 和 DeepSeek API Key）。

## 部署到Vercel

1. Fork 或上传本仓库到 GitHub
2. 在 [Vercel](https://vercel.com) 导入该仓库
3. 在 Vercel Dashboard → Settings → Environment Variables 添加：
   - `TAVILY_API_KEY`：Tavily搜索API Key（[免费注册](https://app.tavily.com)）
   - `DEEPSEEK_API_KEY`：DeepSeek API Key（[申请地址](https://platform.deepseek.com)）
4. 部署完成，获得公网链接

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | 原生 HTML + CSS + JavaScript（无框架） |
| 后端 | Vercel Serverless Functions（Node.js） |
| 搜索 | Tavily API |
| AI | DeepSeek V4 Pro / V4 Flash |
| 部署 | Vercel（免费） |

## 作者

应届生笔试作品，AI产品经理方向。
