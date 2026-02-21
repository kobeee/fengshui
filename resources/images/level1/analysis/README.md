# Level 1 分析中间数据目录

此目录存放 AI 分析过程中产生的中间数据。

## 文件说明

| 文件 | 说明 | 状态 |
|-----|------|------|
| `validation-report.json` | 位置校验报告 | 待生成 |

## 使用流程

1. 使用 `sha-analysis-v1.0.md` 分析冷色底图
2. 生成初步 `hotspots.json`
3. 使用 `position-validation-v1.0.md` 校验位置
4. 生成 `validation-report.json`
5. 根据报告调整 `hotspots.json`
