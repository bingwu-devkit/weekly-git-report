# @weekly-git-report/desktop

## 1.2.1

### Patch Changes

- 5ec50ca: 优化桌面端应用图标、任务栏/安装包图标及页面图标为抗锯齿圆角样式，并提升高分屏清晰度。

## 1.2.0

### Minor Changes

- c1556a2: 桌面端重构为 Linear 极简风格：新增 36px 一体化自定义窗口标题栏与深浅色主题同步，统一黑白灰冷中性视觉体系并本地打包 Inter 字体；升级全站视口锁定内部滚动布局、极简命令面板入口及三联外观设置，并将总览、报告库、仓库、执行记录、报告任务与设置页改造为高密度工作台视图。

## 1.1.1

### Patch Changes

- 65a21b3: 报告生成完成后支持复用本次采集数据重新调用 AI；人工编辑草稿时先确认，重新生成失败则恢复上一版草稿。

## 1.1.0

### Minor Changes

- 5d4a697: 支持配置 OpenAI、DeepSeek 和自定义 OpenAI-compatible AI 服务的 API Key、Base URL 与模型；连接测试可选，首次设置可以保存后稍后测试或暂时跳过。

### Patch Changes

- c6beb24: 修复检查更新时可能错误显示内部 workspace 包名称和版本说明的问题，在更新 feed 中显式写入 Desktop Release 元数据，并为检查、下载和安装操作增加 Toast 状态反馈。将设置导航中的“生成模板”统一调整为语义更准确的“报告模板”。

## 1.0.0

### Major Changes

- 75a6661: 首个正式桌面版本：新增基于 GitHub Releases 的 Windows x64 自动更新、独立“关于与更新”页面、后台更新提醒和安全安装保护。

桌面应用的用户可见变化由 Changesets 维护。GitHub Desktop Release 的版本说明直接取自本文件对应版本，默认使用简体中文。
