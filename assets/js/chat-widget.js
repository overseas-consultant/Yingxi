/**
 * 星途 LumiPath · AI跨境规划顾问 · 聊天组件 v2
 * 自包含聊天 UI + 流式 AI 回复 + 智能线索收集
 * 无第三方依赖
 */
(function () {
  'use strict';

  // ========== 配置 ==========
  var CONFIG = {
    // 部署 Cloudflare Worker 后，把 URL 填到这里
    apiEndpoint: '',
    logoUrl: 'https://overseas-consultant.github.io/Yingxi/assets/images/logo.png',
    fallbackQR: 'https://overseas-consultant.github.io/Yingxi/assets/images/consultation-qr.png',
    // 线索收集完成标记
    leadMarker: '[LEAD_COMPLETE]',
    // 两种模式的配置
    modes: {
      consult: {
        title: '星途 LumiPath 跨境规划顾问',
        subtitle: 'AI智能对话 · 7×24小时在线',
        welcome: '您好！我是星途LumiPath的AI跨境规划顾问 🌟\n\n可以为您解答出国工作、留学升学、跨境旅游、移民、AI就业等方面的问题。\n\n请问您想咨询哪方面？可以直接打字，或点击下方快捷入口。',
        quickReplies: [
          { text: '出国工作签', value: '我想了解出国工作签证，有什么条件？' },
          { text: '低龄升学', value: '我想了解低龄升学路径，不走高考能上名校吗？' },
          { text: '跨境旅游', value: '我想了解跨境旅游服务' },
          { text: '留学移民', value: '我想了解留学移民方案和费用' },
          { text: 'AI转岗就业', value: '我想了解AI转岗课程和内推' },
          { text: '费用咨询', value: '各项服务大概费用是多少？' }
        ]
      },
      assess: {
        title: '星途 LumiPath 免费测评',
        subtitle: 'AI智能测评 · 1分钟出结果',
        welcome: '您好！欢迎来到星途LumiPath免费测评中心 🎯\n\n我将通过几个问题了解您的背景和需求，为您推荐最合适的跨境发展路径。\n\n请问您怎么称呼？',
        quickReplies: [
          { text: '想出国工作', value: '我想出国工作，帮我测评一下适合哪个国家' },
          { text: '想出国留学', value: '我想出国留学，帮我测评一下适合什么学校' },
          { text: '想移民', value: '我想了解移民路径，帮我测评一下' },
          { text: '想转行AI', value: '我想转行AI方向，帮我测评一下适合什么岗位' }
        ]
      }
    }
  };

  // ========== 状态 ==========
  var messages = [];
  var isWaiting = false;
  var isLeadSubmitted = false;
  var currentMode = 'consult';
  var modal = null;
  var messagesContainer = null;
  var inputElement = null;
  var sendButton = null;
  var quickBar = null;

  // ========== 创建模态框 ==========
  function createModal() {
    if (modal) return modal;

    var overlay = document.createElement('div');
    overlay.className = 'lumipath-chat-overlay';
    overlay.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'width:100%', 'height:100%',
      'background:rgba(0,0,0,0.6)', 'z-index:99999',
      'display:none', 'align-items:center', 'justify-content:center',
      'backdrop-filter:blur(4px)', '-webkit-backdrop-filter:blur(4px)'
    ].join(';');

    var dialog = document.createElement('div');
    dialog.className = 'lumipath-chat-dialog';
    dialog.style.cssText = [
      'width:100%', 'max-width:420px', 'height:85vh', 'max-height:680px',
      'background:#0a1628', 'border-radius:16px', 'overflow:hidden',
      'display:flex', 'flex-direction:column',
      'box-shadow:0 8px 32px rgba(0,0,0,0.4)',
      'border:1px solid rgba(212,175,55,0.2)'
    ].join(';');

    // ---- 头部 ----
    var header = document.createElement('div');
    header.style.cssText = [
      'background:#0d1f35', 'padding:12px 16px', 'display:flex',
      'align-items:center', 'gap:10px', 'flex-shrink:0',
      'border-bottom:1px solid rgba(212,175,55,0.15)'
    ].join(';');

    var logoWrap = document.createElement('div');
    logoWrap.style.cssText = 'width:36px;height:36px;border-radius:10px;overflow:hidden;flex-shrink:0;background:#d4af37';
    var logoImg = document.createElement('img');
    logoImg.src = CONFIG.logoUrl;
    logoImg.style.cssText = 'width:100%;height:100%;object-fit:cover';
    logoImg.onerror = function () { logoWrap.style.display = 'none'; };
    logoWrap.appendChild(logoImg);

    var titleWrap = document.createElement('div');
    titleWrap.style.cssText = 'flex:1;min-width:0';
    var title = document.createElement('div');
    title.id = 'lumipath-chat-title';
    title.style.cssText = 'color:#fff;font-weight:600;font-size:.92rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    var subtitle = document.createElement('div');
    subtitle.id = 'lumipath-chat-subtitle';
    subtitle.style.cssText = 'color:#8a9bb5;font-size:.72rem;margin-top:2px';
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    var statusDot = document.createElement('div');
    statusDot.style.cssText = 'display:flex;align-items:center;gap:4px;color:#4ade80;font-size:.7rem;flex-shrink:0';
    var dot = document.createElement('span');
    dot.style.cssText = 'width:7px;height:7px;background:#4ade80;border-radius:50%;animation:lumipath-pulse 2s infinite';
    statusDot.appendChild(dot);
    statusDot.appendChild(document.createTextNode('在线'));

    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = [
      'background:none', 'border:none', 'color:#8a9bb5', 'font-size:22px',
      'cursor:pointer', 'padding:0 4px', 'line-height:1', 'flex-shrink:0',
      'transition:color .2s'
    ].join(';');
    closeBtn.onmouseenter = function () { closeBtn.style.color = '#fff'; };
    closeBtn.onmouseleave = function () { closeBtn.style.color = '#8a9bb5'; };
    closeBtn.onclick = hideModal;

    header.appendChild(logoWrap);
    header.appendChild(titleWrap);
    header.appendChild(statusDot);
    header.appendChild(closeBtn);

    // ---- 消息区域 ----
    messagesContainer = document.createElement('div');
    messagesContainer.className = 'lumipath-chat-messages';
    messagesContainer.style.cssText = [
      'flex:1', 'overflow-y:auto', 'padding:16px', 'display:flex',
      'flex-direction:column', 'gap:12px',
      'scrollbar-width:thin', 'scrollbar-color:#1a2a42 transparent'
    ].join(';');
    var style = document.createElement('style');
    style.textContent = [
      '.lumipath-chat-messages::-webkit-scrollbar{width:5px}',
      '.lumipath-chat-messages::-webkit-scrollbar-track{background:transparent}',
      '.lumipath-chat-messages::-webkit-scrollbar-thumb{background:#1a2a42;border-radius:3px}',
      '@keyframes lumipath-pulse{0%,100%{opacity:1}50%{opacity:.4}}',
      '@keyframes lumipath-bounce{0%,80%,100%{transform:scale(0.6);opacity:.4}40%{transform:scale(1);opacity:1}}',
      '@keyframes lumipath-fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}'
    ].join('\n');
    document.head.appendChild(style);

    // ---- 快捷回复 ----
    quickBar = document.createElement('div');
    quickBar.style.cssText = [
      'display:flex', 'gap:8px', 'padding:8px 12px', 'overflow-x:auto',
      'flex-shrink:0', 'border-top:1px solid rgba(255,255,255,0.05)',
      'background:#0d1f35', 'scrollbar-width:none'
    ].join(';');
    quickBar.className = 'lumipath-quick-bar';
    var quickStyle = document.createElement('style');
    quickStyle.textContent = '.lumipath-quick-bar::-webkit-scrollbar{display:none}';
    document.head.appendChild(quickStyle);

    // ---- 输入区域 ----
    var inputBar = document.createElement('div');
    inputBar.style.cssText = [
      'display:flex', 'gap:8px', 'padding:10px 12px', 'flex-shrink:0',
      'background:#0d1f35', 'border-top:1px solid rgba(255,255,255,0.05)'
    ].join(';');

    inputElement = document.createElement('textarea');
    inputElement.placeholder = '输入您的问题...';
    inputElement.rows = 1;
    inputElement.style.cssText = [
      'flex:1', 'background:#0a1628', 'border:1px solid rgba(255,255,255,0.1)',
      'border-radius:10px', 'padding:10px 14px', 'color:#e0e6f0',
      'font-size:.85rem', 'resize:none', 'outline:none',
      'font-family:inherit', 'max-height:80px', 'line-height:1.5',
      'transition:border-color .2s'
    ].join(';');
    inputElement.onfocus = function () { inputElement.style.borderColor = 'rgba(212,175,55,0.5)'; };
    inputElement.onblur = function () { inputElement.style.borderColor = 'rgba(255,255,255,0.1)'; };
    inputElement.oninput = function () {
      inputElement.style.height = 'auto';
      inputElement.style.height = Math.min(inputElement.scrollHeight, 80) + 'px';
    };
    inputElement.onkeydown = function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    sendButton = document.createElement('button');
    sendButton.textContent = '发送';
    sendButton.style.cssText = [
      'flex-shrink:0', 'padding:0 20px', 'border:none', 'border-radius:10px',
      'background:linear-gradient(135deg,#d4af37,#b8941f)', 'color:#0a1628',
      'font-weight:600', 'font-size:.85rem', 'cursor:pointer',
      'transition:opacity .2s'
    ].join(';');
    sendButton.onclick = handleSend;

    inputBar.appendChild(inputElement);
    inputBar.appendChild(sendButton);

    // ---- 组装 ----
    dialog.appendChild(header);
    dialog.appendChild(messagesContainer);
    dialog.appendChild(quickBar);
    dialog.appendChild(inputBar);
    overlay.appendChild(dialog);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hideModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
        hideModal();
      }
    });

    document.body.appendChild(overlay);
    modal = overlay;
    return modal;
  }

  // ========== 设置模式 ==========
  function setMode(mode) {
    currentMode = mode || 'consult';
    var modeConfig = CONFIG.modes[currentMode] || CONFIG.modes.consult;

    // 更新标题
    var titleEl = document.getElementById('lumipath-chat-title');
    var subtitleEl = document.getElementById('lumipath-chat-subtitle');
    if (titleEl) titleEl.textContent = modeConfig.title;
    if (subtitleEl) subtitleEl.textContent = modeConfig.subtitle;

    // 清空消息
    messages = [];
    isLeadSubmitted = false;
    if (messagesContainer) messagesContainer.innerHTML = '';

    // 添加欢迎消息
    appendMessage('ai', modeConfig.welcome);

    // 更新快捷回复
    renderQuickReplies(modeConfig.quickReplies);
  }

  function renderQuickReplies(replies) {
    if (!quickBar) return;
    quickBar.innerHTML = '';
    quickBar.style.display = 'flex';
    replies.forEach(function (item) {
      var btn = document.createElement('button');
      btn.textContent = item.text;
      btn.style.cssText = [
        'flex-shrink:0', 'padding:6px 14px', 'border-radius:20px',
        'border:1px solid rgba(212,175,55,0.3)', 'background:rgba(212,175,55,0.08)',
        'color:#d4af37', 'font-size:.75rem', 'cursor:pointer',
        'white-space:nowrap', 'transition:all .2s'
      ].join(';');
      btn.onmouseenter = function () {
        btn.style.background = 'rgba(212,175,55,0.2)';
        btn.style.borderColor = 'rgba(212,175,55,0.6)';
      };
      btn.onmouseleave = function () {
        btn.style.background = 'rgba(212,175,55,0.08)';
        btn.style.borderColor = 'rgba(212,175,55,0.3)';
      };
      btn.onclick = function () {
        sendMessage(item.value);
        quickBar.style.display = 'none';
      };
      quickBar.appendChild(btn);
    });
  }

  // ========== 显示/隐藏 ==========
  function showModal(mode) {
    createModal();
    setMode(mode || 'consult');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(function () { inputElement.focus(); }, 100);
  }

  function hideModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  // ========== 消息显示 ==========
  function appendMessage(role, content) {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;animation:lumipath-fadein .3s ease';
    var bubble = document.createElement('div');
    var isUser = role === 'user';
    if (isUser) {
      wrap.style.alignItems = 'flex-end';
      bubble.style.cssText = [
        'max-width:80%', 'padding:10px 14px', 'border-radius:14px 14px 4px 14px',
        'background:linear-gradient(135deg,#d4af37,#b8941f)', 'color:#0a1628',
        'font-size:.85rem', 'line-height:1.6', 'word-break:break-word', 'white-space:pre-wrap'
      ].join(';');
    } else {
      wrap.style.alignItems = 'flex-start';
      bubble.style.cssText = [
        'max-width:85%', 'padding:10px 14px', 'border-radius:14px 14px 14px 4px',
        'background:#1a2a42', 'color:#e0e6f0', 'font-size:.85rem',
        'line-height:1.6', 'word-break:break-word', 'white-space:pre-wrap'
      ].join(';');
    }
    bubble.textContent = content;
    wrap.appendChild(bubble);
    messagesContainer.appendChild(wrap);
    scrollToBottom();
    messages.push({ role: role, content: content });
    return bubble;
  }

  // ========== 流式消息 ==========
  function createStreamingBubble() {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;animation:lumipath-fadein .3s ease;align-items:flex-start';
    var bubble = document.createElement('div');
    bubble.style.cssText = [
      'max-width:85%', 'padding:10px 14px', 'border-radius:14px 14px 14px 4px',
      'background:#1a2a42', 'color:#e0e6f0', 'font-size:.85rem',
      'line-height:1.6', 'word-break:break-word', 'white-space:pre-wrap'
    ].join(';');
    var indicator = document.createElement('div');
    indicator.style.cssText = 'display:flex;gap:4px;padding:4px 0';
    for (var i = 0; i < 3; i++) {
      var dot = document.createElement('span');
      dot.style.cssText = 'width:7px;height:7px;background:#8a9bb5;border-radius:50%;animation:lumipath-bounce 1.4s infinite both;animation-delay:' + (i * 0.16) + 's';
      indicator.appendChild(dot);
    }
    bubble.appendChild(indicator);
    wrap.appendChild(bubble);
    messagesContainer.appendChild(wrap);
    scrollToBottom();
    var fullText = '';
    return {
      bubble: bubble,
      indicator: indicator,
      startStreaming: function () {
        if (bubble.contains(indicator)) bubble.removeChild(indicator);
        bubble.textContent = '';
        fullText = '';
      },
      append: function (text) {
        fullText += text;
        // 检查是否包含线索完成标记，如果有则不显示标记
        var displayText = fullText.replace(CONFIG.leadMarker, '');
        bubble.textContent = displayText;
        scrollToBottom();
      },
      done: function () {
        if (bubble.contains(indicator)) bubble.removeChild(indicator);
        var finalText = fullText.replace(CONFIG.leadMarker, '');
        messages.push({ role: 'ai', content: finalText });
        // 检查是否包含线索完成标记
        if (fullText.indexOf(CONFIG.leadMarker) !== -1 && !isLeadSubmitted) {
          submitLead();
        }
      }
    };
  }

  // ========== 提交线索 ==========
  function submitLead() {
    isLeadSubmitted = true;

    // 禁用输入
    inputElement.disabled = true;
    sendButton.disabled = true;
    sendButton.textContent = '已提交';
    sendButton.style.opacity = '0.6';

    // 显示提交中提示
    var statusWrap = document.createElement('div');
    statusWrap.style.cssText = 'display:flex;justify-content:center;padding:4px 0;animation:lumipath-fadein .3s ease';
    var statusBubble = document.createElement('div');
    statusBubble.style.cssText = 'background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:6px 16px;color:#d4af37;font-size:.75rem';
    statusBubble.textContent = '正在提交您的信息...';
    statusWrap.appendChild(statusBubble);
    messagesContainer.appendChild(statusWrap);
    scrollToBottom();

    // 准备对话历史
    var history = messages.map(function (m) {
      return { role: m.role === 'user' ? 'user' : 'assistant', content: m.content };
    });

    // 提交到 Worker 的 /lead 接口
    var apiUrl = CONFIG.apiEndpoint ? CONFIG.apiEndpoint.replace(/\/$/, '') + '/lead' : '';

    if (!apiUrl) {
      // 没有 API，显示二维码 fallback
      setTimeout(function () {
        statusBubble.textContent = '信息已记录';
        statusBubble.style.color = '#4ade80';
        statusBubble.style.borderColor = 'rgba(74,222,128,0.3)';
        showQRCode();
      }, 800);
      return;
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: history,
        source: currentMode === 'assess' ? '免费测评' : '网站咨询'
      })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      statusBubble.textContent = '✓ 信息已提交，顾问将在24小时内联系您';
      statusBubble.style.color = '#4ade80';
      statusBubble.style.borderColor = 'rgba(74,222,128,0.3)';
      showQRCode();
    }).catch(function (err) {
      statusBubble.textContent = '信息已记录，请扫码添加顾问微信';
      statusBubble.style.color = '#4ade80';
      showQRCode();
    });
  }

  // ========== 显示二维码 ==========
  function showQRCode() {
    var qrWrap = document.createElement('div');
    qrWrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 0;animation:lumipath-fadein .3s ease';
    var qrImg = document.createElement('img');
    qrImg.src = CONFIG.fallbackQR;
    qrImg.style.cssText = 'width:130px;height:130px;border-radius:12px;border:1px solid rgba(212,175,55,0.2)';
    qrImg.onerror = function () { qrWrap.style.display = 'none'; };
    var qrTip = document.createElement('div');
    qrTip.textContent = '扫码添加顾问微信，获取专属方案';
    qrTip.style.cssText = 'color:#8a9bb5;font-size:.72rem';
    qrWrap.appendChild(qrImg);
    qrWrap.appendChild(qrTip);
    messagesContainer.appendChild(qrWrap);
    scrollToBottom();
  }

  // ========== Fallback ==========
  function showFallback() {
    var stream = createStreamingBubble();
    setTimeout(function () {
      stream.startStreaming();
      var text = '感谢您的咨询！我是星途LumiPath的AI顾问，目前AI对话功能正在升级中。\n请扫描下方二维码添加顾问微信，获取一对一专业咨询 👇';
      var i = 0;
      var timer = setInterval(function () {
        if (i < text.length) {
          stream.append(text[i]);
          i++;
        } else {
          clearInterval(timer);
          stream.done();
          showQRCode();
          isWaiting = false;
          updateSendButton();
        }
      }, 30);
    }, 600);
  }

  // ========== 发送 ==========
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
    isWaiting = true;
    updateSendButton();
    appendMessage('user', text);

    if (!CONFIG.apiEndpoint) {
      showFallback();
      return;
    }

    var stream = createStreamingBubble();
    var history = messages.map(function (m) {
      return { role: m.role === 'user' ? 'user' : 'assistant', content: m.content };
    });

    fetch(CONFIG.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: history,
        mode: currentMode
      })
    }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var started = false;

      function read() {
        reader.read().then(function (result) {
          if (result.done) {
            stream.done();
            isWaiting = false;
            updateSendButton();
            return;
          }
          var chunk = decoder.decode(result.value, { stream: true });
          if (!started) {
            stream.startStreaming();
            started = true;
          }
          stream.append(chunk);
          read();
        }).catch(function (err) {
          if (!started) {
            stream.startStreaming();
            started = true;
          }
          stream.append('\n\n（连接中断，请稍后重试）');
          stream.done();
          isWaiting = false;
          updateSendButton();
        });
      }
      read();
    }).catch(function (err) {
      if (messagesContainer.contains(stream.bubble.parentElement)) {
        messagesContainer.removeChild(stream.bubble.parentElement);
      }
      showFallback();
    });
  }

  // ========== 辅助 ==========
  function scrollToBottom() {
    requestAnimationFrame(function () {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  function updateSendButton() {
    if (isLeadSubmitted) {
      sendButton.style.opacity = '0.6';
      sendButton.style.pointerEvents = 'none';
      sendButton.textContent = '已提交';
      return;
    }
    sendButton.style.opacity = isWaiting ? '0.5' : '1';
    sendButton.style.pointerEvents = isWaiting ? 'none' : 'auto';
    sendButton.textContent = isWaiting ? '回复中' : '发送';
    inputElement.disabled = false;
  }

  // ========== 暴露 API ==========
  window.LumiPathChat = {
    show: showModal,
    hide: hideModal,
    config: CONFIG
  };

  // ========== 自动绑定 ==========
  function init() {
    document.querySelectorAll('[data-action="consult"], [data-action="assess"]').forEach(function (btn) {
      btn.onclick = null;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var action = btn.getAttribute('data-action');
        showModal(action === 'assess' ? 'assess' : 'consult');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
