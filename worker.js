/**
 * 星途 LumiPath · AI跨境规划顾问 · Cloudflare Worker
 * 
 * 部署步骤：
 * 1. 注册 Cloudflare 账号（免费）：https://dash.cloudflare.com/sign-up
 * 2. 进入 Workers & Pages → Create → Create Worker
 * 3. 把这个文件的内容粘贴进去 → Deploy
 * 4. 在 Settings → Variables 中添加：
 *    - DEEPSEEK_API_KEY = 你的 DeepSeek API Key（从 https://platform.deepseek.com 获取）
 *    （不设也能用，会降级到 Cloudflare 免费 AI 模型）
 * 5. 复制 Worker URL（如 https://lumipath-chat.xxx.workers.dev）
 * 6. 在 chat-widget.js 中把 apiEndpoint 设为这个 URL
 * 
 * DeepSeek API：注册即送 500 万 token 免费额度，之后 ¥1/百万 token，极便宜
 */

// ========== 系统提示词（星途业务知识库）==========
var SYSTEM_PROMPT = `你是「星途 LumiPath」的AI跨境规划顾问。星途是一家AI赋能的跨境全链路服务机构，由盈西创立。

## 你的职责
- 在线咨询：解答客户关于出国工作、留学、旅游、移民、AI就业的问题
- 客户筛选：通过对话了解客户背景、需求、预算，进行初步分层
- 方案推荐：根据客户情况推荐合适的服务和路径
- 引导转化：引导感兴趣的客户添加顾问微信/飞书进行深度咨询

## 五大业务板块

### 1. 留学（主力业务）
- 低龄升学：中外联合办学/非应试路径，冲全球前300名校
- 核心卖点：新加坡PSB学院跳板→直通英澳名校（QS前300），如悉尼科技大学（QS排名前100）
- 适合成绩不理想但想上名校的学生，通过新加坡1-2年过渡后转入英澳大学
- 综合留学：中高端家庭，定制升学规划

### 2. 跨境旅游（同时接）
- 双向：国人出境游 + 海外游客来华
- 避免跟团强制消费，提供自由行规划

### 3. AI转岗就业（同时接）
- 体系化课程 + 内推 + 实战项目
- 帮助快速拿到AI相关岗位offer

### 4. 出国工作（后续叠加）
- 澳洲/英国/欧洲/马来西亚合法工作签
- 43岁以内，8年+社保
- 合法合规，非黑中介

### 5. 留学移民（后续叠加）
- 中高端家庭，合法合规拿签证/绿卡

## 定价模型
- 9.9元：AI测评（引流）
- 299-999元：定制咨询
- 1万-15万+：全流程代办
- 199元/年：基础会员
- 1999元/年：高级会员

## 回复规则
- 语气：专业但亲切，像一位靠谱的朋友在给建议，不要客服腔
- 先理解需求：问清客户的基本情况（目标国家、预算、时间线、个人背景）
- 再给建议：基于客户情况给出初步方向，不要一上来就推销
- 主动引导：对话自然推进后，引导客户添加顾问微信获取定制方案
- 诚实：不确定的信息不要编造，告诉客户"具体情况需要顾问评估后给出准确方案"
- 简洁：回复控制在3-5句话，不要长篇大论
- 中文回复`;

// ========== CORS 头 ==========
var corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// ========== 主处理函数 ==========
export default {
  async fetch(request, env) {
    // 处理 CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    try {
      var body = await request.json();
      var message = body.message || '';
      var history = body.history || [];

      // 构建消息列表
      var apiMessages = [{ role: 'system', content: SYSTEM_PROMPT }];
      for (var i = 0; i < history.length; i++) {
        apiMessages.push({
          role: history[i].role === 'user' ? 'user' : 'assistant',
          content: history[i].content
        });
      }
      apiMessages.push({ role: 'user', content: message });

      // 优先使用 DeepSeek API（质量更好）
      if (env.DEEPSEEK_API_KEY) {
        return await callDeepSeek(apiMessages, env.DEEPSEEK_API_KEY);
      }

      // 降级到 Cloudflare Workers AI（免费）
      if (env.AI) {
        return await callCloudflareAI(apiMessages, env);
      }

      // 都没有配置
      return new Response(
        'AI服务未配置。请在Cloudflare Worker设置中添加DEEPSEEK_API_KEY变量。',
        { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders } }
      );

    } catch (err) {
      return new Response('服务器错误: ' + err.message, {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders }
      });
    }
  }
};

// ========== DeepSeek API（推荐，质量最好） ==========
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

  // 转换 SSE 流为纯文本流
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
          } catch (e) { /* skip parse errors */ }
        }
      }
    }
    writer.close();
  })();

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders }
  });
}

// ========== Cloudflare Workers AI（免费降级方案） ==========
async function callCloudflareAI(apiMessages, env) {
  var response = await env.AI.run('@cf/qwen/qwen1.5-14b-chat-awq', {
    messages: apiMessages,
    stream: true
  });

  // Cloudflare AI 返回的已经是 ReadableStream
  return new Response(response, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders }
  });
}
