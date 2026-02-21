# Level 1 - 暖色终图提示词 (v1.0)

## 基本信息

| 属性 | 值 |
|-----|-----|
| **用途** | 正式关卡通关图（完成态） |
| **模型建议** | Gemini 3 Pro Image Preview (Nano Banana Pro) |
| **宽高比** | 16:9 |
| **前置条件** | 冷色底图 + 道具 PNG 已生成 |
| **关联关卡** | Level 1 - 开发者的地牢 |

---

## 输入素材

| 文件 | 用途 |
|-----|------|
| `room-cold.png` | 冷色底图（结构参考） |
| `gourd.png` | 葫芦道具（参考素材） |
| `plant-broad.png` | 阔叶绿植道具（参考素材） |
| `screen.png` | 屏风道具（参考素材） |

---

## 完整提示词

```text
Using the provided isometric pixel art room image as STRICT composition reference, create a cleansed and completed warm variant with Feng Shui items placed.

Keep UNCHANGED:
- Identical camera angle, room geometry
- Same object scale and silhouette layout
- Same pixel density and art style
- Same furniture positions (bed, desk, bookshelf, mirror, doors)

Transformations to apply:
1) Shift overall palette from cool gloomy tones to warm cozy sunrise tones
2) Replace rainy cold ambience with gentle warm light entering from window
3) Add subtle morning sunshine glow effect
4) Remove all ominous mood cues (dark shadows, cold blue tints)
5) Make the room feel tidier and emotionally relieved

Place the following Feng Shui items at these locations:
1) GOURD: Hang from the ceiling beam above the bed head (use the gourd reference image)
2) BROAD-LEAF PLANT: Place on the floor between the bookshelf sharp corner and the desk (use the plant reference image)
3) SCREEN DIVIDER: Place between the entrance door and the balcony door to block the straight path (use the screen reference image)

Mirror adjustment:
- The standing mirror should appear slightly rotated/angled, no longer facing the bed directly

Color direction:
- Warm amber, soft gold, muted terracotta, warm gray
- Morning light yellow-orange tones
- Still limited palette (32-64 colors after post process)
- Avoid high saturation cartoon look
- Keep the same level of detail as cold version

Output constraints:
- NO text, NO UI, NO logos, NO watermark
- NO characters
- Deliver one 16:9 warm completed state image
```

---

## 生成后处理

1. **色彩索引化**: 使用与冷色图相同的色彩数量限制 (32-64 色)
2. **像素标准化**: 使用邻近采样确保与冷色图风格一致
3. **对齐校验**: 将冷色图与暖色图叠加，检查房间结构是否对齐

---

## 冷暖图对比检查

| 检查项 | 要求 |
|-------|------|
| 房间结构 | 墙壁、门窗位置一致 |
| 家具位置 | 床、书桌、书架、镜子位置一致 |
| 道具放置 | 葫芦挂横梁、绿植放书架角旁、屏风放门之间 |
| 镜子角度 | 暖色图镜子已旋转，不再正对床 |
| 色调 | 冷色 → 暖色，情绪从阴郁变温馨 |

---

## 版本记录

| 版本 | 日期 | 变更说明 |
|-----|------|---------|
| v1.0 | 2026-02-20 | 初版：完成态暖色终图，包含道具放置 |
