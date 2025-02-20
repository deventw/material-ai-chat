# 前端远程面试题-React web app 开发

## 项目说明

此项目是基于 [React](https://react.org/)、[Vite](https://vitejs.dev/)、[TypeScript](https://www.typescriptlang.org/)、以及 [Material UI](https://mui.com/) 构建的 AI 聊天 Web 应用，旨在实现类似 [https://chat.openai.com/](https://chat.openai.com/) 的对话界面和交互功能。

用户可以输入 OpenRouter API key 来调用 `gpt-3.5-turbo-1106`，实现与 AI 的连续对话功能。项目支持响应式设计，自适应不同设备。

---

## 功能特性

1. **核心功能**：
   - 支持用户输入 OpenRouter API key。
   - 实现 AI **流式响应（streaming）** 效果，模拟实时生成对话。
   - 支持连续上下文的对话（即每次提问包含历史记录）。

2. **界面还原**：
   - 对话界面尽可能还原 [https://chat.openai.com/](https://chat.openai.com/)（还原度 90% 以上）。
   - 使用 [Material UI](https://mui.com/) 组件实现 UI。

3. **技术实现**：
   - 完全基于 React Function Components 和 Hooks。
   - 使用 TypeScript 提供类型安全。
   - 响应式设计，适配桌面和移动设备。

4. **其他说明**：
   - 刷新页面后，清空聊天记录并开始新的对话。
   - 使用 OpenRouter 提供的免费 model“Mistral 7B Instruct”作为 AI provider。

---

## 🚀 安装和运行

按照以下步骤快速启动项目：

```bash
# 1. 克隆仓库
下载解压

# 2. 进入项目目录
cd ai-chat-webapp

# 3. 安装依赖
yarn install

# 4. 启动开发服务器
yarn dev
