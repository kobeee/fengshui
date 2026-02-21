# Level 1 资源目录

## 目录结构

```
level1/
├── metadata.json          # 关卡元数据
├── README.md              # 本文件
├── room-cold.png          # 冷色底图（待生成）
├── room-warm.png          # 暖色终图（待生成）
├── hotspots.json          # 煞点数据（AI 分析生成）
├── patches/               # 净化贴片
│   ├── sha-001-patch.png  # 镜子区域净化后
│   ├── sha-002-patch.png  # 书架角净化后
│   ├── sha-003-patch.png  # 床头横梁净化后
│   └── sha-004-patch.png  # 门口区域净化后
└── analysis/              # 分析中间数据
    └── validation-report.json
```

## 素材状态

| 文件 | 状态 | 备注 |
|-----|------|------|
| room-cold.png | 待生成 | 使用 prompts/room-cold-v1.0.md |
| room-warm.png | 待生成 | 使用 prompts/room-warm-v1.0.md |
| hotspots.json | 待生成 | 使用 analysis/sha-analysis-v1.0.md |
| patches/* | 待生成 | 局部净化效果贴片 |

## 道具素材

道具素材存放在 `resources/images/shared/items/` 目录，由多个关卡共用：

- `gourd.png` - 葫芦
- `plant-broad.png` - 阔叶绿植
- `screen.png` - 屏风

## 设计文档

设计文档位于 `docs/design/game/level1/`：

- `level-design.md` - 关卡设计文档
- `prompts/` - 生图提示词
- `analysis/` - 解析提示词
