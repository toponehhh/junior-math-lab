# 初中数学演示实验室

面向七年级的可视化数学学习页面集合。全部为纯原生 HTML/CSS/JS 单文件，零外部依赖，离线可用。

## 页面导航

| 页面 | 说明 |
|---|---|
| [index.html](index.html) | 站点首页 |
| [parabola-translation.html](parabola-translation.html) | 抛物线平移演示器：a/h/k 滑块、顶点/对称轴/公式实时联动、6 个示例、平移动画 |
| [inverse-function.html](inverse-function.html) | 反比例函数与图像：积不变定义、描点法、k 正负两族双曲线、k 滑块与拖点交互、易错点 |
| [problem-26-3.html](problem-26-3.html) | 二次函数压轴题（第 26 题(3)）图解：等腰直角三角形 MNO 的 4 种情况 |
| [absolute-value-a4.html](absolute-value-a4.html) | 绝对值练习（第 3、4 题）A4 打印版，附参考答案与逐步解析（含数轴示意图、选项陷阱拆解） |
| [theme.js](theme.js) | 全站共享主题脚本：亮/暗双主题切换按钮、localStorage 记忆、跟随系统、SVG 图形重着色 |

## 主题切换

- 每个页面右上角有 ☾/☀ 圆形按钮，点击在亮色与暗黑主题间切换，选择会被记住
- 未手动选择时自动跟随系统深浅色偏好，并实时响应系统切换
- 支持分享链接强制指定主题：`?theme=dark` 或 `?theme=light`
- A4 打印页在暗黑模式下只暗化背景衬底、柔化纸面，打印输出恒为白纸黑字

## 本地查看

无需构建，直接双击 `index.html` 或用任意静态服务器打开即可。

> AI生成
