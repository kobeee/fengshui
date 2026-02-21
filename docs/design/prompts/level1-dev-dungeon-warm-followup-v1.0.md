# Level 1 Prompt - Warm Clear Variant Follow-up (v1.0)

- Model: Gemini Nano Banana Pro
- Use Case: 正式关卡通关图（与 cold 同构图）
- Aspect Ratio: 16:9
- Prerequisite: 先上传 level1-dev-dungeon-cold-v1.0 的结果图，再使用本 follow-up

## Follow-up Prompt

Using the previously generated isometric pixel art room as strict composition reference, create a cleansed and completed warm variant.

Keep unchanged:
- identical camera angle, room geometry, furniture placement, object scale, and silhouette layout
- same pixel density and style

Transformations to apply:
1) Shift overall palette from cool gloomy tones to warm cozy sunrise tones.
2) Replace rainy cold ambience with gentle warm light entering from window.
3) Remove all ominous mood cues.
4) Make the room feel tidier and emotionally relieved, but avoid excessive rearrangement.
5) Keep gameplay readability and preserve clean center and interaction safe areas.

Color direction:
- warm amber, soft gold, muted terracotta, warm gray
- still limited palette after post process
- avoid high saturation cartoon look

Output constraints:
- no text, no UI, no logos, no watermark
- deliver one 16:9 warm clear state image matching the cold version composition one to one

## Post Process

1. Run the same indexed color and nearest neighbor pipeline as cold version.
2. Validate cold warm pair alignment by overlay test.

## Revision Notes

- v1.0：用于关卡通关后的 palette swap 同构图生成。
