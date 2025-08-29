// ===== DEBUG BOOTSTRAP: 确认脚本加载与错误捕获 =====
(function(){
    try {
        console.log('[intro][dbg] love.js loaded. readyState=', document.readyState);
        window.addEventListener('error', function(e){
            try { console.error('[intro][dbg][window.onerror]', e.message || e); } catch(_){}
        });
        window.addEventListener('unhandledrejection', function(e){
            try { console.error('[intro][dbg][unhandledrejection]', e.reason || e); } catch(_){}
        });
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function(){
                console.log('[intro][dbg] DOMContentLoaded fired.');
            }, { once: true });
        } else {
            console.log('[intro][dbg] DOM already ready.');
        }
        setTimeout(function(){ console.log('[intro][dbg] heartbeat 1s'); }, 1000);
        setTimeout(function(){ console.log('[intro][dbg] heartbeat 3s'); }, 3000);
        setTimeout(function(){ console.log('[intro][dbg] heartbeat 6s'); }, 6000);
    } catch (e) {
        // 作为最后兜底，尝试可见提示
        try { alert('调试提示: love.js 加载异常: ' + (e.message || e)); } catch(_){}
    }
})();

// 页面加载完成后的初始化
window.addEventListener('load', function() {
    console.log('3D爱心动画已加载完成！');
    
    // 添加交互效果
    addInteractiveEffects();
    
    // 自动播放音乐（如果浏览器允许）
    const audio = document.getElementById('audios');
    if (audio) {
        audio.play().catch(function(error) {
            console.log('自动播放被阻止，需要用户交互才能播放音乐');
        });
    }
});

// 添加交互效果
function addInteractiveEffects() {
    const heart = document.querySelector('.heart-3d');
    const textChars = document.querySelectorAll('.text-char');
    
    if (heart) {
        // 鼠标悬停爱心效果
        heart.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translate(-50%, -50%) scale(1.2) rotateY(15deg)';
        });
        
        heart.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // 点击爱心效果
        heart.addEventListener('click', function() {
            createHeartBurst();
            // 添加点击音效（可选）
            playClickSound();
        });
    }
    
    // 文字字符交互
    textChars.forEach((char, index) => {
        char.addEventListener('click', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(1.5) rotate(360deg)';
            
            setTimeout(() => {
                this.style.animation = `textFloat 3s ease-in-out infinite`;
                this.style.animationDelay = `${index * 0.5}s`;
                this.style.transform = '';
            }, 600);
        });
    });
}

// 创建爱心爆发效果
function createHeartBurst() {
    const heart = document.querySelector('.heart-3d');
    if (!heart) return;
    
    // 创建多个爆发粒子
    for (let i = 0; i < 8; i++) {
        const burst = document.createElement('div');
        const angle = (i / 8) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        
        burst.className = 'heart-burst-particle';
        burst.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #ff6b9d, #ff4757);
            border-radius: 50%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            animation: burstParticle 0.8s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // 设置动画关键帧
        const keyframes = `
            @keyframes burstParticle {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0);
                    opacity: 0;
                }
            }
        `;
        
        // 添加动画样式
        if (!document.querySelector('#burst-animations')) {
            const style = document.createElement('style');
            style.id = 'burst-animations';
            style.textContent = keyframes;
            document.head.appendChild(style);
        }
        
        heart.appendChild(burst);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (burst.parentNode) {
                burst.parentNode.removeChild(burst);
            }
        }, 800);
    }
}

// 播放点击音效
function playClickSound() {
    // 创建一个简单的音效
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// 添加触摸支持
if ('ontouchstart' in window) {
    const heart = document.querySelector('.heart-3d');
    if (heart) {
        heart.addEventListener('touchstart', function(e) {
            e.preventDefault();
            createHeartBurst();
        });
    }
}

// 添加键盘快捷键
document.addEventListener('keydown', function(e) {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            createHeartBurst();
            break;
        case 'KeyH':
            createHeartBurst();
            break;
    }
});

// 添加窗口大小调整支持
window.addEventListener('resize', function() {
    // 重新计算爱心位置和大小
    const heart = document.querySelector('.heart-3d');
    if (heart) {
        // 重置变换以确保居中
        heart.style.transform = 'translate(-50%, -50%) scale(1)';
    }
});

console.log('3D爱心交互功能已加载！');
console.log('快捷键：空格键或H键 - 触发爱心爆发效果');
console.log('点击爱心 - 触发爆发效果');
console.log('点击文字 - 特殊动画效果');

// 自动播放与重播控制
(function(){
    const audio = document.getElementById('audios');
    if(!audio) return;

    let restartTimer = null;
    let unmuteInterval = null;

    // 周期性尝试取消静音并播放（在策略允许时自动生效）
    function startAutoUnmuteLoop() {
        if (unmuteInterval) return;
        let attempts = 0;
        unmuteInterval = setInterval(() => {
            attempts++;
            // 超过30次(~30秒)后停止重试，避免无意义占用
            if (attempts > 30) {
                clearInterval(unmuteInterval);
                unmuteInterval = null;
            }
            // 若已结束或不存在则跳过
            if (!audio || audio.ended) return;
            // 若未播放则先播放
            if (audio.paused) {
                audio.play().catch(()=>{});
            }
            // 关键：尝试取消静音
            const wasMuted = audio.muted;
            audio.muted = false;
            // 再尝试确保在有声状态下播放
            audio.play().then(() => {
                // 成功则可以停止后续重试
                if (wasMuted === true && audio.muted === false) {
                    clearInterval(unmuteInterval);
                    unmuteInterval = null;
                }
            }).catch(() => {
                // 若失败，恢复静音，等待下一次尝试
                audio.muted = true;
            });
        }, 1000);
    }

    function tryPlay() {
        // 先以静音方式开始，最大化自动播放成功率
        audio.muted = true;
        audio.play().then(() => {
            // 开始循环尝试自动取消静音
            startAutoUnmuteLoop();
        }).catch(() => {
            // 若仍被阻止，稍后再试
            setTimeout(tryPlay, 1000);
        });
    }

    // 播放结束后15秒再播
    audio.addEventListener('ended', () => {
        if (restartTimer) clearTimeout(restartTimer);
        restartTimer = setTimeout(() => {
            audio.currentTime = 0;
            // 以静音启动，随后循环尝试自动取消静音
            audio.muted = true;
            audio.play().then(startAutoUnmuteLoop).catch(() => {
                // 失败则再次重试
                tryPlay();
            });
        }, 15000);
    });

    // 可播放时尝试启动
    audio.addEventListener('canplay', () => {
        if (audio.paused) tryPlay();
    });

    // 页面可见/显示时再尝试一次（有些浏览器在后台页会拒绝）
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && audio.paused) tryPlay();
    });
    window.addEventListener('pageshow', () => {
        if (audio.paused) tryPlay();
    });

    // 微信等内置浏览器
    document.addEventListener('WeixinJSBridgeReady', () => tryPlay());
    document.addEventListener('YixinJSBridgeReady', () => tryPlay());

    // 首次尝试
    tryPlay();
})();

// 强化点击门控与解锁显示（使用当前文案“请点击打开信封”）
(function(){
    const overlay = document.getElementById('introOverlay');
    const audio = document.getElementById('audios');
    if(!overlay || !audio) return;

    function isLocked(){ return overlay.classList.contains('locked'); }
    function isReady(){ return overlay.classList.contains('ready'); }

    const OPEN_DURATION = 1200;
    const FADE_DELAY = 150;
    const FADE_DURATION = 600;

    function startMusic(){
        audio.muted = false;
        audio.currentTime = 0;
        audio.play().catch(()=>{
            audio.muted = true;
            audio.play().finally(()=>{
                setTimeout(()=>{ audio.muted = false; audio.play().catch(()=>{}); }, 120);
            });
        });
    }

    function closeOverlay(){
        overlay.classList.add('hidden');
        setTimeout(()=>{
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, FADE_DURATION + 50);
    }

    function triggerOpen(){
        if (isLocked()) { console.log('[intro] blocked: still locked'); return; }
        if (!isReady()) { console.log('[intro] blocked: not ready'); return; }
        if (overlay.classList.contains('open')) { console.log('[intro] blocked: already open'); return; }
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('aria-label', '正在打开，请稍候');
        setTimeout(()=>{
            setTimeout(closeOverlay, FADE_DELAY);
            startMusic();
        }, OPEN_DURATION);
    }

    const onClick = (e) => {
        if (isLocked() || !isReady()) {
            e.preventDefault(); e.stopPropagation();
            console.log('[intro] click ignored until ready');
            return;
        }
        triggerOpen();
    };

    overlay.addEventListener('click', onClick, false);
    overlay.addEventListener('touchstart', (e)=>{ onClick(e); }, false);
    overlay.addEventListener('keydown', (e) => {
        const code = e.code || e.key;
        if (code === 'Enter' || code === 'Space' || code === 'Spacebar') {
            e.preventDefault();
            triggerOpen();
        }
    });
})();

// 让遮罩中的 GIF 在刷新或显示时从头开始（仅一次）
(function(){
    const overlay = document.getElementById('introOverlay');
    const gif = overlay ? overlay.querySelector('.intro-gif') : null;
    if (!gif) return;

    if (window.__gifBustedOnce) return;
    window.__gifBustedOnce = true;

    function bustCacheOnce() {
        const base = 'images/biubiubiu.gif';
        const ts = Date.now();
        gif.src = base + '?t=' + ts;
    }

    bustCacheOnce();
})();

// GIF 结束前禁止点击，结束后显示文案并允许进入（11.8s 稳固版）
(function(){
    const overlay = document.getElementById('introOverlay');
    if (!overlay) return;
    const gif = overlay.querySelector('.intro-gif');

    // 初始状态：锁定且未 ready
    overlay.classList.add('locked');
    overlay.classList.remove('ready');
    overlay.setAttribute('aria-label', '动画播放中，请稍候');

    const GIF_DURATION_MS = 11800; // 11.8s
    const HARD_FALLBACK_MS = 16000; // 最长兜底

    let unlocked = false;
    let armTimerId = null;
    let hardFallbackId = null;

    function markReady() {
        overlay.classList.remove('locked');
        overlay.classList.add('ready');
        overlay.setAttribute('aria-label', '请点击打开网站');
        overlay.style.cursor = 'pointer';
    }

    function onUnlock(reason) {
        if (unlocked) return;
        unlocked = true;
        if (armTimerId) { clearTimeout(armTimerId); armTimerId = null; }
        if (hardFallbackId) { clearTimeout(hardFallbackId); hardFallbackId = null; }
        try { markReady(); } catch (_) {}
        try { console.log('[intro] unlocked:', reason || 'timer'); } catch(_){}
    }

    function armPreciseTimer() {
        if (armTimerId) clearTimeout(armTimerId);
        armTimerId = setTimeout(() => onUnlock('gif-duration'), GIF_DURATION_MS);
    }

    // 硬兜底：无论如何在最长时限后解锁，避免边缘状态
    hardFallbackId = setTimeout(() => onUnlock('hard-fallback'), HARD_FALLBACK_MS);

    if (gif) {
        // 若我们在其他位置已强制刷新了gif src，这里只需要等待load即可
        const onLoad = () => {
            try { console.log('[intro] gif loaded, arming 11.8s timer'); } catch(_){}
            armPreciseTimer();
        };
        if (gif.complete && gif.naturalWidth > 0) {
            // 已完成加载
            setTimeout(onLoad, 0);
        } else {
            gif.addEventListener('load', onLoad, { once: true });
            gif.addEventListener('error', () => onUnlock('gif-error'), { once: true });
        }
    } else {
        // 没有gif，快速解锁
        setTimeout(() => onUnlock('no-gif'), 800);
    }
})();

// ===== 音频门控：GIF 未结束或未进入前，禁止任何有声播放/取消静音 =====
(function(){
    const overlay = document.getElementById('introOverlay');
    const audio = document.getElementById('audios');
    if (!audio) return;

    // 抑制标记：在未进入前强制静音与暂停
    window.__suppressAutoUnmute = true;

    function isAllowed() {
        if (!overlay) return true; // 没有遮罩则允许
        const locked = overlay.classList.contains('locked');
        const ready = overlay.classList.contains('ready');
        const open  = overlay.classList.contains('open');
        // 仅在已经开始进入（open）后才允许有声
        return !locked && ready && open;
    }

    function enforceGate() {
        if (isAllowed()) return;
        try {
            audio.muted = true;
            // 若已经开始播放，立即暂停，避免无声点击触发后再被其他逻辑解锁
            audio.pause();
        } catch (_) {}
    }

    // 在常见用户手势上拦截早期播放/解锁
    ['click','touchstart','keydown'].forEach(evt => {
        window.addEventListener(evt, enforceGate, true);
    });

    // 页面可见性变化也执行一次门控
    document.addEventListener('visibilitychange', enforceGate);

    // 当遮罩进入（open）时，解除抑制，以便后续 startMusic 正常执行
    if (overlay) {
        const mo = new MutationObserver(() => {
            if (isAllowed()) {
                window.__suppressAutoUnmute = false;
                mo.disconnect();
            }
        });
        mo.observe(overlay, { attributes: true, attributeFilter: ['class'] });
    }
})();

// ===== 页面加载完成即开始计时（11.8s），不依赖 GIF load =====
(function(){
    const overlay = document.getElementById('introOverlay');
    if (!overlay) return;
    const GIF_DURATION_MS = 11800; // 11.8s from page ready

    function forceUnlock(){
        overlay.classList.remove('locked');
        overlay.classList.add('ready');
        overlay.setAttribute('aria-label', '请点击打开信封');
        overlay.style.cursor = 'pointer';
        try { console.log('[intro] force unlock at 11.8s from DOMContentLoaded'); } catch(_){}
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(forceUnlock, GIF_DURATION_MS), { once: true });
    } else {
        setTimeout(forceUnlock, GIF_DURATION_MS);
    }
})();

// ===== 最终保障控制器：11.8s 后强制显示“请点击打开信封”，并允许点击进入 =====
(function(){
    const overlay = document.getElementById('introOverlay');
    const audio = document.getElementById('audios');
    if (!overlay || !audio) return;

    const GIF_DURATION_MS = 11800;
    const MAX_WAIT_MS = 16000;

    function ensureReady(){
        if (overlay.classList.contains('ready') && !overlay.classList.contains('locked')) return;
        overlay.classList.remove('locked');
        overlay.classList.add('ready');
        overlay.setAttribute('aria-label', '请点击打开信封');
        overlay.style.cursor = 'pointer';
        const txt = overlay.querySelector('.letter-text');
        if (txt) {
            txt.style.opacity = '1';
            txt.style.pointerEvents = 'auto';
        }
        try { console.log('[intro] ensureReady applied'); } catch(_){}
    }

    function safeOpen(){
        // 与现有门控保持一致
        if (overlay.classList.contains('locked')) return;
        if (!overlay.classList.contains('ready')) return;
        if (overlay.classList.contains('open')) return;
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('aria-label', '正在打开，请稍候');
        // 延迟与现有动画匹配
        setTimeout(()=>{
            const evt = new Event('click');
            overlay.dispatchEvent(evt);
        }, 0);
    }

    // 从 DOMContentLoaded 起算 11.8s 强制 ready
    const start = () => {
        setTimeout(ensureReady, GIF_DURATION_MS);
        // 再次兜底
        setTimeout(ensureReady, MAX_WAIT_MS);
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }

    // 当 ready 后第一次点击若未触发展开，尝试调用 safeOpen 保障
    overlay.addEventListener('click', ()=>{
        if (overlay.classList.contains('ready') && !overlay.classList.contains('open')) {
            setTimeout(safeOpen, 0);
        }
    }, false);
})();

// ===== 调试日志：周期打印状态与关键动作 =====
(function(){
    const overlay = document.getElementById('introOverlay');
    const audio = document.getElementById('audios');
    if (!overlay) { console.log('[intro][dbg] overlay not found'); return; }

    const t0 = Date.now();
    function now(){ return ((Date.now() - t0)/1000).toFixed(2) + 's'; }

    function state() {
        const cls = overlay.className;
        const txt = overlay.querySelector('.letter-text');
        const txtStyle = txt ? window.getComputedStyle(txt) : null;
        const txtOpacity = txtStyle ? txtStyle.opacity : 'n/a';
        const txtPE = txtStyle ? txtStyle.pointerEvents : 'n/a';
        const hasReady = overlay.classList.contains('ready');
        const hasLocked = overlay.classList.contains('locked');
        const hasOpen = overlay.classList.contains('open');
        const hasHidden = overlay.classList.contains('hidden');
        const audioMuted = audio ? audio.muted : 'n/a';
        const audioPaused = audio ? audio.paused : 'n/a';
        return { time: now(), hasReady, hasLocked, hasOpen, hasHidden, audioMuted, audioPaused, txtOpacity, txtPE, cls };
    }

    // 周期打印状态，直到 open 完成
    let statusTimer = setInterval(()=>{
        const s = state();
        console.log('[intro][dbg][state]', s);
        if (s.hasOpen && s.hasHidden) { clearInterval(statusTimer); }
    }, 1000);

    // 监听类变更
    const mo = new MutationObserver((muts)=>{
        muts.forEach(m=>{
            if (m.attributeName === 'class') {
                console.log('[intro][dbg][classChange]', now(), overlay.className);
            }
        });
    });
    mo.observe(overlay, { attributes: true, attributeFilter: ['class'] });

    // 监听点击并打印当时状态
    function logClick(tag){
        const s = state();
        console.log('[intro][dbg][click]', tag || '', s);
    }
    overlay.addEventListener('click', ()=>logClick('overlay-click'), true);
    overlay.addEventListener('touchstart', ()=>logClick('overlay-touchstart'), true);
    overlay.addEventListener('keydown', (e)=>{
        if (e.code === 'Enter' || e.code === 'Space' || e.code === 'Spacebar') {
            logClick('overlay-key-'+e.code);
        }
    }, true);

    // 音频关键事件
    if (audio) {
        audio.addEventListener('play', ()=>console.log('[intro][dbg][audio] play at', now()));
        audio.addEventListener('pause', ()=>console.log('[intro][dbg][audio] pause at', now()));
        audio.addEventListener('ended', ()=>console.log('[intro][dbg][audio] ended at', now()));
        const _muted = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'muted');
        try {
            // 监听 muted 变化（降级方案：周期检测已覆盖）
        } catch(_){}
    }
})();
