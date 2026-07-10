/**
 * 星途 LumiPath · AI跨境规划顾问 · Cloudflare Worker v3
 * 
 * 功能：
 * 1. POST /            — 流式 AI 对话（引导收集客户信息）
 * 2. POST /lead         — 从对话历史中提取结构化线索数据
 * 3. POST /form-submit  — 表单直接提交，写入飞书多维表格CRM
 * 
 * 部署步骤：
 * 1. 注册 Cloudflare（免费）：https://dash.cloudflare.com/sign-up
 * 2. Workers & Pages → Create → Create Worker
 * 3. 粘贴此代码 → Deploy
 * 4. Settings → Variables 添加：
 *    DEEPSEEK_API_KEY = 你的 DeepSeek API Key（https://platform.deepseek.com 注册，送500万token）
 *    FEISHU_APP_ID = 飞书自建应用 App ID（用于写入CRM，见下方说明）
 *    FEISHU_APP_SECRET = 飞书自建应用 App Secret
 *    FEISHU_WEBHOOK_URL = 飞书自定义机器人 webhook URL（可选，用于接收新线索通知）
 * 5. Settings → KV Namespace Bindings 添加：
 *    LEADS = 创建一个 KV namespace（用于存储线索数据）
 * 6. 把 Worker URL 填到 chat-widget.js 的 apiEndpoint
 * 
 * 飞书自建应用配置（用于写入CRM）：
 * 1. 打开 https://open.feishu.cn/app → 创建自建应用
 * 2. 权限管理 → 添加权限：bitable:app（多维表格读写）
 * 3. 版本管理 → 创建版本 → 发布
 * 4. 把应用添加为客户线索CRM多维表格的协作者（可编辑）
 * 5. 在应用基础信息页面获取 App ID 和 App Secret
 */

// ========== 飞书CRM配置 ==========
var FEISHU_BASE_TOKEN = 'Ck0QbHqOmaR457sRnE1ckmvTn6d';
var FEISHU_TABLE_ID = 'tblDJLF1SHgmSV2p';

// ========== 系统提示词 ==========
var SYSTEM_PROMPT_CONSULT = `你是「星途 LumiPath」的AI跨境规划顾问。星途是一家AI赋能的跨境全链路服务机构。

## 你的核心任务
1. 专业解答客户关于出国工作、留学、旅游、移民、AI就业的问题
2. 在对话中自然地引导客户提供个人信息，收集销售线索
3. 当收集到足够信息后，告知客户顾问会联系他

## 五大业务板块

### 1. 留学（主力业务）
- 低龄升学：中外联合办学/非应试路径，冲全球前300名校
- 核心卖点：新加坡PSB学院跳板→直通英澳名校（QS前300），如悉尼科技大学（QS排名前100）
- 适合成绩不理想但想上名校的学生
- 综合留学：中高端家庭，定制升学规划

### 2. 跨境旅游
- 双向：国人出境游 + 海外游客来华
- 避免跟团强制消费，提供自由行规划

### 3. AI转岗就业
- 体系化课程 + 内推 + 实战项目
- 帮助快速拿到AI相关岗位offer

### 4. 出国工作
- 澳洲/英国/欧洲/马来西亚合法工作签
- 43岁以内，8年+社保

### 5. 留学移民
- 中高端家庭，合法合规拿签证/绿卡

## 定价模型
- 9.9元：AI测评（引流）
- 299-999元：定制咨询
- 1万-15万+：全流程代办
- 199元/年：基础会员 / 1999元/年：高级会员

## 线索收集策略（重要！）
你需要在对话中自然地收集以下信息：
1. **怎么称呼您**（姓名）
2. **手机号或微信号**（联系方式——这是最重要的！）
3. **想了解哪个服务**（出国工作/留学/旅游/移民/AI就业）
4. **目标国家**（如澳洲/英国/新加坡等）
5. **预算范围**（可以问"您大概的预算范围是多少？"）
6. **时间安排**（"您计划什么时候开始办理？"）

### 收集技巧
- 不要一次问太多，每次只问1-2个问题
- 先解答客户的问题，再自然过渡到收集信息
- 例如：客户问完工作签条件后，你可以说"这些条件您基本都符合呢！方便留个联系方式吗？我们的顾问可以帮您做详细评估"
- 客户如果不愿意给信息，不要强求，继续提供价值
- 当客户给了手机号或微信号后，追问预算和时间安排

### 何时输出完成标记
当你收集到以下信息中的至少3项时（必须包含联系方式）：
- 姓名 + 联系方式 + 服务意向

在回复末尾加上标记：[LEAD_COMPLETE]
然后在标记前面说："太好了！我已经把您的信息记录下来了，我们的专业顾问会在24小时内联系您，为您做详细的方案评估。期待与您沟通！"

## 回复规则
- 语气：专业但亲切，像一位靠谱的朋友在给建议
- 简洁：回复控制在3-5句话，不要长篇大论
- 诚实：不确定的信息不要编造
- 中文回复`;

var SYSTEM_PROMPT_ASSESS = `你是「星途 LumiPath」的AI测评顾问。星途是一家AI赋能的跨境全链路服务机构。

## 你的核心任务
通过互动对话为客户提供免费测评，了解客户背景和需求，推荐最合适的跨境发展路径，同时收集客户联系方式作为销售线索。

## 测评流程
1. 先问客户的目标（出国工作/留学/移民/AI就业）
2. 根据目标问2-3个背景问题
3. 基于回答给出初步评估和建议
4. 引导客户留联系方式获取详细报告

## 线索收集
在测评过程中自然收集：
1. 怎么称呼您（姓名）
2. 手机号或微信号（最重要！）
3. 测评方向
4. 目标国家
5. 预算范围
6. 时间安排

### 收集技巧
- 测评完成后说："根据您的情况，我建议可以考虑XXX路径。如果您想获取更详细的定制方案，方便留个手机号或微信吗？"
- 当收集到姓名+联系方式+测评方向后，在回复末尾加 [LEAD_COMPLETE]

## 回复规则
- 语气：专业、鼓励、有洞察
- 每次只问1-2个问题
- 中文回复，简洁3-5句`;

// ========== CORS ==========
var corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// ========== 主处理 ==========
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    var url = new URL(request.url);

    // 表单提交接口
    if (url.pathname === '/form-submit' && request.method === 'POST') {
      return handleFormSubmit(request, env);
    }

    // 线索提取接口
    if (url.pathname === '/lead' && request.method === 'POST') {
      return handleLead(request, env);
    }

    // 健康检查
    if (url.pathname === '/health') {
      return new Response('OK', { headers: corsHeaders });
    }

    // 聊天接口
    if (request.method === 'POST') {
      return handleChat(request, env);
    }

    return new Response('LumiPath Chat Worker v3', { headers: corsHeaders });
  }
};

// ========== 表单提交处理 ==========
async function handleFormSubmit(request, env) {
  try {
    var body = await request.json();
    var source = body.source || '网站表单';

    // 构建飞书多维表格记录字段
    var fields = {};

    if (body.name) fields['客户姓名'] = body.name;
    if (body.phone) fields['联系方式'] = body.phone;
    if (body.wechat) fields['微信号'] = body.wechat;
    
    // 意向服务（多选）
    if (body.service) {
      var services = body.service.split(',').filter(function(s) { return s.trim(); });
      if (services.length > 0) {
        fields['意向服务'] = services;
      }
    }
    
    if (body.country) fields['目标国家'] = body.country;
    
    // 预算范围（单选）
    if (body.budget) fields['预算范围'] = body.budget;
    
    if (body.timeline) fields['时间线'] = body.timeline;
    if (body.description) fields['需求描述'] = body.description;
    
    // 来源（单选）
    var sourceOption = source === '免费测评' ? '免费测评' : '网站咨询';
    fields['来源'] = sourceOption;
    
    // 线索状态
    fields['线索状态'] = '新线索';

    // 完整对话记录
    if (body.conversation) {
      fields['完整对话记录'] = body.conversation;
    }

    // 客户标签
    if (body.tags) {
      fields['客户标签'] = body.tags;
    }

    var lead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
      timestamp: new Date().toISOString(),
      source: source,
      fields: fields
    };

    var results = { ok: true, lead: { id: lead.id, timestamp: lead.timestamp } };

    // 1. 写入飞书多维表格
    if (env.FEISHU_APP_ID && env.FEISHU_APP_SECRET) {
      try {
        var feishuResult = await writeFeishuBase(env, fields);
        results.feishu = feishuResult;
      } catch (e) {
        results.feishu_error = e.message;
      }
    }

    // 2. 存储到 KV
    if (env.LEADS) {
      await env.LEADS.put(lead.id, JSON.stringify(lead));
      var indexRaw = await env.LEADS.get('_index');
      var index = indexRaw ? JSON.parse(indexRaw) : [];
      index.push({ id: lead.id, timestamp: lead.timestamp, name: body.name || '', phone: body.phone || '', source: source });
      await env.LEADS.put('_index', JSON.stringify(index));
    }

    // 3. 发送飞书通知
    if (env.FEISHU_WEBHOOK_URL) {
      await sendFeishuNotification(env.FEISHU_WEBHOOK_URL, {
        name: body.name || '未提供',
        phone: body.phone || '未提供',
        wechat: body.wechat || '未提供',
        service: body.service || '未提供',
        country: body.country || '未提供',
        budget: body.budget || '未提供',
        timeline: body.timeline || '未提供',
        description: body.description || '',
        source: source
      });
    }

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// ========== 飞书多维表格写入 ==========
async function writeFeishuBase(env, fields) {
  // 1. 获取 tenant_access_token
  var tokenResp = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: env.FEISHU_APP_ID,
      app_secret: env.FEISHU_APP_SECRET
    })
  });

  if (!tokenResp.ok) {
    throw new Error('飞书token获取失败: HTTP ' + tokenResp.status);
  }

  var tokenData = await tokenResp.json();
  if (tokenData.code !== 0) {
    throw new Error('飞书token获取失败: ' + tokenData.msg);
  }

  var accessToken = tokenData.tenant_access_token;

  // 2. 创建记录
  var recordResp = await fetch(
    'https://open.feishu.cn/open-apis/bitable/v1/apps/' + FEISHU_BASE_TOKEN + '/tables/' + FEISHU_TABLE_ID + '/records',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify({ fields: fields })
    }
  );

  if (!recordResp.ok) {
    var errText = await recordResp.text();
    throw new Error('飞书记录创建失败: HTTP ' + recordResp.status + ' ' + errText);
  }

  var recordData = await recordResp.json();
  if (recordData.code !== 0) {
    throw new Error('飞书记录创建失败: ' + recordData.msg);
  }

  return { ok: true, record_id: recordData.data.record.record_id };
}

// ========== 聊天处理 ==========
async function handleChat(request, env) {
  try {
    var body = await request.json();
    var message = body.message || '';
    var history = body.history || [];
    var mode = body.mode || 'consult';

    var systemPrompt = mode === 'assess' ? SYSTEM_PROMPT_ASSESS : SYSTEM_PROMPT_CONSULT;

    var apiMessages = [{ role: 'system', content: systemPrompt }];
    for (var i = 0; i < history.length; i++) {
      apiMessages.push({
        role: history[i].role === 'user' ? 'user' : 'assistant',
        content: history[i].content
      });
    }
    apiMessages.push({ role: 'user', content: message });

    if (env.DEEPSEEK_API_KEY) {
      return await callDeepSeek(apiMessages, env.DEEPSEEK_API_KEY);
    }
    if (env.AI) {
      return await callCloudflareAI(apiMessages, env);
    }

    return new Response('AI服务未配置。请在Worker设置中添加DEEPSEEK_API_KEY。', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders }
    });
  } catch (err) {
    return new Response('错误: ' + err.message, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders }
    });
  }
}

// ========== 线索提取处理 ==========
async function handleLead(request, env) {
  try {
    var body = await request.json();
    var history = body.history || [];
    var source = body.source || '网站咨询';

    var extractPrompt = '从以下对话中提取客户信息，返回JSON格式（只返回JSON，不要其他文字）。\n';
    extractPrompt += '字段：name(姓名), phone(手机号), wechat(微信号), service(意向服务，多个用逗号分隔), country(目标国家), budget(预算范围), timeline(时间安排), description(需求描述), tags(客户画像标签)\n';
    extractPrompt += '无法提取的字段留空字符串。\n\n对话内容：\n';

    for (var i = 0; i < history.length; i++) {
      extractPrompt += (history[i].role === 'user' ? '客户' : '顾问') + ': ' + history[i].content + '\n';
    }

    var leadData = null;

    if (env.DEEPSEEK_API_KEY) {
      try {
        var resp = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + env.DEEPSEEK_API_KEY
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: '你是一个信息提取助手。从对话中提取结构化数据，只返回JSON，不要其他文字。' },
              { role: 'user', content: extractPrompt }
            ],
            temperature: 0.1,
            max_tokens: 512
          })
        });

        if (resp.ok) {
          var result = await resp.json();
          var content = result.choices[0].message.content.trim();
          content = content.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
          leadData = JSON.parse(content);
        }
      } catch (e) { }
    }

    if (!leadData) {
      leadData = {
        name: '', phone: '', wechat: '', service: '', country: '', budget: '', timeline: '',
        description: history.map(function(m) { return (m.role === 'user' ? '客户' : '顾问') + ': ' + m.content; }).join('\n'),
        tags: ''
      };
    }

    // 构建飞书记录字段
    var fields = {};
    if (leadData.name) fields['客户姓名'] = leadData.name;
    if (leadData.phone) fields['联系方式'] = leadData.phone;
    if (leadData.wechat) fields['微信号'] = leadData.wechat;
    if (leadData.service) {
      var services = leadData.service.split(',').filter(function(s) { return s.trim(); });
      if (services.length > 0) fields['意向服务'] = services;
    }
    if (leadData.country) fields['目标国家'] = leadData.country;
    if (leadData.budget) fields['预算范围'] = leadData.budget;
    if (leadData.timeline) fields['时间线'] = leadData.timeline;
    if (leadData.description) fields['需求描述'] = leadData.description;
    if (leadData.tags) fields['客户标签'] = leadData.tags;
    
    var sourceOption = source === '免费测评' ? '免费测评' : '网站咨询';
    fields['来源'] = sourceOption;
    fields['线索状态'] = '新线索';
    fields['完整对话记录'] = history.map(function(m) { return (m.role === 'user' ? '客户' : '顾问') + ': ' + m.content; }).join('\n');

    var lead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
      timestamp: new Date().toISOString(),
      source: source,
      fields: fields
    };

    // 1. 写入飞书多维表格
    if (env.FEISHU_APP_ID && env.FEISHU_APP_SECRET) {
      try {
        await writeFeishuBase(env, fields);
      } catch (e) { }
    }

    // 2. 存储到 KV
    if (env.LEADS) {
      await env.LEADS.put(lead.id, JSON.stringify(lead));
      var indexRaw = await env.LEADS.get('_index');
      var index = indexRaw ? JSON.parse(indexRaw) : [];
      index.push({ id: lead.id, timestamp: lead.timestamp, name: leadData.name || '', phone: leadData.phone || '', source: source });
      await env.LEADS.put('_index', JSON.stringify(index));
    }

    // 3. 发送飞书通知
    if (env.FEISHU_WEBHOOK_URL) {
      await sendFeishuNotification(env.FEISHU_WEBHOOK_URL, {
        name: leadData.name || '未提供',
        phone: leadData.phone || '未提供',
        wechat: leadData.wechat || '未提供',
        service: leadData.service || '未提供',
        country: leadData.country || '未提供',
        budget: leadData.budget || '未提供',
        timeline: leadData.timeline || '未提供',
        description: leadData.description || '见对话记录',
        source: source
      });
    }

    return new Response(JSON.stringify({ ok: true, lead: lead }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// ========== 飞书通知 ==========
async function sendFeishuNotification(webhookUrl, lead) {
  var lines = [
    '**姓名:** ' + lead.name,
    '**联系方式:** ' + lead.phone,
    '**微信号:** ' + (lead.wechat || '未提供'),
    '**意向服务:** ' + lead.service,
    '**目标国家:** ' + lead.country,
    '**预算范围:** ' + lead.budget,
    '**时间安排:** ' + lead.timeline,
    '**来源:** ' + lead.source
  ];

  var content = lines.join('\n');

  var message = {
    msg_type: 'interactive',
    card: {
      header: {
        title: { tag: 'plain_text', content: '🌟 新客户线索 - ' + (lead.name !== '未提供' ? lead.name : '未署名') },
        template: 'gold'
      },
      elements: [
        { tag: 'div', text: { tag: 'lark_md', content: content } },
        { tag: 'hr' },
        { tag: 'div', text: { tag: 'lark_md', content: '**需求描述:**\n' + (lead.description || '见对话记录') } },
        { tag: 'note', elements: [{ tag: 'plain_text', content: '⏰ ' + new Date().toLocaleString('zh-CN') }] }
      ]
    }
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  } catch (e) { }
}

// ========== DeepSeek API ==========
async function callDeepSeek(apiMessages, apiKey) {
  var response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: apiMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024
    })
  });

  if (!response.ok) {
    var errText = await response.text();
    return new Response('DeepSeek API错误: ' + errText, {
      status: response.status,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders }
    });
  }

  var { readable, writable } = new TransformStream();
  var writer = writable.getWriter();
  var encoder = new TextEncoder();
  var decoder = new TextDecoder();
  var buffer = '';

  (async () => {
    var reader = response.body.getReader();
    while (true) {
      var { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      var lines = buffer.split('\n');
      buffer = lines.pop();
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            var data = JSON.parse(line.slice(6));
            var content = data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content;
            if (content) {
              await writer.write(encoder.encode(content));
            }
          } catch (e) { }
        }
      }
    }
    writer.close();
  })();

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders }
  });
}

// ========== Cloudflare Workers AI（免费降级） ==========
async function callCloudflareAI(apiMessages, env) {
  var response = await env.AI.run('@cf/qwen/qwen1.5-14b-chat-awq', {
    messages: apiMessages,
    stream: true
  });
  return new Response(response, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders }
  });
}
