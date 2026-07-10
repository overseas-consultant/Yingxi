/**
 * 星途 LumiPath · AI跨境规划顾问 · 聊天+表单组件 v3
 * - 咨询模式：AI对话引导收集信息
 * - 测评模式：表单直收集信息
 * - 线索提交到Worker → 写入飞书多维表格CRM
 * - 无Worker时本地存储+引导
 */
(function () {
  'use strict';

  var CONFIG = {
    apiEndpoint: '',
    logoUrl: 'https://overseas-consultant.github.io/Yingxi/assets/images/logo.png',
    leadMarker: '[LEAD_COMPLETE]',
    // 飞书CRM配置（Worker会用到）
    feishuBaseToken: 'Ck0QbHqOmaR457sRnE1ckmvTn6d',
    feishuTableId: 'tblDJLF1SHgmSV2p',
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
      }
    }
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

  // ========== 创建模态框 ==========
  function createModal() {
    if (modal) return modal;
    var overlay = document.createElement('div');
    overlay.className = 'lumipath-chat-overlay';
    overlay.style.cssText = ['position:fixed','top:0','left:0','width:100%','height:100%','background:rgba(0,0,0,0.6)','z-index:99999','display:none','align-items:center','justify-content:center','backdrop-filter:blur(4px)','-webkit-backdrop-filter:blur(4px)'].join(';');
    var dialog = document.createElement('div');
    dialog.className = 'lumipath-chat-dialog';
    dialog.style.cssText = ['width:100%','max-width:440px','height:85vh','max-height:700px','background:#0a1628','border-radius:16px','overflow:hidden','display:flex','flex-direction:column','box-shadow:0 8px 32px rgba(0,0,0,0.4)','border:1px solid rgba(212,175,55,0.2)'].join(';');
    var header = createHeader();
    var bodyWrapper = document.createElement('div');
    bodyWrapper.style.cssText = 'flex:1;overflow:hidden;display:flex;flex-direction:column';
    messagesContainer = document.createElement('div');
    messagesContainer.className = 'lumipath-chat-messages';
    messagesContainer.style.cssText = ['flex:1','overflow-y:auto','padding:16px','display:flex','flex-direction:column','gap:12px','scrollbar-width:thin','scrollbar-color:#1a2a42 transparent'].join(';');
    var style = document.createElement('style');
    style.textContent = ['.lumipath-chat-messages::-webkit-scrollbar{width:5px}','.lumipath-chat-messages::-webkit-scrollbar-track{background:transparent}','.lumipath-chat-messages::-webkit-scrollbar-thumb{background:#1a2a42;border-radius:3px}','@keyframes lumipath-pulse{0%,100%{opacity:1}50%{opacity:.4}}','@keyframes lumipath-bounce{0%,80%,100%{transform:scale(0.6);opacity:.4}40%{transform:scale(1);opacity:1}}','@keyframes lumipath-fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}','.lumipath-form-input:focus{border-color:rgba(212,175,55,0.6)!important}','.lumipath-form-select:focus{border-color:rgba(212,175,55,0.6)!important}'].join('\n');
    document.head.appendChild(style);
    quickBar = document.createElement('div');
    quickBar.style.cssText = ['display:flex','gap:8px','padding:8px 12px','overflow-x:auto','flex-shrink:0','border-top:1px solid rgba(255,255,255,0.05)','background:#0d1f35','scrollbar-width:none'].join(';');
    var quickStyle = document.createElement('style');
    quickStyle.textContent = '.lumipath-quick-bar::-webkit-scrollbar{display:none}';
    document.head.appendChild(quickStyle);
    var inputBar = document.createElement('div');
    inputBar.style.cssText = ['display:flex','gap:8px','padding:10px 12px','flex-shrink:0','background:#0d1f35','border-top:1px solid rgba(255,255,255,0.05)'].join(';');
    inputElement = document.createElement('textarea');
    inputElement.placeholder = '输入您的问题...';
    inputElement.rows = 1;
    inputElement.style.cssText = ['flex:1','background:#0a1628','border:1px solid rgba(255,255,255,0.1)','border-radius:10px','padding:10px 14px','color:#e0e6f0','font-size:.85rem','resize:none','outline:none','font-family:inherit','max-height:80px','line-height:1.5','transition:border-color .2s'].join(';');
    inputElement.onfocus = function(){inputElement.style.borderColor='rgba(212,175,55,0.5)'};
    inputElement.onblur = function(){inputElement.style.borderColor='rgba(255,255,255,0.1)'};
    inputElement.oninput = function(){inputElement.style.height='auto';inputElement.style.height=Math.min(inputElement.scrollHeight,80)+'px'};
    inputElement.onkeydown = function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleSend()}};
    sendButton = document.createElement('button');
    sendButton.textContent = '发送';
    sendButton.style.cssText = ['flex-shrink:0','padding:0 20px','border:none','border-radius:10px','background:linear-gradient(135deg,#d4af37,#b8941f)','color:#0a1628','font-weight:600','font-size:.85rem','cursor:pointer','transition:opacity .2s'].join(';');
    sendButton.onclick = handleSend;
    inputBar.appendChild(inputElement);
    inputBar.appendChild(sendButton);
    bodyWrapper.appendChild(messagesContainer);
    bodyWrapper.appendChild(quickBar);
    bodyWrapper.appendChild(inputBar);
    dialog.appendChild(header);
    dialog.appendChild(bodyWrapper);
    overlay.appendChild(dialog);
    overlay.addEventListener('click', function(e){if(e.target===overlay)hideModal()});
    document.addEventListener('keydown', function(e){if(e.key==='Escape'&&modal&&modal.style.display==='flex')hideModal()});
    document.body.appendChild(overlay);
    modal = overlay;
    return modal;
  }

  function createHeader() {
    var header = document.createElement('div');
    header.style.cssText = ['background:#0d1f35','padding:12px 16px','display:flex','align-items:center','gap:10px','flex-shrink:0','border-bottom:1px solid rgba(212,175,55,0.15)'].join(';');
    var logoWrap = document.createElement('div');
    logoWrap.style.cssText = 'width:36px;height:36px;border-radius:10px;overflow:hidden;flex-shrink:0;background:#d4af37';
    var logoImg = document.createElement('img');
    logoImg.src = CONFIG.logoUrl;
    logoImg.style.cssText = 'width:100%;height:100%;object-fit:cover';
    logoImg.onerror = function(){logoWrap.style.display='none'};
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
    closeBtn.style.cssText = ['background:none','border:none','color:#8a9bb5','font-size:22px','cursor:pointer','padding:0 4px','line-height:1','flex-shrink:0','transition:color .2s'].join(';');
    closeBtn.onmouseenter = function(){closeBtn.style.color='#fff'};
    closeBtn.onmouseleave = function(){closeBtn.style.color='#8a9bb5'};
    closeBtn.onclick = hideModal;
    header.appendChild(logoWrap);
    header.appendChild(titleWrap);
    header.appendChild(statusDot);
    header.appendChild(closeBtn);
    return header;
  }

  // ========== 咨询模式 ==========
  function setConsultMode() {
    currentMode = 'consult';
    var modeConfig = CONFIG.modes.consult;
    var titleEl = document.getElementById('lumipath-chat-title');
    var subtitleEl = document.getElementById('lumipath-chat-subtitle');
    if (titleEl) titleEl.textContent = modeConfig.title;
    if (subtitleEl) subtitleEl.textContent = modeConfig.subtitle;
    // 显示聊天UI，隐藏表单UI
    messagesContainer.style.display = '';
    quickBar.style.display = 'flex';
    var inputBar = quickBar.nextElementSibling;
    if (inputBar) inputBar.style.display = 'flex';
    messages = [];
    isLeadSubmitted = false;
    messagesContainer.innerHTML = '';
    appendMessage('ai', modeConfig.welcome);
    renderQuickReplies(modeConfig.quickReplies);
    updateSendButton();
  }

  function renderQuickReplies(replies) {
    if (!quickBar) return;
    quickBar.innerHTML = '';
    quickBar.style.display = 'flex';
    replies.forEach(function(item) {
      var btn = document.createElement('button');
      btn.textContent = item.text;
      btn.style.cssText = ['flex-shrink:0','padding:6px 14px','border-radius:20px','border:1px solid rgba(212,175,55,0.3)','background:rgba(212,175,55,0.08)','color:#d4af37','font-size:.75rem','cursor:pointer','white-space:nowrap','transition:all .2s'].join(';');
      btn.onmouseenter = function(){btn.style.background='rgba(212,175,55,0.2)';btn.style.borderColor='rgba(212,175,55,0.6)'};
      btn.onmouseleave = function(){btn.style.background='rgba(212,175,55,0.08)';btn.style.borderColor='rgba(212,175,55,0.3)'};
      btn.onclick = function(){sendMessage(item.value);quickBar.style.display='none'};
      quickBar.appendChild(btn);
    });
  }

  // ========== 测评模式（表单） ==========
  function setAssessMode() {
    currentMode = 'assess';
    var titleEl = document.getElementById('lumipath-chat-title');
    var subtitleEl = document.getElementById('lumipath-chat-subtitle');
    if (titleEl) titleEl.textContent = '星途 LumiPath 免费测评';
    if (subtitleEl) subtitleEl.textContent = '填写信息 · 24小时内出定制方案';
    // 隐藏聊天UI
    quickBar.style.display = 'none';
    var inputBar = quickBar.nextElementSibling;
    if (inputBar) inputBar.style.display = 'none';
    messagesContainer.innerHTML = '';
    messagesContainer.style.display = '';
    renderAssessForm();
  }

  function renderAssessForm() {
    var formWrap = document.createElement('div');
    formWrap.style.cssText = 'animation:lumipath-fadein .3s ease;padding:4px 0';

    var intro = document.createElement('div');
    intro.style.cssText = 'background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.2);border-radius:12px;padding:14px;margin-bottom:16px';
    intro.innerHTML = '<div style="color:#d4af37;font-weight:600;font-size:.9rem;margin-bottom:6px">🎯 免费测评 · 定制您的专属方案</div><div style="color:#8a9bb5;font-size:.78rem;line-height:1.6">填写以下信息，我们的专业顾问将在24小时内联系您，提供一对一深度评估和定制方案。全程免费，无隐形消费。</div>';
    formWrap.appendChild(intro);

    var fields = [
      { name: 'name', label: '姓名', type: 'text', placeholder: '请填写您的真实姓名', required: true },
      { name: 'phone', label: '手机号', type: 'tel', placeholder: '方便顾问联系您', required: true },
      { name: 'wechat', label: '微信号', type: 'text', placeholder: '选填', required: false },
      { name: 'service', label: '意向服务', type: 'select', required: true, options: ['出国工作','低龄升学','跨境旅游','留学移民','AI转岗就业'], multiple: true },
      { name: 'country', label: '目标国家', type: 'text', placeholder: '如澳洲、英国、新加坡等', required: false },
      { name: 'budget', label: '预算范围', type: 'select', required: false, options: ['9.9元测评','299-999咨询','1-5万','5-15万','15万+','未明确'], multiple: false },
      { name: 'timeline', label: '计划时间', type: 'text', placeholder: '您计划什么时候开始办理？', required: false },
      { name: 'description', label: '需求描述', type: 'textarea', placeholder: '请简单描述您的需求和背景情况', required: false }
    ];

    fields.forEach(function(field) {
      var fieldWrap = document.createElement('div');
      fieldWrap.style.cssText = 'margin-bottom:14px';
      var label = document.createElement('label');
      label.style.cssText = 'display:block;color:#e0e6f0;font-size:.82rem;margin-bottom:6px;font-weight:500';
      label.textContent = field.label + (field.required ? ' *' : '');
      fieldWrap.appendChild(label);

      var input;
      if (field.type === 'select') {
        if (field.multiple) {
          // 多选：checkbox组
          var checkboxGroup = document.createElement('div');
          checkboxGroup.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px';
          field.options.forEach(function(opt) {
            var chip = document.createElement('label');
            chip.style.cssText = 'display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:20px;border:1px solid rgba(255,255,255,0.15);background:#0d1f35;cursor:pointer;font-size:.78rem;color:#8a9bb5;transition:all .2s';
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = opt;
            cb.style.cssText = 'accent-color:#d4af37;width:14px;height:14px';
            cb.onchange = function() {
              if (cb.checked) {
                chip.style.borderColor = 'rgba(212,175,55,0.6)';
                chip.style.background = 'rgba(212,175,55,0.15)';
                chip.style.color = '#d4af37';
              } else {
                chip.style.borderColor = 'rgba(255,255,255,0.15)';
                chip.style.background = '#0d1f35';
                chip.style.color = '#8a9bb5';
              }
            };
            chip.appendChild(cb);
            chip.appendChild(document.createTextNode(opt));
            checkboxGroup.appendChild(chip);
          });
          fieldWrap.appendChild(checkboxGroup);
          fieldWrap.dataset.fieldName = field.name;
          fieldWrap.dataset.fieldType = 'multiselect';
        } else {
          input = document.createElement('select');
          input.className = 'lumipath-form-select';
          input.style.cssText = ['width:100%','background:#0d1f35','border:1px solid rgba(255,255,255,0.1)','border-radius:10px','padding:10px 14px','color:#e0e6f0','font-size:.85rem','outline:none','transition:border-color .2s','appearance:none','background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238a9bb5\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")','background-repeat:no-repeat','background-position:right 12px center','padding-right:36px'].join(';');
          var emptyOpt = document.createElement('option');
          emptyOpt.value = '';
          emptyOpt.textContent = '请选择';
          emptyOpt.style.color = '#8a9bb5';
          input.appendChild(emptyOpt);
          field.options.forEach(function(opt) {
            var optEl = document.createElement('option');
            optEl.value = opt;
            optEl.textContent = opt;
            optEl.style.color = '#e0e6f0';
            optEl.style.background = '#0d1f35';
            input.appendChild(optEl);
          });
          fieldWrap.appendChild(input);
        }
      } else if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = 3;
        input.placeholder = field.placeholder;
        input.className = 'lumipath-form-input';
        input.style.cssText = ['width:100%','background:#0d1f35','border:1px solid rgba(255,255,255,0.1)','border-radius:10px','padding:10px 14px','color:#e0e6f0','font-size:.85rem','resize:none','outline:none','font-family:inherit','transition:border-color .2s'].join(';');
        fieldWrap.appendChild(input);
      } else {
        input = document.createElement('input');
        input.type = field.type;
        input.placeholder = field.placeholder;
        input.className = 'lumipath-form-input';
        input.style.cssText = ['width:100%','background:#0d1f35','border:1px solid rgba(255,255,255,0.1)','border-radius:10px','padding:10px 14px','color:#e0e6f0','font-size:.85rem','outline:none','font-family:inherit','transition:border-color .2s'].join(';');
        fieldWrap.appendChild(input);
      }
      if (input) {
        input.dataset.fieldName = field.name;
        input.dataset.required = field.required ? 'true' : 'false';
      }
      formWrap.appendChild(fieldWrap);
    });

    // 提交按钮
    var submitBtn = document.createElement('button');
    submitBtn.textContent = '提交测评信息';
    submitBtn.style.cssText = ['width:100%','padding:12px','border:none','border-radius:10px','background:linear-gradient(135deg,#d4af37,#b8941f)','color:#0a1628','font-weight:600','font-size:.9rem','cursor:pointer','margin-top:8px','transition:opacity .2s'].join(';');
    submitBtn.onclick = function() { submitAssessForm(formWrap); };
    formWrap.appendChild(submitBtn);

    messagesContainer.appendChild(formWrap);
  }

  function submitAssessForm(formWrap) {
    var data = { source: '免费测评' };
    var requiredMissing = [];
    
    formWrap.querySelectorAll('[data-field-name]').forEach(function(el) {
      var fieldName = el.dataset.fieldName;
      if (el.dataset.fieldType === 'multiselect') {
        var selected = [];
        el.querySelectorAll('input[type=checkbox]:checked').forEach(function(cb) {
          selected.push(cb.value);
        });
        data[fieldName] = selected.join(',');
      } else if (el.tagName === 'SELECT') {
        data[fieldName] = el.value;
      } else {
        data[fieldName] = el.value.trim();
      }
      if (el.dataset.required === 'true' && !data[fieldName]) {
        requiredMissing.push(fieldName);
      }
    });

    if (requiredMissing.length > 0) {
      showFormError(formWrap, '请填写必填项：' + requiredMissing.map(function(f){return f==='name'?'姓名':f==='phone'?'手机号':'意向服务'}).join('、'));
      return;
    }

    // 禁用按钮
    var submitBtn = formWrap.querySelector('button');
    submitBtn.textContent = '提交中...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';

    // 提交到Worker
    var apiUrl = CONFIG.apiEndpoint ? CONFIG.apiEndpoint.replace(/\/$/, '') + '/form-submit' : '';

    if (apiUrl) {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function(r) { return r.json(); }).then(function(result) {
        showFormSuccess(formWrap);
      }).catch(function(err) {
        // 本地存储
        saveLeadLocal(data);
        showFormSuccess(formWrap);
      });
    } else {
      // 无Worker，本地存储
      saveLeadLocal(data);
      setTimeout(function() { showFormSuccess(formWrap); }, 600);
    }
  }

  function showFormError(formWrap, msg) {
    var existing = formWrap.querySelector('.lumipath-form-error');
    if (existing) existing.remove();
    var errEl = document.createElement('div');
    errEl.className = 'lumipath-form-error';
    errEl.style.cssText = 'color:#f87171;font-size:.78rem;margin-top:8px;text-align:center';
    errEl.textContent = msg;
    formWrap.appendChild(errEl);
  }

  function showFormSuccess(formWrap) {
    messagesContainer.innerHTML = '';
    var successWrap = document.createElement('div');
    successWrap.style.cssText = 'animation:lumipath-fadein .4s ease;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:20px';
    successWrap.innerHTML = [
      '<div style="font-size:3rem;margin-bottom:16px">✅</div>',
      '<div style="color:#d4af37;font-size:1.1rem;font-weight:600;margin-bottom:10px">信息提交成功！</div>',
      '<div style="color:#8a9bb5;font-size:.85rem;line-height:1.8;max-width:300px">我们的专业顾问将在24小时内联系您，为您提供一对一深度评估和定制方案。</div>',
      '<div style="color:#8a9bb5;font-size:.78rem;margin-top:16px;padding:10px 16px;background:rgba(212,175,55,0.08);border-radius:8px;border:1px solid rgba(212,175,55,0.15)">期待与您沟通，开启您的星途之旅 🌟</div>'
    ].join('');
    messagesContainer.appendChild(successWrap);
  }

  function saveLeadLocal(data) {
    try {
      var leads = JSON.parse(localStorage.getItem('lumipath_leads') || '[]');
      leads.push({ data: data, timestamp: new Date().toISOString() });
      localStorage.setItem('lumipath_leads', JSON.stringify(leads));
    } catch(e) {}
  }

  // ========== 显示/隐藏 ==========
  function showModal(mode) {
    createModal();
    if (mode === 'assess') {
      setAssessMode();
    } else {
      setConsultMode();
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      if (mode === 'assess') {
        var firstInput = messagesContainer.querySelector('input,textarea,select');
        if (firstInput) firstInput.focus();
      } else {
        inputElement.focus();
      }
    }, 100);
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
      bubble.style.cssText = ['max-width:80%','padding:10px 14px','border-radius:14px 14px 4px 14px','background:linear-gradient(135deg,#d4af37,#b8941f)','color:#0a1628','font-size:.85rem','line-height:1.6','word-break:break-word','white-space:pre-wrap'].join(';');
    } else {
      wrap.style.alignItems = 'flex-start';
      bubble.style.cssText = ['max-width:85%','padding:10px 14px','border-radius:14px 14px 14px 4px','background:#1a2a42','color:#e0e6f0','font-size:.85rem','line-height:1.6','word-break:break-word','white-space:pre-wrap'].join(';');
    }
    bubble.textContent = content;
    wrap.appendChild(bubble);
    messagesContainer.appendChild(wrap);
    scrollToBottom();
    messages.push({ role: role, content: content });
    return bubble;
  }

  function createStreamingBubble() {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;animation:lumipath-fadein .3s ease;align-items:flex-start';
    var bubble = document.createElement('div');
    bubble.style.cssText = ['max-width:85%','padding:10px 14px','border-radius:14px 14px 14px 4px','background:#1a2a42','color:#e0e6f0','font-size:.85rem','line-height:1.6','word-break:break-word','white-space:pre-wrap'].join(';');
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
      startStreaming: function() { if (bubble.contains(indicator)) bubble.removeChild(indicator); bubble.textContent = ''; fullText = ''; },
      append: function(text) { fullText += text; bubble.textContent = fullText.replace(CONFIG.leadMarker, ''); scrollToBottom(); },
      done: function() {
        if (bubble.contains(indicator)) bubble.removeChild(indicator);
        var finalText = fullText.replace(CONFIG.leadMarker, '');
        messages.push({ role: 'ai', content: finalText });
        if (fullText.indexOf(CONFIG.leadMarker) !== -1 && !isLeadSubmitted) { submitLead(); }
      }
    };
  }

  // ========== 提交线索（咨询模式） ==========
  function submitLead() {
    isLeadSubmitted = true;
    inputElement.disabled = true;
    sendButton.disabled = true;
    sendButton.textContent = '已提交';
    sendButton.style.opacity = '0.6';

    var statusWrap = document.createElement('div');
    statusWrap.style.cssText = 'display:flex;justify-content:center;padding:4px 0;animation:lumipath-fadein .3s ease';
    var statusBubble = document.createElement('div');
    statusBubble.style.cssText = 'background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.2);border-radius:8px;padding:6px 16px;color:#d4af37;font-size:.75rem';
    statusBubble.textContent = '正在提交您的信息...';
    statusWrap.appendChild(statusBubble);
    messagesContainer.appendChild(statusWrap);
    scrollToBottom();

    var history = messages.map(function(m) { return { role: m.role === 'user' ? 'user' : 'assistant', content: m.content }; });
    var apiUrl = CONFIG.apiEndpoint ? CONFIG.apiEndpoint.replace(/\/$/, '') + '/lead' : '';

    if (!apiUrl) {
      // 本地存储
      saveLeadLocal({ source: '网站咨询', conversation: history });
      setTimeout(function() {
        statusBubble.textContent = '✓ 信息已记录，顾问将在24小时内联系您';
        statusBubble.style.color = '#4ade80';
        statusBubble.style.borderColor = 'rgba(74,222,128,0.3)';
        showInlineForm();
      }, 800);
      return;
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: history, source: '网站咨询' })
    }).then(function(r) { return r.json(); }).then(function(data) {
      statusBubble.textContent = '✓ 信息已提交，顾问将在24小时内联系您';
      statusBubble.style.color = '#4ade80';
      statusBubble.style.borderColor = 'rgba(74,222,128,0.3)';
      showInlineForm();
    }).catch(function(err) {
      saveLeadLocal({ source: '网站咨询', conversation: history });
      statusBubble.textContent = '✓ 信息已记录，顾问将在24小时内联系您';
      statusBubble.style.color = '#4ade80';
      showInlineForm();
    });
  }

  // ========== 咨询模式 fallback：显示内联表单 ==========
  function showInlineForm() {
    var formCard = document.createElement('div');
    formCard.style.cssText = 'animation:lumipath-fadein .3s ease;background:#0d1f35;border:1px solid rgba(212,175,55,0.2);border-radius:12px;padding:16px;margin-top:8px';

    var title = document.createElement('div');
    title.style.cssText = 'color:#d4af37;font-size:.85rem;font-weight:600;margin-bottom:12px';
    title.textContent = '📋 留下您的联系方式';
    formCard.appendChild(title);

    var desc = document.createElement('div');
    desc.style.cssText = 'color:#8a9bb5;font-size:.75rem;margin-bottom:14px;line-height:1.5';
    desc.textContent = '如果您还没留下联系方式，请填写下方表单，顾问会尽快联系您。';
    formCard.appendChild(desc);

    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '您的姓名';
    nameInput.style.cssText = 'width:100%;background:#0a1628;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:8px 12px;color:#e0e6f0;font-size:.82rem;outline:none;margin-bottom:8px;box-sizing:border-box';
    formCard.appendChild(nameInput);

    var phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.placeholder = '手机号或微信号';
    phoneInput.style.cssText = 'width:100%;background:#0a1628;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:8px 12px;color:#e0e6f0;font-size:.82rem;outline:none;margin-bottom:12px;box-sizing:border-box';
    formCard.appendChild(phoneInput);

    var submitBtn = document.createElement('button');
    submitBtn.textContent = '提交联系方式';
    submitBtn.style.cssText = 'width:100%;padding:8px;border:none;border-radius:8px;background:linear-gradient(135deg,#d4af37,#b8941f);color:#0a1628;font-weight:600;font-size:.82rem;cursor:pointer';
    submitBtn.onclick = function() {
      if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        submitBtn.textContent = '请填写姓名和联系方式';
        setTimeout(function(){ submitBtn.textContent = '提交联系方式'; }, 1500);
        return;
      }
      var data = {
        source: '网站咨询-补充表单',
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim()
      };
      var apiUrl = CONFIG.apiEndpoint ? CONFIG.apiEndpoint.replace(/\/$/, '') + '/form-submit' : '';
      if (apiUrl) {
        fetch(apiUrl, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
          .then(function(){ showInlineSuccess(formCard); })
          .catch(function(){ saveLeadLocal(data); showInlineSuccess(formCard); });
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
    container.innerHTML = '';
    var success = document.createElement('div');
    success.style.cssText = 'text-align:center;padding:8px';
    success.innerHTML = '<div style="font-size:1.5rem;margin-bottom:8px">✅</div><div style="color:#4ade80;font-size:.85rem;font-weight:600">联系方式已提交！</div><div style="color:#8a9bb5;font-size:.75rem;margin-top:4px">顾问将在24小时内联系您</div>';
    container.appendChild(success);
  }

  // ========== Fallback（无API时） ==========
  function showFallback() {
    var stream = createStreamingBubble();
    setTimeout(function() {
      stream.startStreaming();
      var text = '感谢您的咨询！我是星途LumiPath的AI顾问。\n\n请直接在下方留下您的问题或需求，也可以填写联系方式，我们的专业顾问会尽快回复您。';
      var i = 0;
      var timer = setInterval(function() {
        if (i < text.length) { stream.append(text[i]); i++; }
        else {
          clearInterval(timer);
          stream.done();
          // 显示内联表单
          showInlineForm();
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
    if (!CONFIG.apiEndpoint) { showFallback(); return; }
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
        }).catch(function(err) {
          if (!started) { stream.startStreaming(); started = true; }
          stream.append('\n\n（连接中断，请稍后重试）');
          stream.done();
          isWaiting = false;
          updateSendButton();
        });
      }
      read();
    }).catch(function(err) {
      if (messagesContainer.contains(stream.bubble.parentElement)) { messagesContainer.removeChild(stream.bubble.parentElement); }
      showFallback();
    });
  }

  function scrollToBottom() {
    requestAnimationFrame(function() { messagesContainer.scrollTop = messagesContainer.scrollHeight; });
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
  window.LumiPathChat = { show: showModal, hide: hideModal, config: CONFIG };

  // ========== 自动绑定 ==========
  function init() {
    document.querySelectorAll('[data-action="consult"], [data-action="assess"]').forEach(function(btn) {
      btn.onclick = null;
      btn.addEventListener('click', function(e) {
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
