# 关卡列表页面 UI 优化方案 v3.0

> 基于 v2.0 的致命问题修复，核心改动：放弃网格跨格，改用纵向列表 + 视觉层叠

## 设计理念

**核心目标**：让玩家一眼看清整体进度，并快速定位到当前关卡。

**设计原则**：
1. **单入口无歧义**：当前关卡用视觉层叠（发光+置顶）高亮，无重复入口
2. **纵向列表布局**：放弃网格，天然适配移动端，扫描效率高
3. **真正的像素硬边**：纯色块 + 像素化投影 + dithering 纹理，拒绝渐变伪像素
4. **视觉层叠突出**：当前关卡通过发光边框、置顶位置、脉冲动画区分，而非物理放大
5. **迷雾探索感**：动画粒子 + 模糊剪影，而非简单的问号
6. **底部按钮安全区**：刘海屏适配，避免遮挡内容

---

## 核心布局：纵向列表 + 视觉层叠

```
┌────────────────────────────────────────────┐
│  探境                           已解 12/20  │
├────────────────────────────────────────────┤
│                                            │
│   ◆─◇─◇─◇  进度路径                        │
│                                            │
├────────────────────────────────────────────┤
│   ◆ 初窥门径 · 第壹章                       │
│                                            │
│   ┌─────────────────────────────────────┐  │
│   │ [缩略图] Level 01 · 玄关破煞         │  │
│   │          ✓ 已化解 3/3 煞            │  │
│   └─────────────────────────────────────┘  │
│                                            │
│   ┌═════════════════════════════════════┐  │
│   ║ [缩略图] Level 05 · 书房夜读         ║  │ ← 当前关卡
│   ║  ●●○ 进行中 2/3 煞   [脉冲边框]      ║  │   置顶+发光
│   └═════════════════════════════════════┘  │
│                                            │
│   ┌─────────────────────────────────────┐  │
│   │ [迷雾动画] Level 06 · ???            │  │
│   │  ~~~ 漂浮粒子 ~~~                    │  │
│   └─────────────────────────────────────┘  │
│                                            │
├────────────────────────────────────────────┤
│   ◇ 渐入佳境 · 第贰章                       │
│   ...                                     │
└────────────────────────────────────────────┘
      [  继 续 探 境  ·  第 2/3 煞  ]
```

---

## 1. 视觉进度路径（颜色+填充双维度）

**问题修复**：v2.0 的 `◇ ◈ ◉ ◆` 四个符号视觉差异太小

**新方案**：统一使用菱形 `◇`，通过**颜色+填充**双维度区分状态

```jsx
function ProgressPath({ completedCount, total = 20 }) {
  const chapters = [
    { name: '初窥门径', range: [1, 5] },
    { name: '渐入佳境', range: [6, 10] },
    { name: '融会贯通', range: [11, 15] },
    { name: '超凡入圣', range: [16, 20] },
  ];
  
  return (
    <div className="flex items-center justify-center gap-1 mb-6">
      {chapters.map((chapter, i) => {
        const isCompleted = completedCount >= chapter.range[1];
        const isCurrent = completedCount >= chapter.range[0] - 1 && 
                         completedCount < chapter.range[1];
        
        // 双维度区分：填充 + 颜色
        const getState = () => {
          if (isCompleted) return { symbol: '◆', color: '#C4A06A', glow: false };
          if (isCurrent) return { symbol: '◈', color: '#F5E4BB', glow: true };
          return { symbol: '◇', color: '#4A5059', glow: false };
        };
        
        const state = getState();
        
        return (
          <div key={chapter.name} className="flex items-center">
            <span 
              className="font-pixel text-[14px] transition-all duration-300"
              style={{
                color: state.color,
                textShadow: state.glow 
                  ? '0 0 10px rgba(196, 160, 106, 0.8), 0 0 20px rgba(196, 160, 106, 0.4)' 
                  : 'none',
              }}
            >
              {state.symbol}
            </span>
            {i < chapters.length - 1 && (
              <span className="font-pixel text-[10px] text-[#2A2F3A] mx-1">
                ─
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

**状态图例**：
- `◇` 灰色描边 → 未解锁
- `◈` 金色描边 + 脉冲发光 → 进行中
- `◆` 金色实心填充 → 已完成

---

## 2. 章节分组布局（纵向列表）

**问题修复**：v2.0 的"跨格"设计与5关分组天然冲突，桌面端产生视觉空洞

**新方案**：纯纵向列表，每个关卡占一整行，当前关卡自动置顶到章节首位

```jsx
const CHAPTER_NAMES = [
  { id: 1, name: '初窥门径', symbol: '壹', range: [1, 5] },
  { id: 2, name: '渐入佳境', symbol: '贰', range: [6, 10] },
  { id: 3, name: '融会贯通', symbol: '叁', range: [11, 15] },
  { id: 4, name: '超凡入圣', symbol: '肆', range: [16, 20] },
];

function ChapterSection({ chapter, levels, currentLevelId, onEnterLevel }) {
  const hasCurrentLevel = levels.some(l => l.id === currentLevelId);
  
  // 当前关卡置顶
  const sortedLevels = useMemo(() => {
    if (!hasCurrentLevel) return levels;
    const current = levels.find(l => l.id === currentLevelId);
    const others = levels.filter(l => l.id !== currentLevelId);
    return [current, ...others];
  }, [levels, currentLevelId, hasCurrentLevel]);
  
  return (
    <section className="mb-8" id={`chapter-${chapter.id}`}>
      {/* 章节标题 */}
      <div className="flex items-center gap-3 mb-4">
        <span 
          className="font-pixel text-[14px]"
          style={{ color: hasCurrentLevel ? '#C4A06A' : '#4A5059' }}
        >
          {hasCurrentLevel ? '◆' : '◇'}
        </span>
        <h2 className="font-pixel text-[12px] text-[#9CA3AF]">
          {chapter.name} · 第{chapter.symbol}章
        </h2>
        <div className="flex-1 h-px bg-[#2A2F3A]" />
      </div>
      
      {/* 纵向列表 */}
      <div className="flex flex-col gap-3">
        {sortedLevels.map((level) => (
          <LevelCard
            key={level.id}
            level={level}
            isCurrent={level.id === currentLevelId}
            onClick={() => onEnterLevel(level)}
          />
        ))}
      </div>
    </section>
  );
}
```

---

## 3. 关卡卡片组件（统一入口）

**问题修复**：v2.0 存在 `LevelCard` 和 `CurrentLevelCard` 两套代码，维护成本高

**新方案**：单组件内部处理所有状态，通过 props 切换样式

### 3.1 核心卡片组件

```jsx
function LevelCard({ level, isCurrent, onClick }) {
  const isLocked = level.state === 'locked';
  const isCompleted = level.state === 'completed';
  
  const handleClick = () => {
    if (isLocked) {
      showToast('此境尚迷雾笼罩，需先解前缘');
      return;
    }
    onClick?.(level);
  };
  
  // 像素硬边样式（无圆角，纯色块，像素化投影）
  const cardStyle = {
    background: isLocked ? '#15181D' : '#1A1D24',
    border: isCurrent 
      ? '2px solid #C4A06A'
      : isCompleted 
        ? '1px solid rgba(196, 160, 106, 0.5)'
        : isLocked
          ? '1px solid rgba(74, 80, 89, 0.5)'
          : '1px solid rgba(196, 160, 106, 0.2)',
    // 像素化投影（关键：4px 4px 0 0，不是模糊阴影）
    boxShadow: isCurrent
      ? '4px 4px 0 0 #0E1116, 0 0 30px rgba(196, 160, 106, 0.4)'
      : '4px 4px 0 0 #0E1116',
    // 当前关卡脉冲动画
    animation: isCurrent ? 'pulse-glow 2s ease-in-out infinite' : 'none',
  };
  
  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer transition-all active:scale-[0.98]"
      style={cardStyle}
    >
      <div className="flex items-center gap-4 p-4">
        {/* 缩略图 */}
        <div 
          className="relative w-20 h-20 flex-shrink-0 overflow-hidden"
          style={{
            border: '1px solid rgba(0,0,0,0.5)',
          }}
        >
          {!isLocked ? (
            <img
              src={level.thumbnail}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            // 迷雾动画效果（见 3.3 节）
            <MistOverlay />
          )}
          
          {/* 状态标记 */}
          {isCompleted && (
            <div 
              className="absolute top-1 left-1 px-1.5 py-0.5"
              style={{
                background: '#C4A06A',
                boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <span className="font-pixel text-[8px] text-[#0E1116]">吉</span>
            </div>
          )}
          
          {isCurrent && (
            <div 
              className="absolute top-1 left-1 px-1.5 py-0.5"
              style={{
                background: '#D4B07A',
                boxShadow: '2px 2px 0 0 rgba(0,0,0,0.5)',
              }}
            >
              <span className="font-pixel text-[8px] text-[#0E1116]">当前</span>
            </div>
          )}
        </div>
        
        {/* 信息区 */}
        <div className="flex-1 min-w-0">
          <span 
            className="font-pixel text-[10px]"
            style={{ color: isLocked ? '#4A5059' : '#C4A06A' }}
          >
            Level {level.id}
          </span>
          
          <h3 
            className="font-pixel text-[11px] mt-1 truncate"
            style={{ color: isLocked ? '#4A5059' : (isCurrent ? '#F5E4BB' : '#E2E8F0') }}
          >
            {isLocked ? '迷雾笼罩' : level.name}
          </h3>
          
          {/* 进度条（非锁定） */}
          {!isLocked && (
            <div className="mt-2">
              <ProgressBar 
                total={level.shaCount} 
                completed={level.shaCompleted}
                isCurrent={isCurrent}
              />
            </div>
          )}
        </div>
        
        {/* 右箭头（当前关卡） */}
        {isCurrent && (
          <div className="flex-shrink-0">
            <span 
              className="font-pixel text-[12px]"
              style={{ 
                color: '#C4A06A',
                textShadow: '0 0 8px rgba(196, 160, 106, 0.5)',
              }}
            >
              ▶
            </span>
          </div>
        )}
      </div>
      
      {/* 脉冲发光动画 */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 4px 4px 0 0 #0E1116, 0 0 30px rgba(196, 160, 106, 0.4);
            border-color: #C4A06A;
          }
          50% { 
            box-shadow: 4px 4px 0 0 #0E1116, 0 0 50px rgba(196, 160, 106, 0.6);
            border-color: #D4B07A;
          }
        }
      `}</style>
    </div>
  );
}
```

### 3.2 进度条组件（像素风格）

```jsx
function ProgressBar({ total, completed, isCurrent }) {
  const progress = completed / total;
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className="flex-1 h-2 overflow-hidden"
        style={{
          background: '#0E1116',
          border: '1px solid #2A2F3A',
        }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progress * 100}%`,
            background: '#C4A06A', // 纯色，不用渐变
            boxShadow: isCurrent ? '0 0 8px rgba(196, 160, 106, 0.5)' : 'none',
          }}
        />
      </div>
      <span className="font-pixel text-[9px] text-[#9CA3AF]">
        {completed}/{total}
      </span>
    </div>
  );
}
```

### 3.3 迷雾动画效果

**问题修复**：v2.0 的问号 `?` 过于简单，失去探索感

**新方案**：模糊剪影 + 漂浮粒子

```jsx
function MistOverlay() {
  // 生成随机粒子位置
  const particles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: i * 0.3,
      size: Math.random() * 0.5 + 0.5, // 0.5-1rem
    })),
  []);
  
  return (
    <div className="relative w-full h-full bg-[#1A1D24] overflow-hidden">
      {/* 模糊剪影 */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #1A1D24 0%, #2A2F3A 50%, #1A1D24 100%)',
          filter: 'blur(8px)',
        }}
      />
      
      {/* 漂浮粒子 */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bg-[#4A5059] animate-float"
          style={{
            left: `${p.left}%`,
            bottom: '-4px',
            width: `${p.size}rem`,
            height: `${p.size}rem`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      
      {/* 问号提示 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="font-pixel text-[20px] text-[#4A5059]"
          style={{ textShadow: '0 0 10px rgba(74, 80, 89, 0.5)' }}
        >
          ?
        </span>
      </div>
      
      {/* 漂浮动画 */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) scale(1.2);
            opacity: 0.6;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
```

---

## 4. 继续游戏悬浮按钮（安全区适配）

**问题修复**：v2.0 的 `pb-24` 可能遮挡最后内容，且未适配刘海屏

**新方案**：动态安全区 + 吸附式设计

```jsx
function ContinueButton({ currentLevel, onClick }) {
  if (!currentLevel) return null;
  
  const progressText = `${currentLevel.shaCompleted}/${currentLevel.shaCount}`;
  
  return (
    <div 
      className="fixed left-0 right-0 flex justify-center z-50 px-4"
      style={{
        bottom: 'calc(16px + env(safe-area-inset-bottom))', // 刘海屏适配
      }}
    >
      <button
        onClick={onClick}
        className="flex items-center gap-3 px-8 py-4 transition-transform active:scale-95"
        style={{
          background: '#C4A06A', // 纯色，不用渐变
          border: '2px solid #B8904F',
          boxShadow: `
            0 4px 0 0 #5C4020,
            4px 4px 0 0 #3A2810
          `,
        }}
      >
        <span className="font-pixel text-[12px] text-[#0E1116]">
          继续探境
        </span>
        <span className="font-pixel text-[10px] text-[#5C4020]">
          · 第 {progressText} 煞
        </span>
        <span className="font-pixel text-[12px] text-[#0E1116] ml-1">▶</span>
      </button>
    </div>
  );
}
```

**页面底部安全区**：
```jsx
// LevelSelectPage 中
<div className="relative min-h-screen bg-[#0E1116]"
     style={{ paddingBottom: 'calc(100px + env(safe-area-inset-bottom))' }}>
```

---

## 5. 完整页面结构

```jsx
function LevelSelectPage() {
  const levels = useLevels(); // 20关数据
  const currentLevel = levels.find(l => l.state === 'current');
  const completedCount = levels.filter(l => l.state === 'completed').length;
  
  // 按章节分组
  const chapters = useMemo(() => {
    return CHAPTER_NAMES.map(chapter => ({
      ...chapter,
      levels: levels.filter(
        l => l.id >= chapter.range[0] && l.id <= chapter.range[1]
      ),
    }));
  }, [levels]);
  
  // 自动滚动到当前关卡
  useEffect(() => {
    if (currentLevel) {
      const chapterId = Math.ceil(currentLevel.id / 5);
      const element = document.getElementById(`chapter-${chapterId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentLevel]);
  
  const handleEnterLevel = (level) => {
    // TODO: 可在此添加关卡预览层动画
    navigateToGame(level.id);
  };
  
  return (
    <div 
      className="relative min-h-screen bg-[#0E1116]"
      style={{ paddingBottom: 'calc(100px + env(safe-area-inset-bottom))' }}
    >
      {/* 背景层 */}
      <div className="fixed inset-0">
        <img 
          src="/images/home-v1.0.png" 
          className="w-full h-full object-cover opacity-20"
          style={{ imageRendering: 'pixelated' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0E1116_90%)]" />
      </div>
      
      {/* 内容层 */}
      <div className="relative z-10 max-w-xl mx-auto px-4 py-6">
        
        {/* 标题区 */}
        <header className="text-center mb-6">
          <h1 
            className="font-pixel text-[16px] mb-2"
            style={{ 
              color: '#F5E4BB',
              textShadow: '2px 2px 0 rgba(0,0,0,0.8), 0 0 20px rgba(196, 160, 106, 0.3)',
            }}
          >
            探境
          </h1>
          <p className="font-pixel text-[10px] text-[#9CA3AF]">
            已解 {completedCount}/20 关
          </p>
        </header>
        
        {/* 进度路径 */}
        <ProgressPath completedCount={completedCount} />
        
        {/* 章节列表 */}
        {chapters.map((chapter) => (
          <ChapterSection
            key={chapter.id}
            chapter={chapter}
            levels={chapter.levels}
            currentLevelId={currentLevel?.id}
            onEnterLevel={handleEnterLevel}
          />
        ))}
        
        {/* 返回按钮 */}
        <footer className="text-center pt-4 pb-8">
          <button 
            onClick={() => navigateToHome()}
            className="font-pixel text-[10px] text-[#4A5059] hover:text-[#C4A06A] transition-colors"
          >
            返回主殿
          </button>
        </footer>
      </div>
      
      {/* 继续游戏悬浮按钮 */}
      {currentLevel && (
        <ContinueButton
          currentLevel={currentLevel}
          onClick={() => handleEnterLevel(currentLevel)}
        />
      )}
    </div>
  );
}
```

---

## 6. 关卡过渡动画（新增）

**问题**：v2.0 缺少关卡过渡，直接进入游戏

**建议**：点击关卡卡片后，展开一个**关卡预览层**

```jsx
function LevelPreviewModal({ level, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1116]/90">
      <div 
        className="relative max-w-md w-full mx-4 p-6"
        style={{
          background: '#1A1D24',
          border: '2px solid #C4A06A',
          boxShadow: '8px 8px 0 0 #0E1116',
        }}
      >
        {/* 关卡名称 */}
        <h2 className="font-pixel text-[14px] text-[#F5E4BB] mb-4">
          Level {level.id} · {level.name}
        </h2>
        
        {/* 缩略图预览 */}
        <div className="relative aspect-video mb-4 overflow-hidden">
          <img 
            src={level.thumbnail} 
            className="w-full h-full object-cover"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        
        {/* 煞气说明 */}
        <div className="mb-6">
          <p className="font-pixel text-[10px] text-[#9CA3AF] mb-2">
            此境煞气：
          </p>
          <ul className="font-pixel text-[9px] text-[#E2E8F0] space-y-1">
            {level.shaList?.map((sha, i) => (
              <li key={i}>· {sha}</li>
            ))}
          </ul>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 font-pixel text-[10px] text-[#9CA3AF]"
            style={{ border: '1px solid #4A5059' }}
          >
            返回
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 font-pixel text-[10px] text-[#0E1116]"
            style={{ 
              background: '#C4A06A',
              boxShadow: '0 2px 0 0 #5C4020',
            }}
          >
            进入
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. 状态对比表

| 状态 | 缩略图 | 边框 | 标记 | 位置 | 交互 |
|-----|--------|------|------|------|------|
| **当前** | 彩色 | 2px金色+脉冲发光 | 左上角「当前」 | 章节置顶 | 点击进入 |
| **已完成** | 彩色 | 1px金色 | 左上角「吉」 | 正常位置 | 点击重玩 |
| **可玩** | 彩色 | 1px淡金色 | 无 | 正常位置 | 点击开始 |
| **锁定** | 迷雾动画+粒子 | 1px灰色 | 中央「?」 | 正常位置 | 点击提示 |

---

## 8. 样式总结

### 颜色体系
```css
/* 背景 */
--bg-primary: #0E1116;
--bg-card: #1A1D24;
--bg-card-dark: #15181D;

/* 边框 */
--border-gold: #C4A06A;
--border-gold-dark: #B8904F;
--border-gray: #4A5059;

/* 文字 */
--text-gold: #C4A06A;
--text-gold-bright: #F5E4BB;
--text-gray: #9CA3AF;
--text-muted: #4A5059;
```

### 像素硬边效果（严格执行）

```css
/* 禁止使用的样式 */
/* ❌ border-radius */
/* ❌ box-shadow: 0 4px 8px rgba(...) */ /* 模糊阴影 */
/* ❌ linear-gradient(135deg, ...) */ /* 任意角度渐变 */

/* 必须使用的样式 */
/* ✓ 无圆角 */
/* ✓ box-shadow: 4px 4px 0 0 #color */ /* 像素化投影 */
/* ✓ border: 2px solid #color */ /* 实体边框 */
/* ✓ image-rendering: pixelated */ /* 图片像素化 */
/* ✓ 纯色背景或水平渐变 */
```

### 关键改进点

| 改进项 | v2.0 | v3.0 |
|-------|------|------|
| 布局方式 | 网格+跨格（逻辑冲突） | 纵向列表（规整） |
| 当前关卡突出 | 物理放大1.5倍跨2格 | 视觉层叠（发光+置顶+脉冲） |
| 组件结构 | LevelCard + CurrentLevelCard 两套 | 单一 LevelCard 统一处理 |
| 迷雾锁定 | 静态问号 `?` | 动画粒子 + 模糊剪影 |
| 进度路径 | 四种符号难区分 | 颜色+填充双维度 |
| 底部按钮 | 固定 pb-24 | 动态安全区 + 刘海屏适配 |
| 关卡过渡 | 无 | 预览层动画 |
| 像素风格 | 渐变伪像素 | 纯色块+像素化投影 |

---

## 参考

- 《Eastward》UI 设计：硬边像素风格
- 《Coffee Talk》关卡选择：章节式纵向布局
- 8-bit 像素美学：dithering、有限调色板、直角边框、像素化投影
