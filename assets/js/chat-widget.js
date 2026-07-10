/**
 * 星途 LumiPath · AI跨境规划顾问 · 聊天+测评+支付组件 v5
 * 参照妙搭参考站设计：
 * - 咨询：白底卡片，蓝色头部，机器人头像，6个快捷入口，对话输入
 * - 测评：紫色头部，3步引导式，开始测评按钮
 * - 支付：支付宝扫码弹窗，收款码+操作指引
 * v5: 按页面类型（留学/旅游/工作签）自动切换咨询内容和测评问题
 */
(function () {
  'use strict';

  // 检测当前页面类型
  var pagePath = window.location.pathname;
  var pageType = 'study'; // 默认留学
  if (pagePath.indexOf('/travel/') !== -1) pageType = 'travel';
  else if (pagePath.indexOf('/workvisa/') !== -1) pageType = 'work';

  // 各页面配置
  var PAGE_CONFIGS = {
    study: {
      botName: '小西',
      botTitle: '咨询顾问',
      botSub: 'AI智能顾问 · 留学规划 · 选校推荐 · 实时答疑',
      welcomeText: '你好！我是<b>小西</b>👋<br>星途LumiPath AI留学规划顾问，请选择您感兴趣的方向或直接提问',
      quickTopics: [
        { icon: '🎓', title: '新加坡跳板', desc: '本科直升 · 硕士直申 · PSB Academy' },
        { icon: '🎓', title: '名校直申', desc: '英国G5 · 澳洲八大 · 美国Top50' },
        { icon: '💰', title: '费用与奖学金', desc: '四国费用对比 · 奖学金申请指南' },
        { icon: '📑', title: '签证与认证', desc: '签证政策 · 中留服认证 · 学历认可' },
        { icon: '✨', title: '个性规划', desc: 'AI测评 · 选校推荐 · 一对一咨询' },
        { icon: '🎓', title: '技能院校', desc: '就业导向 · 澳洲TAFE · 可移民' }
      ],
      assessTitle: 'AI兴趣天赋测评',
      assessSub: '智能匹配专业方向 · 留学路径规划 · 个性化推荐',
      assessIntroTitle: '发现你的留学方向',
      assessIntroDesc: '只需3步，AI将基于你的兴趣、学业背景和目标国家，为你生成个性化的专业方向推荐与留学路径建议',
      assessSteps: [
        { label: '✨ Step 1', title: '兴趣方向', q: '你对哪些领域感兴趣？' },
        { label: '📖 Step 2', title: '学业背景', q: '你目前的教育情况？' },
        { label: '🌐 Step 3', title: '目标国家', q: '你倾向哪些留学目的地？' }
      ]
    },
    travel: {
      botName: '小途',
      botTitle: '旅游咨询顾问',
      botSub: 'AI智能顾问 · 跨境旅游 · 定制行程 · 签证办理',
      welcomeText: '你好！我是<b>小途</b>👋<br>星途LumiPath AI跨境旅游顾问，请选择您感兴趣的旅游方向或直接提问',
      quickTopics: [
        { icon: '✈️', title: '出境旅游', desc: '国人出国 · 热门目的地 · 自由行/跟团' },
        { icon: '🇨🇳', title: '入境旅游', desc: '海外游客来华 · 签证代办 · 中文导览' },
        { icon: '📝', title: '签证办理', desc: '旅游签证 · 多国通办 · 快速出签' },
        { icon: '🗺️', title: '定制行程', desc: '一对一规划 · 深度游 · 私人定制' },
        { icon: '💰', title: '费用预算', desc: '透明报价 · 无强制消费 · 性价比' },
        { icon: '🛡️', title: '旅游保险', desc: '境外保险 · 安全保障 · 紧急救援' }
      ],
      assessTitle: 'AI旅游需求测评',
      assessSub: '智能匹配旅游方案 · 定制行程推荐 · 预算评估',
      assessIntroTitle: '发现你的旅行方向',
      assessIntroDesc: '只需3步，AI将基于你的旅游偏好、出行计划和目的地意向，为你生成个性化的旅游方案推荐与行程建议',
      assessSteps: [
        { label: '✈️ Step 1', title: '出行意向', q: '你想出境游还是入境游？' },
        { label: '📅 Step 2', title: '出行计划', q: '你的出行时间和人数？' },
        { label: '🌍 Step 3', title: '目的地', q: '你倾向哪些旅游目的地？' }
      ]
    },
    work: {
      botName: '小达',
      botTitle: '出国工作顾问',
      botSub: 'AI智能顾问 · 合法工作签 · 海外就业 · 落地保障',
      welcomeText: '你好！我是<b>小达</b>👋<br>星途LumiPath AI出国工作顾问，请选择您感兴趣的方向或直接提问',
      quickTopics: [
        { icon: '🇦🇺', title: '澳洲工作签', desc: '合法工作签证 · 43岁内 · 8年社保' },
        { icon: '🇬🇧', title: '英国工作签', desc: '工签办理 · 岗位匹配 · 合法合规' },
        { icon: '🇪🇺', title: '欧洲工作签', desc: '多国可选 · 签证政策 · 就业机会' },
        { icon: '🇲🇾', title: '马来西亚', desc: '工作签证 · 低门槛 · 华人友好' },
        { icon: '📋', title: '签证条件', desc: '年龄/社保/技能要求 · 资格评估' },
        { icon: '🏠', title: '海外落地保障', desc: '接机住宿 · 银行卡 · 手机卡 · 就业指导' }
      ],
      assessTitle: 'AI出国工作资格测评',
      assessSub: '智能评估签证资格 · 匹配目标国家 · 海外就业规划',
      assessIntroTitle: '评估你的出国工作资格',
      assessIntroDesc: '只需3步，AI将基于你的年龄、工作经验和目标国家，为你评估签证资格并推荐最适合的出国工作路径',
      assessSteps: [
        { label: '👤 Step 1', title: '基本条件', q: '你的年龄和工作经验？' },
        { label: '💼 Step 2', title: '技能背景', q: '你的专业技能和社保情况？' },
        { label: '🌍 Step 3', title: '目标国家', q: '你倾向哪些工作目的地？' }
      ]
    }
  };

  var pageConfig = PAGE_CONFIGS[pageType] || PAGE_CONFIGS.study;

  var CONFIG = {
    apiEndpoint: '',
    logoUrl: '',
    leadMarker: '[LEAD_COMPLETE]',
    feishuBaseToken: 'Ck0QbHqOmaR457sRnE1ckmvTn6d',
    feishuTableId: 'tblDJLF1SHgmSV2p',
    paymentQrUrl: '',
    pageType: pageType,
    pageConfig: pageConfig
  };

  var messages = [];
  var isWaiting = false;
  var isLeadSubmitted = false;
  var currentMode = 'consult';
  var modal = null;
  var messagesContainer = null;
  var inputElement = null;
  var sendButton = null;
  var quickBar = null;
  var assessStep = 0;
  var assessData = {};

  // ========== 注入样式 ==========
  function injectStyles() {
    if (document.getElementById('lumipath-widget-styles')) return;
    var style = document.createElement('style');
    style.id = 'lumipath-widget-styles';
    style.textContent = `
      @keyframes lpFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      @keyframes lpScaleIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
      @keyframes lpPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      @keyframes lpBounce { 0%,80%,100%{transform:scale(.6);opacity:.4} 40%{transform:scale(1);opacity:1} }
      @keyframes lpSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      .lp-overlay { position:fixed;inset:0;background:rgba(15,23,42,.6);z-index:99999;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px); }
      .lp-overlay.show { display:flex;animation:lpFadeIn .25s ease; }
      .lp-dialog { background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3);display:flex;flex-direction:column;animation:lpScaleIn .3s cubic-bezier(.4,0,.2,1); }

      /* 咨询弹窗 */
      .lp-chat-dialog { width:100%;max-width:440px;height:85vh;max-height:680px; }
      .lp-chat-header { background:linear-gradient(135deg,#4f46e5,#6366f1);padding:16px 18px;display:flex;align-items:center;gap:12px;flex-shrink:0; }
      .lp-chat-header .lp-bot-avatar { width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0; }
      .lp-chat-header .lp-header-info { flex:1;min-width:0; }
      .lp-chat-header .lp-header-title { color:#fff;font-weight:700;font-size:1rem; }
      .lp-chat-header .lp-header-sub { color:rgba(255,255,255,.7);font-size:.72rem;margin-top:2px; }
      .lp-chat-header .lp-header-status { display:flex;align-items:center;gap:4px;color:#86efac;font-size:.7rem;flex-shrink:0; }
      .lp-chat-header .lp-header-status span { width:7px;height:7px;background:#86efac;border-radius:50%;animation:lpPulse 2s infinite; }
      .lp-chat-header .lp-close-btn { background:none;border:none;color:rgba(255,255,255,.6);font-size:20px;cursor:pointer;padding:4px 8px;flex-shrink:0;transition:color .2s; }
      .lp-chat-header .lp-close-btn:hover { color:#fff; }

      .lp-chat-body { flex:1;overflow:hidden;display:flex;flex-direction:column;background:#f8fafc; }
      .lp-messages { flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin;scrollbar-color:#cbd5e1 transparent; }
      .lp-messages::-webkit-scrollbar { width:5px; }
      .lp-messages::-webkit-scrollbar-track { background:transparent; }
      .lp-messages::-webkit-scrollbar-thumb { background:#cbd5e1;border-radius:3px; }

      .lp-welcome { display:flex;gap:10px;align-items:flex-start; }
      .lp-welcome .lp-welcome-avatar { width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#4f46e5,#6366f1);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0; }
      .lp-welcome .lp-welcome-bubble { background:#fff;border:1px solid #e2e8f0;border-radius:4px 14px 14px 14px;padding:12px 14px;font-size:.85rem;color:#334155;line-height:1.6; }
      .lp-welcome .lp-welcome-bubble b { color:#4f46e5; }

      .lp-quick-grid { display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 16px 12px; }
      .lp-quick-item { background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;cursor:pointer;transition:all .2s;text-align:left; }
      .lp-quick-item:hover { border-color:#6366f1;background:#eef2ff;transform:translateY(-1px);box-shadow:0 2px 8px rgba(99,102,241,.1); }
      .lp-quick-item .lp-qi-icon { font-size:1.1rem; }
      .lp-quick-item .lp-qi-title { font-weight:600;font-size:.82rem;color:#1e293b;margin-top:2px; }
      .lp-quick-item .lp-qi-desc { font-size:.7rem;color:#64748b;margin-top:2px; }

      .lp-msg { display:flex;flex-direction:column;animation:lpFadeIn .3s ease; }
      .lp-msg.user { align-items:flex-end; }
      .lp-msg.ai { align-items:flex-start; }
      .lp-msg .lp-bubble { max-width:80%;padding:10px 14px;border-radius:14px;font-size:.85rem;line-height:1.6;word-break:break-word;white-space:pre-wrap; }
      .lp-msg.user .lp-bubble { background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;border-radius:14px 14px 4px 14px; }
      .lp-msg.ai .lp-bubble { background:#fff;border:1px solid #e2e8f0;color:#334155;border-radius:14px 14px 14px 4px; }

      .lp-typing { display:flex;gap:4px;padding:6px 0; }
      .lp-typing span { width:7px;height:7px;background:#94a3b8;border-radius:50%;animation:lpBounce 1.4s infinite both; }
      .lp-typing span:nth-child(2) { animation-delay:.16s; }
      .lp-typing span:nth-child(3) { animation-delay:.32s; }

      .lp-input-bar { display:flex;gap:8px;padding:10px 14px;flex-shrink:0;background:#fff;border-top:1px solid #e2e8f0; }
      .lp-input-bar textarea { flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:10px 14px;color:#334155;font-size:.85rem;resize:none;outline:none;font-family:inherit;max-height:80px;line-height:1.5;transition:border-color .2s; }
      .lp-input-bar textarea:focus { border-color:#6366f1;background:#fff; }
      .lp-input-bar button { flex-shrink:0;width:40px;height:40px;border:none;border-radius:10px;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;font-size:18px;cursor:pointer;transition:opacity .2s;display:flex;align-items:center;justify-content:center; }
      .lp-input-bar button:disabled { opacity:.5;cursor:not-allowed; }

      .lp-lead-status { display:flex;justify-content:center;padding:4px 0;animation:lpFadeIn .3s ease; }
      .lp-lead-status .lp-status-bubble { background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:6px 16px;color:#4f46e5;font-size:.75rem; }

      .lp-inline-form { background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-top:8px;animation:lpFadeIn .3s ease; }
      .lp-inline-form .lp-form-title { color:#4f46e5;font-size:.85rem;font-weight:600;margin-bottom:12px; }
      .lp-inline-form .lp-form-desc { color:#64748b;font-size:.75rem;margin-bottom:14px;line-height:1.5; }
      .lp-inline-form input { width:100%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;color:#334155;font-size:.82rem;outline:none;margin-bottom:8px;box-sizing:border-box;transition:border-color .2s; }
      .lp-inline-form input:focus { border-color:#6366f1; }
      .lp-inline-form button { width:100%;padding:8px;border:none;border-radius:8px;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;font-weight:600;font-size:.82rem;cursor:pointer;transition:opacity .2s; }
      .lp-inline-form button:hover { opacity:.9; }

      /* 测评弹窗 */
      .lp-assess-dialog { width:100%;max-width:480px;max-height:90vh;overflow-y:auto; }
      .lp-assess-header { background:linear-gradient(135deg,#7c3aed,#a855f7);padding:16px 18px;display:flex;align-items:center;gap:12px; }
      .lp-assess-header .lp-assess-icon { width:42px;height:42px;border-radius:12px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0; }
      .lp-assess-header .lp-assess-title { color:#fff;font-weight:700;font-size:1rem; }
      .lp-assess-header .lp-assess-sub { color:rgba(255,255,255,.7);font-size:.72rem;margin-top:2px; }
      .lp-assess-header .lp-close-btn { background:none;border:none;color:rgba(255,255,255,.6);font-size:20px;cursor:pointer;padding:4px 8px;flex-shrink:0;margin-left:auto;transition:color .2s; }
      .lp-assess-header .lp-close-btn:hover { color:#fff; }
      .lp-assess-body { padding:24px 20px;background:#fff; }

      .lp-assess-intro { text-align:center;margin-bottom:24px; }
      .lp-assess-intro .lp-intro-icon { width:64px;height:64px;margin:0 auto 12px;background:linear-gradient(135deg,#f3e8ff,#e9d5ff);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px; }
      .lp-assess-intro .lp-intro-title { font-size:1.2rem;font-weight:700;color:#1e293b;margin-bottom:8px; }
      .lp-assess-intro .lp-intro-desc { font-size:.85rem;color:#64748b;line-height:1.6;max-width:360px;margin:0 auto; }

      .lp-step-list { display:flex;flex-direction:column;gap:12px;margin-bottom:24px; }
      .lp-step-item { display:flex;gap:12px;align-items:flex-start;padding:14px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0; }
      .lp-step-item .lp-step-num { width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:700;font-size:.85rem;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
      .lp-step-item .lp-step-content .lp-step-label { font-size:.7rem;color:#a855f7;font-weight:600;text-transform:uppercase;letter-spacing:.5px; }
      .lp-step-item .lp-step-content .lp-step-title { font-size:.9rem;font-weight:600;color:#1e293b;margin-top:2px; }
      .lp-step-item .lp-step-content .lp-step-q { font-size:.78rem;color:#64748b;margin-top:2px; }

      .lp-assess-btn { width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#4f46e5,#6366f1);color:#fff;font-weight:700;font-size:.95rem;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px; }
      .lp-assess-btn:hover { opacity:.9;transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,.3); }

      /* 测评步骤页 */
      .lp-assess-step { animation:lpSlideUp .4s ease; }
      .lp-assess-step .lp-step-header { display:flex;align-items:center;gap:8px;margin-bottom:16px; }
      .lp-assess-step .lp-step-header .lp-back-btn { background:none;border:none;color:#64748b;font-size:.85rem;cursor:pointer;padding:4px 8px; }
      .lp-assess-step .lp-step-header .lp-step-indicator { font-size:.78rem;color:#a855f7;font-weight:600; }
      .lp-assess-step .lp-step-title { font-size:1.1rem;font-weight:700;color:#1e293b;margin-bottom:8px; }
      .lp-assess-step .lp-step-question { font-size:.85rem;color:#64748b;margin-bottom:16px; }

      .lp-options { display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px; }
      .lp-option-chip { padding:10px 16px;border-radius:20px;border:2px solid #e2e8f0;background:#fff;color:#475569;font-size:.85rem;cursor:pointer;transition:all .2s; }
      .lp-option-chip:hover { border-color:#a855f7;background:#faf5ff; }
      .lp-option-chip.selected { border-color:#7c3aed;background:#f3e8ff;color:#7c3aed;font-weight:600; }

      .lp-text-input { width:100%;padding:12px 16px;border:2px solid #e2e8f0;border-radius:12px;font-size:.9rem;color:#334155;outline:none;transition:border-color .2s;box-sizing:border-box;margin-bottom:16px; }
      .lp-text-input:focus { border-color:#a855f7; }

      .lp-next-btn { width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:700;font-size:.95rem;cursor:pointer;transition:all .2s; }
      .lp-next-btn:hover { opacity:.9; }
      .lp-next-btn:disabled { opacity:.5;cursor:not-allowed; }

      .lp-assess-success { text-align:center;padding:20px 0;animation:lpFadeIn .4s ease; }
      .lp-assess-success .lp-success-icon { font-size:3rem;margin-bottom:12px; }
      .lp-assess-success .lp-success-title { color:#7c3aed;font-size:1.2rem;font-weight:700;margin-bottom:8px; }
      .lp-assess-success .lp-success-desc { color:#64748b;font-size:.85rem;line-height:1.8;max-width:320px;margin:0 auto; }
      .lp-assess-success .lp-success-tip { color:#64748b;font-size:.78rem;margin-top:16px;padding:10px 16px;background:#f3e8ff;border-radius:8px;border:1px solid #e9d5ff; }

      /* 支付弹窗 */
      .lp-pay-dialog { width:100%;max-width:360px; }
      .lp-pay-header { display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid #e2e8f0; }
      .lp-pay-header .lp-pay-title { font-size:1rem;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:6px; }
      .lp-pay-header .lp-close-btn { background:none;border:none;color:#94a3b8;font-size:20px;cursor:pointer;padding:4px 8px;transition:color .2s; }
      .lp-pay-header .lp-close-btn:hover { color:#1e293b; }
      .lp-pay-body { padding:20px;text-align:center; }
      .lp-pay-tip { font-size:.85rem;color:#64748b;margin-bottom:16px; }
      .lp-qr-wrap { background:linear-gradient(135deg,#f0f7ff,#e6f0ff);border-radius:12px;padding:16px;border:1px solid #dbeafe; }
      .lp-qr-recommend { background:#1677ff;color:#fff;font-size:.72rem;padding:4px 12px;border-radius:6px;display:inline-block;margin-bottom:12px; }
      .lp-qr-notice { background:#fef3c7;color:#92400e;font-size:.72rem;padding:4px 12px;border-radius:6px;display:inline-block;margin-bottom:12px; }
      .lp-qr-img { width:200px;height:200px;margin:0 auto 8px;border-radius:8px;border:1px solid #e2e8f0;object-fit:contain;background:#fff; }
      .lp-qr-brand { font-size:.78rem;color:#475569;font-weight:600;margin-top:4px; }
      .lp-qr-alipay-logo { font-size:.75rem;color:#1677ff;margin-top:8px;font-weight:600; }
      .lp-pay-instructions { font-size:.78rem;color:#64748b;margin-top:16px;line-height:1.8; }
      .lp-pay-notice { font-size:.75rem;color:#64748b;margin-top:8px;padding:8px 12px;background:#f8fafc;border-radius:8px; }
      .lp-pay-btn { width:100%;padding:12px;border:none;border-radius:10px;background:#1677ff;color:#fff;font-weight:600;font-size:.9rem;cursor:pointer;margin-top:16px;transition:opacity .2s; }
      .lp-pay-btn:hover { opacity:.9; }

      @media (max-width:500px) {
        .lp-chat-dialog { height:90vh;max-height:none;border-radius:0; }
        .lp-assess-dialog { max-height:95vh;border-radius:0; }
        .lp-pay-dialog { border-radius:0; }
        .lp-overlay { align-items:flex-end; }
        .lp-dialog { border-radius:16px 16px 0 0 !important; }
      }
    `;
    document.head.appendChild(style);
  }

  // ========== 创建模态框 ==========
  function createModal() {
    if (modal) return modal;
    injectStyles();
    var overlay = document.createElement('div');
    overlay.className = 'lp-overlay';
    overlay.addEventListener('click', function(e) { if (e.target === overlay) hideModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && modal && modal.classList.contains('show')) hideModal(); });
    document.body.appendChild(overlay);
    modal = overlay;
    return modal;
  }

  function getPaymentQrUrl() {
    if (CONFIG.paymentQrUrl) return CONFIG.paymentQrUrl;
    // 自动检测路径（首页和子页面）
    var base = window.location.pathname;
    if (base.indexOf('/study/') !== -1 || base.indexOf('/travel/') !== -1 || base.indexOf('/workvisa/') !== -1) {
      return '../assets/images/payment-qr.png';
    }
    return 'assets/images/payment-qr.png';
  }

  function getLogoUrl() {
    if (CONFIG.logoUrl) return CONFIG.logoUrl;
    var base = window.location.pathname;
    if (base.indexOf('/study/') !== -1 || base.indexOf('/travel/') !== -1 || base.indexOf('/workvisa/') !== -1) {
      return '../assets/images/logo.png';
    }
    return 'assets/images/logo.png';
  }

  // ========== 咨询模式 ==========
  function showConsultModal() {
    createModal();
    modal.innerHTML = '';
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-chat-dialog';

    // 头部
    var header = document.createElement('div');
    header.className = 'lp-chat-header';
    header.innerHTML = `
      <div class="lp-bot-avatar">🤖</div>
      <div class="lp-header-info">
        <div class="lp-header-title">${pageConfig.botTitle}</div>
        <div class="lp-header-sub">${pageConfig.botSub}</div>
      </div>
      <div class="lp-header-status"><span></span>在线</div>
      <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
    `;
    dialog.appendChild(header);

    // 主体
    var body = document.createElement('div');
    body.className = 'lp-chat-body';

    messagesContainer = document.createElement('div');
    messagesContainer.className = 'lp-messages';

    // 欢迎语
    var welcome = document.createElement('div');
    welcome.className = 'lp-welcome';
    welcome.innerHTML = `
      <div class="lp-welcome-avatar">🤖</div>
      <div class="lp-welcome-bubble">${pageConfig.welcomeText}</div>
    `;
    messagesContainer.appendChild(welcome);

    // 快捷入口
    var quickGrid = document.createElement('div');
    quickGrid.className = 'lp-quick-grid';
    pageConfig.quickTopics.forEach(function(topic) {
      var item = document.createElement('div');
      item.className = 'lp-quick-item';
      item.innerHTML = `<div class="lp-qi-icon">${topic.icon}</div><div class="lp-qi-title">${topic.title}</div><div class="lp-qi-desc">${topic.desc}</div>`;
      item.onclick = function() {
        quickGrid.style.display = 'none';
        sendMessage('我想了解' + topic.title + '，' + topic.desc);
      };
      quickGrid.appendChild(item);
    });
    messagesContainer.appendChild(quickGrid);

    body.appendChild(messagesContainer);

    // 输入栏
    var inputBar = document.createElement('div');
    inputBar.className = 'lp-input-bar';
    inputElement = document.createElement('textarea');
    inputElement.placeholder = '输入你的留学问题…';
    inputElement.rows = 1;
    inputElement.style.cssText = 'flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:10px 14px;color:#334155;font-size:.85rem;resize:none;outline:none;font-family:inherit;max-height:80px;line-height:1.5;transition:border-color .2s;';
    inputElement.onfocus = function() { inputElement.style.borderColor = '#6366f1'; inputElement.style.background = '#fff'; };
    inputElement.onblur = function() { inputElement.style.borderColor = '#e2e8f0'; inputElement.style.background = '#f8fafc'; };
    inputElement.oninput = function() { inputElement.style.height = 'auto'; inputElement.style.height = Math.min(inputElement.scrollHeight, 80) + 'px'; };
    inputElement.onkeydown = function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

    sendButton = document.createElement('button');
    sendButton.innerHTML = '➤';
    sendButton.onclick = handleSend;

    inputBar.appendChild(inputElement);
    inputBar.appendChild(sendButton);
    body.appendChild(inputBar);
    quickBar = quickGrid;

    dialog.appendChild(body);
    modal.appendChild(dialog);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    messages = [];
    isLeadSubmitted = false;
    currentMode = 'consult';

    setTimeout(function() { inputElement.focus(); }, 100);
  }

  function handleSend() {
    if (isLeadSubmitted) return;
    var text = inputElement.value.trim();
    if (!text || isWaiting) return;
    inputElement.value = '';
    inputElement.style.height = 'auto';
    sendMessage(text);
  }

  function sendMessage(text) {
    if (isWaiting || isLeadSubmitted) return;
    if (quickBar) quickBar.style.display = 'none';
    isWaiting = true;
    updateSendButton();
    appendMessage('user', text);

    if (!CONFIG.apiEndpoint) {
      showFallback(text);
      return;
    }

    var stream = createStreamingBubble();
    var history = messages.slice(0, -1).map(function(m) { return { role: m.role === 'user' ? 'user' : 'assistant', content: m.content }; });

    fetch(CONFIG.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history, mode: currentMode })
    }).then(function(response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var started = false;
      function read() {
        reader.read().then(function(result) {
          if (result.done) { stream.done(); isWaiting = false; updateSendButton(); return; }
          var chunk = decoder.decode(result.value, { stream: true });
          if (!started) { stream.startStreaming(); started = true; }
          stream.append(chunk);
          read();
        }).catch(function() {
          if (!started) { stream.startStreaming(); started = true; }
          stream.append('\n\n（连接中断，请稍后重试）');
          stream.done();
          isWaiting = false;
          updateSendButton();
        });
      }
      read();
    }).catch(function() {
      if (stream.bubble.parentElement && messagesContainer.contains(stream.bubble.parentElement)) {
        messagesContainer.removeChild(stream.bubble.parentElement);
      }
      showFallback(text);
    });
  }

  function showFallback(userText) {
    var stream = createStreamingBubble();
    setTimeout(function() {
      stream.startStreaming();
      var text = '感谢您的咨询！我是星途LumiPath的AI顾问小西。\n\n关于"' + userText + '"，我可以为您提供以下信息：\n\n• 我们提供新加坡PSB/SIM跳板、六国名校直申、奖学金申请等留学服务\n• 同时覆盖出国工作、跨境旅游、AI转岗就业等业务\n• 基础咨询免服务费，靠院校返佣盈利\n\n请问您怎么称呼？方便留个手机号或微信号吗？我们的专业顾问会尽快联系您，提供一对一深度咨询。';
      var i = 0;
      var timer = setInterval(function() {
        if (i < text.length) { stream.append(text[i]); i++; }
        else {
          clearInterval(timer);
          stream.done();
          showInlineForm();
          isWaiting = false;
          updateSendButton();
        }
      }, 25);
    }, 500);
  }

  function appendMessage(role, content) {
    var wrap = document.createElement('div');
    wrap.className = 'lp-msg ' + role;
    var bubble = document.createElement('div');
    bubble.className = 'lp-bubble';
    bubble.textContent = content;
    wrap.appendChild(bubble);
    messagesContainer.appendChild(wrap);
    scrollToBottom();
    messages.push({ role: role, content: content });
    return bubble;
  }

  function createStreamingBubble() {
    var wrap = document.createElement('div');
    wrap.className = 'lp-msg ai';
    var bubble = document.createElement('div');
    bubble.className = 'lp-bubble';
    var typing = document.createElement('div');
    typing.className = 'lp-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    bubble.appendChild(typing);
    wrap.appendChild(bubble);
    messagesContainer.appendChild(wrap);
    scrollToBottom();
    var fullText = '';
    return {
      bubble: bubble,
      startStreaming: function() { if (bubble.contains(typing)) bubble.removeChild(typing); bubble.textContent = ''; fullText = ''; },
      append: function(text) { fullText += text; bubble.textContent = fullText.replace(CONFIG.leadMarker, ''); scrollToBottom(); },
      done: function() {
        if (bubble.contains(typing)) bubble.removeChild(typing);
        var finalText = fullText.replace(CONFIG.leadMarker, '');
        messages.push({ role: 'ai', content: finalText });
        if (fullText.indexOf(CONFIG.leadMarker) !== -1 && !isLeadSubmitted) { submitLead(); }
      }
    };
  }

  function submitLead() {
    isLeadSubmitted = true;
    inputElement.disabled = true;
    sendButton.disabled = true;
    sendButton.style.opacity = '0.5';

    var statusWrap = document.createElement('div');
    statusWrap.className = 'lp-lead-status';
    var statusBubble = document.createElement('div');
    statusBubble.className = 'lp-status-bubble';
    statusBubble.textContent = '正在提交您的信息...';
    statusWrap.appendChild(statusBubble);
    messagesContainer.appendChild(statusWrap);
    scrollToBottom();

    var history = messages.map(function(m) { return { role: m.role === 'user' ? 'user' : 'assistant', content: m.content }; });
    var apiUrl = CONFIG.apiEndpoint ? CONFIG.apiEndpoint.replace(/\/$/, '') + '/lead' : '';

    if (!apiUrl) {
      saveLeadLocal({ source: '网站咨询', conversation: history });
      setTimeout(function() {
        statusBubble.textContent = '✓ 信息已记录，顾问将在24小时内联系您';
        statusBubble.style.color = '#16a34a';
        statusBubble.style.background = '#f0fdf4';
        statusBubble.style.borderColor = '#bbf7d0';
        showInlineForm();
      }, 800);
      return;
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: history, source: '网站咨询' })
    }).then(function(r) { return r.json(); }).then(function() {
      statusBubble.textContent = '✓ 信息已提交，顾问将在24小时内联系您';
      statusBubble.style.color = '#16a34a';
      statusBubble.style.background = '#f0fdf4';
      statusBubble.style.borderColor = '#bbf7d0';
      showInlineForm();
    }).catch(function() {
      saveLeadLocal({ source: '网站咨询', conversation: history });
      statusBubble.textContent = '✓ 信息已记录，顾问将在24小时内联系您';
      statusBubble.style.color = '#16a34a';
      showInlineForm();
    });
  }

  function showInlineForm() {
    var formCard = document.createElement('div');
    formCard.className = 'lp-inline-form';
    formCard.innerHTML = `
      <div class="lp-form-title">📋 留下您的联系方式</div>
      <div class="lp-form-desc">如果您还没留下联系方式，请填写下方表单，顾问会尽快联系您。</div>
    `;
    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '您的姓名';
    formCard.appendChild(nameInput);

    var phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.placeholder = '手机号或微信号';
    formCard.appendChild(phoneInput);

    var submitBtn = document.createElement('button');
    submitBtn.textContent = '提交联系方式';
    submitBtn.onclick = function() {
      if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        submitBtn.textContent = '请填写姓名和联系方式';
        setTimeout(function() { submitBtn.textContent = '提交联系方式'; }, 1500);
        return;
      }
      var data = { source: '网站咨询-补充表单', name: nameInput.value.trim(), phone: phoneInput.value.trim() };
      var apiUrl = CONFIG.apiEndpoint ? CONFIG.apiEndpoint.replace(/\/$/, '') + '/form-submit' : '';
      if (apiUrl) {
        fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          .then(function() { showInlineSuccess(formCard); })
          .catch(function() { saveLeadLocal(data); showInlineSuccess(formCard); });
      } else {
        saveLeadLocal(data);
        showInlineSuccess(formCard);
      }
    };
    formCard.appendChild(submitBtn);
    messagesContainer.appendChild(formCard);
    scrollToBottom();
  }

  function showInlineSuccess(container) {
    container.innerHTML = '<div style="text-align:center;padding:8px"><div style="font-size:1.5rem;margin-bottom:8px">✅</div><div style="color:#16a34a;font-size:.85rem;font-weight:600">联系方式已提交！</div><div style="color:#64748b;font-size:.75rem;margin-top:4px">顾问将在24小时内联系您</div></div>';
  }

  function scrollToBottom() {
    requestAnimationFrame(function() { messagesContainer.scrollTop = messagesContainer.scrollHeight; });
  }

  function updateSendButton() {
    if (isLeadSubmitted) {
      sendButton.style.opacity = '0.5';
      sendButton.style.pointerEvents = 'none';
      return;
    }
    sendButton.style.opacity = isWaiting ? '0.5' : '1';
    sendButton.style.pointerEvents = isWaiting ? 'none' : 'auto';
    inputElement.disabled = false;
  }

  // ========== 测评模式 ==========
  function showAssessModal() {
    createModal();
    modal.innerHTML = '';
    assessStep = 0;
    assessData = {};
    renderAssessIntro();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function renderAssessIntro() {
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🧠</div>
        <div>
          <div class="lp-assess-title">${pageConfig.assessTitle}</div>
          <div class="lp-assess-sub">${pageConfig.assessSub}</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-body">
        <div class="lp-assess-intro">
          <div class="lp-intro-icon">🧠</div>
          <div class="lp-intro-title">${pageConfig.assessIntroTitle}</div>
          <div class="lp-intro-desc">${pageConfig.assessIntroDesc}</div>
        </div>
        <div class="lp-step-list">
          <div class="lp-step-item">
            <div class="lp-step-num">1</div>
            <div class="lp-step-content">
              <div class="lp-step-label">${pageConfig.assessSteps[0].label}</div>
              <div class="lp-step-title">${pageConfig.assessSteps[0].title}</div>
              <div class="lp-step-q">${pageConfig.assessSteps[0].q}</div>
            </div>
          </div>
          <div class="lp-step-item">
            <div class="lp-step-num">2</div>
            <div class="lp-step-content">
              <div class="lp-step-label">${pageConfig.assessSteps[1].label}</div>
              <div class="lp-step-title">${pageConfig.assessSteps[1].title}</div>
              <div class="lp-step-q">${pageConfig.assessSteps[1].q}</div>
            </div>
          </div>
          <div class="lp-step-item">
            <div class="lp-step-num">3</div>
            <div class="lp-step-content">
              <div class="lp-step-label">${pageConfig.assessSteps[2].label}</div>
              <div class="lp-step-title">${pageConfig.assessSteps[2].title}</div>
              <div class="lp-step-q">${pageConfig.assessSteps[2].q}</div>
            </div>
          </div>
        </div>
        <button class="lp-assess-btn" id="lp-start-assess">开始测评 →</button>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);
    document.getElementById('lp-start-assess').onclick = function() { assessStep = 1; renderAssessStep1(); };
  }

  function renderAssessStep1() {
    var stepCfg = pageConfig.assessSteps[0];
    var options = [];
    if (pageType === 'travel') {
      options = ['出境游（国人出国）', '入境游（外国人来华）', '两者都有兴趣'];
    } else if (pageType === 'work') {
      options = ['25岁以下', '25-35岁', '35-43岁', '43岁以上', '1-5年工作经验', '5-10年工作经验', '10年以上工作经验'];
    } else {
      options = ['商科/金融', '计算机/IT', '工程/制造', '艺术/设计', '传媒/新闻', '教育/心理', '医学/护理', '法律', '科学/研究', '管理/创业'];
    }
    var isMulti = pageType !== 'work'; // 工作签步骤1单选年龄区间+工作经验可多选
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🧠</div>
        <div>
          <div class="lp-assess-title">${pageConfig.assessTitle}</div>
          <div class="lp-assess-sub">Step 1 / 3 · ${stepCfg.title}</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-body lp-assess-step">
        <div class="lp-step-header">
          <button class="lp-back-btn" onclick="window.LumiPathChat._backIntro()">← 返回</button>
          <span class="lp-step-indicator">Step 1 / 3</span>
        </div>
        <div class="lp-step-title">${stepCfg.title}</div>
        <div class="lp-step-question">${stepCfg.q}（${isMulti ? '可多选' : '请选择'}）</div>
        <div class="lp-options" id="lp-step1-options"></div>
        <button class="lp-next-btn" id="lp-next-1" disabled>下一步 →</button>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);
    var optsContainer = document.getElementById('lp-step1-options');
    var selected = [];
    options.forEach(function(opt) {
      var chip = document.createElement('div');
      chip.className = 'lp-option-chip';
      chip.textContent = opt;
      chip.onclick = function() {
        if (isMulti) {
          var idx = selected.indexOf(opt);
          if (idx > -1) { selected.splice(idx, 1); chip.classList.remove('selected'); }
          else { selected.push(opt); chip.classList.add('selected'); }
        } else {
          optsContainer.querySelectorAll('.lp-option-chip').forEach(function(c) { c.classList.remove('selected'); });
          chip.classList.add('selected');
          selected = [opt];
        }
        document.getElementById('lp-next-1').disabled = selected.length === 0;
      };
      optsContainer.appendChild(chip);
    });
    document.getElementById('lp-next-1').onclick = function() {
      assessData.step1 = selected;
      assessStep = 2;
      renderAssessStep2();
    };
  }

  function renderAssessStep2() {
    var stepCfg = pageConfig.assessSteps[1];
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';

    // 根据页面类型生成不同的问题和选项
    var extraFields = '';
    var options = [];
    if (pageType === 'travel') {
      options = ['3天内', '3-7天', '7-15天', '15天以上', '未定'];
      extraFields = `<div style="margin-bottom:12px"><div style="font-size:.82rem;color:#475569;margin-bottom:6px">出行人数</div><input type="text" class="lp-text-input" id="lp-extra-input" placeholder="如 2人、家庭4人等"></div>`;
    } else if (pageType === 'work') {
      options = ['制造业', '建筑业', '服务业', 'IT/技术', '医疗/护理', '农业', '司机/物流', '其他'];
      extraFields = `<div style="margin-bottom:12px"><div style="font-size:.82rem;color:#475569;margin-bottom:6px">社保缴纳年限</div><input type="text" class="lp-text-input" id="lp-extra-input" placeholder="如 8年、10年等"></div>`;
    } else {
      options = ['初中', '高中在读', '高中毕业', '大学在读', '大学毕业', '已工作'];
      extraFields = `<div style="margin-bottom:12px"><div style="font-size:.82rem;color:#475569;margin-bottom:6px">高中成绩（均分）</div><input type="text" class="lp-text-input" id="lp-extra-input" placeholder="如 75、80、未参加高考等"></div>`;
    }

    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🧠</div>
        <div>
          <div class="lp-assess-title">${pageConfig.assessTitle}</div>
          <div class="lp-assess-sub">Step 2 / 3 · ${stepCfg.title}</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-body lp-assess-step">
        <div class="lp-step-header">
          <button class="lp-back-btn" onclick="window.LumiPathChat._backStep1()">← 返回</button>
          <span class="lp-step-indicator">Step 2 / 3</span>
        </div>
        <div class="lp-step-title">${stepCfg.title}</div>
        <div class="lp-step-question">${stepCfg.q}（请选择）</div>
        <div class="lp-options" id="lp-step2-options"></div>
        ${extraFields}
        <button class="lp-next-btn" id="lp-next-2" disabled>下一步 →</button>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);
    var optsContainer = document.getElementById('lp-step2-options');
    var selectedEdu = null;
    options.forEach(function(opt) {
      var chip = document.createElement('div');
      chip.className = 'lp-option-chip';
      chip.textContent = opt;
      chip.onclick = function() {
        optsContainer.querySelectorAll('.lp-option-chip').forEach(function(c) { c.classList.remove('selected'); });
        chip.classList.add('selected');
        selectedEdu = opt;
        checkStep2Ready();
      };
      optsContainer.appendChild(chip);
    });
    var extraInput = document.getElementById('lp-extra-input');
    if (extraInput) extraInput.oninput = checkStep2Ready;
    function checkStep2Ready() {
      document.getElementById('lp-next-2').disabled = !selectedEdu;
    }
    document.getElementById('lp-next-2').onclick = function() {
      assessData.step2 = selectedEdu;
      assessData.step2Extra = extraInput ? extraInput.value.trim() : '';
      assessStep = 3;
      renderAssessStep3();
    };
  }

  function renderAssessStep3() {
    var stepCfg = pageConfig.assessSteps[2];
    var countries = [];
    if (pageType === 'travel') {
      countries = ['🇯🇵 日本', '🇰🇷 韩国', '🇹🇭 泰国', '🇻🇳 越南', '🇸🇬 新加坡', '🇲🇾 马来西亚', '🇬🇧 英国', '🇦🇺 澳大利亚', '🇨🇳 中国国内', '暂未确定'];
    } else if (pageType === 'work') {
      countries = ['🇦🇺 澳大利亚', '🇬🇧 英国', '🇪🇺 欧洲', '🇲🇾 马来西亚', '🇳🇿 新西兰', '🇨🇦 加拿大', '暂未确定'];
    } else {
      countries = ['🇸🇬 新加坡', '🇬🇧 英国', '🇦🇺 澳大利亚', '🇲🇾 马来西亚', '🇺🇸 美国', '🇷🇺 俄罗斯', '🇨🇦 加拿大', '🇭🇰 中国香港', '暂未确定'];
    }
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🧠</div>
        <div>
          <div class="lp-assess-title">${pageConfig.assessTitle}</div>
          <div class="lp-assess-sub">Step 3 / 3 · ${stepCfg.title}</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-body lp-assess-step">
        <div class="lp-step-header">
          <button class="lp-back-btn" onclick="window.LumiPathChat._backStep2()">← 返回</button>
          <span class="lp-step-indicator">Step 3 / 3</span>
        </div>
        <div class="lp-step-title">${stepCfg.title}</div>
        <div class="lp-step-question">${stepCfg.q}（可多选）</div>
        <div class="lp-options" id="lp-country-options"></div>
        <div style="margin-bottom:12px">
          <div style="font-size:.82rem;color:#475569;margin-bottom:6px">您的称呼</div>
          <input type="text" class="lp-text-input" id="lp-name-input" placeholder="如：王同学">
        </div>
        <div style="margin-bottom:12px">
          <div style="font-size:.82rem;color:#475569;margin-bottom:6px">联系方式（手机号或微信）</div>
          <input type="text" class="lp-text-input" id="lp-phone-input" placeholder="方便顾问联系您">
        </div>
        <button class="lp-next-btn" id="lp-submit-assess" disabled>提交测评 →</button>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);
    var optsContainer = document.getElementById('lp-country-options');
    var selectedCountries = [];
    countries.forEach(function(opt) {
      var chip = document.createElement('div');
      chip.className = 'lp-option-chip';
      chip.textContent = opt;
      chip.onclick = function() {
        var idx = selectedCountries.indexOf(opt);
        if (idx > -1) { selectedCountries.splice(idx, 1); chip.classList.remove('selected'); }
        else { selectedCountries.push(opt); chip.classList.add('selected'); }
        checkStep3Ready();
      };
      optsContainer.appendChild(chip);
    });
    var nameInput = document.getElementById('lp-name-input');
    var phoneInput = document.getElementById('lp-phone-input');
    nameInput.oninput = checkStep3Ready;
    phoneInput.oninput = checkStep3Ready;
    function checkStep3Ready() {
      document.getElementById('lp-submit-assess').disabled = selectedCountries.length === 0 || !nameInput.value.trim() || !phoneInput.value.trim();
    }
    document.getElementById('lp-submit-assess').onclick = function() {
      assessData.countries = selectedCountries;
      assessData.name = nameInput.value.trim();
      assessData.phone = phoneInput.value.trim();
      submitAssess();
    };
  }

  function submitAssess() {
    var data = {
      source: pageType === 'travel' ? '跨境旅游测评' : pageType === 'work' ? '出国工作测评' : '免费测评',
      name: assessData.name,
      phone: assessData.phone,
      step1: (assessData.step1 || []).join(','),
      step2: assessData.step2 || '',
      step2Extra: assessData.step2Extra || '',
      countries: (assessData.countries || []).join(','),
      pageType: pageType
    };

    // 提交到Worker或本地存储
    var apiUrl = CONFIG.apiEndpoint ? CONFIG.apiEndpoint.replace(/\/$/, '') + '/form-submit' : '';
    if (apiUrl) {
      fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function() { renderAssessSuccess(); })
        .catch(function() { saveLeadLocal(data); renderAssessSuccess(); });
    } else {
      saveLeadLocal(data);
      renderAssessSuccess();
    }
  }

  function renderAssessSuccess() {
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🧠</div>
        <div>
          <div class="lp-assess-title">${pageConfig.assessTitle}</div>
          <div class="lp-assess-sub">测评完成</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-body">
        <div class="lp-assess-success">
          <div class="lp-success-icon">🎉</div>
          <div class="lp-success-title">测评信息提交成功！</div>
          <div class="lp-success-desc">感谢${assessData.name || '您'}的参与！我们的专业顾问将根据您提交的信息，在24小时内为您生成个性化的专业方向推荐与留学路径建议，并通过电话或微信联系您。</div>
          <div class="lp-success-tip">期待与您沟通，开启您的星途之旅 🌟</div>
        </div>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);
  }

  // ========== 支付弹窗 ==========
  function showPayModal() {
    createModal();
    modal.innerHTML = '';
    var qrUrl = getPaymentQrUrl();
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-pay-dialog';
    dialog.innerHTML = `
      <div class="lp-pay-header">
        <div class="lp-pay-title">💙 支付宝扫码支付</div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-pay-body">
        <div class="lp-pay-tip">请使用支付宝扫描下方二维码</div>
        <div class="lp-qr-wrap">
          <div class="lp-qr-recommend">推荐使用支付宝</div>
          <div class="lp-qr-notice">支持花呗 | 信用卡 | 分期付款</div>
          <img class="lp-qr-img" src="${qrUrl}" alt="支付宝收款码" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div style="display:none;align-items:center;justify-content:center;width:200px;height:200px;margin:0 auto;background:#f1f5f9;border-radius:8px;color:#94a3b8;font-size:.8rem">收款码加载中</div>
          <div class="lp-qr-brand">星途LumiPath</div>
          <div class="lp-qr-alipay-logo">支付宝</div>
        </div>
        <div class="lp-pay-instructions">打开支付宝 → 扫一扫 → 对准上方二维码</div>
        <div class="lp-pay-notice">支持花呗、信用卡、分期付款<br>支付完成后，顾问将在24小时内与您联系</div>
        <button class="lp-pay-btn" onclick="window.open('alipays://platformapi/startapp?saId=10000007','_blank')">打开支付宝付款</button>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  // ========== 隐藏 ==========
  function hideModal() {
    if (modal) {
      modal.classList.remove('show');
      modal.innerHTML = '';
      document.body.style.overflow = '';
    }
  }

  function saveLeadLocal(data) {
    try {
      var leads = JSON.parse(localStorage.getItem('lumipath_leads') || '[]');
      leads.push({ data: data, timestamp: new Date().toISOString() });
      localStorage.setItem('lumipath_leads', JSON.stringify(leads));
    } catch(e) {}
  }

  // ========== 暴露 API ==========
  window.LumiPathChat = {
    show: function(mode) {
      if (mode === 'assess') showAssessModal();
      else if (mode === 'pay') showPayModal();
      else showConsultModal();
    },
    hide: hideModal,
    config: CONFIG,
    _backIntro: renderAssessIntro,
    _backStep1: renderAssessStep1,
    _backStep2: renderAssessStep2
  };

  // ========== 自动绑定按钮 ==========
  function init() {
    // 移除旧的 payment-modal 阻止其显示
    var oldPayModal = document.getElementById('payment-modal');
    if (oldPayModal) {
      // 拦截旧支付弹窗的关闭按钮
      var oldClose = oldPayModal.querySelector('.modal-close');
      if (oldClose) {
        oldClose.onclick = function() { oldPayModal.classList.remove('show'); };
      }
    }

    document.querySelectorAll('[data-action]').forEach(function(btn) {
      // 清除旧绑定
      btn.onclick = null;
      var action = btn.getAttribute('data-action');
      if (action === 'consult' || action === 'assess' || action === 'pay') {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (action === 'pay') {
            showPayModal();
          } else if (action === 'assess') {
            showAssessModal();
          } else {
            showConsultModal();
          }
        });
      }
    });

    // 拦截旧 payment-modal 的 show 方法
    if (oldPayModal) {
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(m) {
          if (m.attributeName === 'class' && oldPayModal.classList.contains('show')) {
            oldPayModal.classList.remove('show');
            showPayModal();
          }
        });
      });
      observer.observe(oldPayModal, { attributes: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
