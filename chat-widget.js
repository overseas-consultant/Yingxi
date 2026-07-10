/**
 * 出国规划顾问 - 嵌入式聊天组件 SDK
 * 使用方法：<script src="chat-widget.js" data-agent="出国规划顾问"></script>
 */
(function(){'use strict';
var s=document.currentScript;
var AGENT_NAME=s.getAttribute('data-agent')||'咨询顾问';
var COLOR=s.getAttribute('data-color')||'#d4af37';
var BG=s.getAttribute('data-bg')||'#0a1628';
var CHAT_URL=s.getAttribute('data-chat-url')||'https://overseas-consultant.github.io/Yingxi/chat.html';
var style=document.createElement('style');
style.textContent='.cwa-fab{position:fixed;bottom:24px;right:24px;z-index:2147483647;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,'+COLOR+','+COLOR+'dd);border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:1.6rem;color:#fff}.cwa-fab:hover{transform:scale(1.08)}.cwa-overlay{position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,0.5);display:none;justify-content:center;align-items:flex-end}.cwa-overlay.cwa-open{display:flex}.cwa-panel{width:100%;max-width:420px;height:85vh;max-height:700px;background:'+BG+';border-radius:20px 20px 0 0;display:flex;flex-direction:column;overflow:hidden;animation:cwaSlideUp .3s}.cwa-iframe{flex:1;border:none}@keyframes cwaSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}';
document.head.appendChild(style);
var fab=document.createElement('button');fab.className='cwa-fab';fab.title=AGENT_NAME;fab.innerHTML='🎯';fab.onclick=openChat;
var overlay=document.createElement('div');overlay.className='cwa-overlay';overlay.onclick=function(e){if(e.target===overlay)closeChat()};
var panel=document.createElement('div');panel.className='cwa-panel';panel.style.position='relative';
var closeBtn=document.createElement('button');closeBtn.className='cwa-close';closeBtn.textContent='✕';closeBtn.onclick=closeChat;
var iframe=document.createElement('iframe');iframe.className='cwa-iframe';iframe.src=CHAT_URL;iframe.title=AGENT_NAME;iframe.allow='clipboard-write';
panel.appendChild(closeBtn);panel.appendChild(iframe);overlay.appendChild(panel);
document.body.appendChild(fab);document.body.appendChild(overlay);
function openChat(){overlay.classList.add('cwa-open');fab.style.display='none'}
function closeChat(){overlay.classList.remove('cwa-open');fab.style.display='flex'}
window.ChatWidget={open:openChat,close:closeChat,toggle:function(){overlay.classList.contains('cwa-open')?closeChat():openChat()}};
console.log('[ChatWidget] 出国规划顾问已就绪');
})();