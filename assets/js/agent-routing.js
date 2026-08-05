/**
 * 星途 LumiPath · Agent 路由配置
 *
 * 全站唯一的「哪个页面 / 哪个按钮 → 哪个 Agent」映射表。
 * 改 Agent 绑定只改这个文件，不要回到 chat-widget.js 里找。
 *
 * 必须在 chat-widget.js 之前引入。
 *
 * 对应 PRD: D:\OpenHex\PRD-Agent-Consultation-Routing.md v2.0 §6.2 / §6.3
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------
  // API 接入点
  //
  // ⚠️ 安全现状（PRD §7.2 方案 A）：key 明文放在前端，任何访客查看源码即可拿到。
  // 这是静态站的既有状态，本次改造没有引入新问题，但把暴露面从 1 个 Agent 扩大到 6 个。
  //
  // 将来上代理（Cloudflare Worker 等）时，**只改这里**：
  //   base 换成自己的代理地址，key 置空，由代理在服务端补 Authorization。
  // 业务代码一律通过 LumiPathAgentRouting.API 取值，不再各处硬编码。
  // ---------------------------------------------------------------
  var API = {
    base: 'https://api.openhex.tech',
    key: 'mysta_b518bcb31b1f4b6e6c799ce6bfc75ed2fcfd90d1feb4591115e0415049332b17'
  };

  // ---------------------------------------------------------------
  // 6 个 Agent 的真实 ID
  // 「低龄升学」不是独立 Agent，复用 study_abroad，因此这里只有 6 条。
  // ---------------------------------------------------------------
  var AGENT_IDS = {
    comprehensive: '44e53b50-35a5-4033-8b29-6ef993d27e3c',
    study_abroad: '81cbc20b-d760-4905-8752-5c99d53385d2',
    global_travel: '9c4898de-cca6-4d5c-87b3-e6618131005b',
    overseas_work: 'b11d2ca3-d878-482b-9ab9-a18304d3c3e0',
    ai_career: '2f49fcb3-55a9-45bc-b592-7405b2e30155',
    talent_assessment: '2368c054-c0ea-463b-b4e1-f3c00b4b98bd'
  };

  // ---------------------------------------------------------------
  // 各 Agent 的身份文案（对话框头部 + 欢迎语）
  //
  // 顾问人名统一为「小西」（客户 2026-08-05 确认），替换掉现网散着的
  // 小途 / 小达 / 小星三个名字。botTitle 用 PRD §5.3 的身份标识，
  // 因为验收标准逐条检查这些字样。
  // ---------------------------------------------------------------
  var AGENT_META = {
    comprehensive: {
      botName: '小西',
      botTitle: '全球发展规划顾问',
      botSub: 'AI智能顾问 · 留学 · 旅游 · 出国工作 · AI就业',
      welcomeText: '你好！我是<b>小西</b>👋<br>星途LumiPath AI全球发展规划顾问，请选择您感兴趣的方向或直接提问'
    },
    study_abroad: {
      botName: '小西',
      botTitle: '留学规划顾问',
      botSub: '留学规划 · 三大项目 · 选校推荐 · 实时答疑',
      welcomeText: '你好！我是<b>小西</b>👋<br>星途LumiPath AI留学规划顾问，有什么可以帮你的？'
    },
    global_travel: {
      botName: '小西',
      botTitle: '跨境旅游顾问',
      botSub: 'AI智能顾问 · 跨境旅游 · 定制行程 · 品质出行',
      welcomeText: '你好！我是<b>小西</b>👋<br>星途LumiPath AI跨境旅游顾问，有什么可以帮你的？'
    },
    overseas_work: {
      botName: '小西',
      botTitle: '海外工作顾问',
      botSub: 'AI智能顾问 · 技术移民 · 海外工作 · 落地安家',
      welcomeText: '你好！我是<b>小西</b>👋<br>星途LumiPath AI海外工作顾问，有什么可以帮你的？'
    },
    ai_career: {
      botName: '小西',
      botTitle: 'AI就业顾问',
      botSub: 'AI智能顾问 · 转岗就业 · 技能提升 · 内推机会',
      welcomeText: '你好！我是<b>小西</b>👋<br>星途LumiPath AI就业顾问，有什么可以帮你的？'
    },
    talent_assessment: {
      botName: '小西',
      botTitle: '兴趣天赋测评顾问',
      botSub: 'AI智能测评 · 兴趣分析 · 专业匹配 · 方向推荐',
      welcomeText: '你好！我是<b>小西</b>👋<br>星途LumiPath AI兴趣天赋测评顾问，点击开始测评或直接提问'
    }
  };

  // ---------------------------------------------------------------
  // 页面 → Agent
  //
  // key 是路径片段，按实际目录写（不是 PRD v1.2 那套 /study-abroad）。
  // 首页 mode='router'：综合 Agent 承接自由输入，另给 6 个快捷入口切换。
  // 子页 mode='fixed'：整页只有一个 Agent，页面内按钮可用 data-agent 单点覆盖。
  // ---------------------------------------------------------------
  var ROUTES = [
    {
      match: '/travel/',
      config: { mode: 'fixed', chatbotAgent: 'global_travel' }
    },
    {
      match: '/workvisa/',
      config: { mode: 'fixed', chatbotAgent: 'overseas_work' }
    },
    {
      match: '/consult/',
      config: { mode: 'fixed', chatbotAgent: 'ai_career' }
    },
    {
      match: '/study/',
      config: { mode: 'fixed', chatbotAgent: 'study_abroad' }
    },
    {
      // /assess/ 在 Cloudflare 上被 _redirects 301 到首页，但 GitHub 仓库里
      // 这个页面还在，且加载的是同一个 chat-widget.js。留着这条路由，
      // 它在哪个 host 上被访问到都能正确挂上测评 Agent，而不是退化成留学页。
      match: '/assess/',
      config: { mode: 'fixed', chatbotAgent: 'talent_assessment' }
    }
  ];

  var HOME_CONFIG = {
    mode: 'router',
    defaultAgent: 'comprehensive',
    quickEntries: [
      { icon: '🎓', label: '留学', agent: 'study_abroad' },
      { icon: '✈️', label: '跨境旅游', agent: 'global_travel' },
      { icon: '💼', label: '出国工作', agent: 'overseas_work' },
      { icon: '🤖', label: 'AI就业', agent: 'ai_career' },
      { icon: '✨', label: '兴趣天赋测评', agent: 'talent_assessment' },
      // 低龄升学没有独立 Agent，走留学 Agent，因此与「留学」共用同一个会话。
      { icon: '🧒', label: '低龄升学', agent: 'study_abroad' }
    ]
  };

  /**
   * 解析当前路径对应的页面配置。
   * 匹配不到任何子页 → 按首页处理（含 `/`、`/index.html`、根部署路径）。
   */
  function resolve(pathname) {
    var p = pathname || '/';
    for (var i = 0; i < ROUTES.length; i++) {
      if (p.indexOf(ROUTES[i].match) !== -1) return ROUTES[i].config;
    }
    return HOME_CONFIG;
  }

  /** 页面/按钮默认绑定的 Agent key。 */
  function defaultAgentKeyOf(pathname) {
    var cfg = resolve(pathname);
    return cfg.mode === 'router' ? cfg.defaultAgent : cfg.chatbotAgent;
  }

  /** Agent key → UUID。未知 key 返回 null，调用方据此回退到页面默认 Agent。 */
  function agentIdOf(key) {
    return Object.prototype.hasOwnProperty.call(AGENT_IDS, key) ? AGENT_IDS[key] : null;
  }

  function metaOf(key) {
    return AGENT_META[key] || AGENT_META.comprehensive;
  }

  /**
   * 会话存储 key —— 按 Agent 分区。
   *
   * 这一个函数就实现了 PRD §6.4 的三条会话规则：
   *   切 Agent → key 不同 → 读不到对方的 conversationId → 自然开新会话
   *   同 Agent → key 相同 → 恢复上下文
   *   同 Agent 不同入口（首页「留学」/「低龄升学」/ study 页）→ agentId 相同 → 同一会话
   */
  function convKeyOf(agentKey) {
    return 'yingxi_conv_' + (agentIdOf(agentKey) || 'unknown');
  }

  window.LumiPathAgentRouting = {
    API: API,
    AGENT_IDS: AGENT_IDS,
    AGENT_META: AGENT_META,
    resolve: resolve,
    defaultAgentKeyOf: defaultAgentKeyOf,
    agentIdOf: agentIdOf,
    metaOf: metaOf,
    convKeyOf: convKeyOf
  };
})();
