/**
 * 星途 LumiPath · OpenHex Agent Proxy Worker
 * 
 * 前端不暴露 API Key，所有 OpenHex API 调用通过此 Worker 代理。
 * 
 * 部署：
 *   npx wrangler deploy
 *   npx wrangler secret put OPENHEX_API_KEY
 *   npx wrangler secret put OPENHEX_AGENT_ID
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const API_BASE = 'https://api.openhex.tech/api/v2';
    const apiKey = env.OPENHEX_API_KEY || '';
    const agentId = env.OPENHEX_AGENT_ID || '';

    // POST /api/chat — send message (streaming SSE proxy)
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      const body = await request.json();
      const message = String(body.message || '').trim();
      if (!message || !apiKey || !agentId) {
        return new Response(JSON.stringify({ error: message ? '服务未配置' : '消息不能为空' }), {
          status: message ? 503 : 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }

      // Step 1: POST /conversations/send
      const payload = { message, agentId };
      if (body.conversationId) payload.conversationId = body.conversationId;

      const sendRes = await fetch(`${API_BASE}/conversations/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!sendRes.ok) {
        return new Response(JSON.stringify({ error: `Agent 服务异常 (${sendRes.status})` }), {
          status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }

      const sendData = await sendRes.json();
      const conversationId = sendData.conversationId;
      const userEventId = sendData.userEventId;

      // Step 2: Stream the reply via SSE, relay to client
      const streamUrl = `${API_BASE}/conversations/${conversationId}/stream` +
        (userEventId ? `?lastEventId=${encodeURIComponent(userEventId)}` : '?turns=1');

      const streamRes = await fetch(streamUrl, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });

      // Relay SSE stream to client
      const relayHeaders = { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' };
      return new Response(streamRes.body, { headers: relayHeaders });
    }

    // GET /api/stream/:conversationId — resume SSE stream
    const streamMatch = url.pathname.match(/^\/api\/stream\/(.+)$/);
    if (streamMatch && request.method === 'GET') {
      const conversationId = streamMatch[1];
      const lastEventId = url.searchParams.get('lastEventId') || '';
      
      const qs = lastEventId ? `?lastEventId=${encodeURIComponent(lastEventId)}` : '?turns=1';
      const streamRes = await fetch(`${API_BASE}/conversations/${conversationId}/stream${qs}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });

      return new Response(streamRes.body, {
        headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      });
    }

    // Health check
    return new Response('星途 LumiPath Agent Proxy OK', {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  },
};
