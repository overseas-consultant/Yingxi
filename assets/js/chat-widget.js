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
    pageConfig: pageConfig,
    openhexAgentUrl: 'https://agent.openhex.tech/share/e835e195bdd0a0c1bd3b3943e609b72c'
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

  // ========== 留学深度测评数据模型 ==========
  // 专业方向库
  var STUDY_MAJORS = {
    business:    { name: '商科/金融',    icon: '📊', color: '#3b82f6', desc: '商业管理、金融、会计、市场营销、国际贸易', paths: ['新加坡跳板(PSB/SIM)', '名校直申(英国/澳洲)', '奖学金机会'] },
    cs:          { name: '计算机/IT',    icon: '💻', color: '#6366f1', desc: '软件工程、人工智能、数据科学、网络安全', paths: ['名校直申(英国/澳洲)', '新加坡跳板', '技能院校就业'] },
    engineering: { name: '工程',        icon: '⚙️', color: '#f59e0b', desc: '机械工程、电子工程、土木工程、化学工程', paths: ['名校直申(澳洲/英国)', '新加坡跳板', '技能院校(TAFE)'] },
    design:      { name: '设计/艺术',    icon: '🎨', color: '#ec4899', desc: '平面设计、工业设计、建筑设计、数字媒体艺术', paths: ['名校直申(英国)', '新加坡跳板(考文垂)', '个性化规划'] },
    education:   { name: '教育',        icon: '📚', color: '#10b981', desc: '教育学、心理学、TESOL、学前教育', paths: ['名校直申(英国/澳洲)', '新加坡跳板', '奖学金机会'] },
    media:       { name: '传媒',        icon: '📺', color: '#8b5cf6', desc: '新闻传播、广告学、影视制作、数字营销', paths: ['名校直申(英国)', '新加坡跳板(考文垂)', '个性化规划'] },
    health:      { name: '健康/医学',    icon: '🏥', color: '#ef4444', desc: '护理学、公共卫生、生命科学、药剂学', paths: ['名校直申(澳洲/英国)', '新加坡跳板(La Trobe)', '技能院校'] },
    tourism:     { name: '旅游/酒店管理', icon: '✈️', color: '#06b6d4', desc: '酒店管理、旅游管理、会展策划、餐饮管理', paths: ['技能院校(SHATEC)', '新加坡跳板', '名校直申(澳洲)'] },
    law:         { name: '法律',        icon: '⚖️', color: '#1e40af', desc: '法学、国际法、商业法、知识产权法', paths: ['名校直申(英国)', '奖学金机会', '个性化规划'] },
    social:      { name: '社会科学',     icon: '🌐', color: '#0ea5e9', desc: '社会学、国际关系、政治学、人类学', paths: ['名校直申(英国/澳洲)', '新加坡跳板', '奖学金机会'] },
    science:     { name: '自然科学',     icon: '🔬', color: '#14b8a6', desc: '物理学、化学、生物学、数学、环境科学', paths: ['名校直申(英国/澳洲)', '奖学金机会', '继续深造'] },
    humanities:  { name: '人文学科',     icon: '📖', color: '#a855f7', desc: '文学、历史学、哲学、语言学、文化研究', paths: ['名校直申(英国)', '奖学金机会', '个性化规划'] }
  };

  // 测评问题（5步，每步1-2题）
  var STUDY_QUESTIONS = [
    {
      step: 1, label: '兴趣探索', icon: '✨',
      questions: [
        {
          title: '闲暇时你最喜欢做什么？',
          desc: '选择最让你有热情的活动，没有对错之分',
          multi: true,
          options: [
            { icon: '📖', text: '阅读或写作', tags: { humanities: 3, media: 2 } },
            { icon: '💻', text: '编程或折腾电子产品', tags: { cs: 3, engineering: 1 } },
            { icon: '🎨', text: '画画、设计或做手工', tags: { design: 3 } },
            { icon: '👥', text: '组织活动或和朋友聚会', tags: { business: 2, social: 2, media: 1 } },
            { icon: '🔬', text: '研究自然现象或做实验', tags: { science: 3, health: 2 } },
            { icon: '🤝', text: '帮助他人解决困难', tags: { education: 2, health: 2, social: 2 } },
            { icon: '📈', text: '关注商业新闻或尝试小生意', tags: { business: 3, law: 1 } },
            { icon: '🌍', text: '旅行或探索不同文化', tags: { tourism: 3, social: 1 } }
          ]
        },
        {
          title: '什么活动能让你全神贯注、忘记时间？',
          desc: '这种"心流"体验往往指向你的天赋所在',
          multi: false,
          options: [
            { icon: '🧩', text: '逻辑推理和数据分析', tags: { cs: 2, science: 2, business: 1 } },
            { icon: '🎭', text: '创意表达和审美创作', tags: { design: 3, media: 2 } },
            { icon: '💬', text: '与人深度交流和倾听', tags: { education: 2, social: 2, health: 1 } },
            { icon: '🔧', text: '动手制作或修理东西', tags: { engineering: 3, design: 1 } },
            { icon: '📋', text: '规划和组织团队任务', tags: { business: 3, law: 1 } },
            { icon: '🏛️', text: '探索历史、哲学或文化', tags: { humanities: 3, social: 1 } },
            { icon: '❤️', text: '照顾他人或关注健康议题', tags: { health: 3, education: 1 } },
            { icon: '🗣️', text: '辩论或分析社会议题', tags: { law: 3, social: 2, media: 1 } }
          ]
        }
      ]
    },
    {
      step: 2, label: '学科偏好', icon: '📖',
      questions: [
        {
          title: '在学校里，你最擅长或最喜欢的学科是？',
          desc: '可以多选，选择你成绩不错或学得很开心的科目',
          multi: true,
          options: [
            { icon: '🔢', text: '数学', tags: { cs: 3, science: 2, business: 2, engineering: 1 } },
            { icon: '⚗️', text: '物理/化学', tags: { engineering: 3, science: 3, health: 1 } },
            { icon: '📝', text: '语文/历史/政治', tags: { humanities: 3, social: 2, law: 1, media: 1 } },
            { icon: '🗣️', text: '英语/外语', tags: { media: 2, tourism: 2, social: 1, humanities: 1 } },
            { icon: '🧬', text: '生物', tags: { health: 3, science: 2 } },
            { icon: '🗺️', text: '地理', tags: { tourism: 2, social: 2, science: 1 } },
            { icon: '💻', text: '信息技术', tags: { cs: 3, engineering: 1 } },
            { icon: '🎨', text: '美术/音乐', tags: { design: 3, media: 1 } },
            { icon: '💹', text: '经济/会计', tags: { business: 3, law: 1 } },
            { icon: '🏃', text: '体育', tags: { health: 1, tourism: 1 } }
          ]
        }
      ]
    },
    {
      step: 3, label: '性格特质', icon: '🧬',
      questions: [
        {
          title: '如果选择一种理想的工作方式，你最倾向哪种？',
          desc: '基于霍兰德职业兴趣模型（RIASEC），帮你定位职业类型',
          multi: false,
          options: [
            { icon: '🔬', text: '独立研究，探索未知领域', tags: { science: 3, cs: 2 } },
            { icon: '🔨', text: '用双手创造实在的成果', tags: { engineering: 3, design: 2 } },
            { icon: '🎨', text: '自由表达创意和个性', tags: { design: 3, media: 2, humanities: 1 } },
            { icon: '🤲', text: '帮助他人成长和发展', tags: { education: 3, health: 2, social: 2 } },
            { icon: '🚀', text: '带领团队达成商业目标', tags: { business: 3, law: 2 } },
            { icon: '📋', text: '按规则高效完成精密任务', tags: { law: 2, cs: 2, business: 2, health: 1 } }
          ]
        }
      ]
    },
    {
      step: 4, label: '价值观与目标', icon: '🎯',
      questions: [
        {
          title: '在未来的职业中，你最看重什么？',
          desc: '可多选，选择2-3个最核心的价值取向',
          multi: true,
          options: [
            { icon: '💰', text: '高收入和经济回报', tags: { business: 3, law: 2, cs: 1 } },
            { icon: '🛡️', text: '稳定和安全感', tags: { health: 2, education: 2, law: 1, cs: 1 } },
            { icon: '🎨', text: '创造和自我表达', tags: { design: 3, media: 2, humanities: 1 } },
            { icon: '❤️', text: '帮助他人和社会贡献', tags: { education: 3, health: 3, social: 2 } },
            { icon: '📚', text: '持续学习和探索', tags: { science: 3, cs: 2, humanities: 1 } },
            { icon: '🌐', text: '国际化和发展空间', tags: { business: 2, tourism: 2, media: 1, cs: 1 } },
            { icon: '⚖️', text: '工作与生活平衡', tags: { tourism: 2, education: 1, social: 1 } },
            { icon: '🚀', text: '创业和自主权', tags: { business: 3, law: 1 } }
          ]
        },
        {
          title: '你希望留学后的发展方向是？',
          desc: '这会影响专业和路径推荐',
          multi: false,
          options: [
            { icon: '🏠', text: '回国发展，考公/考编/进国企', tags: { law: 2, education: 1, business: 1 } },
            { icon: '✈️', text: '留在当地工作积累经验', tags: { cs: 2, engineering: 2, health: 2, business: 1 } },
            { icon: '🎓', text: '继续深造读硕士/博士', tags: { science: 3, cs: 2, humanities: 1 } },
            { icon: '💡', text: '创业或自由职业', tags: { business: 2, design: 2, media: 1 } },
            { icon: '🤔', text: '还没想好，想多了解', tags: { social: 1 } }
          ]
        }
      ]
    },
    {
      step: 5, label: '留学偏好', icon: '🌐',
      questions: [
        {
          title: '你的留学预算大概是多少（每年）？',
          desc: '包括学费和生活费，不同预算对应不同国家方案',
          multi: false,
          options: [
            { icon: '💰', text: '5-10万/年（马来西亚、俄罗斯等）', tags: { tourism: 2, social: 1 } },
            { icon: '💰💰', text: '10-15万/年（新加坡私立等）', tags: { business: 1, cs: 1, design: 1 } },
            { icon: '💰💰💰', text: '15-25万/年（英国、澳洲等）', tags: { media: 1, education: 1, health: 1 } },
            { icon: '💰💰💰💰', text: '25万以上/年（美国等）', tags: { science: 1, law: 1 } },
            { icon: '🤷', text: '不确定，想看性价比', tags: { business: 1, cs: 1 } }
          ]
        },
        {
          title: '你倾向哪些留学目的地？',
          desc: '可多选，选择你感兴趣的国家或地区',
          multi: true,
          options: [
            { icon: '🇸🇬', text: '新加坡', tags: { business: 1, cs: 1, tourism: 1 } },
            { icon: '🇬🇧', text: '英国', tags: { media: 1, law: 1, humanities: 1 } },
            { icon: '🇦🇺', text: '澳大利亚', tags: { health: 1, engineering: 1, education: 1 } },
            { icon: '🇲🇾', text: '马来西亚', tags: { tourism: 1, business: 1 } },
            { icon: '🇺🇸', text: '美国', tags: { cs: 1, science: 1, business: 1 } },
            { icon: '🇷🇺', text: '俄罗斯', tags: { science: 1, humanities: 1 } },
            { icon: '🇨🇦', text: '加拿大', tags: { engineering: 1, health: 1 } },
            { icon: '🇭🇰', text: '中国香港', tags: { business: 1, law: 1, media: 1 } },
            { icon: '🤔', text: '暂未确定', tags: { social: 1 } }
          ]
        }
      ]
    }
  ];

  // 留学测评状态
  var studyAssessAnswers = []; // [{ questionIndex, selectedOptions }]
  var studyAssessScores = {};  // { majorKey: totalScore }
  var studyAssessStepIdx = 0;  // 当前步骤索引 (0-based)

  // ========== 出国工作深度测评数据模型 ==========
  var WORK_QUESTIONS = [
    {
      step: 1, label: '目标国家', icon: '🌍', multi: false,
      title: '你想去哪个国家工作？',
      desc: '选择你最感兴趣的工作目的地',
      options: [
        { icon: '🇦🇺', text: '澳大利亚', value: 'au' },
        { icon: '🇬🇧', text: '英国', value: 'uk' },
        { icon: '🇪🇺', text: '欧洲', value: 'eu' },
        { icon: '🇲🇾', text: '马来西亚', value: 'my' },
        { icon: '🇳🇿', text: '新西兰', value: 'nz' },
        { icon: '🇨🇦', text: '加拿大', value: 'ca' },
        { icon: '🤔', text: '暂未确定', value: 'undecided' }
      ]
    },
    {
      step: 2, label: '年龄', icon: '👤', multi: false,
      title: '你现在的年龄是？',
      desc: '年龄是工作签证的重要评估指标，不同国家有不同年龄上限',
      options: [
        { icon: '🌱', text: '25岁以下', value: 'under25' },
        { icon: '💪', text: '25-30岁', value: '25-30' },
        { icon: '⭐', text: '30-35岁', value: '30-35' },
        { icon: '🔥', text: '35-40岁', value: '35-40' },
        { icon: '⚡', text: '40-43岁', value: '40-43' },
        { icon: '⚠️', text: '43岁以上', value: 'over43' }
      ]
    },
    {
      step: 3, label: '学历', icon: '🎓', multi: false,
      title: '你的最高学历是？',
      desc: '学历水平影响签证类型和匹配的岗位',
      options: [
        { icon: '📖', text: '初中及以下', value: 'middle' },
        { icon: '📔', text: '高中', value: 'high' },
        { icon: '📕', text: '中专', value: 'vocational' },
        { icon: '📘', text: '大专', value: 'college' },
        { icon: '📗', text: '本科', value: 'bachelor' },
        { icon: '🎓', text: '硕士及以上', value: 'master' }
      ]
    },
    {
      step: 4, label: '工作经验', icon: '💼', multi: false,
      title: '你有多少年可以证明的工作经验？',
      desc: '以社保缴纳年限为准，这是工作签证的核心条件之一',
      options: [
        { icon: '📅', text: '1-3年', value: '1-3' },
        { icon: '📅', text: '3-5年', value: '3-5' },
        { icon: '📅', text: '5-8年', value: '5-8' },
        { icon: '📅', text: '8-10年', value: '8-10' },
        { icon: '📅', text: '10年以上', value: '10+' },
        { icon: '❌', text: '无社保记录', value: 'none' }
      ]
    },
    {
      step: 5, label: '预算', icon: '💰', multi: false,
      title: '你的出国工作预算是？',
      desc: '包括签证办理、中介服务、机票等费用',
      options: [
        { icon: '💰', text: '3万以内', value: 'under3w' },
        { icon: '💰', text: '3-5万', value: '3-5w' },
        { icon: '💰', text: '5-10万', value: '5-10w' },
        { icon: '💰', text: '10-15万', value: '10-15w' },
        { icon: '💰', text: '15万以上', value: '15w+' },
        { icon: '🤷', text: '尚未确定', value: 'undecided' }
      ]
    },
    {
      step: 6, label: '专业技能', icon: '🔧', multi: true,
      title: '你有哪些专业技能领域？',
      desc: '可多选，选择你具备实际工作经验的技能领域',
      options: [
        { icon: '🏭', text: '制造业', value: 'manufacturing' },
        { icon: '🏗️', text: '建筑业', value: 'construction' },
        { icon: '🛎️', text: '服务业', value: 'service' },
        { icon: '💻', text: 'IT技术', value: 'it' },
        { icon: '🏥', text: '医疗护理', value: 'healthcare' },
        { icon: '🌾', text: '农业', value: 'agriculture' },
        { icon: '🚛', text: '司机物流', value: 'driving' },
        { icon: '🍳', text: '餐饮', value: 'culinary' },
        { icon: '📦', text: '其他', value: 'other' }
      ]
    }
  ];

  // 各国工作签信息库
  var WORK_COUNTRIES = {
    au: { name: '澳大利亚', flag: '🇦🇺', color: '#16a34a', visaType: '482/SID工签', minAge: 18, maxAge: 43, minSocial: 8, minBudget: '5-10万', landing: '接机住宿+银行卡+税号+就业指导', desc: '高薪合法工作签证，43岁以内、有8年+社保和技能即可申请' },
    uk: { name: '英国', flag: '🇬🇧', color: '#1d4ed8', visaType: 'Skilled Worker签证', minAge: 18, maxAge: 55, minSocial: 2, minBudget: '5-10万', landing: '接机住宿+NIN+银行+就业对接', desc: '需雇主担保+英语B1水平，适合IT/医疗/工程等专业人才' },
    eu: { name: '欧洲', flag: '🇪🇺', color: '#0ea5e9', visaType: '欧盟蓝卡/各国工签', minAge: 18, maxAge: 50, minSocial: 3, minBudget: '3-8万', landing: '接机+住宿+居留卡办理+就业指导', desc: '各国政策不同，一般需专业技能和合同，德/法/波兰等机会多' },
    my: { name: '马来西亚', flag: '🇲🇾', color: '#dc2626', visaType: '工作准证(Employment Pass)', minAge: 18, maxAge: 60, minSocial: 1, minBudget: '1-3万', landing: '接机住宿+工作证+银行+华人社区支持', desc: '低门槛华人友好，适合服务业/餐饮/销售/制造业，费用低' },
    nz: { name: '新西兰', flag: '🇳🇿', color: '#059669', visaType: 'AEWV工签', minAge: 18, maxAge: 55, minSocial: 3, minBudget: '5-10万', landing: '接机住宿+IRD+银行+就业指导', desc: '打分制工签，年龄/学历/经验综合评分，建筑/农业/IT需求大' },
    ca: { name: '加拿大', flag: '🇨🇦', color: '#ea580c', visaType: 'TFW/Express Entry', minAge: 18, maxAge: 50, minSocial: 3, minBudget: '8-15万', landing: '接机住宿+SIN+银行+就业指导', desc: '打分制移民导向，年龄/学历/语言/经验综合评估，长期发展好' }
  };

  // 工作签测评状态
  var workAssessAnswers = []; // [selectedIndices per step]
  var workAssessStepIdx = 0;

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
      .lp-pay-btn-primary { background:linear-gradient(135deg,#7c3aed,#a855f7);font-size:1rem;padding:14px; }
      .lp-pay-btn-secondary { background:#f1f5f9;color:#64748b;font-size:.82rem;padding:10px;margin-top:8px; }

      /* ========== 留学深度测评增强样式 ========== */
      .lp-assess-progress-wrap { padding:0 20px 0;background:linear-gradient(135deg,#7c3aed,#a855f7);padding-bottom:14px; }
      .lp-assess-progress-bar { height:6px;background:rgba(255,255,255,.2);border-radius:3px;overflow:hidden; }
      .lp-assess-progress-fill { height:100%;background:linear-gradient(90deg,#fbbf24,#fde68a);border-radius:3px;transition:width .5s cubic-bezier(.4,0,.2,1); }
      .lp-assess-progress-text { color:rgba(255,255,255,.8);font-size:.72rem;margin-top:6px;display:flex;justify-content:space-between; }

      .lp-study-intro-features { display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px; }
      .lp-study-intro-feature { background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;text-align:center; }
      .lp-study-intro-feature .lp-feature-icon { font-size:1.5rem;margin-bottom:4px; }
      .lp-study-intro-feature .lp-feature-text { font-size:.72rem;color:#64748b;line-height:1.4; }

      .lp-study-step-body { padding:20px; }
      .lp-study-step-anim { animation:lpSlideUp .4s ease; }
      .lp-study-q-num { display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-size:.78rem;font-weight:700;margin-right:8px;flex-shrink:0; }
      .lp-study-q-title { font-size:1rem;font-weight:700;color:#1e293b;margin-bottom:6px;display:flex;align-items:flex-start; }
      .lp-study-q-desc { font-size:.8rem;color:#64748b;margin-bottom:14px;line-height:1.5; }

      .lp-study-cards { display:flex;flex-direction:column;gap:8px;margin-bottom:20px; }
      .lp-study-card { display:flex;align-items:center;gap:10px;padding:12px 14px;border:2px solid #e2e8f0;border-radius:12px;background:#fff;cursor:pointer;transition:all .2s; }
      .lp-study-card:hover { border-color:#c4b5fd;background:#faf5ff; }
      .lp-study-card.selected { border-color:#7c3aed;background:linear-gradient(135deg,#f3e8ff,#faf5ff);box-shadow:0 2px 10px rgba(124,58,237,.15); }
      .lp-study-card .lp-card-icon { font-size:1.4rem;flex-shrink:0;width:36px;text-align:center; }
      .lp-study-card .lp-card-text { font-size:.85rem;color:#334155;line-height:1.4; }
      .lp-study-card.selected .lp-card-text { color:#6b21a8;font-weight:600; }
      .lp-study-card .lp-card-check { margin-left:auto;color:#7c3aed;opacity:0;transition:opacity .2s;flex-shrink:0;font-size:1.1rem; }
      .lp-study-card.selected .lp-card-check { opacity:1; }

      .lp-study-nav { display:flex;gap:8px; }
      .lp-study-nav .lp-back-btn { flex:0 0 auto;padding:12px 16px;border:2px solid #e2e8f0;border-radius:12px;background:#fff;color:#64748b;font-weight:600;font-size:.88rem;cursor:pointer;transition:all .2s; }
      .lp-study-nav .lp-back-btn:hover { border-color:#c4b5fd;color:#7c3aed; }
      .lp-study-nav .lp-next-btn { flex:1; }

      .lp-study-multitag { display:inline-block;font-size:.68rem;color:#a855f7;background:#f3e8ff;padding:2px 8px;border-radius:6px;margin-left:6px; }

      /* 测评结果页 */
      .lp-result-body { padding:20px 18px; }
      .lp-result-summary { text-align:center;margin-bottom:20px;animation:lpFadeIn .5s ease; }
      .lp-result-summary .lp-result-emoji { font-size:2.5rem;margin-bottom:8px; }
      .lp-result-summary .lp-result-title { font-size:1.15rem;font-weight:700;color:#1e293b;margin-bottom:6px; }
      .lp-result-summary .lp-result-sub { font-size:.8rem;color:#64748b;line-height:1.5; }

      .lp-result-card { border-radius:14px;overflow:hidden;margin-bottom:12px;animation:lpSlideUp .4s ease;box-shadow:0 2px 8px rgba(0,0,0,.06); }
      .lp-result-card-header { padding:14px 16px;display:flex;align-items:center;gap:12px;color:#fff; }
      .lp-result-card-header .lp-rc-icon { width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0; }
      .lp-result-card-header .lp-rc-info { flex:1; }
      .lp-result-card-header .lp-rc-name { font-weight:700;font-size:1rem; }
      .lp-result-card-header .lp-rc-match { font-size:.75rem;opacity:.85;margin-top:2px; }
      .lp-result-card-header .lp-rc-pct { font-size:1.3rem;font-weight:800;flex-shrink:0; }
      .lp-result-card-body { padding:14px 16px;background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 14px 14px; }
      .lp-result-card-body .lp-rc-desc { font-size:.78rem;color:#64748b;line-height:1.5;margin-bottom:10px; }
      .lp-result-card-body .lp-rc-reason { font-size:.78rem;color:#475569;line-height:1.5;margin-bottom:10px;padding:8px 10px;background:#f8fafc;border-radius:8px;border-left:3px solid #a855f7; }
      .lp-result-card-body .lp-rc-paths { display:flex;flex-wrap:wrap;gap:6px; }
      .lp-result-card-body .lp-rc-path { font-size:.72rem;padding:4px 10px;border-radius:6px;background:#eef2ff;color:#4f46e5;font-weight:500; }

      .lp-match-bar { height:4px;background:#e2e8f0;border-radius:2px;margin-top:6px;overflow:hidden; }
      .lp-match-fill { height:100%;border-radius:2px;transition:width .8s cubic-bezier(.4,0,.2,1); }

      .lp-result-contact { background:linear-gradient(135deg,#f3e8ff,#e9d5ff);border-radius:14px;padding:18px;margin-top:16px;text-align:center;animation:lpFadeIn .5s ease; }
      .lp-result-contact .lp-contact-title { font-size:.95rem;font-weight:700;color:#6b21a8;margin-bottom:6px; }
      .lp-result-contact .lp-contact-desc { font-size:.78rem;color:#7c3aed;margin-bottom:14px;line-height:1.5; }
      .lp-result-contact input { width:100%;padding:10px 14px;border:2px solid #e9d5ff;border-radius:10px;font-size:.85rem;color:#334155;outline:none;margin-bottom:8px;box-sizing:border-box;transition:border-color .2s;background:#fff; }
      .lp-result-contact input:focus { border-color:#7c3aed; }
      .lp-result-contact button { width:100%;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:700;font-size:.9rem;cursor:pointer;transition:all .2s; }
      .lp-result-contact button:hover { opacity:.9;transform:translateY(-1px);box-shadow:0 4px 12px rgba(124,58,237,.3); }
      .lp-result-contact button:disabled { opacity:.5;cursor:not-allowed;transform:none;box-shadow:none; }

      @media (max-width:500px) {
        .lp-chat-dialog { height:90vh;max-height:none;border-radius:0; }
        .lp-assess-dialog { max-height:95vh;border-radius:0; }
        .lp-pay-dialog { border-radius:0; }
        .lp-overlay { align-items:flex-end; }
        .lp-dialog { border-radius:16px 16px 0 0 !important; }
        .lp-study-intro-features { grid-template-columns:1fr 1fr; }
        .lp-study-cards { gap:6px; }
        .lp-study-card { padding:10px 12px; }
        .lp-study-card .lp-card-text { font-size:.82rem; }
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

  // ========== 留学深度测评模式 ==========
  function showStudyAssessModal() {
    createModal();
    modal.innerHTML = '';
    studyAssessAnswers = [];
    studyAssessScores = {};
    studyAssessStepIdx = 0;
    renderStudyAssessIntro();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  // 扁平化所有问题为线性列表
  function getFlatQuestions() {
    var flat = [];
    STUDY_QUESTIONS.forEach(function(step) {
      step.questions.forEach(function(q) {
        flat.push({ step: step, question: q });
      });
    });
    return flat;
  }

  function renderStudyAssessIntro() {
    var flatQs = getFlatQuestions();
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🌟</div>
        <div>
          <div class="lp-assess-title">AI兴趣天赋测评</div>
          <div class="lp-assess-sub">智能匹配专业方向 · 留学路径规划 · 个性化推荐</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-body">
        <div class="lp-assess-intro">
          <div class="lp-intro-icon">🌟</div>
          <div class="lp-intro-title">发现你的留学方向</div>
          <div class="lp-intro-desc">通过${flatQs.length}道精心设计的问题，AI将基于你的兴趣、性格、能力和价值观，为你智能匹配最适合的专业方向与留学路径</div>
        </div>
        <div class="lp-study-intro-features">
          <div class="lp-study-intro-feature"><div class="lp-feature-icon">🎯</div><div class="lp-feature-text">5大维度<br>深度测评</div></div>
          <div class="lp-study-intro-feature"><div class="lp-feature-icon">🔬</div><div class="lp-feature-text">霍兰德模型<br>科学匹配</div></div>
          <div class="lp-study-intro-feature"><div class="lp-feature-icon">📊</div><div class="lp-feature-text">12个专业<br>方向推荐</div></div>
          <div class="lp-study-intro-feature"><div class="lp-feature-icon">🚀</div><div class="lp-feature-text">个性化<br>留学路径</div></div>
        </div>
        <div class="lp-step-list">
          <div class="lp-step-item"><div class="lp-step-num">1</div><div class="lp-step-content"><div class="lp-step-label">✨ Step 1</div><div class="lp-step-title">兴趣探索</div><div class="lp-step-q">你喜欢做什么？什么让你充满热情？</div></div></div>
          <div class="lp-step-item"><div class="lp-step-num">2</div><div class="lp-step-content"><div class="lp-step-label">📖 Step 2</div><div class="lp-step-title">学科偏好</div><div class="lp-step-q">你擅长和喜欢哪些学科？</div></div></div>
          <div class="lp-step-item"><div class="lp-step-num">3</div><div class="lp-step-content"><div class="lp-step-label">🧬 Step 3</div><div class="lp-step-title">性格特质</div><div class="lp-step-q">基于霍兰德模型，你的职业倾向是？</div></div></div>
          <div class="lp-step-item"><div class="lp-step-num">4</div><div class="lp-step-content"><div class="lp-step-label">🎯 Step 4</div><div class="lp-step-title">价值观与目标</div><div class="lp-step-q">你看重什么？留学后想怎么发展？</div></div></div>
          <div class="lp-step-item"><div class="lp-step-num">5</div><div class="lp-step-content"><div class="lp-step-label">🌐 Step 5</div><div class="lp-step-title">留学偏好</div><div class="lp-step-q">预算多少？想去哪里？</div></div></div>
        </div>
        <button class="lp-assess-btn" id="lp-start-study-assess">开始测评 →</button>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);
    document.getElementById('lp-start-study-assess').onclick = function() {
      studyAssessStepIdx = 0;
      renderStudyAssessQuestion(0);
    };
  }

  function renderStudyAssessQuestion(qIdx) {
    var flatQs = getFlatQuestions();
    var totalQs = flatQs.length;
    if (qIdx >= totalQs) {
      calculateStudyScores();
      renderStudyAssessResult();
      return;
    }
    var item = flatQs[qIdx];
    var q = item.question;
    var stepInfo = item.step;
    var progressPct = Math.round((qIdx / totalQs) * 100);

    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🌟</div>
        <div style="flex:1">
          <div class="lp-assess-title">AI兴趣天赋测评</div>
          <div class="lp-assess-sub">${stepInfo.icon} ${stepInfo.label} · 第 ${qIdx + 1} / ${totalQs} 题</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-progress-wrap">
        <div class="lp-assess-progress-bar"><div class="lp-assess-progress-fill" style="width:${progressPct}%"></div></div>
        <div class="lp-assess-progress-text"><span>${stepInfo.label}</span><span>${qIdx + 1} / ${totalQs}</span></div>
      </div>
      <div class="lp-study-step-body lp-study-step-anim">
        <div class="lp-study-q-title"><span class="lp-study-q-num">${qIdx + 1}</span><span>${q.title}${q.multi ? '<span class="lp-study-multitag">可多选</span>' : ''}</span></div>
        <div class="lp-study-q-desc">${q.desc}</div>
        <div class="lp-study-cards" id="lp-study-options"></div>
        <div class="lp-study-nav">
          ${qIdx > 0 ? '<button class="lp-back-btn" id="lp-study-back">← 上一题</button>' : ''}
          <button class="lp-next-btn" id="lp-study-next" disabled>${qIdx === totalQs - 1 ? '查看结果 →' : '下一题 →'}</button>
        </div>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);

    var optsContainer = document.getElementById('lp-study-options');
    var selected = [];
    // 如果之前回答过，恢复选择
    if (studyAssessAnswers[qIdx]) {
      selected = studyAssessAnswers[qIdx].slice();
    }

    q.options.forEach(function(opt, optIdx) {
      var card = document.createElement('div');
      card.className = 'lp-study-card';
      if (selected.indexOf(optIdx) > -1) card.classList.add('selected');
      card.innerHTML = `
        <div class="lp-card-icon">${opt.icon}</div>
        <div class="lp-card-text">${opt.text}</div>
        <div class="lp-card-check">✓</div>
      `;
      card.onclick = function() {
        if (q.multi) {
          var idx = selected.indexOf(optIdx);
          if (idx > -1) { selected.splice(idx, 1); card.classList.remove('selected'); }
          else { selected.push(optIdx); card.classList.add('selected'); }
        } else {
          optsContainer.querySelectorAll('.lp-study-card').forEach(function(c) { c.classList.remove('selected'); });
          card.classList.add('selected');
          selected = [optIdx];
        }
        document.getElementById('lp-study-next').disabled = selected.length === 0;
      };
      optsContainer.appendChild(card);
    });

    // 恢复按钮状态
    document.getElementById('lp-study-next').disabled = selected.length === 0;

    document.getElementById('lp-study-next').onclick = function() {
      studyAssessAnswers[qIdx] = selected;
      renderStudyAssessQuestion(qIdx + 1);
    };

    var backBtn = document.getElementById('lp-study-back');
    if (backBtn) {
      backBtn.onclick = function() { renderStudyAssessQuestion(qIdx - 1); };
    }
  }

  function calculateStudyScores() {
    studyAssessScores = {};
    var flatQs = getFlatQuestions();
    studyAssessAnswers.forEach(function(selectedOptIdxs, qIdx) {
      if (!selectedOptIdxs || selectedOptIdxs.length === 0) return;
      var q = flatQs[qIdx].question;
      selectedOptIdxs.forEach(function(optIdx) {
        var opt = q.options[optIdx];
        if (!opt || !opt.tags) return;
        for (var majorKey in opt.tags) {
          if (!studyAssessScores[majorKey]) studyAssessScores[majorKey] = 0;
          studyAssessScores[majorKey] += opt.tags[majorKey];
        }
      });
    });
  }

  function renderStudyAssessResult() {
    // 排序专业方向
    var sorted = Object.keys(studyAssessScores)
      .map(function(key) { return { key: key, score: studyAssessScores[key] }; })
      .sort(function(a, b) { return b.score - a.score; });

    // 取Top 4（或全部如果不足4个）
    var topCount = Math.min(4, sorted.length);
    var topMajors = sorted.slice(0, topCount);
    var maxScore = topMajors.length > 0 ? topMajors[0].score : 1;

    // 计算匹配度百分比
    var results = topMajors.map(function(item) {
      var pct = Math.round((item.score / maxScore) * 100);
      if (pct < 40) pct = 40 + Math.round(pct * 0.3); // 最低40%
      if (pct > 99) pct = 99;
      return { key: item.key, score: item.score, pct: pct };
    });

    // 生成推荐理由
    function getReason(key, pct) {
      var major = STUDY_MAJORS[key];
      var reasons = {
        business: '你在商业思维、组织领导和目标导向方面表现突出，适合追求高回报和国际化发展的商科领域。',
        cs: '你的逻辑思维、分析能力和对技术的兴趣非常突出，计算机/IT领域的高薪和全球需求完美匹配你的特质。',
        engineering: '你展现出了出色的动手能力和实践精神，工程领域可以充分发挥你"用双手创造成果"的天赋。',
        design: '你拥有强烈的创造力和审美天赋，设计/艺术领域可以让你的想象力和个性得到充分释放。',
        education: '你的同理心和助人特质非常突出，教育领域可以让你在帮助他人成长中获得深层的职业满足感。',
        media: '你对表达和沟通有天然的热情，传媒领域可以充分发挥你的创意和影响力。',
        health: '你展现出强烈的关怀特质和科学精神，健康/医学领域既能满足你的助人初心，也有稳定的职业前景。',
        tourism: '你对探索世界和服务他人充满热情，旅游/酒店管理领域可以结合你的兴趣与国际化发展。',
        law: '你的逻辑分析和社会关注非常突出，法律领域既能发挥你的思辨能力，也有稳定和高回报的前景。',
        social: '你对社会议题和人际互动有敏锐的洞察力，社会科学领域能满足你理解和改善社会的深层需求。',
        science: '你展现出了强烈的探索欲和研究精神，自然科学领域可以让你在持续探索未知中获得成就感。',
        humanities: '你对文化、历史和思想有深厚的兴趣，人文学科领域可以充分发挥你的思考和表达能力。'
      };
      return reasons[key] || ('你的特质与' + major.name + '方向高度匹配。');
    }

    var resultCardsHtml = results.map(function(r, idx) {
      var major = STUDY_MAJORS[r.key];
      var delay = idx * 0.1;
      return `
        <div class="lp-result-card" style="animation-delay:${delay}s">
          <div class="lp-result-card-header" style="background:linear-gradient(135deg,${major.color},${major.color}dd)">
            <div class="lp-rc-icon">${major.icon}</div>
            <div class="lp-rc-info">
              <div class="lp-rc-name">${major.name}</div>
              <div class="lp-rc-match">匹配度 ${r.pct}%</div>
              <div class="lp-match-bar"><div class="lp-match-fill" style="width:${r.pct}%;background:${major.color}"></div></div>
            </div>
            <div class="lp-rc-pct">${r.pct}%</div>
          </div>
          <div class="lp-result-card-body">
            <div class="lp-rc-desc">${major.desc}</div>
            <div class="lp-rc-reason">💡 ${getReason(r.key, r.pct)}</div>
            <div class="lp-rc-paths">${major.paths.map(function(p) { return '<span class="lp-rc-path">' + p + '</span>'; }).join('')}</div>
          </div>
        </div>
      `;
    }).join('');

    var topMajorName = results.length > 0 ? STUDY_MAJORS[results[0].key].name : '你的专业方向';

    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🌟</div>
        <div>
          <div class="lp-assess-title">AI兴趣天赋测评</div>
          <div class="lp-assess-sub">测评完成 · 个性化推荐报告</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-progress-wrap">
        <div class="lp-assess-progress-bar"><div class="lp-assess-progress-fill" style="width:100%"></div></div>
        <div class="lp-assess-progress-text"><span>测评完成</span><span>✓ 全部完成</span></div>
      </div>
      <div class="lp-result-body">
        <div class="lp-result-summary">
          <div class="lp-result-emoji">🎉</div>
          <div class="lp-result-title">你的测评结果出来了！</div>
          <div class="lp-result-sub">基于你的回答，AI为你匹配了${results.length}个最适合的专业方向<br>最推荐的方向是<b style="color:#7c3aed">${topMajorName}</b></div>
        </div>
        ${resultCardsHtml}
        <div class="lp-result-contact" id="lp-result-contact">
          <div class="lp-contact-title">📋 获取完整测评报告</div>
          <div class="lp-contact-desc">留下联系方式，顾问将为你发送包含详细分析、院校推荐和路径规划的完整报告</div>
          <input type="text" id="lp-study-name" placeholder="您的称呼（如：王同学）">
          <input type="text" id="lp-study-phone" placeholder="手机号或微信号">
          <button id="lp-study-submit" disabled>提交并获取完整报告 →</button>
        </div>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);

    var nameInput = document.getElementById('lp-study-name');
    var phoneInput = document.getElementById('lp-study-phone');
    var submitBtn = document.getElementById('lp-study-submit');

    function checkReady() {
      submitBtn.disabled = !nameInput.value.trim() || !phoneInput.value.trim();
    }
    nameInput.oninput = checkReady;
    phoneInput.oninput = checkReady;

    submitBtn.onclick = function() {
      // 收集测评数据
      var flatQs = getFlatQuestions();
      var answersText = studyAssessAnswers.map(function(selectedIdxs, qIdx) {
        var q = flatQs[qIdx].question;
        var texts = selectedIdxs.map(function(i) { return q.options[i].text; });
        return q.title + ': ' + texts.join(', ');
      }).join(' | ');

      var topMajorsText = results.map(function(r) {
        return STUDY_MAJORS[r.key].name + '(' + r.pct + '%)';
      }).join(', ');

      var data = {
        source: '留学深度测评',
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        answers: answersText,
        recommendedMajors: topMajorsText,
        pageType: 'study'
      };

      // 保存到本地
      saveLeadLocal(data);

      // 尝试提交到API
      var apiUrl = CONFIG.apiEndpoint ? CONFIG.apiEndpoint.replace(/\/$/, '') + '/form-submit' : '';
      if (apiUrl) {
        fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          .then(function() { renderStudyAssessSuccess(nameInput.value.trim()); })
          .catch(function() { renderStudyAssessSuccess(nameInput.value.trim()); });
      } else {
        renderStudyAssessSuccess(nameInput.value.trim());
      }
    };
  }

  function renderStudyAssessSuccess(userName) {
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🌟</div>
        <div>
          <div class="lp-assess-title">AI兴趣天赋测评</div>
          <div class="lp-assess-sub">报告提交成功</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-body">
        <div class="lp-assess-success">
          <div class="lp-success-icon">🎉</div>
          <div class="lp-success-title">测评报告提交成功！</div>
          <div class="lp-success-desc">感谢${userName || '你'}的参与！我们的专业顾问将根据你的测评结果，在24小时内为你整理一份包含<b>详细专业分析、院校推荐和留学路径规划</b>的完整报告，并通过手机或微信发送给你。</div>
          <div class="lp-success-tip">期待与您沟通，开启您的星途之旅 🌟</div>
        </div>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);
  }

  // ========== 出国工作深度测评模式 ==========
  function showWorkAssessModal() {
    createModal();
    modal.innerHTML = '';
    workAssessAnswers = [];
    workAssessStepIdx = 0;
    renderWorkAssessIntro();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function renderWorkAssessIntro() {
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🌟</div>
        <div>
          <div class="lp-assess-title">AI出国工作资格测评</div>
          <div class="lp-assess-sub">智能评估签证资格 · 匹配目标国家 · 海外就业规划</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-body">
        <div class="lp-assess-intro">
          <div class="lp-intro-icon">🌟</div>
          <div class="lp-intro-title">评估你的出国工作资格</div>
          <div class="lp-intro-desc">通过6个维度的智能评估，AI将基于你的年龄、学历、工作经验、预算和技能，为你匹配最适合的出国工作路径与签证方案</div>
        </div>
        <div class="lp-study-intro-features">
          <div class="lp-study-intro-feature"><div class="lp-feature-icon">🌍</div><div class="lp-feature-text">6大维度<br>深度评估</div></div>
          <div class="lp-study-intro-feature"><div class="lp-feature-icon">📊</div><div class="lp-feature-text">6个国家<br>智能匹配</div></div>
          <div class="lp-study-intro-feature"><div class="lp-feature-icon">🎯</div><div class="lp-feature-text">签证资格<br>精准评估</div></div>
          <div class="lp-study-intro-feature"><div class="lp-feature-icon">🛡️</div><div class="lp-feature-text">落地保障<br>全程规划</div></div>
        </div>
        <div class="lp-step-list">
          <div class="lp-step-item"><div class="lp-step-num">1</div><div class="lp-step-content"><div class="lp-step-label">🌍 Step 1</div><div class="lp-step-title">目标国家</div><div class="lp-step-q">你想去哪个国家工作？</div></div></div>
          <div class="lp-step-item"><div class="lp-step-num">2</div><div class="lp-step-content"><div class="lp-step-label">👤 Step 2</div><div class="lp-step-title">年龄</div><div class="lp-step-q">你现在的年龄是？</div></div></div>
          <div class="lp-step-item"><div class="lp-step-num">3</div><div class="lp-step-content"><div class="lp-step-label">🎓 Step 3</div><div class="lp-step-title">学历</div><div class="lp-step-q">你的最高学历是？</div></div></div>
          <div class="lp-step-item"><div class="lp-step-num">4</div><div class="lp-step-content"><div class="lp-step-label">💼 Step 4</div><div class="lp-step-title">工作经验</div><div class="lp-step-q">有多少年可证明的社保工作经验？</div></div></div>
          <div class="lp-step-item"><div class="lp-step-num">5</div><div class="lp-step-content"><div class="lp-step-label">💰 Step 5</div><div class="lp-step-title">预算</div><div class="lp-step-q">你的出国工作预算是？</div></div></div>
          <div class="lp-step-item"><div class="lp-step-num">6</div><div class="lp-step-content"><div class="lp-step-label">🔧 Step 6</div><div class="lp-step-title">专业技能</div><div class="lp-step-q">你有哪些专业技能领域？</div></div></div>
        </div>
        <button class="lp-assess-btn" id="lp-start-work-assess">开始测评 →</button>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);
    document.getElementById('lp-start-work-assess').onclick = function() {
      workAssessStepIdx = 0;
      renderWorkAssessQuestion(0);
    };
  }

  function renderWorkAssessQuestion(qIdx) {
    var totalQs = WORK_QUESTIONS.length;
    if (qIdx >= totalQs) {
      renderWorkAssessResult();
      return;
    }
    var q = WORK_QUESTIONS[qIdx];
    var progressPct = Math.round((qIdx / totalQs) * 100);

    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🌟</div>
        <div style="flex:1">
          <div class="lp-assess-title">AI出国工作资格测评</div>
          <div class="lp-assess-sub">${q.icon} ${q.label} · 第 ${qIdx + 1} / ${totalQs} 步</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-progress-wrap">
        <div class="lp-assess-progress-bar"><div class="lp-assess-progress-fill" style="width:${progressPct}%"></div></div>
        <div class="lp-assess-progress-text"><span>${q.label}</span><span>${qIdx + 1} / ${totalQs}</span></div>
      </div>
      <div class="lp-study-step-body lp-study-step-anim">
        <div class="lp-study-q-title"><span class="lp-study-q-num">${qIdx + 1}</span><span>${q.title}${q.multi ? '<span class="lp-study-multitag">可多选</span>' : ''}</span></div>
        <div class="lp-study-q-desc">${q.desc}</div>
        <div class="lp-study-cards" id="lp-work-options"></div>
        <div class="lp-study-nav">
          ${qIdx > 0 ? '<button class="lp-back-btn" id="lp-work-back">← 上一步</button>' : ''}
          <button class="lp-next-btn" id="lp-work-next" disabled>${qIdx === totalQs - 1 ? '查看结果 →' : '下一步 →'}</button>
        </div>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);

    var optsContainer = document.getElementById('lp-work-options');
    var selected = [];
    // 恢复之前的选择
    if (workAssessAnswers[qIdx]) {
      selected = workAssessAnswers[qIdx].slice();
    }

    q.options.forEach(function(opt, optIdx) {
      var card = document.createElement('div');
      card.className = 'lp-study-card';
      if (selected.indexOf(optIdx) > -1) card.classList.add('selected');
      card.innerHTML = `
        <div class="lp-card-icon">${opt.icon}</div>
        <div class="lp-card-text">${opt.text}</div>
        <div class="lp-card-check">✓</div>
      `;
      card.onclick = function() {
        if (q.multi) {
          var idx = selected.indexOf(optIdx);
          if (idx > -1) { selected.splice(idx, 1); card.classList.remove('selected'); }
          else { selected.push(optIdx); card.classList.add('selected'); }
        } else {
          optsContainer.querySelectorAll('.lp-study-card').forEach(function(c) { c.classList.remove('selected'); });
          card.classList.add('selected');
          selected = [optIdx];
        }
        document.getElementById('lp-work-next').disabled = selected.length === 0;
      };
      optsContainer.appendChild(card);
    });

    document.getElementById('lp-work-next').disabled = selected.length === 0;

    document.getElementById('lp-work-next').onclick = function() {
      workAssessAnswers[qIdx] = selected;
      renderWorkAssessQuestion(qIdx + 1);
    };

    var backBtn = document.getElementById('lp-work-back');
    if (backBtn) {
      backBtn.onclick = function() { renderWorkAssessQuestion(qIdx - 1); };
    }
  }

  function calculateWorkScores() {
    // 提取用户答案
    var answers = {};
    workAssessAnswers.forEach(function(selectedIdxs, qIdx) {
      var q = WORK_QUESTIONS[qIdx];
      var values = selectedIdxs.map(function(i) { return q.options[i].value; });
      answers[q.step] = q.multi ? values : (values[0] || '');
    });

    var countryScores = {};
    var countryReasons = {};
    var allCountries = ['au', 'uk', 'eu', 'my', 'nz', 'ca'];

    // 年龄数值映射
    var ageMap = { 'under25': 23, '25-30': 28, '30-35': 33, '35-40': 38, '40-43': 42, 'over43': 48 };
    var userAge = ageMap[answers[2]] || 30;

    // 社保年限数值映射
    var socialMap = { '1-3': 2, '3-5': 4, '5-8': 7, '8-10': 9, '10+': 12, 'none': 0 };
    var userSocial = socialMap[answers[4]] || 0;

    // 学历数值映射
    var eduMap = { 'middle': 1, 'high': 2, 'vocational': 2, 'college': 3, 'bachelor': 4, 'master': 5 };
    var userEdu = eduMap[answers[3]] || 2;

    // 预算数值映射
    var budgetMap = { 'under3w': 1, '3-5w': 2, '5-10w': 3, '10-15w': 4, '15w+': 5, 'undecided': 0 };
    var userBudget = budgetMap[answers[5]] || 0;

    // 技能列表
    var userSkills = answers[6] || [];
    // 用户选择的目标国家
    var targetCountry = answers[1] || '';

    allCountries.forEach(function(countryKey) {
      var country = WORK_COUNTRIES[countryKey];
      var score = 0;
      var maxScore = 0;
      var reasons = [];

      // 1. 年龄匹配 (权重 25)
      maxScore += 25;
      if (userAge < country.maxAge) {
        var ageBonus = 25;
        if (userAge < 30) ageBonus = 25;
        else if (userAge < 35) ageBonus = 22;
        else if (userAge < 40) ageBonus = 18;
        else if (userAge < country.maxAge) ageBonus = 15;
        score += ageBonus;
        reasons.push('年龄' + (userAge < 30 ? '优势明显' : '符合要求') + '（' + country.name + '上限' + country.maxAge + '岁）');
      } else {
        reasons.push('⚠️ 年龄可能超过' + country.name + '的签证上限（' + country.maxAge + '岁）');
      }

      // 2. 社保/工作经验匹配 (权重 25)
      maxScore += 25;
      if (userSocial === 0) {
        reasons.push('⚠️ 无社保记录可能影响签证申请');
      } else if (userSocial >= country.minSocial) {
        score += 25;
        reasons.push('社保年限' + userSocial + '年，满足' + country.name + '要求（≥' + country.minSocial + '年）');
      } else {
        var partial = Math.round((userSocial / country.minSocial) * 20);
        score += partial;
        reasons.push('社保年限' + userSocial + '年，接近' + country.name + '要求（≥' + country.minSocial + '年）');
      }

      // 3. 学历匹配 (权重 20)
      maxScore += 20;
      if (countryKey === 'au') {
        // 澳洲更看重技能而非学历
        if (userEdu >= 2) { score += 18; reasons.push('学历符合澳洲工签要求'); }
        else { score += 12; reasons.push('学历偏低但可通过技能经验弥补'); }
      } else if (countryKey === 'uk' || countryKey === 'ca') {
        // 英国/加拿大更看重学历
        if (userEdu >= 4) { score += 20; reasons.push('高学历是' + country.name + '工签的加分项'); }
        else if (userEdu >= 3) { score += 15; reasons.push('大专学历可匹配部分' + country.name + '岗位'); }
        else { score += 8; reasons.push('学历偏低，' + country.name + '更倾向本科以上'); }
      } else if (countryKey === 'my') {
        // 马来西亚学历要求低
        score += 18;
        reasons.push('马来西亚对学历要求宽松');
      } else {
        if (userEdu >= 3) { score += 16; reasons.push('学历符合' + country.name + '工签要求'); }
        else { score += 10; reasons.push('学历偏低但可通过技能经验弥补'); }
      }

      // 4. 预算匹配 (权重 15)
      maxScore += 15;
      if (userBudget === 0) {
        score += 8;
        reasons.push('预算待定，建议进一步沟通确认');
      } else {
        var budgetNeed = { au: 3, uk: 3, eu: 2, my: 1, nz: 3, ca: 4 };
        var need = budgetNeed[countryKey];
        if (userBudget >= need) { score += 15; reasons.push('预算充足，覆盖' + country.name + '签证全流程'); }
        else { score += 8; reasons.push('预算偏紧，' + country.name + '全流程约需' + country.minBudget); }
      }

      // 5. 技能匹配 (权重 10)
      maxScore += 10;
      var skillMatch = { au: ['manufacturing','construction','healthcare','driving','culinary','it'], uk: ['it','healthcare','construction','service'], eu: ['manufacturing','construction','it','healthcare','agriculture'], my: ['service','culinary','manufacturing','driving'], nz: ['construction','agriculture','driving','it','healthcare'], ca: ['it','healthcare','construction','manufacturing','agriculture'] };
      var matchSkills = skillMatch[countryKey] || [];
      var hasSkill = userSkills.some(function(s) { return matchSkills.indexOf(s) > -1; });
      if (hasSkill) { score += 10; reasons.push('你的技能领域在' + country.name + '有较强需求'); }
      else if (userSkills.length > 0) { score += 5; reasons.push('你的技能可匹配部分' + country.name + '岗位'); }
      else { score += 3; reasons.push('建议补充技能信息以便精准匹配'); }

      // 6. 目标国家加分 (权重 5)
      maxScore += 5;
      if (targetCountry === countryKey) { score += 5; reasons.push('✨ 你首选' + country.name + '，匹配意愿度高'); }
      else if (targetCountry === 'undecided') { score += 3; }
      else { score += 1; }

      // 归一化 30%-99%
      var pct = Math.round((score / maxScore) * 100);
      if (pct < 30) pct = 30;
      if (pct > 99) pct = 99;

      countryScores[countryKey] = pct;
      countryReasons[countryKey] = reasons;
    });

    return { scores: countryScores, reasons: countryReasons, answers: answers };
  }

  function renderWorkAssessResult() {
    var result = calculateWorkScores();
    var scores = result.scores;
    var reasons = result.reasons;

    // 排序取Top 3
    var sorted = Object.keys(scores)
      .map(function(key) { return { key: key, pct: scores[key] }; })
      .sort(function(a, b) { return b.pct - a.pct; });

    var topCount = Math.min(3, sorted.length);
    var topResults = sorted.slice(0, topCount);

    // 判断是否有硬性条件不符
    var userAgeVal = result.answers[2] || '';
    var userSocialVal = result.answers[4] || '';
    var hasBlocking = userAgeVal === 'over43' || userSocialVal === 'none';

    var resultCardsHtml = topResults.map(function(r, idx) {
      var country = WORK_COUNTRIES[r.key];
      var delay = idx * 0.1;
      var matchColor = r.pct >= 70 ? country.color : r.pct >= 50 ? '#f59e0b' : '#94a3b8';
      var reasonHtml = (reasons[r.key] || []).map(function(re) { return '<div style="margin-bottom:4px">' + re + '</div>'; }).join('');
      return `
        <div class="lp-result-card" style="animation-delay:${delay}s">
          <div class="lp-result-card-header" style="background:linear-gradient(135deg,${country.color},${country.color}dd)">
            <div class="lp-rc-icon">${country.flag}</div>
            <div class="lp-rc-info">
              <div class="lp-rc-name">${country.name}</div>
              <div class="lp-rc-match">匹配度 ${r.pct}% · ${country.visaType}</div>
              <div class="lp-match-bar"><div class="lp-match-fill" style="width:${r.pct}%;background:${matchColor}"></div></div>
            </div>
            <div class="lp-rc-pct">${r.pct}%</div>
          </div>
          <div class="lp-result-card-body">
            <div class="lp-rc-desc">${country.desc}</div>
            <div class="lp-rc-reason">💡 ${reasonHtml}</div>
            <div class="lp-rc-paths">
              <span class="lp-rc-path">🛡️ ${country.landing}</span>
              <span class="lp-rc-path">💰 预算 ${country.minBudget}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    var topCountryName = topResults.length > 0 ? WORK_COUNTRIES[topResults[0].key].name : '你的目标国家';
    var topCountryPct = topResults.length > 0 ? topResults[0].pct : 0;

    var warningHtml = '';
    if (hasBlocking) {
      var warningText = '';
      if (userAgeVal === 'over43') {
        warningText = '你的年龄超过43岁，澳大利亚工作签的年龄上限为43岁。但英国（55岁）、马来西亚（60岁）、新西兰（55岁）等国仍有机会，我们已为你重新匹配了适合的国家方案。';
      } else if (userSocialVal === 'none') {
        warningText = '你目前没有社保记录，这会影响部分国家的工作签证申请。但马来西亚、欧洲部分国家对社保要求较低，建议先通过短期工签或技能签证起步，积累海外工作经验后再申请其他国家。';
      }
      warningHtml = `
        <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:14px 16px;margin-bottom:16px;animation:lpFadeIn .4s ease">
          <div style="display:flex;gap:8px;align-items:flex-start">
            <span style="font-size:1.2rem;flex-shrink:0">💡</span>
            <div style="font-size:.8rem;color:#92400e;line-height:1.6">${warningText}</div>
          </div>
        </div>
      `;
    }

    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🌟</div>
        <div>
          <div class="lp-assess-title">AI出国工作资格测评</div>
          <div class="lp-assess-sub">测评完成 · 签证资格评估报告</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-progress-wrap">
        <div class="lp-assess-progress-bar"><div class="lp-assess-progress-fill" style="width:100%"></div></div>
        <div class="lp-assess-progress-text"><span>测评完成</span><span>✓ 全部完成</span></div>
      </div>
      <div class="lp-result-body">
        <div class="lp-result-summary">
          <div class="lp-result-emoji">${topCountryPct >= 70 ? '🎉' : topCountryPct >= 50 ? '👍' : '📋'}</div>
          <div class="lp-result-title">你的测评结果出来了！</div>
          <div class="lp-result-sub">基于你的条件，AI为你匹配了${topResults.length}个最适合的出国工作路径<br>最推荐的国家是<b style="color:#7c3aed">${topCountryName}</b>（匹配度${topCountryPct}%）</div>
        </div>
        ${warningHtml}
        ${resultCardsHtml}
        <div class="lp-result-contact" id="lp-work-result-contact">
          <div class="lp-contact-title">📋 获取详细评估报告</div>
          <div class="lp-contact-desc">留下联系方式，顾问将为你发送包含签证方案、费用明细、落地保障的完整评估报告</div>
          <input type="text" id="lp-work-name" placeholder="您的称呼（如：王先生）">
          <input type="text" id="lp-work-phone" placeholder="手机号或微信号">
          <button id="lp-work-submit" disabled>提交并获取完整报告 →</button>
        </div>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);

    var nameInput = document.getElementById('lp-work-name');
    var phoneInput = document.getElementById('lp-work-phone');
    var submitBtn = document.getElementById('lp-work-submit');

    function checkReady() {
      submitBtn.disabled = !nameInput.value.trim() || !phoneInput.value.trim();
    }
    nameInput.oninput = checkReady;
    phoneInput.oninput = checkReady;

    submitBtn.onclick = function() {
      // 收集测评数据
      var answersText = workAssessAnswers.map(function(selectedIdxs, qIdx) {
        var q = WORK_QUESTIONS[qIdx];
        var texts = selectedIdxs.map(function(i) { return q.options[i].text; });
        return q.title + ': ' + texts.join(', ');
      }).join(' | ');

      var topCountriesText = topResults.map(function(r) {
        return WORK_COUNTRIES[r.key].name + '(' + r.pct + '%)';
      }).join(', ');

      var data = {
        source: '出国工作深度测评',
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        answers: answersText,
        recommendedCountries: topCountriesText,
        pageType: 'work'
      };

      saveLeadLocal(data);

      var apiUrl = CONFIG.apiEndpoint ? CONFIG.apiEndpoint.replace(/\/$/, '') + '/form-submit' : '';
      if (apiUrl) {
        fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          .then(function() { renderWorkAssessSuccess(nameInput.value.trim(), topCountriesText); })
          .catch(function() { renderWorkAssessSuccess(nameInput.value.trim(), topCountriesText); });
      } else {
        renderWorkAssessSuccess(nameInput.value.trim(), topCountriesText);
      }
    };
  }

  function renderWorkAssessSuccess(userName, topCountries) {
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-assess-dialog';
    dialog.innerHTML = `
      <div class="lp-assess-header">
        <div class="lp-assess-icon">🌟</div>
        <div>
          <div class="lp-assess-title">AI出国工作资格测评</div>
          <div class="lp-assess-sub">报告提交成功</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-body">
        <div class="lp-assess-success">
          <div class="lp-success-icon">🎉</div>
          <div class="lp-success-title">评估报告提交成功！</div>
          <div class="lp-success-desc">感谢${userName || '你'}的参与！你的推荐方案：<b style="color:#7c3aed">${topCountries || '待匹配'}</b><br><br>我们的专业顾问将根据你的评估结果，在24小时内为你整理一份包含<b>详细签证方案、费用明细、雇主匹配和落地保障</b>的完整报告，并通过手机或微信发送给你。</div>
          <div class="lp-success-tip">星途LumiPath · 合法合规 · 全程陪伴 🌟</div>
        </div>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);
  }

  // ========== 测评模式 ==========
  function showAssessModal() {
    // 留学页使用深度测评系统
    if (pageType === 'study') {
      showStudyAssessModal();
      return;
    }
    // 工作签页使用深度测评系统
    if (pageType === 'work') {
      showWorkAssessModal();
      return;
    }
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
        <div class="lp-assess-icon">🌟</div>
        <div>
          <div class="lp-assess-title">${pageConfig.assessTitle}</div>
          <div class="lp-assess-sub">${pageConfig.assessSub}</div>
        </div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-assess-body">
        <div class="lp-assess-intro">
          <div class="lp-intro-icon">🌟</div>
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
        <div class="lp-assess-icon">🌟</div>
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
        <div class="lp-assess-icon">🌟</div>
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
        <div class="lp-assess-icon">🌟</div>
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
        <div class="lp-assess-icon">🌟</div>
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

  // ========== 测评支付弹窗（支付后跳转AI智能体） ==========
  function showAssessPayModal() {
    createModal();
    modal.innerHTML = '';
    var qrUrl = getPaymentQrUrl();
    var agentUrl = CONFIG.openhexAgentUrl;
    var dialog = document.createElement('div');
    dialog.className = 'lp-dialog lp-pay-dialog';
    dialog.innerHTML = `
      <div class="lp-pay-header">
        <div class="lp-pay-title">🌟 AI兴趣天赋测评 · ¥9.9</div>
        <button class="lp-close-btn" onclick="window.LumiPathChat.hide()">✕</button>
      </div>
      <div class="lp-pay-body">
        <div class="lp-pay-tip">请使用支付宝扫描下方二维码支付 ¥9.9</div>
        <div class="lp-qr-wrap">
          <div class="lp-qr-recommend">支付 ¥9.9 开启AI测评</div>
          <div class="lp-qr-notice">支持花呗 | 信用卡 | 分期付款</div>
          <img class="lp-qr-img" src="${qrUrl}" alt="支付宝收款码" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div style="display:none;align-items:center;justify-content:center;width:200px;height:200px;margin:0 auto;background:#f1f5f9;border-radius:8px;color:#94a3b8;font-size:.8rem">收款码加载中</div>
          <div class="lp-qr-brand">星途LumiPath</div>
          <div class="lp-qr-alipay-logo">支付宝</div>
        </div>
        <div class="lp-pay-instructions">打开支付宝 → 扫一扫 → 对准上方二维码</div>
        <div class="lp-pay-notice">支付完成后点击下方按钮，即可进入AI智能体开始测评<br>测评金可抵10000元签约服务费</div>
        <button class="lp-pay-btn lp-pay-btn-primary" onclick="window.open('${agentUrl}','_blank')">✅ 我已支付，进入AI兴趣天赋测评</button>
      </div>
    `;
    modal.innerHTML = '';
    modal.appendChild(dialog);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
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
      else if (mode === 'assess-pay') showAssessPayModal();
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
      if (action === 'consult' || action === 'assess' || action === 'pay' || action === 'assess-pay') {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (action === 'assess-pay') {
            showAssessPayModal();
          } else if (action === 'pay') {
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
