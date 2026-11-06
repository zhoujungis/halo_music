
  (function(){
    const APP_VERSION = document.querySelector('meta[name="app-version"]')?.content || '0.0.0';
    const ANDROID_UPDATE_STORAGE_KEY = 'halo-music-android-update-dismissed';

    const translations = {
      zh: {
        appTitle:"Halo音乐",
        searchTitle:"歌曲搜索",
        searchButton:"搜索",
        searchStatusIdle:"搜索即可播放 · 登录后可收藏与同步歌单",
        searchStatusSearching:"正在搜索中…",
        searchStatusDone:"搜索完成。",
        searchStatusNoSource:"请至少选择一个音乐源。",
        searchBatchNoResults:"暂无搜索结果",
        searchBatchSelectAll:"全选",
        searchBatchUnselectAll:"取消全选",
        searchBatchFavorite:"加入收藏",
        searchBatchPlaylist:"加入歌单",
        searchBatchNeedSelection:"请先选择歌曲。",
        searchBatchFavoriteResult:"已收藏 {added} 首歌曲",
        searchBatchPlaylistTitle:"批量保存到歌单",
        searchBatchPlaylistDescription:"选择歌单保存已选歌曲（已存在的歌曲会自动跳过）",
        searchBatchPlaylistSaved:"已保存 {added} 首",
        playerTitle:"正在播放",
        playerStatusIdle:"空闲",
        playerStatusLoading:"加载音源中…",
        playerStatusPlaying:"播放中",
        playerStatusPaused:"已暂停",
        playerStatusBuffering:"缓冲中…",
        playerStatusError:"播放失败",
        lyricsEmpty:"暂无歌词，试着播放一首支持歌词的歌曲。",
        playlistTitle:"播放列表",
        tabResults:"正在播放",
        tabFavorites:"收藏",
        tabCustomLists:"歌单",
        playlistInfoResults:"正在播放列表",
        playlistInfoFavorites:"收藏列表",
        playlistInfoPlaylist:"歌单",
        libraryLoginTitle:"登录后查看收藏与歌单",
        libraryLoginDescription:"搜索和播放无需登录；登录后会同步收藏与歌单到你的账号",
        libraryEmptyFavoritesTitle:"还没有收藏歌曲",
        libraryEmptyFavoritesDescription:"去搜索页发现喜欢的音乐",
        libraryEmptyPlaylistsTitle:"还没有自建歌单",
        libraryEmptyPlaylistsDescription:"创建一张歌单，把喜欢的歌收在一起",
        libraryLoginAction:"登录 / 注册",
        libraryBrowseAction:"去搜索",
        libraryCreateAction:"新建",
        mobileImportAction:"导入",
        mobileExportAction:"导出",
        saveToPlaylistTitle:"保存到歌单",
        saveToPlaylistDescription:"选择一张歌单保存当前歌曲",
        saveToPlaylistEmpty:"还没有歌单，先创建一张吧",
        playlistAlreadyContains:"已保存",
        playlistOpenLabel:"打开歌单",
        newPlaylist:"新建歌单",
        queueAdd:"加入播放列表",
        queueRemove:"从播放列表移除",
        queueEmpty:"播放列表为空",
        queueClear:"清空播放列表",
        toastQueueCleared:"播放列表已清空",
        confirmClearQueue:"确定要清空播放列表吗？",
        importPlaylist:"导入歌单",
        modalImportPlaylistTitle:"导入平台歌单",
        modalImportPlaylistDesc:"粘贴歌单分享文本或链接，系统会自动识别平台并导入歌曲。",
        importPlaylistPlaceholder:"粘贴分享文本或歌单链接…",
        importPlaylistNote:"仅支持公开歌单；大型 QQ 歌单最多导入前 1200 首。",
        importPlaylistFile:"从 JSON 文件导入",
        importPlaylistConfirm:"开始导入",
        importPlaylistLoading:"正在解析歌单…",
        providerNeteaseFull:"网易云音乐",
        providerQishuiFull:"汽水音乐",
        providerQQFull:"QQ 音乐",
        exportPlaylist:"导出歌单",
        deletePlaylist:"删除歌单",
        removeFromPlaylist:"从歌单移除",
        footerText:"本站仅作为学习演示，音乐版权归各平台与原作者所有。",
        toastAddedFavorite:"已添加到收藏",
        toastRemovedFavorite:"已从收藏移除",
        toastAddedToPlaylist:"已添加到歌单",
        toastAlreadyInList:"该歌曲已在当前列表里~",
        toastNoMore:"已经没有更多搜索结果啦~",
        toastSearchError:"搜索时发生了一点小错误，请稍后再试。",
        toastPlayError:"播放失败，请稍后再试。",
        toastAutoSkipNext:"播放失败，已自动切换下一首。",
        toastNeteaseFallback:"QQ 音乐暂无可用音源，已切换网易云音频",
        toastPreviewSwap:"免费音源只有试听，已切换完整音源",
        toastNeteaseFallbackError:"QQ 与网易云都没有可播放的版本，请稍后再试",
        downloadTitle:"下载当前歌曲",
        aboutTitle:"关于本站",
        privacyTitle:"隐私政策",
        disclaimerTitle:"免责声明",
        infoClose:"关闭",
        toastDownloadLogin:"登录后才能下载歌曲",
        toastDownloadQuota:"今日该平台下载额度已用完",
        toastDownloadError:"下载失败，请稍后再试",
        toastDownloadStarted:"已开始下载",
        toastDownloadStartedRemaining:"已开始下载，今日该平台剩余 {remaining} 首",
        toastLocalTrack:"这首歌已经在本地下载目录里，正在播放本地文件",
        toastLocalFallback:"本地文件无法播放，已切回在线音源",
        toastLyricStyleSwitched:"已切换歌词炫酷效果。",
        toastPlaylistCreated:"歌单创建成功。",
        toastPlaylistDeleted:"歌单已删除。",
        toastTrackRemovedFromPlaylist:"已从歌单移除。",
        confirmDeletePlaylist:"确定要删除这个歌单吗？",
        confirmRemoveTrack:"确定要从歌单中移除这首歌吗？",
        toastPlaylistImported:"导入完成",
        toastPlaylistImportEmpty:"导入文件里没有可用歌单或收藏。",
        toastPlaylistImportError:"导入失败，请确认文件是本站导出的 JSON。",
        toastPlaylistExported:"已导出歌单文件。",
        toastPlaylistExportEmpty:"暂无可导出的歌单。",
        toastPlaylistEmpty:"当前歌单为空，先添加几首歌吧~",
        toastPlaymodeList:"播放模式：列表循环",
        toastPlaymodeSingle:"播放模式：单曲循环",
        toastPlaymodeShuffle:"播放模式：随机播放",
        toastNeedPlaylistSelected:"请先选择一个歌单。",
        toastNoCurrentTrack:"当前没有正在播放的歌曲。",
        sourceNetease:"网易云",
        sourceQQ:"QQ音乐",
        sourceBilibili:"哔哩哔哩",
        sourceQishui:"汽水音乐",
        sourceJoox:"QQ音乐",
        modalNewPlaylistTitle:"新建歌单",
        modalNewPlaylistDesc:"给你的歌单取一个可爱的名字吧～",
        modalConfirm:"确定",
        modalCancel:"取消",
        clientDownloadTitle:"下载客户端",
        clientDownloadClose:"关闭下载客户端",
        clientDownloadDesc:"下载 HALO Music 桌面端或安卓客户端。",
        iosGuideDesc:"iPhone 不需要安装包：把本站添加到主屏幕，就能像 App 一样全屏使用。",
        iosAlreadyInstalled:"你已经把 HALO Music 添加到主屏幕了，直接从桌面图标打开即可。",
        iosNotSafariTip:"当前不是 Safari：请点右上角「…」选择「在 Safari 中打开」，再按下面的步骤添加。",
        iosStep1Title:"点底部工具栏的「分享」",
        iosStep1Desc:"就是那个方框加向上箭头的按钮。",
        iosStep2Title:"在菜单里选「添加到主屏幕」",
        iosStep2Desc:"菜单可能需要往下滑一点才能看到。",
        iosStep3Title:"点右上角「添加」",
        iosStep3Desc:"桌面就会出现 Halo音乐 图标，点开是全屏的。"
      }
    };

    const state = {
      enabledSources:{netease:true, qq:true},
      perSourceLimit:30,
      perSourceCurrentLimit:{netease:30, qq:30},
      perSourcePage:{netease:1, qq:1},

      searchKeyword:'',
      searchResults:[],
      searchSelectMode:false,
      trackMap:new Map(),
      favorites:[],
      playlists:[],
      playQueue:[],
      currentTrack:null,
      playContext:{type:'results',index:-1,playlistId:null},
      playMode:'list',
      isPlaying:false,
      lyricLines:[],
      currentLyricIndex:-1,
      searchInProgress:false,
      noMoreResults:false,
      lyricsAlt:false,
      muted:false,
      isAuthenticated:false,
      profileName:'',
      mobilePlaylistDetailId:null,
      selectedSearchUids:new Set(),
      batchTracks:[]
    };

    const LIBRARY_STORAGE_KEY = 'halo-music-library-v1';
    const PLAY_QUEUE_STORAGE_KEY = 'halo-music-play-queue-v1';
    const THEME_STORAGE_KEY = 'halo-music-theme';
    const SEARCH_HISTORY_KEY = 'halo-music-search-history-v1';
    const SEARCH_HISTORY_LIMIT = 8;
    const TOPLIST_TTL = 30 * 60 * 1000;
    const TOPLIST_CHARTS = [
      { key: 'hot', label: '热歌', enLabel: 'US Top 20' },
      { key: 'new', label: '新歌', enLabel: 'UK Top 20' },
      { key: 'rise', label: '飙升', enLabel: 'AU Top 20' },
    ];
    function uiLang(){ return window.HaloI18n?.lang === 'en' ? 'en' : 'zh'; }
    function chartLabel(chart){ return uiLang() === 'en' ? chart.enLabel : `${chart.label}榜`; }
    let toplistCache = {};
    let toplistLoading = {};
    let toplistFailed = {};
    let activeToplistChart = 'hot';
    const RECOMMEND_TTL = 5 * 60 * 1000;
    // 推荐歌手：站内既有的热门歌手池（头像为网易图床直链，加载失败回退首字母）。
    const POPULAR_ARTISTS = [
      { name: '周杰伦', avatar: '/avatars/zhou-jielun.jpg' },
      { name: '林俊杰', avatar: '/avatars/lin-junjie.jpg' },
      { name: '陈奕迅', avatar: '/avatars/eason-chan.jpg' },
      { name: '告五人', avatar: '/avatars/accusefive.jpg' },
      { name: '五月天', avatar: '/avatars/mayday.jpg' },
      { name: '邓紫棋', avatar: '/avatars/gem.jpg' },
      { name: '薛之谦', avatar: '/avatars/joker-xue.jpg' },
      { name: '孙燕姿', avatar: '/avatars/stefanie-sun.jpg' },
    ];
    // 英文界面的热门歌手（头像来自 Wikimedia，加载失败时回退首字母）。
    const POPULAR_ARTISTS_EN = [
      { name: 'Taylor Swift', avatar: '/avatars/taylor-swift.jpg' },
      { name: 'Ed Sheeran', avatar: '/avatars/ed-sheeran.jpg' },
      { name: 'The Weeknd', avatar: '/avatars/the-weeknd.jpg' },
      { name: 'Billie Eilish', avatar: '/avatars/billie-eilish.jpg' },
      { name: 'Bruno Mars', avatar: '/avatars/bruno-mars.jpg' },
      { name: 'Adele', avatar: '/avatars/adele.jpg' },
      { name: 'Coldplay', avatar: '/avatars/coldplay.jpg' },
      { name: 'Drake', avatar: '/avatars/drake.jpg' },
    ];
    function popularArtists(){
      return uiLang() === 'en' ? POPULAR_ARTISTS_EN : POPULAR_ARTISTS;
    }
    let recommendCache = { tracks: [], basis: '', at: 0 };
    let recommendLoading = false;
    let recommendFailed = false;
    const GUEST_AVATAR_ICON='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2-7 4.5V21h14v-2.5c0-2.5-3-4.5-7-4.5Z" fill="currentColor"/></svg>';
    const SUN_ICON='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
    const MOON_ICON='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>';

    const dom = {};
    let audioLevel = 0;
    let librarySaveChain = Promise.resolve();
    let createPlaylistForCurrentTrack = false;
    let pendingPlaylistTracks = [];
    let editingPlaylistId = null;
    let nextAudioPreload = null;
    let activePlaybackBlobUrl = '';
    let playbackRequestToken = 0;
    let searchRequestToken = 0;
    // 播放终态失败时自动切下一首；连续失败超过上限说明音源/网络整体不可用，停止切歌。
    let consecutivePlayFailures = 0;
    const MAX_CONSECUTIVE_PLAY_FAILURES = 3;
    // How many lyric lines to show either side of the active one on mobile.
    // One either side keeps each line tall enough to be a real tap target.
    const MOBILE_LYRIC_WINDOW = 1;

    async function fetchWithTimeout(input, options={}, timeoutMs=10000){
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),timeoutMs);
      const externalSignal=options.signal;
      const abort=()=>controller.abort();
      if(externalSignal){
        if(externalSignal.aborted)controller.abort();
        else externalSignal.addEventListener('abort',abort,{once:true});
      }
      try{return await fetch(input,{...options,signal:controller.signal});}
      finally{
        clearTimeout(timer);
        externalSignal?.removeEventListener('abort',abort);
      }
    }
    let nextTrackPrepareToken = 0;
    let preparedNextTrack = null;
    let workspaceRemovedTabs = [];
    let workspaceRemovedPlaylistControls = [];
    let workspaceDesktopPlaylistId = null;
    let pendingAndroidUpdateUrl = '';
    let pendingAndroidUpdateVersion = '';

    function $(id){return document.getElementById(id);}
    function t(k){return translations.zh[k]||k;}
    function sourceTranslationKey(source){
      if(source==='netease')return 'sourceNetease';
      if(source==='qq')return 'sourceQQ';
      if(source==='bilibili')return 'sourceBilibili';
      if(source==='qishui')return 'sourceQishui';
      if(source==='joox')return 'sourceJoox';
      return 'sourceNetease';
    }
    function trackDisplaySource(track){
      return track?.playbackSource || track?.source || 'netease';
    }
    let toastTimer = null;
    function showToast(msg,duration=2000){
      const toast=$('toast'); if(!toast)return;
      toast.textContent=msg;
      toast.classList.add('show');
      if(toastTimer)clearTimeout(toastTimer);
      toastTimer=setTimeout(()=>{toast.classList.remove('show');toastTimer=null;},duration);
    }
    function updateDesktopPlaybackVisual(){
      dom.playerPanel?.classList.toggle('is-playing',Boolean(state.isPlaying));
    }
    function isCurrentPlaying(track){
      return Boolean(track&&state.currentTrack&&state.currentTrack.uid===track.uid&&state.isPlaying);
    }
    // 所有列表里的播放图标（▶/⏸）统一跟随当前播放状态。
    function normalizeMatchText(value){
      return String(value||'').toLowerCase().replace(/\s+/g,'').trim();
    }
    function rowMatchesCurrent(rowUid,title,artist){
      if(!state.currentTrack)return false;
      if(rowUid&&rowUid===state.currentTrack.uid)return true;
      return normalizeMatchText(title)===normalizeMatchText(state.currentTrack.title)
        &&normalizeMatchText(artist)===normalizeMatchText(state.currentTrack.artist);
    }
    function updatePlayMarks(){
      const uid=state.currentTrack?.uid||'';
      const playing=Boolean(state.isPlaying);
      document.querySelectorAll('[data-track-uid]').forEach(row=>{
        const same=row.dataset.trackUid===uid
          ||(row.dataset.trackTitle&&normalizeMatchText(row.dataset.trackTitle)===normalizeMatchText(state.currentTrack?.title)
            &&normalizeMatchText(row.dataset.trackArtist)===normalizeMatchText(state.currentTrack?.artist));
        const mark=row.querySelector('.discovery-play-mark');
        if(mark)mark.textContent=same&&playing?'⏸':'▶';
        const btn=row.querySelector('.track-actions .btn-secondary');
        if(btn)btn.textContent=same&&playing?'⏸':'▶';
      });
    }
    function updateAuthUI(){
      const authenticated=state.isAuthenticated;
      document.body.classList.toggle('is-guest',!authenticated);
      if(dom.accountNavLabel)dom.accountNavLabel.textContent=authenticated?(state.profileName||'我的账号'):'登录';
      if(dom.accountNavAvatar){
        if(authenticated)dom.accountNavAvatar.textContent=(state.profileName||'H').slice(0,1).toUpperCase();
        else dom.accountNavAvatar.innerHTML=GUEST_AVATAR_ICON;
      }
      if(dom.accountNavButton){
        dom.accountNavButton.classList.toggle('is-authenticated',authenticated);
        dom.accountNavButton.setAttribute('aria-label',authenticated?`我的账号：${state.profileName}`:'登录账号');
        dom.accountNavButton.title=authenticated?'打开我的音乐':'登录 / 注册';
      }
    }
    function setAuthGate(authenticated){
      state.isAuthenticated=Boolean(authenticated);
      updateAuthUI();
    }
    const AUTH_ERROR_MESSAGES={
      google_not_configured:'Google 登录尚未配置，请联系管理员',
      google_database:'账号数据库暂不可用',
      google_cancelled:'已取消 Google 登录',
      google_state:'登录会话已过期，请重试',
      google_token:'Google 授权失败，请重试',
      google_profile:'无法读取 Google 资料，请重试',
      google_email:'Google 账号邮箱未验证，无法登录',
      google_conflict:'该邮箱已绑定其他 Google 账号',
      google_failed:'Google 登录失败，请稍后重试'
    };
    let authMode='login';
    let registerCodeTimer=null;

    function authMessage(value){
      return AUTH_ERROR_MESSAGES[value]||'登录失败，请稍后重试';
    }
    function setAuthError(element,message){
      if(!element)return;
      element.textContent=message||'';
      element.hidden=!message;
    }
    function setAuthMode(mode='login'){
      authMode=mode==='register'?'register':'login';
      const registering=authMode==='register';
      dom.loginForm.hidden=registering;
      dom.registerForm.hidden=!registering;
      dom.authTabLogin.classList.toggle('is-active',!registering);
      dom.authTabRegister.classList.toggle('is-active',registering);
      dom.authTabLogin.setAttribute('aria-selected',String(!registering));
      dom.authTabRegister.setAttribute('aria-selected',String(registering));
      dom.loginTitle.textContent=registering?'创建 HALO MUSIC 账号':'登录 HALO MUSIC';
      dom.loginDescription.textContent=registering?'邮箱验证码注册，或直接使用 Google 账号':'登录后可同步收藏与歌单；搜索和播放无需登录';
      dom.googleAuthLabel.textContent=registering?'使用 Google 账号注册':'使用 Google 账号继续';
      dom.loginSubmit.textContent='登录';
      dom.loginPasswordInput.autocomplete='current-password';
      setAuthError(dom.loginError,'');
      setAuthError(dom.registerError,'');
      setTimeout(()=>(registering?dom.registerEmailInput:dom.loginAccountInput).focus(),40);
    }
    function handleAuthRedirect(){
      let url;
      try{url=new URL(window.location.href);}catch(e){return;}
      const provider=url.searchParams.get('auth');
      const error=url.searchParams.get('auth_error');
      if(!provider&&!error)return;
      url.searchParams.delete('auth');
      url.searchParams.delete('auth_error');
      const query=url.searchParams.toString();
      try{history.replaceState(null,'',url.pathname+(query?`?${query}`:'')+url.hash);}catch(e){}
      if(error){showToast(authMessage(error));return;}
      if(provider==='google'&&state.isAuthenticated)showToast('已使用 Google 账号登录');
    }
    async function loadAuthSession(){
      let authenticated=false;
      try{
        const response=await fetch('/api/me',{credentials:'same-origin'});
        if(response.ok){
          const data=await response.json();
          if(data&&data.username){
            authenticated=true;
            state.profileName=data.username;
            setAuthGate(true);
            await loadLibraryForAuthenticatedUser();
            loadPlayQueueFromStorage(getPlayQueueStorageKey(data.username));
          }
        }
      }catch(e){}
      finally{
        setAuthGate(authenticated);
        updateAuthUI();
        if(!authenticated && !state.currentTrack && window.matchMedia('(min-width: 761px)').matches){
          setDesktopView('search');
        }
        handleAuthRedirect();
      }
    }
    function openLoginModal(mode='login'){
      setAuthMode(mode);
      dom.loginModal.classList.add('show');
      dom.loginModal.setAttribute('aria-hidden','false');
      setTimeout(()=>(mode==='register'?dom.registerEmailInput:dom.loginAccountInput).focus(),40);
    }
    function closeLoginModal(){
      dom.loginModal.classList.remove('show');
      dom.loginModal.setAttribute('aria-hidden','true');
      dom.loginPasswordInput.value='';
      dom.registerPasswordInput.value='';
    }
    function requirePlayback(){
      return true;
    }
    function requireLibraryAccess(){
      if(state.isAuthenticated)return true;
      showToast('登录后才能收藏和管理歌单');
      openLoginModal();
      return false;
    }
    async function completeAuth(username,successMessage='登录成功，收藏与歌单已同步'){
      setAuthGate(true);
      state.profileName=username||state.profileName;
      closeLoginModal();
      updateAuthUI();
      await loadLibraryForAuthenticatedUser();
      loadPlayQueueFromStorage(getPlayQueueStorageKey(state.profileName));
      renderPlaylistList();
      showToast(successMessage);
    }
    async function submitLogin(){
      const username=dom.loginAccountInput.value.trim();
      const password=dom.loginPasswordInput.value;
      if(!username||!password){setAuthError(dom.loginError,'请输入用户名和密码');return;}
      setAuthError(dom.loginError,'');
      dom.loginSubmit.disabled=true;
      dom.loginSubmit.textContent='登录中…';
      try{
        const response=await fetch('/api/login',{
          method:'POST',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({username,password})
        });
        const data=await response.json().catch(()=>({}));
        if(!response.ok){setAuthError(dom.loginError,data.error||'请求失败，请稍后重试');return;}
        await completeAuth(data.username||username);
      }catch(e){
        setAuthError(dom.loginError,'网络错误，无法连接登录服务');
      }finally{
        dom.loginSubmit.disabled=false;
        dom.loginSubmit.textContent='登录';
      }
    }
    async function sendRegisterCode(){
      const email=dom.registerEmailInput.value.trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){
        setAuthError(dom.registerError,'请输入有效的邮箱地址');
        return;
      }
      setAuthError(dom.registerError,'');
      dom.registerSendCode.disabled=true;
      let remaining=60;
      const renderCountdown=()=>{
        if(remaining<=0){
          dom.registerSendCode.textContent='重新发送';
          dom.registerSendCode.disabled=false;
          if(registerCodeTimer){clearInterval(registerCodeTimer);registerCodeTimer=null;}
          return;
        }
        dom.registerSendCode.textContent=`${remaining}s 后重发`;
        remaining-=1;
      };
      try{
        const response=await fetch('/api/email-code',{
          method:'POST',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({email})
        });
        const data=await response.json().catch(()=>({}));
        if(!response.ok){
          setAuthError(dom.registerError,data.error||'验证码发送失败，请稍后重试');
          dom.registerSendCode.disabled=false;
          dom.registerSendCode.textContent='发送验证码';
          return;
        }
        showToast('验证码已发送，请检查邮箱');
        remaining=Number(data.cooldown||60);
        renderCountdown();
        registerCodeTimer=setInterval(renderCountdown,1000);
      }catch(e){
        setAuthError(dom.registerError,'网络错误，无法发送验证码');
        dom.registerSendCode.disabled=false;
        dom.registerSendCode.textContent='发送验证码';
      }
    }
    async function submitRegister(){
      const email=dom.registerEmailInput.value.trim();
      const code=dom.registerCodeInput.value.trim();
      const username=dom.registerUsernameInput.value.trim();
      const password=dom.registerPasswordInput.value;
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){setAuthError(dom.registerError,'请输入有效的邮箱地址');return;}
      if(!/^\d{6}$/.test(code)){setAuthError(dom.registerError,'请输入 6 位邮箱验证码');return;}
      if(username.length<3||username.length>20){setAuthError(dom.registerError,'用户名需为 3–20 位');return;}
      if(password.length<8){setAuthError(dom.registerError,'密码至少需要 8 位');return;}
      setAuthError(dom.registerError,'');
      dom.registerSubmit.disabled=true;
      dom.registerSubmit.textContent='创建中…';
      try{
        const response=await fetch('/api/register',{
          method:'POST',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({email,code,username,password})
        });
        const data=await response.json().catch(()=>({}));
        if(!response.ok){setAuthError(dom.registerError,data.error||'注册失败，请稍后重试');return;}
        await completeAuth(data.username||username,'账号创建成功，已自动登录');
      }catch(e){
        setAuthError(dom.registerError,'网络错误，无法连接注册服务');
      }finally{
        dom.registerSubmit.disabled=false;
        dom.registerSubmit.textContent='创建账号';
      }
    }
    function startGoogleAuth(){
      window.location.assign('/api/auth/google/start');
    }
    async function toggleAuth(){
      if(!state.isAuthenticated){openLoginModal();return;}
      await librarySaveChain;
      const previousUsername=state.profileName;
      try{await fetch('/api/logout',{method:'POST',credentials:'same-origin'});}catch(e){}
      try{
        if(previousUsername){
          localStorage.removeItem(getLibraryStorageKey(previousUsername));
          localStorage.removeItem(getPlayQueueStorageKey(previousUsername));
        }
      }catch(e){}
      dom.audio.pause();
      state.isAuthenticated=false;
      state.profileName='';
      state.favorites=[];
      state.playlists=[];
      state.playQueue=[];
      state.currentTrack=null;
      document.body.classList.remove('has-track');
      state.playContext={type:'results',index:-1,playlistId:null};
      closeAccountProfile();
      renderPlaylistOptions();
      renderPlaylistList();
      updateMainFavButton();
      setAuthGate(false);
      showToast('已退出登录，收藏和歌单已隐藏');
    }
    function applyTheme(theme){
      const next=theme==='light'?'light':'dark';
      document.documentElement.dataset.theme=next;
      dom.themeIcon.innerHTML=next==='light'?MOON_ICON:SUN_ICON;
      dom.themeToggle.title=next==='light'?'切换暗色模式':'切换亮色模式';
      // Keep the mobile browser chrome in step with the app background.
      const meta=document.querySelector('meta[name="theme-color"]');
      if(meta) meta.setAttribute('content',next==='light'?'#f7f7f2':'#18201c');
      try{localStorage.setItem(THEME_STORAGE_KEY,next);}catch(e){}
    }
    function toggleTheme(){
      applyTheme(document.documentElement.dataset.theme==='light'?'dark':'light');
    }
    function formatTime(sec){
      if(!isFinite(sec)||sec<0)sec=0;
      const m=Math.floor(sec/60);const s=Math.floor(sec%60);
      return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
    }

    function getInterleavedSearchList(){
      const grouped={netease:[],qq:[]};
      state.searchResults.forEach(t=>{if(grouped[t.source])grouped[t.source].push(t);});
      Object.keys(grouped).forEach(k=>grouped[k].sort((a,b)=>(a.displayIndex||0)-(b.displayIndex||0)));
      const order=['netease','qq'];
      const idx={netease:0,qq:0};
      const out=[];
      let added=true;
      while(added){
        added=false;
        for(const s of order){
          const arr=grouped[s]; const i=idx[s];
          if(arr && i<arr.length){out.push(arr[i]);idx[s]++;added=true;}
        }
      }
      return out;
    }

    // 界面只提供中文，文案在启动时统一注入一次即可。
    function applyStaticText(){
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const key=el.dataset.i18n;
        if(key) el.textContent = t(key);
      });
      document.querySelectorAll('[data-i18n-title]').forEach(el=>{
        const key=el.dataset.i18nTitle;
        if(key){el.title=t(key);el.setAttribute('aria-label',t(key));}
      });
      dom.searchInput.placeholder = '输入歌名 / 歌手，回车搜索…';
      dom.playlistNameInput.placeholder = '例如：通勤歌单 / 宝可梦歌单';
      renderPlaylistOptions();
      updatePlaylistInfoLabel();
    }

    // 音质标签只展示上游明确标注的结果；无法确认时不显示，避免误导性宣传。

    // ===================== 歌单缓存 / 导出 =====================

    function serializeTrack(track){
      if(!track) return null;
      const keys=[
        'uid','source','displayIndex','keyword','songid','songMid','qqId','qqSearchKey','qqIndex','jooxIndex',
        'title','artist','album','cover','pageUrl','duration','mediaMid',
        'quality','qualityLabel','qqQualityText','pay'
      ];
      const out={};
      keys.forEach(k=>{
        if(track[k]!==undefined && track[k]!==null && track[k]!=='') out[k]=track[k];
      });
      out.detailsLoaded=false;
      out.audioUrl=null;
      out.lrc=null;
      out.lrcUrl=null;
      return out.uid ? out : null;
    }

    function deserializeTrack(raw){
      if(raw && raw.source === 'migu') return null;
      const track=serializeTrack(raw);
      if(!track) return null;
      track.detailsLoaded=false;
      track.audioUrl=null;
      track.lrc=null;
      track.lrcUrl=null;
      return track;
    }

    function getLibrarySnapshot(){
      return {
        version:1,
        savedAt:new Date().toISOString(),
        favorites:state.favorites.map(serializeTrack).filter(Boolean),
        playlists:state.playlists.map(pl=>({
          id:pl.id,
          name:pl.name,
          ...(pl.desc?{desc:String(pl.desc).slice(0,200)}:{}),
          tracks:(pl.tracks||[]).map(serializeTrack).filter(Boolean)
        }))
      };
    }

    function getLibraryStorageKey(username=state.isAuthenticated ? state.profileName : ''){
      return `${LIBRARY_STORAGE_KEY}:${username ? `user:${username}` : 'guest'}`;
    }

    function getPlayQueueStorageKey(username=state.isAuthenticated ? state.profileName : ''){
      return `${PLAY_QUEUE_STORAGE_KEY}:${username ? `user:${username}` : 'guest'}`;
    }

    function savePlayQueueToStorage(){
      try{
        localStorage.setItem(getPlayQueueStorageKey(),JSON.stringify({
          version:1,
          tracks:state.playQueue.map(serializeTrack).filter(Boolean)
        }));
      }catch(error){
        console.warn('save play queue failed',error);
      }
    }

    function loadPlayQueueFromStorage(key=getPlayQueueStorageKey()){
      try{
        const raw=localStorage.getItem(key);
        const data=raw?JSON.parse(raw):null;
        state.playQueue=Array.isArray(data?.tracks)
          ? data.tracks.map(deserializeTrack).filter(Boolean)
          : [];
        state.playQueue.forEach(track=>{
          if(track?.uid&&!state.trackMap.has(track.uid))state.trackMap.set(track.uid,track);
        });
      }catch(error){
        state.playQueue=[];
        console.warn('load play queue failed',error);
      }
    }

    function writeLibraryToStorage(snapshot, key=getLibraryStorageKey()){
      try{
        localStorage.setItem(key, JSON.stringify(snapshot));
      }catch(e){
        console.warn('save library failed', e);
      }
    }

    function queueLibraryDatabaseSave(snapshot){
      const username=state.profileName;
      if(!state.isAuthenticated || !username)return;
      librarySaveChain=librarySaveChain.then(async()=>{
        if(!state.isAuthenticated || state.profileName!==username)return;
        const response=await fetch('/api/library',{
          method:'PUT',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(snapshot)
        });
        if(!response.ok){
          const data=await response.json().catch(()=>({}));
          throw new Error(data.error||`library sync failed (${response.status})`);
        }
      }).catch(error=>console.warn('sync library failed', error));
    }

    function saveLibraryToStorage(){
      const snapshot=getLibrarySnapshot();
      writeLibraryToStorage(snapshot);
      queueLibraryDatabaseSave(snapshot);
    }

    function rebuildLibraryTrackMap(){
      [...state.favorites, ...state.playlists.flatMap(pl=>pl.tracks||[])].forEach(track=>{
        if(track && track.uid && !state.trackMap.has(track.uid)){
          state.trackMap.set(track.uid, track);
        }
      });
    }

    function applyLibrarySnapshot(data){
      if(!data || typeof data!=='object')return false;
      state.favorites=Array.isArray(data.favorites)
        ? data.favorites.map(deserializeTrack).filter(Boolean)
        : [];
      state.playlists=Array.isArray(data.playlists)
        ? data.playlists.map((pl,idx)=>({
            id:pl.id || ('pl-cached-'+idx+'-'+Date.now()),
            name:pl.name || '未命名歌单',
            desc:typeof pl.desc==='string'?pl.desc.slice(0,200):'',
            tracks:Array.isArray(pl.tracks) ? pl.tracks.map(deserializeTrack).filter(Boolean) : []
          }))
        : [];
      rebuildLibraryTrackMap();
      return true;
    }

    function readLibrarySnapshotFromStorage(key){
      try{
        const raw=localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      }catch(e){
        console.warn('load library failed', e);
        return null;
      }
    }

    function loadLibraryFromStorage(key=getLibraryStorageKey()){
      const snapshot=readLibrarySnapshotFromStorage(key);
      return snapshot ? applyLibrarySnapshot(snapshot) : false;
    }

    async function loadLibraryForAuthenticatedUser(){
      if(!state.isAuthenticated || !state.profileName)return;
      const username=state.profileName;
      const fallbackSnapshot=getLibrarySnapshot();
      const userKey=getLibraryStorageKey(username);
      const hasAccountCache=loadLibraryFromStorage(userKey);
      const legacySnapshot=hasAccountCache ? null : readLibrarySnapshotFromStorage(LIBRARY_STORAGE_KEY);

      try{
        const response=await fetch('/api/library',{credentials:'same-origin'});
        if(!response.ok)throw new Error(`library load failed (${response.status})`);
        const data=await response.json();
        if(!state.isAuthenticated || state.profileName!==username)return;
        if(data.library){
          applyLibrarySnapshot(data.library);
          writeLibraryToStorage(getLibrarySnapshot(),userKey);
        }else{
          if(!hasAccountCache)applyLibrarySnapshot(legacySnapshot||fallbackSnapshot);
          const snapshot=getLibrarySnapshot();
          writeLibraryToStorage(snapshot,userKey);
          queueLibraryDatabaseSave(snapshot);
        }
      }catch(error){
        console.warn('load cloud library failed', error);
        if(!hasAccountCache)applyLibrarySnapshot(legacySnapshot||fallbackSnapshot);
      }

      renderPlaylistOptions();
      renderPlaylistList();
      updateMainFavButton();
    }

    function exportPlaylistData(){
      const payload=getLibrarySnapshot();
      const hasAny=payload.favorites.length || payload.playlists.length;
      if(!hasAny){showToast(t('toastPlaylistExportEmpty'));return;}

      const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      const date=new Date().toISOString().slice(0,10);
      a.href=url;
      a.download='halo-music-playlists-'+date+'.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast(t('toastPlaylistExported'));
    }

    function importText(...values){
      for(const value of values){
        if(value===undefined||value===null)continue;
        if(typeof value==='object')continue;
        const text=String(value).trim();
        if(text)return text;
      }
      return '';
    }

    function importArtist(raw){
      const value=raw?.ar||raw?.artists||raw?.singer||raw?.singers||raw?.artist||raw?.artistName
        ||raw?.singer_name||raw?.singerName||raw?.singername||raw?.['歌手']||raw?.['歌手名'];
      if(Array.isArray(value))return value.map(item=>importText(item?.name,item?.title,item?.singer_name,item?.['歌手'],item)).filter(Boolean).join(' / ');
      if(value&&typeof value==='object')return importText(value.name,value.title,value.singer_name,value['歌手']);
      return importText(value);
    }

    function importTrackId(raw, source){
      const ids={
        netease:[raw.id,raw.songid,raw.songId,raw.song_id,raw.songID,raw.trackId],
        qq:[raw.songmid,raw.songMid,raw.song_mid,raw.mid,raw?.file?.media_mid,raw.id,raw.songid,raw.songId]
      };
      const id=importText(...(ids[source]||[]));
      return id;
    }

    function normalizeImportCover(raw, source){
      const cover=importText(
        raw?.al?.picUrl,raw?.al?.pic_str,raw?.album?.picUrl,raw?.album?.cover,raw?.album?.pic,
        raw.pic,raw.picUrl,raw.cover,raw.albumPic,raw.album_pic,raw.albumUrl,raw['专辑图片']
      );
      if(cover)return cover;
      const albumMid=importText(raw?.album?.mid,raw.albummid,raw.albumMid);
      return source==='qq'&&albumMid ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albumMid}.jpg` : '';
    }

    function normalizeProviderTrack(raw, source, index){
      if(!raw||typeof raw!=='object')return null;
      if(source!=='netease'&&source!=='qq')return null;
      const id=importTrackId(raw,source);
      const title=importText(raw.name,raw.songname,raw.songName,raw.song_name,raw.title,raw.musicName,raw.trackName,raw['歌曲名称'],raw['歌名']);
      if(!title)return null;
      const artist=importArtist(raw)||importText(raw.artist_name,raw.artistName,raw['艺术家'],'Unknown');
      const album=importText(raw?.al?.name,raw?.album?.name,raw.albumname,raw.albumName,raw.album_name,raw.album,raw['专辑']);
      const cover=normalizeImportCover(raw,source);
      const safeId=id||`${title}-${artist}-${index}`;
      const track={
        uid:`${source}-${safeId}`,
        source,
        songid:safeId,
        title,
        artist,
        album,
        cover,
        keyword:`${title} ${artist}`.trim(),
        detailsLoaded:false,
        audioUrl:null,
        lrc:null,
        lrcUrl:null
      };
      if(source==='qq'){
        track.qqId=safeId;
        track.songMid=safeId;
        track.qqSearchKey=track.keyword;
      }
      return track;
    }

    function normalizeExternalPlaylist(data){
      if(!data||typeof data!=='object')return null;
      if(Array.isArray(data.favorites)||Array.isArray(data.playlists))return data;

      const result={favorites:[],playlists:[]};
      const addPlaylist=(source,raw,name,tracks)=>{
        if(!Array.isArray(tracks))return false;
        const normalized=tracks.map((track,index)=>normalizeProviderTrack(track,source,index)).filter(Boolean);
        if(!normalized.length)return false;
        result.playlists.push({
          id:`import-${source}-${importText(raw?.id,raw?.dissid,raw?.rid,raw?.playlistId,raw?.playlist_id,name,Date.now())}-${result.playlists.length}`,
          name:importText(name,raw?.name,raw?.title,raw?.dissname,raw?.playlistName,raw?.listName,'导入歌单'),
          tracks:normalized
        });
        return true;
      };
      const firstArray=(...values)=>values.find(Array.isArray);
      const qqPayload=data?.req_0?.data||data?.req_1?.data||data?.data||data;

      // NetEase Cloud Music: playlist detail responses use playlist.tracks and each track has ar/al.
      const neteasePlaylist=data.playlist&&Array.isArray(data.playlist.tracks)&&data.playlist.tracks.some(track=>track?.ar||track?.al)
        ? data.playlist : null;
      if(neteasePlaylist){
        addPlaylist('netease',neteasePlaylist,neteasePlaylist.name,neteasePlaylist.tracks);
      }else if(Array.isArray(data.tracks)&&data.tracks.some(track=>track?.ar||track?.al)){
        addPlaylist('netease',data,data.name||data.title,data.tracks);
      }

      // QQ Music's playlist detail APIs use cdlist[].songlist, including the req_0.data wrapper.
      const qqLists=firstArray(data.cdlist,data?.data?.cdlist,data?.req_0?.data?.cdlist,data?.req_1?.data?.cdlist);
      let hasQQPlaylist=false;
      if(qqLists){
        qqLists.forEach(list=>{
          hasQQPlaylist=addPlaylist('qq',list,list.dissname||list.name||list.title,list.songlist||list.songList||list.tracks)||hasQQPlaylist;
        });
      }else{
        const qqTracks=firstArray(qqPayload.songlist,qqPayload.songList);
        if(qqTracks)hasQQPlaylist=addPlaylist('qq',qqPayload,qqPayload.dissname||qqPayload.name||qqPayload.title,qqTracks);
      }

      return result.playlists.length?result:null;
    }

    function mergeImportedTracks(targetList, rawTracks){
      let added=0;
      if(!Array.isArray(rawTracks)) return added;

      rawTracks.forEach(raw=>{
        const imported=deserializeTrack(raw);
        if(!imported || !imported.uid) return;

        const track=state.trackMap.get(imported.uid) || imported;
        if(!state.trackMap.has(track.uid)) state.trackMap.set(track.uid, track);

        if(!targetList.some(item=>item.uid===track.uid)){
          targetList.push(track);
          added++;
        }
      });

      return added;
    }

    function importPlaylistData(data){
      if(!data || typeof data!=='object') throw new Error('invalid import data');
      const normalized=normalizeExternalPlaylist(data);
      if(!normalized) return {empty:true, addedFavorites:0, addedPlaylists:0, addedPlaylistTracks:0, totalAdded:0};
      data=normalized;

      let addedFavorites=0;
      let addedPlaylists=0;
      let addedPlaylistTracks=0;

      addedFavorites=mergeImportedTracks(state.favorites, data.favorites);

      const importedPlaylists=Array.isArray(data.playlists) ? data.playlists : [];
      importedPlaylists.forEach((pl,idx)=>{
        if(!pl || typeof pl!=='object') return;

        const fallbackName='导入歌单';
        const name=(pl.name || fallbackName).toString().trim() || fallbackName;
        const rawId=(pl.id || '').toString().trim();

        let target=rawId ? state.playlists.find(item=>item.id===rawId) : null;
        if(!target) target=state.playlists.find(item=>item.name===name);

        if(!target){
          let id=rawId || ('pl-import-'+Date.now()+'-'+idx+'-'+Math.random().toString(16).slice(2));
          if(state.playlists.some(item=>item.id===id)){
            id='pl-import-'+Date.now()+'-'+idx+'-'+Math.random().toString(16).slice(2);
          }
          target={id,name,tracks:[]};
          state.playlists.push(target);
          addedPlaylists++;
        }

        addedPlaylistTracks += mergeImportedTracks(target.tracks, pl.tracks);
      });

      const totalAdded=addedFavorites + addedPlaylists + addedPlaylistTracks;
      const hasUsableData=(Array.isArray(data.favorites) && data.favorites.length) || importedPlaylists.length;
      if(!hasUsableData) return {empty:true, addedFavorites, addedPlaylists, addedPlaylistTracks, totalAdded};

      rebuildLibraryTrackMap();
      renderPlaylistOptions();
      saveLibraryToStorage();
      renderPlaylistList();
      updateMainFavButton();

      return {empty:false, addedFavorites, addedPlaylists, addedPlaylistTracks, totalAdded};
    }

    function playlistImportSuccessMessage(stat,meta={}){
      const base=`${t('toastPlaylistImported')}：新增 ${stat.addedPlaylists} 个歌单，${stat.addedFavorites} 首收藏，${stat.addedPlaylistTracks} 首歌单歌曲。`;
      if(!meta.truncated)return base;
      const skipped=Math.max(0,Number(meta.total||0)-Number(meta.imported||0));
      return `${base} 原歌单共 ${meta.total} 首，受平台单次导入限制只导入了前 ${meta.imported} 首，跳过 ${skipped} 首。`;
    }

    function openImportPlaylistModal(){
      if(!requireLibraryAccess())return;
      dom.importPlaylistModal.classList.add('show');
      dom.importPlaylistModal.setAttribute('aria-hidden','false');
      dom.importPlaylistUrl.value='';
      dom.importPlaylistNote.textContent=t('importPlaylistNote');
      if(window.matchMedia('(min-width:761px) and (hover:hover)').matches){
        setTimeout(()=>dom.importPlaylistUrl.focus(),40);
      }
    }

    function closeImportPlaylistModal(){
      if(dom.importPlaylistConfirm.disabled)return;
      dom.importPlaylistModal.classList.remove('show');
      dom.importPlaylistModal.setAttribute('aria-hidden','true');
    }

    function setImportPlaylistLoading(loading){
      dom.importPlaylistConfirm.disabled=loading;
      dom.importPlaylistFileBtn.disabled=loading;
      dom.importPlaylistCancel.disabled=loading;
      dom.importPlaylistModal.classList.toggle('is-loading',loading);
      dom.importPlaylistConfirm.textContent=loading?t('importPlaylistLoading'):t('importPlaylistConfirm');
      dom.importPlaylistNote.textContent=loading?t('importPlaylistLoading'):t('importPlaylistNote');
    }

    function releaseImportPlaylistFocus(){
      if(document.activeElement===dom.importPlaylistUrl)dom.importPlaylistUrl.blur();
    }

    async function importPlaylistFromLink(){
      if(!requireLibraryAccess())return;
      const url=dom.importPlaylistUrl.value.trim();
      if(!url){showToast('请粘贴歌单分享链接。');return;}
      releaseImportPlaylistFocus();
      setImportPlaylistLoading(true);
      try{
        const response=await fetch('/api/import-playlist',{
          method:'POST',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({url})
        });
        const data=await response.json().catch(()=>({}));
        if(!response.ok)throw new Error(data.error||`playlist import failed (${response.status})`);
        const stat=importPlaylistData(data);
        if(stat.empty){showToast(t('toastPlaylistImportEmpty'));return;}
        const imported=data.playlists?.[0]?.tracks?.length||stat.addedPlaylistTracks;
        showToast(playlistImportSuccessMessage(stat,{truncated:data.truncated,total:data.total,imported}),5000);
        dom.importPlaylistUrl.value='';
        dom.importPlaylistModal.classList.remove('show');
        dom.importPlaylistModal.setAttribute('aria-hidden','true');
      }catch(error){
        console.error('import playlist link failed',error);
        showToast(error.message||t('toastPlaylistImportError'));
      }finally{
        setImportPlaylistLoading(false);
      }
    }

    function handleImportPlaylistFile(e){
      if(!requireLibraryAccess()){e.target.value='';return;}
      const input=e.target;
      const file=input.files && input.files[0];
      if(!file) return;

      const reader=new FileReader();
      reader.onload=()=>{
        try{
          const data=JSON.parse(reader.result);
          const stat=importPlaylistData(data);
          if(stat.empty){
            showToast(t('toastPlaylistImportEmpty'));
          }else{
            showToast(playlistImportSuccessMessage(stat),5000);
            dom.importPlaylistModal.classList.remove('show');
            dom.importPlaylistModal.setAttribute('aria-hidden','true');
          }
        }catch(err){
          console.error('import playlist failed', err);
          showToast(t('toastPlaylistImportError'));
        }finally{
          input.value='';
        }
      };
      reader.onerror=()=>{
        showToast(t('toastPlaylistImportError'));
        input.value='';
      };
      reader.readAsText(file, 'utf-8');
    }

    function renderPlaylistOptions(){
      if(!state.playlists.length){
        state.playContext.playlistId=null;
        return;
      }
      const prev=state.playContext.playlistId;
      const nextValue=state.playlists.some(pl=>pl.id===prev) ? prev : state.playlists[0].id;
      state.playContext.playlistId=nextValue;
    }

    function getSelectedPlaylistId(){
      return state.mobilePlaylistDetailId || state.playContext.playlistId || state.playlists[0]?.id || '';
    }

    // ===================== 各平台搜索 =====================

    function isDuplicateSearchTrack(track){
      const title=normalizeMusicMatchText(track?.title);
      const artist=normalizeMusicMatchText(track?.artist);
      if(!title)return false;
      const key=`${title}|${artist}`;
      return state.searchResults.some(existing=>`${normalizeMusicMatchText(existing?.title)}|${normalizeMusicMatchText(existing?.artist)}`===key);
    }

    // 网易云搜索：通过同源服务端代理
    async function searchNetease(kw, page, num, token=searchRequestToken){
      const requestLimit=Math.max(1,page||1)*Math.max(1,num||10);
      const url=`/api/music?action=netease_search&q=${encodeURIComponent(kw)}&limit=${encodeURIComponent(requestLimit)}`;
      let added=0;

      function pickQueryParam(rawUrl, key){
        if(!rawUrl)return '';
        try{
          return new URL(rawUrl, window.location.href).searchParams.get(key) || '';
        }catch(e){
          const m=String(rawUrl).match(new RegExp('[?&]'+key+'=([^&]+)'));
          return m ? decodeURIComponent(m[1]) : '';
        }
      }

      try{
        const res=await fetchWithTimeout(url,{},10000);
        const json=await res.json();
        if(token!==searchRequestToken)return 0;
        const rows=Array.isArray(json)?json:json?.data;
        if(!Array.isArray(rows))return 0;

        rows.forEach((it, idx)=>{
          if(token!==searchRequestToken)return;
          const songId = pickQueryParam(it.url, 'id') || String(it.id||it.songid||it.song_id||it.url_id||'').trim();
          if(!/^\d{1,20}$/.test(songId))return;
          const uid=`netease-${songId}`;
          if(state.trackMap.has(uid))return;

          const track={
            uid,
            source:'netease',
            displayIndex:idx+1,
            keyword:kw,

            songid:songId,
            title:it.name||it.title||'',
            artist:Array.isArray(it.artist)?it.artist.join(' / '):(it.artist||it.author||''),
            album:'',

            cover:it.pic||it.cover||it.coverUrl||null,
            audioUrl:`/api/music?action=netease_audio&id=${encodeURIComponent(songId)}`,
            lrc:null,
            lrcUrl:`/api/music?action=netease_lyric&id=${encodeURIComponent(songId)}`,

            detailsLoaded:false,
            quality:null,
            qualityLabel:null
          };
          if(isDuplicateSearchTrack(track))return;
          state.trackMap.set(uid,track);
          state.searchResults.push(track);
          added++;
        });

      }catch(e){console.error('netease proxy search',e);}
      return added;
    }

    // 界面上的「QQ音乐」入口现在由 QQ源 提供数据。
    // 保留 source:'qq' 与原有文案，后端换成 joox_search。
    async function searchQQ(kw, limit, token=searchRequestToken) {
      const url=`/api/music?action=joox_search&q=${encodeURIComponent(kw)}&limit=${encodeURIComponent(limit)}`;
      let added=0;
      try{
        const res=await fetchWithTimeout(url,{},12000);
        const json=await res.json();
        if(token!==searchRequestToken)return 0;
        if(!res.ok||json.code!==200||!Array.isArray(json.data))throw new Error(json.error||'QQ源 搜索失败');
        json.data.forEach((it,idx)=>{
          if(token!==searchRequestToken)return;
          const mid=String(it.songmid||'').trim();
          if(!mid)return;
          const uid=`qq-${mid}`;
          if(state.trackMap.has(uid))return;
          const index=Number(it.index)||idx+1;
          const track={
            uid,
            source:'qq',
            displayIndex:idx+1,
            keyword:kw,
            qqSearchKey:kw,
            jooxIndex:index,
            qqIndex:index,
            qqId:mid,
            songid:String(it.songid||mid),
            songMid:mid,
            mediaMid:mid,
            title:it.title||'',
            artist:it.artist||'',
            album:it.album||'',
            cover:null,
            duration:Number(it.duration)||0,
            audioUrl:null,
            lrc:null,
            lrcUrl:null,
            detailsLoaded:false,
            quality:null,
            qualityLabel:null,
            qqQualityText:null,
            pay:null,
            resolverSource:'joox'
          };
          if(isDuplicateSearchTrack(track))return;
          state.trackMap.set(uid,track);
          state.searchResults.push(track);
          added++;
        });
      }catch(e){
        console.error('joox search pool',e);
      }
      return added;
    }

    // ===================== 聚合搜索 =====================

    async function searchAllSources(reset){
      if(!state.searchKeyword){
        // 空关键词 = 回到发现页，而不是反复弹「请先输入关键词」。
        state.searchResults=[];
        state.trackMap.clear();
        state.noMoreResults=false;
        state.selectedSearchUids.clear();
        updateBatchToolbar();
        renderMiniSearchList();
        return;
      }
      const enabled=Object.keys(state.enabledSources).filter(k=>state.enabledSources[k]);
      if(!enabled.length){showToast(t('searchStatusNoSource'));return;}
      if(state.searchInProgress&&!reset)return;
      if(reset)searchRequestToken+=1;
      const requestToken=searchRequestToken;
      state.searchInProgress=true;
      dom.searchStatus.textContent=t('searchStatusSearching');

      if(reset){
        recordSearchHistory(state.searchKeyword);
        Object.keys(state.perSourceCurrentLimit)
          .forEach(k=>state.perSourceCurrentLimit[k]=state.perSourceLimit);
        Object.keys(state.perSourcePage).forEach(k=>state.perSourcePage[k]=1);

        state.searchResults=[];
        state.trackMap.clear();
        state.noMoreResults=false;
        state.selectedSearchUids.clear();
        updateBatchToolbar();
        renderMiniSearchList();
      }

      const kw=state.searchKeyword;
      const tasks=[];
      for(const s of enabled){
        const limit=state.perSourceCurrentLimit[s]||state.perSourceLimit;
        if(s==='netease')tasks.push(searchNetease(kw, state.perSourcePage.netease||1, state.perSourceLimit, requestToken));
        if(s==='qq')tasks.push(searchQQ(kw,limit,requestToken));
      }
      let added=0;
      try{
        const res=await Promise.all(tasks);
        added=res.reduce((a,b)=>a+(b||0),0);
      }catch(e){
        console.error(e);
        showToast(t('toastSearchError'));
      }

      if(requestToken!==searchRequestToken)return;
      state.searchInProgress=false;
      dom.searchStatus.textContent=t('searchStatusDone');
      renderMiniSearchList();
      renderPlaylistList();
      updateBatchToolbar();
      if(!state.currentTrack && state.searchResults.length){
        playFromList('search',0);
      }
      state.noMoreResults=added===0;
    }

    // ===================== 各平台详情 =====================

    // 网易云详情：搜索结果已返回播放、封面、歌词接口，这里只补全缓存歌曲和歌词内容
    async function fetchNeteaseDetails(track){
      if(track.songid){
        if(!track.audioUrl)track.audioUrl=`/api/music?action=netease_audio&id=${encodeURIComponent(track.songid)}`;
        if(!track.lrcUrl)track.lrcUrl=`/api/music?action=netease_lyric&id=${encodeURIComponent(track.songid)}`;
      }



      if(!track.lrc && track.lrcUrl){
        try{
          const lr=await fetchWithTimeout(track.lrcUrl,{},10000);
          const contentType=(lr.headers.get('content-type')||'').toLowerCase();
          if(contentType.includes('json')){
            const lj=await lr.json();
            track.lrc =
              (typeof lj === 'string' ? lj : null) ||
              lj?.lrc ||
              lj?.lyric ||
              lj?.data?.lrc ||
              lj?.data?.lyric ||
              (typeof lj?.data === 'string' ? lj.data : null) ||
              track.lrc ||
              null;
          }else{
            track.lrc=await lr.text();
          }
        }catch(e){
          console.warn('netease proxy lyric fetch failed', e);
        }
      }

      track.detailsLoaded=true;
    }

    // 「QQ音乐」入口的实际音源：QQ源。
    // 播放地址直接指向同源 joox_audio，由服务端按关键词 + 结果序号取流。
    // 封面和歌词独立于音源解析：本地播放、解析失败时也要能补上。
    async function refreshQqMetadata(track){
      if(!track)return;
      const keyword=(track.qqSearchKey||track.keyword||`${track.title||''} ${track.artist||''}`).trim();
      const index=Number(track.jooxIndex)||Number(track.displayIndex)||1;
      const tasks=[];
      if(!track.cover){
        const memo=coverMemo.get(track.uid);
        if(memo)track.cover=memo;
        else tasks.push((async()=>{
          try{
            const coverParams=new URLSearchParams({action:'cover_lookup',title:track.title||'',artist:track.artist||''});
            if(track.duration)coverParams.set('duration',String(track.duration));
            const coverResponse=await fetchWithTimeout(`/api/music?${coverParams}`,{},12000);
            const coverJson=await coverResponse.json().catch(()=>null);
            const cover=coverJson?.data?.cover||'';
            if(cover){
              track.cover=cover;
              coverMemo.set(track.uid,cover);
            }
          }catch(error){
            console.warn('cover lookup unavailable',error);
          }
        })());
      }
      if(!track.lrc&&keyword){
        tasks.push((async()=>{
          try{
            const lyricParams=new URLSearchParams({action:'joox_lyric',q:keyword,n:String(index)});
            if(track.title)lyricParams.set('title',track.title);
            if(track.artist)lyricParams.set('artist',track.artist);
            if(track.duration)lyricParams.set('duration',String(track.duration));
            const lyricResponse=await fetchWithTimeout(`/api/music?${lyricParams}`,{},12000);
            const lyricJson=await lyricResponse.json().catch(()=>null);
            const lyric=lyricJson?.data?.lyric||'';
            if(lyric)track.lrc=lyric;
          }catch(error){
            console.warn('lyric lookup unavailable',error);
          }
        })());
      }
      if(tasks.length)await Promise.allSettled(tasks);
    }

    async function fetchQQDetails(track,options={}) {
      const keyword=(track.qqSearchKey||track.keyword||`${track.title||''} ${track.artist||''}`).trim();
      const index=Number(track.jooxIndex)||Number(track.displayIndex)||1;
      if(!keyword)throw new Error('QQ源 关键词缺失');
      const params=new URLSearchParams({action:'joox_audio',q:keyword,n:String(index)});
      const audioUrl=`/api/music?${params}`;
      Object.assign(track,{
        audioUrl,
        audioCandidates:[audioUrl],
        playbackSource:'qq',
        lrcUrl:null,
        quality:track.quality||null,
        qualityLabel:track.qualityLabel||null
      });
      await refreshQqMetadata(track);
      // 歌词和封面都落定后再标记就绪，否则播放路径会提前返回、歌词渲染成空。
      track.detailsLoaded=true;
    }

    // 常见繁简差异（QQ源 的歌手名多为繁体），匹配前统一，避免「周杰倫」对不上「周杰伦」。
    const TRADITIONAL_CHARS={'傑':'杰','倫':'伦','陳':'陈','華':'华','鄧':'邓','張':'张','劉':'刘','謙':'谦','孫':'孙','楊':'杨','黃':'黄','龍':'龙','鳳':'凤','許':'许','齊':'齐','羅':'罗','葉':'叶','趙':'赵','藍':'蓝','雲':'云','韓':'韩','貝':'贝'};

    function normalizeMusicMatchText(value){
      return String(value||'').toLowerCase()
        .replace(/[\s\-—_·•()（）【】\[\]《》'".,，。:：;；!?！？]/g,'')
        .replace(/[傑倫陳華鄧張劉謙孫楊黃龍鳳許齊羅葉趙藍雲韓貝]/g,ch=>TRADITIONAL_CHARS[ch]||ch);
    }

    // QQ源 行用 title/artist，QQ 行用 song_title/singer_name，两种字段都认。
    function scoreQQImportCandidate(track,candidate){
      const targetTitle=normalizeMusicMatchText(track.title);
      const targetArtist=normalizeMusicMatchText(track.artist);
      const title=normalizeMusicMatchText(candidate.song_title||candidate.song_name||candidate.name||candidate.title);
      const artist=normalizeMusicMatchText(candidate.singer_name||candidate.artist);
      let score=0;
      if(title===targetTitle)score+=100;
      else if(title&&targetTitle&&(title.includes(targetTitle)||targetTitle.includes(title)))score+=45;
      if(artist===targetArtist)score+=50;
      else if(artist&&targetArtist&&(artist.includes(targetArtist)||targetArtist.includes(artist)))score+=24;
      return score;
    }

    // 汽水分享页通常不暴露可直接播放的音源 ID，首次播放时按歌名和歌手匹配 QQ 音源。
    async function fetchQishuiDetails(track){
      if(!track.qqId){
        const keyword=(track.keyword||`${track.title||''} ${track.artist||''}`).trim();
        const response=await fetchWithTimeout(`/api/music?action=qq_search&q=${encodeURIComponent(keyword)}&limit=20`,{},10000);
        const json=await response.json();
        const candidates=Array.isArray(json?.data)?json.data:[];
        const matched=candidates
          .filter(item=>item&&item.mid)
          .map(item=>({item,score:scoreQQImportCandidate(track,item)}))
          .sort((a,b)=>b.score-a.score)[0];
        if(!matched||matched.score<45)throw new Error('qishui track match failed');
        track.qqId=matched.item.mid;
        track.songMid=matched.item.mid;
        track.qqSearchKey=keyword;
      }
      await fetchQQDetails(track);
    }

    let audioCandidateIndex=0;
    const coverMemo=new Map();

    function scoreNeteaseMatch(track,item){
      const targetTitle=normalizeMusicMatchText(track.title);
      const targetArtist=normalizeMusicMatchText(track.artist);
      const title=normalizeMusicMatchText(item?.title);
      const artist=normalizeMusicMatchText(item?.author);
      let score=0;
      if(title===targetTitle)score+=100;
      else if(title&&targetTitle&&(title.includes(targetTitle)||targetTitle.includes(title)))score+=45;
      if(artist===targetArtist)score+=50;
      else if(artist&&targetArtist&&(artist.includes(targetArtist)||targetArtist.includes(artist)))score+=24;
      return score;
    }

    // 只在歌手也能对上时才用网易云版本兜底，避免把原唱换成同名翻唱。
    function neteaseArtistMatches(track,item){
      const target=normalizeMusicMatchText(track.artist);
      const artist=normalizeMusicMatchText(item?.author);
      if(!target||!artist)return false;
      return artist===target||artist.includes(target)||target.includes(artist);
    }

    // QQ 音源解析失败时，用同一首歌的网易云版本兜底。
    // 第三方 QQ 取流接口经常只返回 403，而网易云的公开接口通常可用。
    async function fetchNeteaseFallback(track){
      const query=[track.title,track.artist].filter(Boolean).join(' ').trim();
      if(!query)throw new Error('Netease fallback query is empty');
      const response=await fetchWithTimeout(`/api/music?action=netease_search&q=${encodeURIComponent(query)}&limit=10`,{},15000);
      const json=await response.json().catch(()=>null);
      const rows=Array.isArray(json?.data)?json.data:[];
      const best=rows
        .filter(item=>item&&item.url&&neteaseArtistMatches(track,item))
        .map(item=>({item,score:scoreNeteaseMatch(track,item)}))
        .sort((a,b)=>b.score-a.score)[0];
      if(!best||best.score<40)throw new Error('Netease fallback match failed');
      const id=/(?:[?&]id=)(\d+)/.exec(String(best.item.url))?.[1]||'';
      if(!id)throw new Error('Netease fallback id missing');
      const audioUrl=`/api/music?action=netease_audio&id=${id}`;
      Object.assign(track,{
        audioUrl,
        audioCandidates:[audioUrl],
        playbackSource:'netease',
        lrcUrl:`/api/music?action=netease_lyric&id=${id}`,
        lrc:null,
        detailsLoaded:true
      });
      showToast(t('toastNeteaseFallback'));
      try{
        const lyricResponse=await fetchWithTimeout(track.lrcUrl,{},10000);
        const lyricJson=await lyricResponse.json().catch(()=>null);
        const lyric=lyricJson?.data?.lyric||'';
        if(lyric)track.lrc=lyric;
      }catch(error){
        console.warn('Netease fallback lyric unavailable',error);
      }
      return best.item;
    }

    // 本地文件 blob 按歌曲缓存；解析下一首时不能回收正在播放的那个。
    const localBlobUrls=new Map();

    function rememberLocalBlob(uid,url){
      const previous=localBlobUrls.get(uid);
      if(previous&&previous!==url)URL.revokeObjectURL(previous);
      localBlobUrls.set(uid,url);
      if(localBlobUrls.size>4){
        for(const [key,value] of localBlobUrls){
          if(key===uid)continue;
          URL.revokeObjectURL(value);
          localBlobUrls.delete(key);
          break;
        }
      }
    }

    function sniffAudioType(buffer,name){
      const bytes=new Uint8Array(buffer.slice(0,12));
      const ascii=(start,length)=>String.fromCharCode(...bytes.slice(start,start+length));
      if(ascii(0,4)==='fLaC')return 'audio/flac';
      if(ascii(0,4)==='OggS')return 'audio/ogg';
      if(ascii(0,3)==='ID3')return 'audio/mpeg';
      if(bytes[0]===0xff&&(bytes[1]&0xe0)===0xe0)return 'audio/mpeg';
      if(ascii(4,4)==='ftyp')return 'audio/mp4';
      if(ascii(0,4)==='RIFF')return 'audio/wav';
      return String(name||'').toLowerCase().endsWith('.flac')?'audio/flac':'audio/mpeg';
    }

    // 桌面端：播放前先在默认下载目录里找同名歌曲，找到就直接用本地文件。
    async function resolveLocalAudio(track){
      if(!window.haloDesktop?.findLocalTrack)return;
      if(track.localAudio)return;
      const name=[track.artist,track.title].filter(Boolean).join(' - ').trim();
      if(!name)return;
      try{
        const found=await window.haloDesktop.findLocalTrack(name);
        if(!found?.path)return;
        const buffer=await window.haloDesktop.readLocalTrack(found.path);
        if(!buffer)return;
        const type=sniffAudioType(buffer,found.name);
        const blobUrl=URL.createObjectURL(new Blob([buffer],{type}));
        rememberLocalBlob(track.uid,blobUrl);
        track.localAudio=blobUrl;
        track.localFileName=found.name;
      }catch(error){
        console.warn('local track lookup failed',error);
      }
    }

    async function ensureTrackDetails(track, options={}){
      if(!options.forceRefresh && track.detailsLoaded && track.audioUrl && (track.lrc || !track.lrcUrl)) return;
      if(!options.silent)dom.playerStatus.textContent=t('playerStatusLoading');
      if(!options.forceRefresh)await resolveLocalAudio(track);
      try{
        if(track.source==='netease') await fetchNeteaseDetails(track);
        else if(track.source==='qishui') await fetchQishuiDetails(track);
        else {
          try{
            await fetchQQDetails(track,options);
          }catch(error){
            if(track.localAudio)throw error;
            if(track.source!=='qq')throw error;
            try{
              await fetchNeteaseFallback(track);
              return;
            }catch(neteaseError){
              console.warn('Netease fallback unavailable',neteaseError);
              track._neteaseFallbackError=neteaseError?.message||'netease fallback failed';
              throw error;
            }
          }
        }
      }catch(e){
        // 本地已有文件时，网络元数据失败不影响播放。
        if(!track.localAudio){
          console.warn(track.source+' 详情解析失败',e);
          throw e;
        }
        console.warn('metadata unavailable, playing local file',e);
      }
      if(track.localAudio&&track.source==='qq'&&(!track.cover||!track.lrc)){
        await refreshQqMetadata(track);
      }
      if(track.localAudio){
        track.audioUrl=track.localAudio;
        track.audioCandidates=[track.localAudio];
        track.detailsLoaded=true;
      }
    }

    // ===================== 下载 =====================

    function filenameFromContentDisposition(value){
      const encoded=/filename\*=UTF-8''([^;]+)/i.exec(value||'');
      if(encoded){
        try{return decodeURIComponent(encoded[1]);}catch(e){}
      }
      const plain=/filename="?([^";]+)"?/i.exec(value||'');
      return plain?plain[1].trim():'';
    }

    function saveBlobToFile(blob,filename){
      const url=URL.createObjectURL(blob);
      const anchor=document.createElement('a');
      anchor.href=url;
      anchor.download=filename;
      anchor.rel='noopener';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(()=>URL.revokeObjectURL(url),4000);
    }

    // 配额由服务端按 账号 + 平台 + 北京时间自然日 校验，前端只负责提示结果。
    async function downloadCurrentTrack(){
      const track=state.currentTrack;
      if(!track){showToast(t('toastNoCurrentTrack'));return;}
      if(!state.isAuthenticated){showToast(t('toastDownloadLogin'));openLoginModal();return;}
      if(track.localAudio){showToast(t('toastLocalTrack'));return;}
      if(dom.downloadBtn?.disabled)return;
      if(dom.downloadBtn)dom.downloadBtn.disabled=true;
      try{
        if(!track.audioUrl)await ensureTrackDetails(track,{silent:true});
        if(!track.audioUrl){showToast(t('toastPlayError'));return;}
        const url=new URL(track.audioUrl,window.location.href);
        url.searchParams.set('download','1');
        url.searchParams.set(
          'download_name',
          [track.artist,track.title].filter(Boolean).join(' - ')||'halo-music'
        );
        const response=await fetch(url.href,{credentials:'same-origin',cache:'no-store'});
        const contentType=(response.headers.get('content-type')||'').toLowerCase();
        if(!response.ok||contentType.includes('application/json')){
          const payload=await response.json().catch(()=>({}));
          if(response.status===401){
            showToast(t('toastDownloadLogin'));
            openLoginModal();
          }else if(response.status===429){
            showToast(payload.error||t('toastDownloadQuota'));
          }else{
            showToast(payload.error||t('toastDownloadError'));
          }
          return;
        }
        const filename=filenameFromContentDisposition(response.headers.get('content-disposition'))||'halo-music.mp3';
        saveBlobToFile(await response.blob(),filename);
        const remaining=response.headers.get('x-halo-download-remaining');
        showToast(remaining===null
          ?t('toastDownloadStarted')
          :t('toastDownloadStartedRemaining').replace('{remaining}',remaining));
      }catch(error){
        console.warn('Download failed',error);
        showToast(t('toastDownloadError'));
      }finally{
        if(dom.downloadBtn)dom.downloadBtn.disabled=false;
      }
    }

    // ===================== 歌词处理 =====================

    function parseLRC(txt){
      if(!txt)return[];
      const normalized=String(txt).replace(/\\n/g,'\n').replace(/\r/g,'');
      const reg=/\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
      const out=[];
      const matches=[...normalized.matchAll(reg)];
      for(let i=0;i<matches.length;i++){
        const m=matches[i];
        const min=parseInt(m[1],10)||0;
        const sec=parseInt(m[2],10)||0;
        const ms=m[3]?parseInt(m[3].padEnd(3,'0'),10):0;
        const time=min*60+sec+ms/1000;
        const next=matches[i+1];
        const text=normalized.slice(m.index+m[0].length,next?.index??normalized.length)
          .replace(/<\d+,\d+>|\(\d+,\d+\)/g,'')
          .replace(/\[[a-z]+:[^\]]*\]/gi,'')
          .replace(/\s+/g,' ')
          .trim();
        if(text)out.push({time,text});
      }
      out.sort((a,b)=>a.time-b.time);
      return out;
    }

    function renderLyrics(){
      const wrap=dom.lyricsInner;
      wrap.innerHTML='';
      state.currentLyricIndex=-1;
      const track=state.currentTrack;
      const titleLine=document.createElement('div');
      titleLine.className='lyrics-title-line';
      if(track){
        titleLine.textContent=(track.title||'')+(track.artist?' - '+track.artist:'');
      }
      wrap.appendChild(titleLine);

      const arr=state.lyricLines;
      if(!arr.length){
        const empty=document.createElement('div');
        empty.className='lyrics-empty';
        const head=document.createElement('p');
        head.className='lyrics-empty-title';
        head.textContent=track?'这首歌暂时没有歌词':'还没有在播放的歌曲';
        const hint=document.createElement('p');
        hint.className='lyrics-empty-hint';
        hint.textContent=track?'先听旋律吧～':'搜索一首歌，开始播放';
        empty.appendChild(head);
        empty.appendChild(hint);
        wrap.appendChild(empty);
        updateMobileLyricWindow(-1);
        return;
      }
      arr.forEach((ln,i)=>{
        const div=document.createElement('div');
        div.className='lyrics-line';
        div.dataset.index=i;
        div.setAttribute('role','button');
        div.tabIndex=0;
        div.textContent=ln.text;
        div.addEventListener('click',()=>seekToLyric(i));
        div.addEventListener('keydown',event=>{
          if(event.key==='Enter'||event.key===' '){event.preventDefault();seekToLyric(i);}
        });
        wrap.appendChild(div);
      });
      updateMobileLyricWindow(-1);
    }

    function updateMobileLyricWindow(index){
      const rows=[...(dom.lyricsInner?.querySelectorAll('.lyrics-line')||[])];
      if(!rows.length)return;
      const isMobileLyrics=window.matchMedia('(max-width: 760px)').matches
        && document.body.dataset.mobileView==='lyrics';
      if(!isMobileLyrics){
        rows.forEach(row=>row.classList.remove('mobile-lyrics-visible','mobile-lyrics-current'));
        return;
      }
      const active=Number.isInteger(index)&&index>=0&&index<rows.length?index:0;
      // Show a window of lines around the active one so the lyrics read as a
      // passage instead of a single isolated line.
      rows.forEach((row,i)=>{
        row.classList.toggle('mobile-lyrics-visible',Math.abs(i-active)<=MOBILE_LYRIC_WINDOW);
        row.classList.toggle('mobile-lyrics-current',i===active);
      });
    }

    function seekToLyric(index){
      const line=state.lyricLines[index];
      if(!line||!dom.audio)return;
      const duration=Number.isFinite(dom.audio.duration)&&dom.audio.duration>0?dom.audio.duration:null;
      const target=duration===null?Math.max(0,line.time):Math.min(Math.max(0,line.time),duration);
      try{dom.audio.currentTime=target;}catch(error){return;}
      state.currentLyricIndex=-1;
      updateLyricsHighlight(target);
    }

    function updateLyricsHighlight(time){
      const lines=state.lyricLines; if(!lines.length)return;
      let idx=state.currentLyricIndex;
      if(idx<0||idx>=lines.length||time<lines[idx].time|| (idx+1<lines.length && time>=lines[idx+1].time)){
        idx=lines.findIndex((l,i)=>{
          const nxt=lines[i+1];
          if(!nxt)return time>=l.time-0.05;
          return time>=l.time-0.05 && time<nxt.time-0.05;
        });
      }
      if(idx<0||idx===state.currentLyricIndex)return;
      state.currentLyricIndex=idx;
      updateMobileLyricWindow(idx);
      const wrap=dom.lyricsInner;
      wrap.querySelectorAll('.lyrics-line.active').forEach(el=>el.classList.remove('active'));
      const act=wrap.querySelector(`.lyrics-line[data-index="${idx}"]`);
      if(act){
        act.classList.add('active');
        const box=dom.lyricsContainer;
        if(!(window.matchMedia('(max-width: 760px)').matches&&document.body.dataset.mobileView==='lyrics')){
          box.scrollTo({top:act.offsetTop-box.clientHeight*0.45,behavior:'smooth'});
        }
      }
    }

    // ===================== 收藏 / 播放 =====================

    function isFavorite(track){
      if(!track)return false;
      return state.favorites.some(x=>x.uid===track.uid);
    }
    function updateMainFavButton(){
      const tr=state.currentTrack;
      const active=isFavorite(tr);
      dom.favBtn.classList.toggle('btn-fav-active',active);
    }

    function scrollCurrentTrackIntoView(){
      const uid=state.currentTrack?.uid;
      if(!uid)return;
      const targets=[
        {container:dom.playlistMain,list:dom.playlistList,selector:'.track-item'},
        {container:dom.searchMiniList,list:dom.searchMiniList,selector:'.search-mini-item'}
      ];
      targets.forEach(({container,list,selector})=>{
        if(!container||!list||container.clientHeight<=0)return;
        const item=[...list.querySelectorAll(selector)].find(row=>row.dataset.trackUid===uid);
        if(!item)return;
        const itemRect=item.getBoundingClientRect();
        const containerRect=container.getBoundingClientRect();
        const delta=itemRect.top-containerRect.top-(containerRect.height-itemRect.height)/2;
        container.scrollTo({
          top:Math.max(0,container.scrollTop+delta),
          behavior:'smooth'
        });
      });
    }

    async function playTrack(track,context,options={}){
      if(!track)return;
      // 之前检测到试听片段的歌，直接播记住的完整版。
      if(track.source==='netease'&&!options.detailsReady){
        const swapped=lookupPreviewSwap(track.uid);
        if(swapped&&swapped.uid!==track.uid){
          swapped.cover=swapped.cover||track.cover||null;
          return playTrack(swapped,context,options);
        }
      }
      if(!requirePlayback())return;
      const requestToken=++playbackRequestToken;
      dom.audio.pause();
      state.isPlaying=false;
      updateDesktopPlaybackVisual();
      state.currentTrack=track;
      document.body.classList.add('has-track');
      state.playContext=context||state.playContext;
      renderPlaylistList();
      scrollCurrentTrackIntoView();

      const applyUI=()=>{
        dom.trackTitle.textContent=track.title||'';
        dom.trackArtist.textContent=track.artist||'';

        // 音乐源不再对外展示，只保留标题与歌手。
        dom.trackSourcePill.style.display='none';
        dom.trackSourcePill.className='source-pill';
        dom.trackSourcePill.innerHTML='';

        // 显示音质：LOSSLESS 或 320K（根据 qualityLabel）
        if (track.qualityLabel) {
          dom.trackQualityPill.style.display = 'inline-block';
          dom.trackQualityPill.textContent = track.qualityLabel;
        } else {
          dom.trackQualityPill.style.display = 'none';
        }

        if(track.cover){
          const coverUrl=track.cover;
          const reveal=()=>{
            dom.coverImg.style.display='block';
            dom.coverPlaceholder.style.display='none';
            requestAnimationFrame(()=>dom.coverImg.classList.add('cover-ready'));
          };
          if(dom.coverImg.getAttribute('src')!==coverUrl){
            dom.coverImg.classList.remove('cover-ready');
            dom.coverImg.onload=reveal;
            dom.coverImg.onerror=()=>{
              dom.coverImg.style.display='none';
              dom.coverPlaceholder.style.display='flex';
            };
            dom.coverImg.src=coverUrl;
          }else{
            reveal();
          }
          if(dom.coverImg.complete&&dom.coverImg.naturalWidth)reveal();
        }else{
          dom.coverImg.classList.remove('cover-ready');
          dom.coverImg.style.display='none';
          dom.coverPlaceholder.style.display='flex';
        }
      };

      dom.playerStatus.textContent=t('playerStatusLoading');
      applyUI();

      state.lyricLines = track.lrc ? parseLRC(track.lrc) : [];
      renderLyrics();
      updateMainFavButton();

      // Netease search results already contain a same-origin audio endpoint.
      // Start it before awaiting lyrics/details so a real track click keeps
      // its browser user-activation and does not require clicking Lyrics.
      const earlyAudioUrl=track.source==='netease'&&track.audioUrl?track.audioUrl:'';
      let earlyPlayback=null;
      if(earlyAudioUrl){
        try{
          dom.audio.autoplay=true;
          dom.audio.src=earlyAudioUrl;
          dom.audio.load();
          earlyPlayback=dom.audio.play();
        }catch(error){
          earlyPlayback=Promise.reject(error);
        }
      }

      try{
        if(!options.detailsReady || !track.audioUrl)await ensureTrackDetails(track);
        if(requestToken!==playbackRequestToken)return;
        applyUI();
        state.lyricLines = track.lrc ? parseLRC(track.lrc) : [];
        renderLyrics();
        // 本地播放或解析失败时封面/歌词可能缺失，后台补一次再刷新界面。
        if(track.source==='qq'&&(!track.cover||!track.lrc)){
          refreshQqMetadata(track).then(()=>{
            if(requestToken!==playbackRequestToken)return;
            applyUI();
            state.lyricLines = track.lrc ? parseLRC(track.lrc) : [];
            renderLyrics();
          }).catch(()=>{});
        }
        if(!track.audioUrl){showToast(t('toastPlayError'));dom.playerStatus.textContent=t('playerStatusIdle');return;}

        if(earlyPlayback&&earlyAudioUrl===track.audioUrl){
          await earlyPlayback;
          if(requestToken!==playbackRequestToken)return;
          state.isPlaying=true;
          updateDesktopPlaybackVisual();
          dom.playBtn.textContent='\u23f8';
          dom.playerStatus.textContent=t('playerStatusPlaying');
          updateMediaSession(track);
          recordPlayedTrack(track);
          prepareUpcomingTrack();
        }else{
          audioCandidateIndex=Math.max(0,(track.audioCandidates||[]).indexOf(track.audioUrl));
          const preloadedUrl=await takePreloadedAudio(track);
          if(requestToken!==playbackRequestToken)return;
          releaseActivePlaybackBlob();
          activePlaybackBlobUrl=preloadedUrl;
          dom.audio.autoplay=true;
          dom.audio.src=preloadedUrl||track.audioUrl;
          dom.audio.load();
          const playback=dom.audio.play();
          await playback;
          if(requestToken!==playbackRequestToken)return;
          state.isPlaying=true;
          updateDesktopPlaybackVisual();
        dom.playBtn.textContent='⏸';
        dom.playerStatus.textContent=t('playerStatusPlaying');
        updateMediaSession(track);
        recordPlayedTrack(track);
        prepareUpcomingTrack();
        }
      }catch(e){
        if(requestToken!==playbackRequestToken)return;
        console.error(e);
        handleTerminalPlayFailure(track._neteaseFallbackError?t('toastNeteaseFallbackError'):undefined);
      }

      renderMiniSearchList();
      renderPlaylistList();
      scrollCurrentTrackIntoView();
    }

    function getActiveList(){
      const tp=state.playContext.type;
      if(tp==='results'||tp==='queue'){
        return state.playQueue;
      }
      if(tp==='search'){
        let list=getInterleavedSearchList();
        if(!list.length && state.searchResults.length){
          list=[...state.searchResults];
        }
        return list;
      }
      if(tp==='favorites')return state.favorites;
      if(tp==='playlist'){
        const pl=state.playlists.find(p=>p.id===state.playContext.playlistId);
        return pl?pl.tracks:[];
      }
      return getInterleavedSearchList();
    }

    function getNextTrackTarget(direction='next'){
      const list=getActiveList();
      if(!list.length)return null;
      let index=state.playContext.index ?? -1;
      if(index<0||index>=list.length){
        index=list.findIndex(track=>track.uid===state.currentTrack?.uid);
        if(index<0)index=0;
      }
      if(state.playMode==='single'||list.length===1)return {repeat:true};
      if(state.playMode==='shuffle'){
        if(list.length>1){
          let nextIndex;
          do{nextIndex=Math.floor(Math.random()*list.length);}while(nextIndex===index);
          index=nextIndex;
        }
      }else{
        index=(index+(direction==='prev'?-1:1)+list.length)%list.length;
      }
      return {
        track:list[index],
        context:{type:state.playContext.type,index,playlistId:state.playContext.playlistId}
      };
    }

    function preloadAudio(track){
      if(!track?.audioUrl)return;
      // QQ源 代理流单曲 10MB 级，整段预取成 blob 会拖慢起播，直接流式播放。
      if(track.source==='qq')return;
      const url=new URL(track.audioUrl,window.location.href).href;
      if(nextAudioPreload?.url===url)return;
      stopPreloadedAudio();
      const controller=new AbortController();
      const entry={url,blobUrl:'',controller,promise:null};
      nextAudioPreload=entry;
      entry.promise=fetchWithTimeout(url,{cache:'force-cache',credentials:'same-origin',signal:controller.signal},12000)
        .then(response=>{
          if(!response.ok)throw new Error(`prefetch failed: ${response.status}`);
          return response.blob();
        })
        .then(blob=>{
          if(nextAudioPreload!==entry)return;
          entry.blobUrl=URL.createObjectURL(blob);
        })
        .catch(error=>{
          if(error?.name!=='AbortError')console.warn('next audio prefetch failed',error);
          if(nextAudioPreload===entry)nextAudioPreload=null;
        });
    }

    function stopPreloadedAudio(){
      const entry=nextAudioPreload;
      if(!entry)return;
      nextAudioPreload=null;
      try{entry.controller?.abort();}catch(error){}
      if(entry.blobUrl)URL.revokeObjectURL(entry.blobUrl);
    }

    async function takePreloadedAudio(track){
      const entry=nextAudioPreload;
      const url=track?.audioUrl?new URL(track.audioUrl,window.location.href).href:'';
      if(!entry)return '';
      if(entry.url!==url){
        stopPreloadedAudio();
        return '';
      }
      if(!entry.blobUrl&&entry.promise){
        try{await entry.promise;}catch(error){}
      }
      nextAudioPreload=null;
      if(entry.blobUrl)return entry.blobUrl;
      try{entry.controller?.abort();}catch(error){}
      return '';
    }

    function releaseActivePlaybackBlob(){
      if(!activePlaybackBlobUrl)return;
      URL.revokeObjectURL(activePlaybackBlobUrl);
      activePlaybackBlobUrl='';
    }

    function prepareUpcomingTrack(){
      const target=getNextTrackTarget('next');
      const currentUid=state.currentTrack?.uid||'';
      if(!target||target.repeat||!target.track||target.track.uid===currentUid){
        preparedNextTrack=null;
        stopPreloadedAudio();
        return;
      }
      const token=++nextTrackPrepareToken;
      const prepared={fromUid:currentUid,target,ready:false,promise:null};
      preparedNextTrack=prepared;
      prepared.promise=ensureTrackDetails(target.track,{silent:true})
        .catch(error=>console.warn('prepare next track failed',error))
        .then(()=>{
          if(token!==nextTrackPrepareToken||preparedNextTrack!==prepared)return;
          prepared.ready=Boolean(target.track.audioUrl);
          if(prepared.ready)preloadAudio(target.track);
        });
    }

    function playFromList(type,index,plId){
      let list;
      if(type==='results'||type==='queue') list=state.playQueue;
      else if(type==='search') list=getInterleavedSearchList();
      else if(type==='favorites') list=state.favorites;
      else{
        const pl=state.playlists.find(p=>p.id===plId);
        list=pl?pl.tracks:[];
      }
      if(!list.length){
        if(type!=='results')showToast(t('toastPlaylistEmpty'));
        return;
      }
      if(!Number.isInteger(index)||index<0||index>=list.length){
        showToast(t('toastPlayError'));
        return;
      }
      state.playContext={type,index,playlistId:plId||null};
      playTrack(list[index],state.playContext);
    }

    function playNext(direction){
      if(!requirePlayback())return;
      const target=getNextTrackTarget(direction);
      if(!target)return;
      if(target.repeat){
        dom.audio.currentTime=0;
        dom.audio.play().catch(()=>{});
        return;
      }
      playTrack(target.track,target.context);
    }

    function advanceAfterTrackEnds(){
      const finishedUid=state.currentTrack?.uid||'';
      const prepared=preparedNextTrack?.fromUid===finishedUid ? preparedNextTrack : null;
      if(prepared?.ready){
        playTrack(prepared.target.track,prepared.target.context,{detailsReady:true});
        return;
      }
      if(prepared?.promise){
        prepared.promise.finally(()=>{
          if(state.currentTrack?.uid!==finishedUid)return;
          if(prepared.ready)playTrack(prepared.target.track,prepared.target.context,{detailsReady:true});
          else playNext('next');
        });
        return;
      }
      playNext('next');
    }

    // 单曲播放彻底失败（候选线路与强制重解析都用尽）后的出路：
    // 列表里还有别的歌就自动切下一首，否则按普通播放失败收尾。
    function handleTerminalPlayFailure(message){
      consecutivePlayFailures+=1;
      const target=consecutivePlayFailures<=MAX_CONSECUTIVE_PLAY_FAILURES?getNextTrackTarget('next'):null;
      if(target&&!target.repeat&&target.track&&getActiveList().length>1){
        showToast(t('toastAutoSkipNext'));
        playNext('next');
        return;
      }
      if(consecutivePlayFailures>MAX_CONSECUTIVE_PLAY_FAILURES)consecutivePlayFailures=0;
      showToast(message||t('toastPlayError'));
      dom.playerStatus.textContent=t('playerStatusError');
    }

    function updateMediaSession(track){
      if(!navigator.mediaSession)return;
      try{
        navigator.mediaSession.metadata=new MediaMetadata({
          title:track.title||'',
          artist:track.artist||'',
          album:track.album||'',
          artwork:track.cover?[{src:track.cover,sizes:'300x300',type:'image/jpeg'}]:[]
        });
        navigator.mediaSession.playbackState=state.isPlaying?'playing':'paused';
      }catch(error){
        console.warn('media session update failed',error);
      }
    }

    function setupMediaSessionHandlers(){
      if(!navigator.mediaSession)return;
      const handlers={
        play:()=>dom.audio.play().catch(()=>{}),
        pause:()=>dom.audio.pause(),
        previoustrack:()=>playNext('prev'),
        nexttrack:()=>playNext('next')
      };
      Object.entries(handlers).forEach(([action,handler])=>{
        try{navigator.mediaSession.setActionHandler(action,handler);}catch(error){}
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
        const key=el.dataset.i18nPlaceholder;
        if(key)el.placeholder=t(key);
      });
    }

    function togglePlayPause(){
      if(!dom.audio.src)return;
      if(!state.isPlaying&&!requirePlayback())return;
      if(state.isPlaying)dom.audio.pause();
      else dom.audio.play().catch(e=>console.error(e));
    }

    // ===================== Android 原生桥 =====================
    // Android WebView 壳里通过 window.haloNative.playbackState(json) 上报状态，
    // 原生 PlaybackService 据此显示通知栏/锁屏控制；控制指令经 window.haloRemote 回注。

    function isNativeBridgeAvailable(){
      return isAndroidWebView()&&typeof window.haloNative?.playbackState==='function';
    }
    let lastNativeStatePush=0;
    function pushNativePlaybackState(force=false){
      if(!isNativeBridgeAvailable())return;
      const now=Date.now();
      if(!force&&now-lastNativeStatePush<1000)return;
      lastNativeStatePush=now;
      const track=state.currentTrack;
      const payload={
        playing:state.isPlaying,
        title:track?.title||'',
        artist:track?.artist||'',
        album:track?.album||'',
        cover:track?.cover||'',
        position:dom.audio.currentTime||0,
        duration:isFinite(dom.audio.duration)?dom.audio.duration:0
      };
      try{window.haloNative.playbackState(JSON.stringify(payload));}catch(error){}
    }
    function setupNativeRemoteCommands(){
      window.haloRemote={
        play:()=>{if(dom.audio.src)dom.audio.play().catch(()=>{});},
        pause:()=>dom.audio.pause(),
        next:()=>playNext('next'),
        prev:()=>playNext('prev')
      };
    }

    function updateBatchToolbar(){
      if(!dom.searchBatchToolbar)return;
      const allTracks=getInterleavedSearchList();
      dom.searchBatchToolbar.style.display=allTracks.length?'':'none';
      if(dom.searchSelectToggle)dom.searchSelectToggle.style.display=allTracks.length?'':'none';
      const allSelected=allTracks.length>0&&allTracks.every(track=>state.selectedSearchUids.has(track.uid));
      dom.searchBatchSelectAll.checked=allSelected;
      dom.searchBatchSelectAll.title=t(allSelected?'searchBatchUnselectAll':'searchBatchSelectAll');
      dom.searchBatchSelectAll.setAttribute('aria-label',dom.searchBatchSelectAll.title);
    }

    // Multi-select is opt-in on touch: a checkbox on every row makes the result
    // list read as a form. The body class drives the CSS that swaps the status
    // text for the batch actions and reveals the row checkboxes.
    function setSearchSelectMode(on){
      state.searchSelectMode=Boolean(on);
      document.body.classList.toggle('search-selecting',state.searchSelectMode);
      if(dom.searchSelectToggle){
        dom.searchSelectToggle.textContent=state.searchSelectMode?'取消':'选择';
        dom.searchSelectToggle.setAttribute('aria-pressed',String(state.searchSelectMode));
      }
      if(!state.searchSelectMode)state.selectedSearchUids.clear();
      updateBatchToolbar();
      renderMiniSearchList();
    }

    function exitSearchSelectMode(){
      if(state.searchSelectMode)setSearchSelectMode(false);
    }

    function toggleSearchTrackSelection(uid){
      if(state.selectedSearchUids.has(uid))state.selectedSearchUids.delete(uid);
      else state.selectedSearchUids.add(uid);
      updateBatchToolbar();
    }

    function addTracksToPlaylist(tracks,pl){
      if(!pl||!Array.isArray(tracks))return 0;
      const existing=new Set(pl.tracks.map(track=>track.uid));
      let added=0;
      tracks.forEach(track=>{
        if(!track||existing.has(track.uid))return;
        pl.tracks.push(track);
        existing.add(track.uid);
        added++;
      });
      if(added){saveLibraryToStorage();renderPlaylistList();}
      return added;
    }

    function addSelectedToFavorites(){
      const allTracks=getInterleavedSearchList();
      if(!allTracks.length){showToast(t('searchBatchNoResults'));return;}
      if(!requireLibraryAccess())return;
      const tracks=allTracks.filter(track=>state.selectedSearchUids.has(track.uid));
      if(!tracks.length){showToast(t('searchBatchNeedSelection'));return;}
      const existing=new Set(state.favorites.map(track=>track.uid));
      let added=0;
      tracks.forEach(track=>{
        if(existing.has(track.uid))return;
        state.favorites.push(track);
        existing.add(track.uid);
        added++;
      });
      saveLibraryToStorage();
      state.selectedSearchUids.clear();
      updateBatchToolbar();
      renderMiniSearchList();
      renderPlaylistList();
      showToast(t('searchBatchFavoriteResult').replace('{added}',String(added)));
    }

    function addSelectedToPlayQueue(){
      const allTracks=getInterleavedSearchList();
      if(!allTracks.length){showToast(t('searchBatchNoResults'));return;}
      const tracks=allTracks.filter(track=>state.selectedSearchUids.has(track.uid));
      if(!tracks.length){showToast(t('searchBatchNeedSelection'));return;}
      const existing=new Set(state.playQueue.map(track=>track.uid));
      let added=0;
      tracks.forEach(track=>{
        if(existing.has(track.uid))return;
        state.playQueue.push(track);
        existing.add(track.uid);
        added++;
      });
      savePlayQueueToStorage();
      renderPlaylistList();
      showToast(`已加入播放列表 ${added} 首`);
    }

    function openBatchSavePlaylistModal(){
      const allTracks=getInterleavedSearchList();
      if(!allTracks.length){showToast(t('searchBatchNoResults'));return;}
      if(!requireLibraryAccess())return;
      const tracks=allTracks.filter(track=>state.selectedSearchUids.has(track.uid));
      if(!tracks.length){showToast(t('searchBatchNeedSelection'));return;}
      state.batchTracks=tracks;
      renderSavePlaylistOptions();
      dom.savePlaylistModal.classList.add('show');
      dom.savePlaylistModal.setAttribute('aria-hidden','false');
    }

    function toggleFavoriteCurrent(){
      if(!requireLibraryAccess())return;
      const tr=state.currentTrack; if(!tr)return;
      const i=state.favorites.findIndex(x=>x.uid===tr.uid);
      if(i>=0){state.favorites.splice(i,1);showToast(t('toastRemovedFavorite'));}
      else{state.favorites.push(tr);showToast(t('toastAddedFavorite'));}
      saveLibraryToStorage();
      updateMainFavButton();
      renderPlaylistList();
    }

    function addTrackToPlaylist(track, pl){
      if(!track||!pl)return false;
      if(pl.tracks.some(tk=>tk.uid===track.uid)){
        showToast(t('toastAlreadyInList'));
        return false;
      }
      pl.tracks.push(track);
      saveLibraryToStorage();
      renderPlaylistList();
      showToast(t('toastAddedToPlaylist'));
      return true;
    }

    function addToPlayQueue(track){
      if(!track)return false;
      if(state.playQueue.some(item=>item.uid===track.uid)){
        showToast('歌曲已在播放列表');
        return false;
      }
      state.playQueue.push(track);
      savePlayQueueToStorage();
      renderPlaylistList();
      showToast('已加入播放列表');
      return true;
    }

    function removeFromPlayQueue(trackUid){
      const index=state.playQueue.findIndex(track=>track.uid===trackUid);
      if(index<0)return;
      const removed=state.playQueue.splice(index,1)[0];
      if(state.playContext.type==='results' || state.playContext.type==='queue'){
        if(state.currentTrack?.uid===removed?.uid){
          state.playContext.index=state.playQueue.length ? Math.min(index,state.playQueue.length-1) : -1;
        }else if(index<state.playContext.index){
          state.playContext.index-=1;
        }else if(state.playContext.index>=state.playQueue.length){
          state.playContext.index=state.playQueue.length-1;
        }
      }
      savePlayQueueToStorage();
      renderPlaylistList();
      showToast(t('queueRemove'));
    }

    function clearPlayQueue(){
      if(!state.playQueue.length)return;
      if(typeof window.confirm==='function'&&!window.confirm(t('confirmClearQueue')))return;
      state.playQueue=[];
      if(state.playContext.type==='results'||state.playContext.type==='queue'){
        state.playContext={type:'queue',index:-1,playlistId:null};
      }
      savePlayQueueToStorage();
      renderPlaylistList();
      showToast(t('toastQueueCleared'));
    }

    function renderSavePlaylistOptions(){
      dom.savePlaylistOptions.innerHTML='';
      const tracks=state.batchTracks.length?[...state.batchTracks]:(state.currentTrack?[state.currentTrack]:[]);
      const isBatch=state.batchTracks.length>0;
      if(dom.savePlaylistTitle)dom.savePlaylistTitle.textContent=t(isBatch?'searchBatchPlaylistTitle':'saveToPlaylistTitle');
      if(dom.savePlaylistDescription)dom.savePlaylistDescription.textContent=t(isBatch?'searchBatchPlaylistDescription':'saveToPlaylistDescription');
      if(!state.playlists.length){
        const empty=document.createElement('div');
        empty.className='save-playlist-empty';
        empty.textContent=t('saveToPlaylistEmpty');
        dom.savePlaylistOptions.appendChild(empty);
        return;
      }
      state.playlists.forEach(pl=>{
        const savedCount=tracks.filter(track=>pl.tracks.some(item=>item.uid===track.uid)).length;
        const saved=savedCount===tracks.length;
        const option=document.createElement('button');
        option.type='button';
        option.className='save-playlist-option ripple-target';
        option.disabled=saved;
        const copy=document.createElement('span');
        const name=document.createElement('strong');
        const count=document.createElement('small');
        const marker=document.createElement('b');
        name.textContent=pl.name;
        count.textContent=`${pl.tracks.length} 首歌曲`;
        marker.textContent=saved?t('playlistAlreadyContains'):'+';
        copy.appendChild(name);copy.appendChild(count);
        option.appendChild(copy);option.appendChild(marker);
        option.addEventListener('click',()=>{
          const added=addTracksToPlaylist(tracks,pl);
          if(added){
            showToast(isBatch?t('searchBatchPlaylistSaved').replace('{added}',String(added)):t('toastAddedToPlaylist'));
            closeSavePlaylistModal();
            if(isBatch){
              state.selectedSearchUids.clear();
              updateBatchToolbar();
              renderMiniSearchList();
            }
          }else showToast(t('toastAlreadyInList'));
        });
        dom.savePlaylistOptions.appendChild(option);
      });
    }

    function openSavePlaylistModal(){
      if(!requireLibraryAccess())return;
      if(!state.currentTrack){showToast(t('toastNoCurrentTrack'));return;}
      renderSavePlaylistOptions();
      dom.savePlaylistModal.classList.add('show');
      dom.savePlaylistModal.setAttribute('aria-hidden','false');
    }

    function closeSavePlaylistModal(){
      dom.savePlaylistModal.classList.remove('show');
      dom.savePlaylistModal.setAttribute('aria-hidden','true');
      state.batchTracks=[];
    }

    function parseVersion(value){
      const match=String(value==null?'':value).trim().replace(/^v/i,'').match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:[-+].*)?$/);
      if(!match)return null;
      return [Number(match[1]),Number(match[2]||0),Number(match[3]||0)];
    }

    function compareVersions(a,b){
      const av=parseVersion(a);
      const bv=parseVersion(b);
      if(!av||!bv)return 0;
      for(let i=0;i<3;i++){
        if(av[i]>bv[i])return 1;
        if(av[i]<bv[i])return -1;
      }
      return 0;
    }

    function isAndroidWebView(){
      const userAgent=navigator.userAgent||'';
      if(window.haloDesktop||!/Android/i.test(userAgent))return false;
      if(/\bwv\b/i.test(userAgent)||/; wv\)/i.test(userAgent))return true;
      if(!/(Chrome|CriOS|Firefox|FxiOS|EdgA|OPR|SamsungBrowser)\//i.test(userAgent))return true;
      return /Version\/\d+\.\d+/i.test(userAgent);
    }

    function isIOSDevice(){
      if(window.haloDesktop)return false;
      if(/iPad|iPhone|iPod/.test(navigator.userAgent||''))return true;
      return navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1;
    }

    function isStandaloneApp(){
      return navigator.standalone===true||window.matchMedia('(display-mode: standalone)').matches;
    }

    function isIOSSafari(){
      return !/CriOS|FxiOS|EdgiOS|OPiOS|MicroMessenger|QQ\//.test(navigator.userAgent||'');
    }

    function closeAndroidUpdateModal(){
      dom.androidUpdateModal.classList.remove('show');
      dom.androidUpdateModal.setAttribute('aria-hidden','true');
      pendingAndroidUpdateUrl='';
    }

    function dismissAndroidUpdate(version){
      try{sessionStorage.setItem(ANDROID_UPDATE_STORAGE_KEY,String(version));}catch(e){}
      closeAndroidUpdateModal();
    }

    function showAndroidUpdateModal(data,latestVersion){
      const android=data&&typeof data.android==='object'?data.android:{};
      const rawUrl=android.url||data.url||'';
      let updateUrl='';
      try{
        const parsed=new URL(rawUrl,window.location.href);
        if(parsed.protocol==='https:')updateUrl=parsed.href;
      }catch(e){}
      pendingAndroidUpdateUrl=updateUrl;
      pendingAndroidUpdateVersion=String(latestVersion);
      dom.androidUpdateVersion.textContent=`HALO Music ${latestVersion}`;
      dom.androidUpdateCurrent.textContent=`当前版本 ${APP_VERSION} · 最新版本 ${latestVersion}`;
      dom.androidUpdateNotes.replaceChildren();
      const notes=Array.isArray(data.releaseNotes)?data.releaseNotes:[];
      (notes.length?notes:['优化播放体验']).forEach(note=>{
        const item=document.createElement('li');
        item.textContent=String(note);
        dom.androidUpdateNotes.appendChild(item);
      });
      dom.androidUpdateInstall.disabled=!updateUrl;
      dom.androidUpdateInstall.title=updateUrl?'下载并安装 Android 更新':'暂时没有可用的下载地址';
      dom.androidUpdateModal.classList.add('show');
      dom.androidUpdateModal.setAttribute('aria-hidden','false');
    }

    async function checkForAndroidUpdate(){
      if(!isAndroidWebView())return;
      try{
        const response=await fetch('/api/version',{cache:'no-store',credentials:'same-origin'});
        if(!response.ok)return;
        const data=await response.json();
        const latestVersion=(data&&data.android&&data.android.version)||data&&data.version;
        if(compareVersions(latestVersion,APP_VERSION)<=0)return;
        let dismissedVersion='';
        try{dismissedVersion=sessionStorage.getItem(ANDROID_UPDATE_STORAGE_KEY)||'';}catch(e){}
        if(dismissedVersion===String(latestVersion))return;
        if(dom.loginModal.classList.contains('show')){
          window.setTimeout(()=>checkForAndroidUpdate(),500);
          return;
        }
        showAndroidUpdateModal(data,latestVersion);
      }catch(error){
        console.warn('Android update check failed:',error);
      }
    }

    function createPlaylistForTrack(){
      if(state.batchTracks.length){
        pendingPlaylistTracks=[...state.batchTracks];
        closeSavePlaylistModal();
        createPlaylistForCurrentTrack=false;
        openPlaylistModal();
        return;
      }
      closeSavePlaylistModal();
      createPlaylistForCurrentTrack=true;
      openPlaylistModal();
    }

    function deleteSelectedPlaylist(){
      if(!requireLibraryAccess())return;
      const plId=getSelectedPlaylistId();
      if(!plId){showToast(t('toastNeedPlaylistSelected'));return;}
      const idx=state.playlists.findIndex(p=>p.id===plId);
      if(idx<0){showToast(t('toastNeedPlaylistSelected'));return;}
      if(!window.confirm(t('confirmDeletePlaylist')))return;

      state.playlists.splice(idx,1);
      if(state.mobilePlaylistDetailId===plId)state.mobilePlaylistDetailId=null;
      const next=state.playlists[Math.min(idx,state.playlists.length-1)]||state.playlists[0]||null;
      state.playContext.playlistId=next?next.id:null;
      if(state.playContext.type==='playlist' && !next){
        state.playContext.index=-1;
      }
      renderPlaylistOptions();
      saveLibraryToStorage();
      renderPlaylistList();
      showToast(t('toastPlaylistDeleted'));
    }

    function removeTrackFromCurrentPlaylist(trackUid){
      if(!requireLibraryAccess())return;
      const plId=getSelectedPlaylistId();
      const pl=state.playlists.find(p=>p.id===plId);
      if(!pl)return;
      const idx=pl.tracks.findIndex(tk=>tk.uid===trackUid);
      if(idx<0)return;
      if(!window.confirm(t('confirmRemoveTrack')))return;

      const removed=pl.tracks.splice(idx,1)[0];
      if(state.playContext.type==='playlist' && state.playContext.playlistId===plId){
        if(state.currentTrack && removed && state.currentTrack.uid===removed.uid){
          state.playContext.index=pl.tracks.length ? Math.min(idx,pl.tracks.length-1) : -1;
        }else if(idx<state.playContext.index){
          state.playContext.index-=1;
        }else if(state.playContext.index>=pl.tracks.length){
          state.playContext.index=pl.tracks.length-1;
        }
      }
      saveLibraryToStorage();
      renderPlaylistList();
      showToast(t('toastTrackRemovedFromPlaylist'));
    }

    // ===================== 搜索结果 / 播放列表渲染 =====================

    // ===================== 发现区块（搜索空态） =====================

    function makeSuggestionChip(name){
      const chip=document.createElement('button');
      chip.type='button';
      chip.className='search-suggestion-chip ripple-target';
      chip.textContent=name;
      chip.addEventListener('click',()=>{
        dom.searchInput.value=name;
        state.searchKeyword=name;
        state.noMoreResults=false;
        searchAllSources(true);
      });
      return chip;
    }

    // ===================== 本地搜索历史 =====================

    function readSearchHistory(){
      try{
        const raw=localStorage.getItem(SEARCH_HISTORY_KEY);
        const list=raw?JSON.parse(raw):[];
        return Array.isArray(list)
          ? list.filter(item=>typeof item==='string'&&item.trim()).slice(0,SEARCH_HISTORY_LIMIT)
          : [];
      }catch(e){
        return [];
      }
    }
    function recordSearchHistory(keyword){
      const kw=String(keyword||'').trim();
      if(!kw)return;
      const list=readSearchHistory().filter(item=>item!==kw);
      list.unshift(kw);
      try{localStorage.setItem(SEARCH_HISTORY_KEY,JSON.stringify(list.slice(0,SEARCH_HISTORY_LIMIT)));}catch(e){}
    }
    function clearSearchHistory(){
      try{localStorage.removeItem(SEARCH_HISTORY_KEY);}catch(e){}
      renderMiniSearchList();
    }
    function buildHistoryChips(){
      const history=readSearchHistory();
      if(!history.length)return null;
      const chips=document.createElement('div');
      chips.className='search-suggestion-chips';
      history.forEach(keyword=>chips.appendChild(makeSuggestionChip(keyword)));
      return chips;
    }

    function buildNoResultEmpty(){
      const empty=document.createElement('div');
      empty.className='search-empty-state';
      const icon=document.createElement('div');
      icon.className='search-empty-icon';
      icon.setAttribute('aria-hidden','true');
      icon.innerHTML='<svg viewBox="0 0 24 24" focusable="false"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>';
      const title=document.createElement('strong');
      title.textContent='没有找到相关歌曲';
      const copy=document.createElement('span');
      copy.textContent='换个关键词试试，或从最近搜索里再挑一个';
      empty.append(icon,title,copy);
      const chips=buildHistoryChips();
      if(chips)empty.appendChild(chips);
      return empty;
    }

    function buildDiscoveryBlock(){
      const block=document.createElement('div');
      block.className='discovery-block';

      block.appendChild(buildRecommendedSection());
      block.appendChild(buildRecommendedArtistsSection());

      const history=readSearchHistory();
      if(history.length){
        const head=document.createElement('div');
        head.className='discovery-history-head';
        const headTitle=document.createElement('div');
        headTitle.className='discovery-section-head';
        headTitle.textContent='最近搜索';
        head.appendChild(headTitle);
        const clearBtn=document.createElement('button');
        clearBtn.type='button';
        clearBtn.className='discovery-history-clear';
        clearBtn.textContent='清空';
        clearBtn.addEventListener('click',clearSearchHistory);
        head.appendChild(clearBtn);
        block.appendChild(head);
        block.appendChild(buildHistoryChips());
      }
      return block;
    }

    // 精确还原一首网易歌曲（榜单、试听替换共用）：搜索结果里的网易云行就是这个结构。
    function playNeteaseTrack(id,title,artist,cover){
      const track={
        uid:`netease-${id}`,
        source:'netease',
        keyword:`${title} ${artist}`.trim(),
        songid:id,
        title,
        artist,
        album:'',
        cover:cover||null,
        audioUrl:`/api/music?action=netease_audio&id=${id}`,
        lrc:null,
        lrcUrl:`/api/music?action=netease_lyric&id=${id}`,
        detailsLoaded:false,
        quality:null,
        qualityLabel:null
      };
      state.trackMap.set(track.uid,track);
      playTrack(track,{type:'search',index:-1,playlistId:null});
      if(window.matchMedia('(max-width: 760px)').matches)setMobileView('lyrics');
    }

    // ===================== 热门榜单 =====================

    function cachedToplist(key){
      const entry=toplistCache[`${uiLang()}:${key}`];
      return entry&&Date.now()-entry.at<TOPLIST_TTL?entry.tracks:null;
    }

    async function loadToplist(key){
      const cacheKey=`${uiLang()}:${key}`;
      if(toplistLoading[cacheKey]||cachedToplist(key))return;
      toplistLoading[cacheKey]=true;
      try{
        const response=await fetchWithTimeout(`/api/music?action=netease_toplist&chart=${encodeURIComponent(key)}&locale=${uiLang()}&limit=10`,{},12000);
        const json=await response.json();
        const tracks=Array.isArray(json?.data?.tracks)?json.data.tracks:[];
        if(tracks.length)toplistCache[cacheKey]={tracks,at:Date.now(),lang:uiLang()};
        else toplistFailed[cacheKey]=true;
      }catch(error){
        console.warn('toplist load failed',error);
        toplistFailed[cacheKey]=true;
      }finally{
        toplistLoading[cacheKey]=false;
      }
      // 数据到位后刷新发现页推荐与榜单页。
      if(!state.searchKeyword&&!state.searchInProgress)renderMiniSearchList();
      renderToplistPage();
    }

    // 网易图床返回 http:// 地址，https 页面会被拦成 mixed content，统一升级；
    // music.126.net 支持 ?param=WxH 缩放，Apple/Wikimedia 也按展示尺寸改小，减少首屏体积。
    function coverUrlFor(raw,size){
      const url=String(raw||'').replace(/^http:\/\//i,'https://');
      if(!url)return '';
      if(size&&/music\.126\.net/.test(url)){
        return `${url.split('?')[0]}?param=${size}y${size}`;
      }
      if(size&&/mzstatic\.com/.test(url)){
        return url.replace(/\/(\d+)x(\d+)bb\.(jpg|jpeg|png|webp)$/i,(m,w,h,ext)=>{
          const target=Math.min(Math.max(Number(size),60),Number(w)||size);
          return `/${target}x${target}bb.${ext}`;
        });
      }
      if(size&&/y\.gtimg\.cn/.test(url)){
        // QQ 图床只提供固定的几档尺寸，取最接近的。
        const target=Number(size)>=300?300:Number(size)>=150?150:90;
        return url.replace(/T002R\d+x\d+M/,`T002R${target}x${target}M`);
      }
      if(size&&/thumb\.wikimedia\.org/.test(url)){
        const target=Math.min(Math.max(Number(size)*2,120),330);
        return url.replace(/\/(\d+)px-/,`/${target}px-`);
      }
      return url;
    }

    // ===================== 试听片段换完整音源 =====================
    // 网易免费音源对部分版权歌曲只返回 30 秒试听。loadedmetadata 时检测时长，
    // 命中就换 QQ(QQ源) 音源的完整版，并记住替换关系，下次直接播完整版。

    const PREVIEW_MAX_SECONDS = 35;
    const PREVIEW_SWAP_KEY = 'halo-music-preview-swaps-v1';
    const PREVIEW_SWAP_LIMIT = 60;

    function readPreviewSwaps(){
      try{
        const raw=localStorage.getItem(PREVIEW_SWAP_KEY);
        const map=raw?JSON.parse(raw):null;
        return map&&typeof map==='object'?map:{};
      }catch(e){
        return {};
      }
    }
    function lookupPreviewSwap(uid){
      if(!uid)return null;
      const swapped=readPreviewSwaps()[uid];
      return swapped?deserializeTrack(swapped):null;
    }
    function rememberPreviewSwap(uid,track){
      if(!uid||!track)return;
      const map=readPreviewSwaps();
      map[uid]=serializeTrack(track);
      const keys=Object.keys(map);
      if(keys.length>PREVIEW_SWAP_LIMIT)delete map[keys[0]];
      try{localStorage.setItem(PREVIEW_SWAP_KEY,JSON.stringify(map));}catch(e){}
    }

    async function handlePreviewClip(track){
      const requestToken=playbackRequestToken;
      // 换源只对网易歌曲做一次；QQ/QQ源 源自己再出试听就直接按失败跳下一首。
      if(track.source!=='netease'){
        handleTerminalPlayFailure('这首歌在免费音源只有试听片段');
        return;
      }
      try{
        dom.playerStatus.textContent='试听片段，正在切换完整音源…';
        const qqTrack=await matchJooxTrack(track.title,track.artist);
        if(!qqTrack)throw new Error('no full version matched');
        if(requestToken!==playbackRequestToken)return;
        qqTrack.cover=track.cover||null;
        state.trackMap.set(qqTrack.uid,qqTrack);
        rememberPreviewSwap(track.uid,qqTrack);
        await playTrack(qqTrack,{type:'search',index:-1,playlistId:null});
        if(requestToken!==playbackRequestToken)return;
        showToast(t('toastPreviewSwap'));
      }catch(error){
        if(requestToken!==playbackRequestToken)return;
        console.warn('preview swap failed',error);
        handleTerminalPlayFailure('免费音源没有这首歌的完整版');
      }
    }

    function buildToplistArt(row,index){
      const art=document.createElement('span');
      art.className='discovery-art'+(index===undefined?'':' discovery-art-sm');
      const cover=coverUrlFor(row.cover,90);
      if(cover){
        const img=document.createElement('img');
        img.src=cover;img.alt='';img.referrerPolicy='no-referrer';img.loading='lazy';img.decoding='async';
        img.onerror=()=>{img.remove();art.textContent='♪';};
        art.appendChild(img);
      }else art.textContent='♪';
      return art;
    }

    // ===================== 榜单页（三榜并排） =====================

    // 榜单页：三个榜单分页展示，一次只加载一页（10 张封面），点标签切换。
    function renderToplistPage(){
      if(!dom.toplistPage)return;
      dom.toplistPage.replaceChildren();
      const tabs=document.createElement('div');
      tabs.className='discovery-chart-tabs toplist-tabs';
      TOPLIST_CHARTS.forEach(chart=>{
        const tab=document.createElement('button');
        tab.type='button';
        tab.className='discovery-chart-tab ripple-target'+(chart.key===activeToplistChart?' active':'');
        tab.textContent=chartLabel(chart);
        tab.addEventListener('click',()=>{
          if(activeToplistChart===chart.key)return;
          activeToplistChart=chart.key;
          renderToplistPage();
        });
        tabs.appendChild(tab);
      });
      dom.toplistPage.appendChild(tabs);
      const chart=TOPLIST_CHARTS.find(item=>item.key===activeToplistChart)||TOPLIST_CHARTS[0];
      dom.toplistPage.appendChild(buildToplistColumn(chart));
    }

    function buildToplistColumn(chart){
      const column=document.createElement('div');
      column.className='toplist-column';
      const head=document.createElement('div');
      head.className='toplist-column-head';
      const name=document.createElement('strong');
      name.textContent=chartLabel(chart);
      const sub=document.createElement('span');
      sub.textContent='每日 02:00 更新';
      head.append(name,sub);
      column.appendChild(head);

      const tracks=cachedToplist(chart.key);
      const cacheKey=`${uiLang()}:${chart.key}`;
      const isEn=uiLang()==='en';
      const list=document.createElement('div');
      list.className='discovery-recent-list toplist-column-list';
      if(tracks){
        tracks.slice(0,10).forEach((row,index)=>{
          const trackUid=isEn?`apple-${row.id}`:`netease-${row.id}`;
          const rowEl=document.createElement('button');
          rowEl.type='button';
          rowEl.className='discovery-recent-item ripple-target';
          rowEl.dataset.trackUid=trackUid;
          rowEl.dataset.trackTitle=row.title||'';
          rowEl.dataset.trackArtist=row.artist||'';
          const rank=document.createElement('span');
          rank.className='discovery-rank-num'+(index<3?' top3':'');
          rank.textContent=String(index+1);
          rowEl.appendChild(rank);
          rowEl.appendChild(buildToplistArt(row,1));
          const meta=document.createElement('span');
          meta.className='discovery-recent-meta';
          const t1=document.createElement('strong');t1.textContent=row.title||'未知歌曲';
          const t2=document.createElement('span');t2.textContent=row.artist||'';
          meta.append(t1,t2);
          const mark=document.createElement('b');
          mark.className='discovery-play-mark';
          mark.textContent=rowMatchesCurrent(trackUid,row.title,row.artist)?'⏸':'▶';
          rowEl.append(meta,mark);
          rowEl.addEventListener('click',async()=>{
            if(rowMatchesCurrent(trackUid,row.title,row.artist)){dom.audio.pause();return;}
            if(isEn){
              const played=await playHistoryTrack({title:row.title,artist:row.artist,cover:row.cover});
              if(played?.uid){rowEl.dataset.trackUid=played.uid;updatePlayMarks();}
              return;
            }
            playNeteaseTrack(row.id,row.title,row.artist,row.cover);
          });
          list.appendChild(rowEl);
        });
      }else{
        const status=document.createElement('div');
        status.className='discovery-toplist-status'+(toplistFailed[cacheKey]?' is-error':' is-loading');
        status.textContent=toplistFailed[cacheKey]?'榜单每日 02:00 更新，稍后再来看看':'正在获取…';
        list.appendChild(status);
        if(!toplistFailed[cacheKey])loadToplist(chart.key);
      }
      column.appendChild(list);
      return column;
    }

    // ===================== 发现页：推荐歌曲 / 推荐歌手 =====================

    async function loadRecommendations(){
      if(recommendLoading)return;
      recommendLoading=true;
      try{
        const response=await fetchWithTimeout(`/api/recommend?lang=${uiLang()}`,{},10000);
        if(response.ok){
          const data=await response.json();
          const tracks=(Array.isArray(data?.tracks)?data.tracks:[]).filter(item=>item&&item.title);
          // 英文界面兜底过滤中文曲目，避免服务端历史数据混入。
          const visibleTracks=uiLang()==='en'
            ?tracks.filter(item=>!/[\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af]/.test(`${item.title||''}${item.artist||''}`))
            :tracks;
          recommendCache={
            tracks:visibleTracks,
            basis:String(data?.basis||''),
            at:Date.now()
          };
          recommendFailed=false;
        }else{
          recommendFailed=true;
        }
      }catch(error){
        recommendFailed=true;
        console.warn('load recommendations failed',error);
      }finally{
        recommendLoading=false;
      }
      if(!state.searchKeyword&&!state.searchInProgress)renderMiniSearchList();
    }

    // 推荐卡缺封面时用 QQ 封面接口补（默认推荐只带歌名+歌手，播放走 QQ源）。
    const recommendCoverLookups=new Map();
    function fillRecommendedCover(art,track){
      const key=`${track.title||''}|${track.artist||''}`;
      if(!key||key==='|')return;
      const apply=(cover)=>{
        if(!cover)return;
        recommendCoverLookups.set(key,cover);
        const img=document.createElement('img');
        img.src=coverUrlFor(cover,120);img.alt='';img.referrerPolicy='no-referrer';
        img.loading='lazy';img.decoding='async';
        art.classList.remove('no-img');
        art.textContent='';
        art.appendChild(img);
      };
      const cached=recommendCoverLookups.get(key);
      if(cached){apply(cached);return;}
      const params=new URLSearchParams({action:'cover_lookup',title:track.title||'',artist:track.artist||''});
      fetchWithTimeout(`/api/music?${params}`,{},12000)
        .then(response=>response.json())
        .then(json=>apply(json?.data?.cover||''))
        .catch(()=>{});
    }

    function buildRecommendedCards(tracks){
      const row=document.createElement('div');
      row.className='discovery-recommended-row';
      (tracks||[]).slice(0,8).forEach((t,index)=>{
        const card=document.createElement('button');
        card.type='button';
        card.className='discovery-podium-card ripple-target';
        const art=document.createElement('span');
        art.className='discovery-podium-art';
        const cover=coverUrlFor(t.cover,120);
        if(cover){
          const img=document.createElement('img');
          img.src=cover;img.alt='';img.referrerPolicy='no-referrer';img.decoding='async';
          img.loading=index<4?'eager':'lazy';
          if(index<4)img.fetchPriority='high';
          img.onerror=()=>{img.remove();art.classList.add('no-img');art.textContent=String(index+1);};
          art.appendChild(img);
        }else{
          art.classList.add('no-img');
          art.textContent=String(index+1);
          fillRecommendedCover(art,t);
        }
        const rank=document.createElement('b');
        rank.className='discovery-podium-rank';
        rank.textContent=String(index+1);
        art.appendChild(rank);
        const copy=document.createElement('span');
        copy.className='discovery-podium-copy';
        const title=document.createElement('strong');title.textContent=t.title||'未知歌曲';
        copy.append(title);
        card.append(art,copy);
        card.dataset.trackUid=t.track_uid||'';
        card.addEventListener('click',()=>{
          if(rowMatchesCurrent(t.track_uid||'',t.title,t.artist)){dom.audio.pause();return;}
          playHistoryTrack(t);
        });
        row.appendChild(card);
      });
      return row;
    }

    function buildRecommendedSection(){
      const section=document.createElement('div');
      section.className='discovery-recommended';
      const head=document.createElement('div');
      head.className='discovery-toplist-head';
      const headTitle=document.createElement('div');
      headTitle.className='discovery-section-head';
      headTitle.textContent='推荐歌曲';
      head.appendChild(headTitle);
      const more=document.createElement('button');
      more.type='button';
      more.className='discovery-history-clear';
      more.textContent='查看榜单';
      more.addEventListener('click',()=>{
        if(window.matchMedia('(max-width: 760px)').matches)setMobileView('toplist');
        else setDesktopView('toplist');
      });
      head.appendChild(more);
      section.appendChild(head);

      const fresh=recommendCache.at>0&&Date.now()-recommendCache.at<RECOMMEND_TTL?recommendCache:null;
      if(fresh&&fresh.tracks.length){
        section.appendChild(buildRecommendedCards(fresh.tracks));
        return section;
      }
      // 推荐数据未就绪：先用热榜兜底展示，数据到达后自动重绘。
      const chart=cachedToplist('hot');
      if(chart&&chart.length){
        const isEn=uiLang()==='en';
        section.appendChild(buildRecommendedCards(chart.slice(0,8).map(row=>({
          track_uid:isEn?'':`netease-${row.id}`,
          title:row.title,
          artist:row.artist,
          source:isEn?'':'netease',
          cover:row.cover
        }))));
        if(!recommendLoading)loadRecommendations();
        return section;
      }
      const status=document.createElement('div');
      status.className='discovery-toplist-status'+(recommendFailed?' is-error':' is-loading');
      status.textContent=recommendFailed?'推荐每日更新，稍后再来看看':'正在准备推荐…';
      section.appendChild(status);
      if(!recommendLoading&&!recommendFailed)loadRecommendations();
      return section;
    }

    function buildRecommendedArtistsSection(){
      const section=document.createElement('div');
      section.className='discovery-artists';
      const head=document.createElement('div');
      head.className='discovery-toplist-head';
      const headTitle=document.createElement('div');
      headTitle.className='discovery-section-head';
      headTitle.textContent='推荐歌手';
      head.appendChild(headTitle);
      section.appendChild(head);
      const row=document.createElement('div');
      row.className='discovery-artist-row';
      popularArtists().forEach(artist=>{
        const name=artist.name;
        const card=document.createElement('button');
        card.type='button';
        card.className='discovery-artist-card ripple-target';
        const avatar=document.createElement('span');
        avatar.className='discovery-artist-avatar';
        const cover=coverUrlFor(artist.avatar,96);
        if(cover){
          const img=document.createElement('img');
          img.src=cover;img.alt='';img.referrerPolicy='no-referrer';img.loading='lazy';img.decoding='async';
          img.onerror=()=>{img.remove();avatar.textContent=name.slice(0,1);};
          avatar.appendChild(img);
        }else avatar.textContent=name.slice(0,1);
        const label=document.createElement('span');
        label.className='discovery-artist-name';
        label.textContent=name;
        card.append(avatar,label);
        card.addEventListener('click',()=>{
          dom.searchInput.value=name;
          state.searchKeyword=name;
          state.noMoreResults=false;
          searchAllSources(true);
        });
        row.appendChild(card);
      });
      section.appendChild(row);
      return section;
    }

    // 播放历史/推荐里的歌：网易按 ID 精确播放；其它来源用歌名+歌手匹配 QQ源，再兜底搜索。
    async function playHistoryTrack(entry){
      if(!entry)return;
      const uid=String(entry.track_uid||entry.uid||'');
      const title=entry.title||'';
      const artist=entry.artist||'';
      const id=/^netease-(\d+)$/.exec(uid)?.[1];
      if(id){
        playNeteaseTrack(id,title,artist,entry.cover);
        return;
      }
      const track=await matchJooxTrack(title,artist);
      if(track){
        track.cover=entry.cover||null;
        state.trackMap.set(track.uid,track);
        playTrack(track,{type:'search',index:-1,playlistId:null});
        if(window.matchMedia('(max-width: 760px)').matches)setMobileView('lyrics');
        return track;
      }
      const keyword=`${title} ${artist}`.trim();
      if(!keyword)return;
      dom.searchInput.value=keyword;
      state.searchKeyword=keyword;
      state.noMoreResults=false;
      searchAllSources(true);
    }

    async function matchJooxTrack(title,artist){
      const query=`${title||''} ${artist||''}`.trim();
      if(!query)return null;
      try{
        const response=await fetchWithTimeout(`/api/music?action=joox_search&q=${encodeURIComponent(query)}&limit=20`,{},12000);
        const json=await response.json();
        const candidates=Array.isArray(json?.data)?json.data:[];
        const matched=candidates
          .filter(item=>item&&item.songmid)
          .map(item=>({item,score:scoreQQImportCandidate({title,artist},item)}))
          .sort((a,b)=>b.score-a.score)[0];
        if(!matched||matched.score<45)return null;
        const it=matched.item;
        const mid=String(it.songmid);
        return {
          uid:`qq-${mid}`,
          source:'qq',
          keyword:query,
          qqSearchKey:query,
          jooxIndex:Number(it.index)||1,
          qqIndex:Number(it.index)||1,
          qqId:mid,
          songid:String(it.songid||mid),
          songMid:mid,
          mediaMid:mid,
          title:it.title||title||'',
          artist:it.artist||artist||'',
          album:'',
          cover:null,
          duration:Number(it.duration)||0,
          audioUrl:null,
          lrc:null,
          lrcUrl:null,
          detailsLoaded:false,
          quality:null,
          qualityLabel:null,
          qqQualityText:null,
          pay:null,
          resolverSource:'joox'
        };
      }catch(error){
        console.warn('joox match failed',error);
        return null;
      }
    }

    function renderMiniSearchList(){
      const wrap=dom.searchMiniList;
      wrap.innerHTML='';
      const out=getInterleavedSearchList();
      if(!out.length){
        if(state.searchInProgress){
          const loading=document.createElement('div');
          loading.className='search-empty-state search-loading-state';
          const spinner=document.createElement('div');
          spinner.className='search-loading-spinner';
          spinner.setAttribute('aria-hidden','true');
          const copy=document.createElement('span');
          copy.textContent='正在搜索多个音源…';
          loading.append(spinner,copy);
          wrap.appendChild(loading);
          return;
        }
        wrap.appendChild(state.searchKeyword?buildNoResultEmpty():buildDiscoveryBlock());
        return;
      }
      out.forEach((track,i)=>{
        const item=document.createElement('div');
        item.className='search-mini-item ripple-target';
        item.dataset.trackUid=track.uid;
        if(state.currentTrack?.uid===track.uid)item.classList.add('playing');
        if(state.selectedSearchUids.has(track.uid))item.classList.add('batch-selected');
        let selectControl=null;
        selectControl=document.createElement('input');
        selectControl.type='checkbox';
        selectControl.className='mini-select-control';
        selectControl.checked=state.selectedSearchUids.has(track.uid);
        selectControl.setAttribute('aria-label',track.title||'');
        selectControl.addEventListener('click',event=>event.stopPropagation());
        selectControl.addEventListener('change',()=>{
          toggleSearchTrackSelection(track.uid);
          item.classList.toggle('batch-selected',selectControl.checked);
        });
        item.appendChild(selectControl);
        const meta=document.createElement('div');
        meta.className='mini-meta-main';
        const tt=document.createElement('div');
        tt.className='mini-title'; tt.textContent=track.title||'Unknown';
        const ar=document.createElement('div');
        ar.className='mini-artist'; ar.textContent=track.artist||'';
        meta.appendChild(tt);meta.appendChild(ar);
        const right=document.createElement('div');
        right.className='mini-right';
        const queueBtn=document.createElement('button');
        queueBtn.type='button';
        queueBtn.className='btn btn-ghost btn-icon queue-add-btn ripple-target';
        queueBtn.textContent='☷';
        queueBtn.title=t('queueAdd');
        queueBtn.setAttribute('aria-label',t('queueAdd'));
        queueBtn.addEventListener('click',event=>{
          event.stopPropagation();
          addToPlayQueue(track);
        });
        right.appendChild(queueBtn);
        const badge=document.createElement('div');
        badge.className='mini-badge'; badge.textContent='#'+(i+1);
        right.appendChild(badge);
        item.appendChild(meta);item.appendChild(right);
        item.addEventListener('click',()=>{
          if(isCurrentPlaying(track)){dom.audio.pause();return;}
          const visible=getInterleavedSearchList();
          const idx=visible.findIndex(x=>x.uid===track.uid);
          playFromList('search',idx);
          if(window.matchMedia('(max-width: 760px)').matches)setMobileView('lyrics');
        });
        wrap.appendChild(item);
      });
    }

    function updatePlaylistInfoLabel(){
      if(!dom.playlistInfo)return;
      const tab=document.querySelector('.playlist-tab.active')?.dataset.tab||'results';
      if(tab==='results'){
        dom.playlistInfo.style.display='';
        dom.playlistInfo.textContent = t('playlistInfoResults');
      }
      else if(tab==='favorites'){
        if(isDesktopLibraryWorkspace()){
          dom.playlistInfo.style.display='none';
          dom.playlistInfo.textContent='';
          return;
        }
        dom.playlistInfo.style.display='';
        dom.playlistInfo.textContent = t('playlistInfoFavorites');
      }
      else {
        const selectedId=state.mobilePlaylistDetailId||getSelectedPlaylistId();
        const pl=state.playlists.find(p=>p.id===selectedId);
        const showMobileCount=Boolean(pl&&window.matchMedia('(max-width: 760px)').matches&&state.mobilePlaylistDetailId);
        dom.playlistInfo.style.display=showMobileCount?'':'none';
        dom.playlistInfo.textContent = showMobileCount
          ? (`${pl.tracks.length} 首歌曲`)
          : '';
      }
    }

    function updatePlaymodeVisibility(){
      const activeTab=document.querySelector('.playlist-tab.active')?.dataset.tab||'results';
      dom.playlistPanel?.querySelector('.playmode-row')?.classList.toggle('is-hidden',activeTab!=='results');
      if(dom.clearQueueBtn){
        dom.clearQueueBtn.classList.toggle('is-hidden',activeTab!=='results');
        dom.clearQueueBtn.disabled=state.playQueue.length===0;
      }
    }

    function isMobileLibraryView(){
      return window.matchMedia('(max-width: 760px)').matches&&document.body.dataset.mobileView==='me';
    }

    function isDesktopLibraryWorkspace(){
      return window.matchMedia('(min-width: 761px)').matches
        && dom.workspaceContent?.classList.contains('workspace-library-only');
    }

    // 歌单封面自动取第一首歌的封面；空歌单或无封面回退歌单名首字母。
    function buildPlaylistCardArt(playlist,className='playlist-card-art'){
      const art=document.createElement('span');
      art.className=className;
      const cover=playlist.tracks?.[0]?.cover||'';
      if(cover){
        const img=document.createElement('img');
        img.src=coverUrlFor(cover,120);img.alt='';img.referrerPolicy='no-referrer';
        img.loading='lazy';img.decoding='async';
        img.onerror=()=>{img.remove();art.textContent=(playlist.name||'P').slice(0,1).toUpperCase();};
        art.appendChild(img);
      }else art.textContent=(playlist.name||'P').slice(0,1).toUpperCase();
      return art;
    }

    function appendPlaylistCardCopy(card,playlist){
      const copy=document.createElement('span');
      copy.className='playlist-card-copy';
      const name=document.createElement('strong');
      name.textContent=playlist.name;
      copy.appendChild(name);
      if(playlist.desc){
        const desc=document.createElement('small');
        desc.className='playlist-card-desc';
        desc.textContent=playlist.desc;
        copy.appendChild(desc);
      }
      card.appendChild(copy);
      return copy;
    }

    function renderDesktopPlaylistOverview(){
      const wrap=dom.playlistList;
      if(!state.playlists.length){
        wrap.classList.add('is-empty');
        renderLibraryEmptyState('playlists');
        return;
      }
      const list=document.createElement('div');
      list.className='desktop-playlist-overview';
      state.playlists.forEach(playlist=>{
        const card=document.createElement('button');
        card.type='button';
        card.className='desktop-playlist-card ripple-target';
        card.appendChild(buildPlaylistCardArt(playlist));
        appendPlaylistCardCopy(card,playlist);
        const count=document.createElement('span');
        count.textContent=`${playlist.tracks.length} 首歌曲`;
        card.appendChild(count);
        card.addEventListener('click',()=>{
          workspaceDesktopPlaylistId=playlist.id;
          state.playContext.type='playlist';
          state.playContext.playlistId=playlist.id;
          renderPlaylistList();
        });
        list.appendChild(card);
      });
      wrap.appendChild(list);
    }

    function syncMobilePlaylistPage(){
      const activeTab=document.querySelector('.playlist-tab.active')?.dataset.tab||'results';
      updatePlaymodeVisibility();
      const detail=activeTab==='playlists'&&isMobileLibraryView()
        ? state.playlists.find(pl=>pl.id===state.mobilePlaylistDetailId)
        : null;
      const overview=activeTab==='playlists'&&isMobileLibraryView()&&!detail;
      dom.playlistPanel.classList.toggle('mobile-playlist-detail',Boolean(detail));
      dom.playlistPanel.classList.toggle('mobile-playlist-overview',overview);
      if(dom.mobilePlaylistDelete)dom.mobilePlaylistDelete.disabled=!detail;
    }

    function openMobilePlaylistDetail(playlistId){
      const playlist=state.playlists.find(pl=>pl.id===playlistId);
      if(!playlist)return;
      state.mobilePlaylistDetailId=playlist.id;
      state.playContext.type='playlist';
      state.playContext.playlistId=playlist.id;
      renderPlaylistList();
    }

    function closeMobilePlaylistDetail(){
      state.mobilePlaylistDetailId=null;
      renderPlaylistList();
    }

    function renderMobilePlaylistOverview(){
      const toolbar=document.createElement('div');
      toolbar.className='mobile-playlist-toolbar';
      const create=document.createElement('button');
      create.type='button';create.className='btn mobile-playlist-create ripple-target';
      create.textContent=t('libraryCreateAction');
      create.addEventListener('click',()=>openPlaylistModal());
      const editBtn=document.createElement('button');
      editBtn.type='button';editBtn.className='btn btn-ghost mobile-playlist-tool ripple-target';
      editBtn.textContent='编辑';
      editBtn.addEventListener('click',()=>{
        const pl=state.playlists.find(item=>item.id===getSelectedPlaylistId());
        if(!pl){showToast(t('toastNeedPlaylistSelected'));return;}
        openPlaylistModal(pl);
      });
      const importBtn=document.createElement('button');
      importBtn.type='button';importBtn.className='btn btn-ghost mobile-playlist-tool ripple-target';
      importBtn.title=t('importPlaylist');importBtn.setAttribute('aria-label',t('importPlaylist'));importBtn.textContent=t('mobileImportAction');
      importBtn.addEventListener('click',()=>dom.importPlaylistBtn.click());
      const exportBtn=document.createElement('button');
      exportBtn.type='button';exportBtn.className='btn btn-ghost mobile-playlist-tool ripple-target';
      exportBtn.title=t('exportPlaylist');exportBtn.setAttribute('aria-label',t('exportPlaylist'));exportBtn.textContent=t('mobileExportAction');
      exportBtn.addEventListener('click',()=>dom.exportPlaylistBtn.click());
      const shareBtn=document.createElement('button');
      shareBtn.type='button';shareBtn.className='btn btn-ghost mobile-playlist-tool ripple-target';
      shareBtn.textContent='分享';
      shareBtn.addEventListener('click',shareCurrentPlaylist);
      toolbar.appendChild(create);toolbar.appendChild(editBtn);toolbar.appendChild(shareBtn);toolbar.appendChild(importBtn);toolbar.appendChild(exportBtn);
      dom.playlistList.appendChild(toolbar);

      if(!state.playlists.length){
        dom.playlistList.classList.add('is-empty');
        renderLibraryEmptyState('playlists');
        return;
      }

      const cards=document.createElement('div');
      cards.className='mobile-playlist-cards';
      state.playlists.forEach((playlist,index)=>{
        const card=document.createElement('button');
        card.type='button';card.className='mobile-playlist-card ripple-target';
        card.appendChild(buildPlaylistCardArt(playlist,'mobile-playlist-card-art playlist-card-art'));
        const copy=document.createElement('span');
        const name=document.createElement('strong');
        const count=document.createElement('small');
        name.textContent=playlist.name;
        count.textContent=`${playlist.tracks.length} 首歌曲`;
        const arrow=document.createElement('b');arrow.setAttribute('aria-hidden','true');arrow.textContent='\u203A';
        copy.appendChild(name);copy.appendChild(count);
        if(playlist.desc){
          const desc=document.createElement('small');
          desc.className='playlist-card-desc';
          desc.textContent=playlist.desc;
          copy.appendChild(desc);
        }
        card.appendChild(copy);card.appendChild(arrow);
        card.addEventListener('click',()=>openMobilePlaylistDetail(playlist.id));
        cards.appendChild(card);
      });
      dom.playlistList.appendChild(cards);
    }

    function renderLibraryEmptyState(activeTab){
      const empty=document.createElement('div');
      empty.className='library-empty-state';
      empty.setAttribute('role','status');

      const icon=document.createElement('div');
      icon.className='library-empty-icon';
      icon.setAttribute('aria-hidden','true');
      icon.textContent=activeTab==='favorites'?'\u2661':'+';

      const copy=document.createElement('div');
      copy.className='library-empty-copy';
      const title=document.createElement('strong');
      const description=document.createElement('span');
      const action=document.createElement('button');
      action.type='button';
      action.className='btn library-empty-action ripple-target';

      if(!state.isAuthenticated){
        title.textContent=t('libraryLoginTitle');
        description.textContent=t('libraryLoginDescription');
        action.textContent=t('libraryLoginAction');
        action.addEventListener('click',()=>openLoginModal());
      }else if(activeTab==='favorites'){
        title.textContent=t('libraryEmptyFavoritesTitle');
        description.textContent=t('libraryEmptyFavoritesDescription');
        action.textContent=t('libraryBrowseAction');
        action.addEventListener('click',()=>{
          if(window.matchMedia('(max-width: 760px)').matches)setMobileView('search');
          else setDesktopView('search');
        });
      }else{
        title.textContent=t('libraryEmptyPlaylistsTitle');
        description.textContent=t('libraryEmptyPlaylistsDescription');
        action.textContent=t('libraryCreateAction');
        action.addEventListener('click',()=>openPlaylistModal());
      }

      copy.appendChild(title);
      copy.appendChild(description);
      empty.appendChild(icon);
      empty.appendChild(copy);
      empty.appendChild(action);
      dom.playlistList.appendChild(empty);
    }

    function renderPlaylistList(){
      const wrap=dom.playlistList;
      wrap.innerHTML='';
      wrap.classList.remove('is-empty');
      const activeTab=document.querySelector('.playlist-tab.active')?.dataset.tab||'results';
      const mobileLibrary=isMobileLibraryView();
      const desktopLibrary=isDesktopLibraryWorkspace();
      if(!state.isAuthenticated && activeTab!=='results'){
        dom.playlistList.hidden=false;
        dom.accountProfileView.hidden=true;
        if(dom.playlistSelectRow)dom.playlistSelectRow.style.display='none';
        if(dom.playlistSelectTools)dom.playlistSelectTools.style.display='none';
        if(dom.playlistInfo)dom.playlistInfo.style.display='none';
        wrap.classList.add('is-empty');
        renderLibraryEmptyState(activeTab==='profile'?'favorites':activeTab);
        return;
      }
      let list=[];
      if(activeTab==='profile'){
        dom.playlistList.hidden=true;
        dom.playlistPanel.querySelector('.playlist-bar').hidden=true;
        dom.accountProfileView.hidden=false;
        return;
      }
      dom.playlistList.hidden=false;
      if(activeTab==='results'){
        list=state.playQueue;
        dom.playlistSelectRow?.style && (dom.playlistSelectRow.style.display='none');
        dom.playlistSelectTools?.style && (dom.playlistSelectTools.style.display='none');
      }else if(activeTab==='favorites'){
        list=state.favorites;
        dom.playlistSelectRow?.style && (dom.playlistSelectRow.style.display='none');
        dom.playlistSelectTools?.style && (dom.playlistSelectTools.style.display='none');
      }else{
        renderPlaylistOptions();
        if(desktopLibrary){
          dom.playlistSelectRow?.style && (dom.playlistSelectRow.style.display='none');
          dom.playlistSelectTools?.style && (dom.playlistSelectTools.style.display='none');
          if(!workspaceDesktopPlaylistId){
            if(dom.playlistInfo)dom.playlistInfo.style.display='none';
            renderDesktopPlaylistOverview();
            return;
          }
        }
        if(mobileLibrary){
          dom.playlistSelectRow?.style && (dom.playlistSelectRow.style.display='none');
          dom.playlistSelectTools?.style && (dom.playlistSelectTools.style.display='none');
          syncMobilePlaylistPage();
          if(!state.mobilePlaylistDetailId){
            updatePlaylistInfoLabel();
            renderMobilePlaylistOverview();
            return;
          }
        }else{
          dom.playlistSelectRow?.style && (dom.playlistSelectRow.style.display='grid');
          dom.playlistSelectTools?.style && (dom.playlistSelectTools.style.display='flex');
        }
        if(!state.playlists.length){
          updatePlaylistInfoLabel();
          wrap.classList.add('is-empty');
          renderLibraryEmptyState(activeTab);
          return;
        }
        const pl=state.playlists.find(p=>p.id===getSelectedPlaylistId())||state.playlists[0];
        state.playContext.playlistId=pl.id;
        list=pl.tracks;
      }
      updatePlaylistInfoLabel();
      syncMobilePlaylistPage();

      if(activeTab==='results'&&!list.length){
        wrap.classList.add('is-empty');
        const empty=document.createElement('div');
        empty.className='library-empty-state queue-empty-state';
        const icon=document.createElement('div');
        icon.className='library-empty-icon';
        icon.setAttribute('aria-hidden','true');
        icon.textContent='\u266A';
        const copy=document.createElement('div');
        copy.className='library-empty-copy';
        const title=document.createElement('strong');
        const description=document.createElement('span');
        const action=document.createElement('button');
        action.type='button';
        action.className='btn library-empty-action ripple-target';
        if(state.currentTrack){
          title.textContent='队列为空';
          description.textContent=`当前正在播放《${state.currentTrack.title||'未知歌曲'}》。把歌曲加入队列后，可以手动管理接下来的播放顺序。`;
          action.textContent='加入当前歌曲';
          action.addEventListener('click',()=>addToPlayQueue(state.currentTrack));
        }else{
          title.textContent=t('queueEmpty');
          description.textContent='从搜索结果或收藏中把歌曲加入队列。';
          action.textContent='去搜索';
          action.addEventListener('click',()=>{
            if(window.matchMedia('(max-width: 760px)').matches)setMobileView('search');
            else setDesktopView('search');
          });
        }
        copy.appendChild(title);
        copy.appendChild(description);
        empty.appendChild(icon);empty.appendChild(copy);empty.appendChild(action);
        wrap.appendChild(empty);
        return;
      }
      if(activeTab!=='results'&&!list.length){
        wrap.classList.add('is-empty');
        renderLibraryEmptyState(activeTab);
        return;
      }

      if(desktopLibrary&&activeTab==='playlists'&&workspaceDesktopPlaylistId){
        const back=document.createElement('button');
        back.type='button';
        back.className='desktop-playlist-back btn btn-ghost ripple-target';
        back.textContent='← 歌单';
        back.addEventListener('click',()=>{
          workspaceDesktopPlaylistId=null;
          renderPlaylistList();
        });
        wrap.appendChild(back);
      }

      list.forEach((track,idx)=>{
        const item=document.createElement('div');
        item.className='track-item ripple-target';
        item.dataset.trackUid=track.uid;
        if(state.currentTrack && state.currentTrack.uid===track.uid) item.classList.add('playing');
        if(activeTab==='results'&&state.selectedSearchUids.has(track.uid)) item.classList.add('batch-selected');

        const index=document.createElement('div');
        index.className='track-index'; index.textContent=idx+1;

        const meta=document.createElement('div');
        const title=document.createElement('div');
        title.className='track-meta-title'; title.textContent=track.title||'Unknown';
        const sub=document.createElement('div');
        sub.className='track-meta-sub';
        const aSpan=document.createElement('span'); aSpan.textContent=track.artist||'';
        // 音乐源不再对外展示。
        sub.appendChild(aSpan);
        meta.appendChild(title);meta.appendChild(sub);

        const act=document.createElement('div');
        act.className='track-actions';
        const pBtn=document.createElement('button');
        pBtn.className='btn btn-secondary btn-icon ripple-target';
        pBtn.textContent=state.currentTrack?.uid===track.uid&&state.isPlaying?'⏸':'▶';
        const fBtn=document.createElement('button');
        fBtn.className='btn btn-secondary btn-icon ripple-target'; fBtn.textContent='❤';
        if(isFavorite(track)) fBtn.classList.add('btn-fav-active');
        const removeBtn=document.createElement('button');
        removeBtn.className='btn btn-ghost btn-icon ripple-target';
        removeBtn.textContent='×';
        removeBtn.title=t('removeFromPlaylist');

        pBtn.addEventListener('click',ev=>{
          ev.stopPropagation();
          if(isCurrentPlaying(track)){dom.audio.pause();return;}
          if(activeTab==='results'){
            const i=state.playQueue.findIndex(x=>x.uid===track.uid);
            playFromList('queue',i);
          }else if(activeTab==='favorites'){
            const i=state.favorites.findIndex(x=>x.uid===track.uid);
            playFromList('favorites',i);
          }else{
            const plId=getSelectedPlaylistId();
            const pl=state.playlists.find(p=>p.id===plId);
            const i=pl?pl.tracks.findIndex(x=>x.uid===track.uid):-1;
            playFromList('playlist',i,plId);
          }
        });
        const queueBtn=document.createElement('button');
        queueBtn.className='btn btn-ghost btn-icon queue-add-btn ripple-target';
        queueBtn.textContent='☷';
        queueBtn.title=t('queueAdd');
        queueBtn.setAttribute('aria-label',t('queueAdd'));
        queueBtn.addEventListener('click',ev=>{
          ev.stopPropagation();
          addToPlayQueue(track);
        });
        fBtn.addEventListener('click',ev=>{
          ev.stopPropagation();
          if(!requireLibraryAccess())return;
          const i=state.favorites.findIndex(x=>x.uid===track.uid);
          if(i>=0){state.favorites.splice(i,1);showToast(t('toastRemovedFavorite'));}
          else{state.favorites.push(track);showToast(t('toastAddedFavorite'));}
          saveLibraryToStorage();
          renderPlaylistList();
          updateMainFavButton();
        });
        removeBtn.addEventListener('click',ev=>{
          ev.stopPropagation();
          if(activeTab==='results')removeFromPlayQueue(track.uid);
          else removeTrackFromCurrentPlaylist(track.uid);
        });
        act.appendChild(pBtn);
        if(activeTab==='results') act.appendChild(removeBtn);
        else {
          act.appendChild(queueBtn);
          if(activeTab!=='playlists') act.appendChild(fBtn);
          if(activeTab==='playlists') act.appendChild(removeBtn);
        }
        item.appendChild(index);item.appendChild(meta);item.appendChild(act);
        item.addEventListener('click',()=>pBtn.click());
        wrap.appendChild(item);
      });

      // Do not auto-scroll the right playlist after every re-render.
      // Re-rendering can happen when favoriting/unfavoriting a track; forcing
      // the active track into view at that moment may push the playlist header
      // and controls out of the visible area in some layouts.
    }

    // ===================== 歌单弹窗 =====================

    function openPlaylistModal(pl){
      if(!requireLibraryAccess())return;
      const target=typeof pl==='string'?state.playlists.find(item=>item.id===pl):pl;
      editingPlaylistId=target?target.id:null;
      dom.playlistModal.classList.add('show');
      dom.playlistNameInput.value=target?target.name:'';
      dom.playlistDescInput.value=target?(target.desc||''):'';
      const titleEl=dom.playlistModal.querySelector('[data-i18n="modalNewPlaylistTitle"]');
      if(titleEl)titleEl.textContent=target?'编辑歌单':t('modalNewPlaylistTitle');
      setTimeout(()=>dom.playlistNameInput.focus(),50);
    }
    function closePlaylistModal(){
      dom.playlistModal.classList.remove('show');
      createPlaylistForCurrentTrack=false;
      pendingPlaylistTracks=[];
      editingPlaylistId=null;
    }
    function createPlaylist(){
      if(!requireLibraryAccess())return;
      if(editingPlaylistId){
        const pl=state.playlists.find(item=>item.id===editingPlaylistId);
        closePlaylistModal();
        if(pl){
          const name=dom.playlistNameInput.value.trim();
          pl.name=name||pl.name;
          pl.desc=dom.playlistDescInput.value.trim();
          saveLibraryToStorage();
          renderPlaylistList();
          showToast('歌单已更新');
        }
        return;
      }
      let name=dom.playlistNameInput.value.trim();
      if(!name)name='未命名歌单';
      const id='pl-'+Date.now()+'-'+Math.random().toString(16).slice(2);
      const pl={id,name,desc:dom.playlistDescInput.value.trim(),tracks:[]};
      const shouldSaveCurrent=createPlaylistForCurrentTrack;
      const batchTracks=[...pendingPlaylistTracks];
      const shouldSaveBatch=batchTracks.length>0;
      createPlaylistForCurrentTrack=false;
      pendingPlaylistTracks=[];
      state.playlists.push(pl);
      state.playContext.playlistId=pl.id;
      if(shouldSaveCurrent&&state.currentTrack)pl.tracks.push(state.currentTrack);
      if(shouldSaveBatch){
        const seen=new Set();
        batchTracks.forEach(track=>{
          if(track&&!seen.has(track.uid)){pl.tracks.push(track);seen.add(track.uid);}
        });
      }
      renderPlaylistOptions();
      saveLibraryToStorage();
      closePlaylistModal();
      renderPlaylistList();
      if(shouldSaveBatch){
        state.selectedSearchUids.clear();
        updateBatchToolbar();
        renderMiniSearchList();
        showToast(t('searchBatchPlaylistSaved').replace('{added}',String(pl.tracks.length)));
      }else showToast(shouldSaveCurrent&&state.currentTrack?t('toastAddedToPlaylist'):t('toastPlaylistCreated'));
    }

    // ===================== 搜索加载更多 =====================

    function canAutoLoadMore(){
      return !state.searchInProgress && !state.noMoreResults;
    }
    function requestMoreResults(){
      const enabled=Object.keys(state.enabledSources).filter(k=>state.enabledSources[k]);
      if(!enabled.length)return;

      enabled.forEach(src=>{
        if(src==='netease'){
          state.perSourcePage.netease = (state.perSourcePage.netease || 1) + 1;
        }else{
          state.perSourceCurrentLimit[src]=(state.perSourceCurrentLimit[src]||state.perSourceLimit)+state.perSourceLimit;
        }
      });

      searchAllSources(false);
    }

    // ===================== 背景粒子 & 水波纹 =====================

    function setupParticles(){
      const canvas=$('bg-canvas');
      if(!canvas)return;
      const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
      if(reduceMotion.matches){canvas.style.display='none';return;}
      const ctx=canvas.getContext('2d');
      if(!ctx)return;
      function resize(){
        const dpr=window.devicePixelRatio||1;
        canvas.width=window.innerWidth*dpr;
        canvas.height=window.innerHeight*dpr;
        ctx.setTransform(dpr,0,0,dpr,0,0);
      }
      resize();window.addEventListener('resize',resize);
      const parts=[];
      const N=window.matchMedia('(max-width: 760px)').matches?45:90;
      for(let i=0;i<N;i++){
        parts.push({
          x:Math.random()*window.innerWidth,
          y:Math.random()*window.innerHeight,
          vx:(Math.random()-0.5)*0.4,
          vy:(Math.random()-0.5)*0.4,
          r:1+Math.random()*2.5,
          baseR:1+Math.random()*2.5,
          hue:120+Math.random()*60,
          a:0.22+Math.random()*0.3
        });
      }
      let mouse={x:window.innerWidth/2,y:window.innerHeight/2};
      window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
      let frameId=null;
      function start(){
        if(frameId===null&&!document.hidden)frameId=requestAnimationFrame(tick);
      }
      function stop(){
        if(frameId!==null){cancelAnimationFrame(frameId);frameId=null;}
      }
      function tick(){
        frameId=null;
        ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
        const pulse = 1 + audioLevel * 2.2;
        for(const p of parts){
          p.x+=p.vx; p.y+=p.vy; p.hue+=0.08;
          if(p.x<-40)p.x=window.innerWidth+40;
          if(p.x>window.innerWidth+40)p.x=-40;
          if(p.y<-40)p.y=window.innerHeight+40;
          if(p.y>window.innerHeight+40)p.y=-40;
          const dx=p.x-mouse.x,dy=p.y-mouse.y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          const push=Math.max(0,140-dist)/140;
          p.x+=dx*0.011*push; p.y+=dy*0.011*push;
          ctx.beginPath();
          ctx.arc(p.x,p.y,p.baseR*pulse,0,Math.PI*2);
          const light = Math.min(80, 60 + audioLevel*40);
          ctx.fillStyle=`hsla(${p.hue},70%,${light}%,${p.a})`;
          ctx.fill();
        }
        ctx.lineWidth=0.45;
        for(let i=0;i<parts.length;i++){
          for(let j=i+1;j<parts.length;j++){
            const a=parts[i],b=parts[j];
            const dx=a.x-b.x,dy=a.y-b.y;
            const d=Math.sqrt(dx*dx+dy*dy);
            if(d<100){
              const al=0.10*(1-d/100)*(0.6+audioLevel*1.5);
              ctx.beginPath();
              ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
              ctx.strokeStyle=`rgba(127,166,143,${al})`;
              ctx.stroke();
            }
          }
        }
        if(!document.hidden)frameId=requestAnimationFrame(tick);
      }
      document.addEventListener('visibilitychange',()=>{document.hidden?stop():start();});
      reduceMotion.addEventListener?.('change',event=>{
        if(event.matches){stop();canvas.style.display='none';}
        else{canvas.style.display='';resize();start();}
      });
      start();
    }

    function setupRipple(){
      document.addEventListener('pointerdown',e=>{
        const target=e.target.closest('.ripple-target, .btn, .track-item, .search-mini-item');
        if(!target)return;
        const rect=target.getBoundingClientRect();
        const x=e.clientX-rect.left, y=e.clientY-rect.top;
        const max=Math.max(rect.width,rect.height);

        const outer=document.createElement('span');
        outer.className='ripple-circle';
        outer.style.left=x+'px'; outer.style.top=y+'px';
        outer.style.width=outer.style.height=(max*2)+'px';

        const inner=document.createElement('span');
        inner.className='ripple-circle-inner';
        inner.style.left=x+'px'; inner.style.top=y+'px';
        inner.style.width=inner.style.height=(max*1.4)+'px';

        target.appendChild(outer);
        target.appendChild(inner);
        setTimeout(()=>outer.remove(),800);
        setTimeout(()=>inner.remove(),800);
      });
    }

    async function accountRequest(url,options={}){
      const response=await fetch(url,{credentials:'same-origin',...options});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.error||'请求失败，请稍后重试');
      return data;
    }
    function formatListeningTime(seconds){
      const total=Math.max(0,Math.round(Number(seconds)||0));
      if(total<60)return total?`${total} 秒`:'—';
      const totalMinutes=Math.round(total/60);
      const hours=Math.floor(totalMinutes/60);
      const minutes=totalMinutes%60;
      if(hours>0)return minutes?`${hours} 小时 ${minutes} 分钟`:`${hours} 小时`;
      return `${minutes} 分钟`;
    }

    // 同一歌手/专辑常有繁简两种写法（周杰伦/周杰倫），展示前按归一化名称合并。
    function mergeRankedRows(rows,keyFn){
      const map=new Map();
      (rows||[]).forEach(row=>{
        const key=keyFn(row)||`${row.title||''}|${row.artist||''}`;
        const existing=map.get(key);
        if(existing){
          existing.plays=Number(existing.plays||0)+Number(row.plays||0);
          existing.seconds=Number(existing.seconds||0)+Number(row.seconds||0);
          if(!existing.cover&&row.cover)existing.cover=row.cover;
        }else{
          map.set(key,{...row,plays:Number(row.plays||0),seconds:Number(row.seconds||0)});
        }
      });
      return [...map.values()].sort((a,b)=>b.plays-a.plays);
    }

    function renderInsightsBars(container,entries){
      const max=Math.max(1,...entries.map(entry=>Number(entry.value)||0));
      const bars=document.createElement('div');
      bars.className='insights-bars';
      entries.forEach(entry=>{
        const row=document.createElement('div');
        row.className='insights-bar-row';
        const label=document.createElement('span');
        label.className='insights-bar-label';
        label.textContent=entry.label;
        const track=document.createElement('span');
        track.className='insights-bar-track';
        const fill=document.createElement('i');
        fill.style.width=`${Math.max(6,Math.round(((Number(entry.value)||0)/max)*100))}%`;
        track.appendChild(fill);
        const value=document.createElement('span');
        value.className='insights-bar-value';
        value.textContent=entry.text||String(entry.value||0);
        row.append(label,track,value);
        bars.appendChild(row);
      });
      container.appendChild(bars);
    }

    function renderInsightsList(container,title,items,options={}){
      if(!items||!items.length)return;
      const card=document.createElement('div');
      card.className='insights-list-card';
      const heading=document.createElement('h4');
      heading.className='insights-section-title';
      heading.textContent=title;
      const list=document.createElement('ol');
      list.className='insights-list';
      items.forEach((item,index)=>{
        const li=document.createElement('li');
        const rank=document.createElement('b');
        rank.textContent=String(index+1);
        li.appendChild(rank);
        const cover=options.coverKey?coverUrlFor(item[options.coverKey],80):'';
        if(cover){
          const img=document.createElement('img');
          img.className='insights-row-cover';
          img.src=cover;
          img.alt='';
          img.referrerPolicy='no-referrer';
          img.loading='lazy';
          li.appendChild(img);
        }else if(options.initialKey){
          const initial=document.createElement('span');
          initial.className='insights-row-initial';
          initial.textContent=String(item[options.initialKey]||'?').slice(0,1);
          li.appendChild(initial);
        }
        const copy=document.createElement('span');
        copy.className='insights-row-copy';
        copy.textContent=options.describe?options.describe(item):'';
        li.appendChild(copy);
        list.appendChild(li);
      });
      card.append(heading,list);
      container.appendChild(card);
    }

    function renderAccountSummary(summary={}){
      lastAccountSummary=summary;
      const target=dom.listeningSummary;
      target.replaceChildren();
      const plays=Number(summary.plays||0);
      if(!plays){
        const empty=document.createElement('p');
        empty.className='account-muted';
        empty.textContent='开始播放歌曲后，这里会生成你的听歌分析。';
        target.appendChild(empty);
        return;
      }
      const stats=document.createElement('div');
      stats.className='listening-summary-stats insights-stats';
      [
        [Number(plays).toLocaleString(),'次播放'],
        [formatListeningTime(summary.totalSeconds),'总时长'],
        [Number(summary.uniqueTracks||0).toLocaleString(),'首歌曲'],
        [Number(summary.month?.plays||0).toLocaleString(),'本月播放'],
      ].forEach(([value,label])=>{
        const item=document.createElement('div');
        item.className='listening-stat insights-stat';
        const strong=document.createElement('strong');
        strong.textContent=value;
        const small=document.createElement('span');
        small.textContent=label;
        item.append(strong,small);
        stats.appendChild(item);
      });
      target.appendChild(stats);

      if(Number(summary.discoveries||0)>0){
        const discoveries=document.createElement('p');
        discoveries.className='insights-discovery';
        discoveries.textContent=`近 30 天新发现 ${Number(summary.discoveries)} 首歌`;
        target.appendChild(discoveries);
      }

      const daily=Array.isArray(summary.daily)?summary.daily:[];
      const hours=Array.isArray(summary.hours)?summary.hours:[];
      if(daily.length||hours.length){
        const charts=document.createElement('div');
        charts.className='insights-charts';
        if(daily.length){
          const chart=document.createElement('div');
          chart.className='insights-chart';
          const heading=document.createElement('h4');
          heading.className='insights-section-title';
          heading.textContent='最近 7 天';
          chart.appendChild(heading);
          const byDay=new Map(daily.map(row=>[String(row.day),row]));
          const weekLabels=['日','一','二','三','四','五','六'];
          const entries=[];
          for(let offset=6;offset>=0;offset-=1){
            const date=new Date(Date.now()-offset*86400000+8*3600000);
            const key=date.toISOString().slice(0,10);
            const row=byDay.get(key);
            entries.push({label:`周${weekLabels[date.getUTCDay()]}`,value:Number(row?.plays||0),text:String(Number(row?.plays||0))});
          }
          renderInsightsBars(chart,entries);
          charts.appendChild(chart);
        }
        if(hours.length){
          const chart=document.createElement('div');
          chart.className='insights-chart';
          const heading=document.createElement('h4');
          heading.className='insights-section-title';
          heading.textContent='听歌时段';
          chart.appendChild(heading);
          const buckets=['凌晨','早晨','上午','下午','傍晚','深夜'];
          const counts=new Array(6).fill(0);
          hours.forEach(row=>{
            const hour=Number(row.hour)||0;
            counts[Math.min(5,Math.floor(hour/4))]+=Number(row.plays)||0;
          });
          renderInsightsBars(chart,buckets.map((label,index)=>({label,value:counts[index],text:String(counts[index])})));
          charts.appendChild(chart);
        }
        target.appendChild(charts);
      }

      const artists=mergeRankedRows(summary.topArtists||[],item=>normalizeMusicMatchText(item.artist)).slice(0,5);
      const tracks=mergeRankedRows(summary.topTracks||[],item=>`${normalizeMusicMatchText(item.title)}|${normalizeMusicMatchText(item.artist)}`).slice(0,5);
      if(artists.length||tracks.length){
        const lists=document.createElement('div');
        lists.className='insights-lists';
        renderInsightsList(lists,'最常听歌手',artists,{initialKey:'artist',describe:item=>`${item.artist||'未知歌手'} · ${Number(item.plays||0)} 次`});
        renderInsightsList(lists,'最常听歌曲',tracks,{coverKey:'cover',describe:item=>`${item.title||'未知歌曲'} · ${item.artist||'未知歌手'} · ${Number(item.plays||0)} 次`});
        target.appendChild(lists);
      }


    }

    async function loadAccountProfile(){
      if(!state.isAuthenticated){openLoginModal();return;}
      dom.accountProfileView.hidden=false;
      dom.playlistList.hidden=true;
      dom.playlistPanel.querySelector('.playlist-bar').hidden=true;
      dom.accountProfileName.textContent=state.profileName||'我的信息';
      try{
        const [{profile},{summary}]=await Promise.all([accountRequest('/api/profile'),accountRequest('/api/history')]);
        dom.accountProfileId.textContent=`账号：${profile.username} · 收藏 ${state.favorites.length} · 歌单 ${state.playlists.length}`;
        dom.accountDisplayName.value=profile.display_name||profile.username;
        dom.accountAvatarUrl.value=profile.avatar_url||'';
        dom.accountProfileName.textContent=profile.display_name||profile.username;
        dom.accountAvatarPreview.replaceChildren();
        if(profile.avatar_url){const img=document.createElement('img');img.src=profile.avatar_url;img.alt='';img.referrerPolicy='no-referrer';img.onerror=()=>{img.remove();dom.accountAvatarPreview.textContent='H';};dom.accountAvatarPreview.appendChild(img);}
        else dom.accountAvatarPreview.textContent=(profile.display_name||profile.username||'H').slice(0,1);
        renderAccountSummary(summary);
      }catch(error){
        dom.listeningSummary.textContent=error.message;
      }
    }
    function closeAccountProfile(){
      dom.accountProfileView.hidden=true;
      dom.playlistList.hidden=false;
      dom.playlistPanel.querySelector('.playlist-bar').hidden=false;
    }
    async function saveAccountProfile(event){
      event.preventDefault();
      const previousUsername=state.profileName;
      const payload={username:dom.accountDisplayName.value.trim(),displayName:dom.accountDisplayName.value.trim(),avatarUrl:dom.accountAvatarUrl.value.trim()};
      try{
        const result=await accountRequest('/api/profile',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        if(result.username&&result.username!==previousUsername){
          try{
            const library=localStorage.getItem(getLibraryStorageKey(previousUsername));
            const queue=localStorage.getItem(getPlayQueueStorageKey(previousUsername));
            if(library)localStorage.setItem(getLibraryStorageKey(result.username),library);
            if(queue)localStorage.setItem(getPlayQueueStorageKey(result.username),queue);
          }catch(error){}
          state.profileName=result.username;
        }
        showToast('资料已保存');
        await loadAccountProfile();
      }catch(error){showToast(error.message);}
    }
    async function changeAccountPassword(event){
      event.preventDefault();
      try{
        await accountRequest('/api/password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({currentPassword:dom.accountCurrentPassword.value,newPassword:dom.accountNewPassword.value})});
        dom.accountCurrentPassword.value='';dom.accountNewPassword.value='';showToast('密码已更新');
      }catch(error){showToast(error.message);}
    }
    function recordPlayedTrack(track){
      if(!state.isAuthenticated||!track?.uid)return;
      const audioDuration=Number(dom.audio.duration);
      const duration=Math.round(isFinite(audioDuration)&&audioDuration>0?audioDuration:(Number(track.duration)||0));
      fetch('/api/history',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({uid:track.uid,title:track.title,artist:track.artist||'',source:track.source||'',cover:track.cover||'',album:track.album||'',duration})}).catch(()=>{});
    }

    // ===================== DOM / 事件绑定 =====================

    function setupDOM(){
      dom.searchInput=$('search-input');
      dom.searchBtn=$('search-btn');
      dom.searchStatus=$('search-status');
      dom.searchSelectToggle=$('search-select-toggle');
      dom.searchBatchToolbar=$('search-batch-toolbar');
      dom.searchBatchSelectAll=$('search-batch-select-all');
      dom.searchBatchQueue=$('search-batch-queue');
      dom.searchBatchFavorite=$('search-batch-favorite');
      dom.searchBatchPlaylist=$('search-batch-playlist');
      dom.searchMiniList=$('search-mini-list');

      dom.coverImg=$('cover-img');
      dom.coverWrapper=document.querySelector('.cover-wrapper');
      dom.coverPlaceholder=document.querySelector('.cover-placeholder');
      dom.trackTitle=$('track-title');
      dom.trackArtist=$('track-artist');
      dom.trackSourcePill=$('track-source-pill');
      dom.trackQualityPill=$('track-quality-pill');
      dom.playerStatus=$('player-status');
      dom.playBtn=$('play-btn');
      dom.prevBtn=$('prev-btn');
      dom.nextBtn=$('next-btn');
      dom.favBtn=$('fav-btn');
      dom.saveToPlaylistBtn=$('save-to-playlist-btn');
      dom.downloadBtn=$('download-btn');
      dom.audio=$('audio');
      dom.currentTime=$('current-time');
      dom.totalTime=$('total-time');
      dom.progressWrapper=$('progress-bar-wrapper');
      dom.progressBar=$('progress-bar');
      dom.progressHandle=$('progress-handle');
      dom.volumeSlider=$('volume-slider');
      dom.lyricsInner=$('lyrics-inner');
      dom.lyricsContainer=document.querySelector('.lyrics-container');
      dom.playerPanel=document.querySelector('.player-panel');

      dom.playlistMain=document.querySelector('.playlist-main');
      dom.playlistList=$('playlist-list');
      dom.playlistInfo=$('playlist-info');
      dom.playlistPanel=document.querySelector('.playlist-panel');
      dom.clearQueueBtn=$('clear-playlist-btn');
      dom.mobilePlaylistBack=$('mobile-playlist-back');
      dom.mobilePlaylistDelete=$('mobile-playlist-delete');
      dom.playlistSelectRow=$('playlist-select-row');
      dom.playlistSelectTools=$('playlist-select-tools');
      dom.playlistSelect=$('playlist-select');
      dom.deletePlaylistBtn=$('delete-playlist-btn');
      dom.editPlaylistBtn=$('edit-playlist-btn');
      dom.sharePlaylistBtn=$('share-playlist-btn');
      dom.insightsShareCard=$('insights-share-card');
      dom.newPlaylistBtn=$('new-playlist-btn');
      dom.importPlaylistBtn=$('import-playlist-btn');
      dom.importPlaylistInput=$('import-playlist-input');
      dom.importPlaylistModal=$('import-playlist-modal');
      dom.importPlaylistUrl=$('import-playlist-url');
      dom.importPlaylistNote=$('import-playlist-note');
      dom.importPlaylistFileBtn=$('import-playlist-file-btn');
      dom.importPlaylistConfirm=$('import-playlist-confirm');
      dom.importPlaylistCancel=$('import-playlist-cancel');
      dom.importPlaylistClose=$('import-playlist-close');
      dom.exportPlaylistBtn=$('export-playlist-btn');

      dom.playlistModal=$('playlist-modal');
      dom.playlistNameInput=$('playlist-name-input');
      dom.playlistDescInput=$('playlist-desc-input');
      dom.playlistConfirmBtn=$('playlist-confirm-btn');
      dom.playlistCancelBtn=$('playlist-cancel-btn');
      dom.playlistCloseBtn=$('playlist-close');

      dom.savePlaylistModal=$('save-playlist-modal');
      dom.savePlaylistOptions=$('save-playlist-options');
      dom.savePlaylistTitle=$('save-playlist-title');
      dom.savePlaylistDescription=$('save-playlist-description');
      dom.savePlaylistCloseBtn=$('save-playlist-close');
      dom.savePlaylistCreateBtn=$('save-playlist-create');

      dom.clientDownloadButton=$('client-download-nav-button');
      dom.clientDownloadModal=$('client-download-modal');
      dom.clientDownloadClose=$('client-download-close');
      dom.clientDownloadGeneric=$('client-download-generic');
      dom.clientDownloadMeta=$('client-download-meta');
      dom.clientDownloadNotes=$('client-download-notes');
      dom.clientDownloadExeSize=$('client-download-exe-size');
      dom.clientDownloadMsiSize=$('client-download-msi-size');
      dom.clientDownloadApkSize=$('client-download-apk-size');
      dom.iosInstallGuide=$('ios-install-guide');
      dom.iosNotSafariTip=$('ios-not-safari-tip');
      dom.iosAlreadyInstalled=$('ios-already-installed');
      dom.aboutLink=$('about-link');
      dom.aboutModal=$('about-modal');
      dom.aboutClose=$('about-close');
      dom.privacyLink=$('privacy-link');
      dom.privacyModal=$('privacy-modal');
      dom.privacyClose=$('privacy-close');
      dom.disclaimerLink=$('disclaimer-link');
      dom.disclaimerModal=$('disclaimer-modal');
      dom.disclaimerClose=$('disclaimer-close');
      dom.workspaceModal=$('workspace-modal');
      dom.workspaceContent=$('workspace-content');
      dom.workspaceTitle=$('workspace-title');
      dom.workspaceCloseBtn=$('workspace-close');

      dom.themeToggle=$('theme-toggle');
      dom.themeIcon=$('theme-icon');
      dom.accountNavButton=$('account-nav-button');
      dom.accountNavAvatar=$('account-nav-avatar');
      dom.accountNavLabel=$('account-nav-label');
      dom.loginModal=$('login-modal');
      dom.loginForm=$('login-form');
      dom.loginTitle=$('login-title');
      dom.loginDescription=$('login-description');
      dom.loginAccountInput=$('login-account-input');
      dom.loginPasswordInput=$('login-password-input');
      dom.loginSubmit=$('login-submit');
      dom.loginError=$('login-error');
      dom.authTabLogin=$('auth-tab-login');
      dom.authTabRegister=$('auth-tab-register');
      dom.googleAuthBtn=$('google-auth-btn');
      dom.googleAuthLabel=$('google-auth-label');
      dom.registerForm=$('register-form');
      dom.registerEmailInput=$('register-email-input');
      dom.registerCodeInput=$('register-code-input');
      dom.registerUsernameInput=$('register-username-input');
      dom.registerPasswordInput=$('register-password-input');
      dom.registerSendCode=$('register-send-code');
      dom.registerSubmit=$('register-submit');
      dom.registerError=$('register-error');
      dom.accountProfileView=$('account-profile-view');
      dom.accountProfileName=$('account-profile-name');
      dom.accountProfileId=$('account-profile-id');
      dom.accountAvatarPreview=$('account-avatar-preview');
      dom.accountDisplayName=$('account-display-name');
      dom.accountAvatarUrl=$('account-avatar-url');
      dom.accountProfileForm=$('account-profile-form');
      dom.accountPasswordForm=$('account-password-form');
      dom.accountCurrentPassword=$('account-current-password');
      dom.accountNewPassword=$('account-new-password');
      dom.listeningSummary=$('listening-summary-content');
      dom.accountLogout=$('account-logout');
      dom.accountDeletePassword=$('account-delete-password');
      dom.accountDelete=$('account-delete');
      dom.loginCloseBtn=$('login-close');
      dom.androidUpdateModal=$('android-update-modal');
      dom.androidUpdateClose=$('android-update-close');
      dom.androidUpdateLater=$('android-update-later');
      dom.androidUpdateInstall=$('android-update-install');
      dom.androidUpdateVersion=$('android-update-version');
      dom.androidUpdateCurrent=$('android-update-current');
      dom.androidUpdateNotes=$('android-update-notes');
      dom.mobileNav=$('mobile-nav');
      dom.toplistPage=$('toplist-page');
      dom.layout=document.querySelector('.layout');
    }

    const mobileViews=['search','toplist','lyrics','queue','me'];

    function openWorkspace(view){
      const isSearch=view==='search';
      const isFavorites=view==='favorites';
      const isPlaylists=view==='playlists';
      const isQueue=view==='queue';
      if(!isSearch&&!isFavorites&&!isPlaylists&&!isQueue)return;
      const searchPanel=document.querySelector('.layout > .search-panel');
      const playlistPanel=document.querySelector('.layout > .playlist-panel');
      if(!searchPanel||!playlistPanel)return;
      dom.workspaceContent.className=`workspace-content ${isSearch?'workspace-search':'workspace-library'}${!isSearch&&!isQueue?' workspace-library-only':''}`;
      if(isPlaylists)workspaceDesktopPlaylistId=null;
      dom.workspaceModal.classList.toggle('workspace-search-open',isSearch);
      dom.workspaceModal.classList.toggle('workspace-library-open',!isSearch);
      dom.workspaceContent.replaceChildren();
      if(isSearch){
        dom.workspaceContent.append(searchPanel);
        dom.workspaceTitle.textContent='搜索';
      }else{
        dom.workspaceContent.append(playlistPanel);
        if(!workspaceRemovedPlaylistControls.length){
          workspaceRemovedPlaylistControls=[dom.playlistSelectTools,dom.playlistSelectRow]
            .filter(element=>element?.parentNode)
            .map(element=>({element,parent:element.parentNode,next:element.nextSibling}));
          workspaceRemovedPlaylistControls.forEach(({element})=>element.remove());
        }
        const tabs=playlistPanel.querySelector('.playlist-tabs');
        if(workspaceRemovedTabs.length){
          workspaceRemovedTabs.forEach(tab=>tabs?.appendChild(tab));
          workspaceRemovedTabs=[];
        }
        const removeTabs=isQueue
          ? ['favorites','playlists']
          : isFavorites
            ? ['results','playlists']
            : ['results'];
        if(tabs){
          workspaceRemovedTabs=removeTabs
            .map(name=>tabs.querySelector(`.playlist-tab[data-tab="${name}"]`))
            .filter(Boolean);
          workspaceRemovedTabs.forEach(tab=>tab.remove());
        }
        const tab=isQueue?'results':(isFavorites?'favorites':'playlists');
        document.querySelector(`.playlist-tab[data-tab="${tab}"]`)?.click();
        dom.workspaceTitle.textContent=isQueue?'播放列表':(isFavorites?'我的收藏':'我的歌单');
      }
      dom.workspaceModal.classList.add('show');
      dom.workspaceModal.setAttribute('aria-hidden','false');
      if(isSearch)setTimeout(()=>dom.searchInput?.focus(),40);
    }

    function closeWorkspace(){
      const searchPanel=dom.workspaceContent.querySelector('.search-panel');
      const playlistPanel=dom.workspaceContent.querySelector('.playlist-panel');
      if(searchPanel)dom.layout.appendChild(searchPanel);
      if(playlistPanel){
        dom.layout.appendChild(playlistPanel);
        workspaceRemovedPlaylistControls.forEach(({element,parent,next})=>{
          if(!parent||!element)return;
          parent.insertBefore(element,next&&next.parentNode===parent?next:null);
        });
        workspaceRemovedPlaylistControls=[];
        if(workspaceRemovedTabs.length){
          const tabs=playlistPanel.querySelector('.playlist-tabs');
          const ordered=['results','favorites','playlists'];
          workspaceRemovedTabs.sort((a,b)=>ordered.indexOf(a.dataset.tab)-ordered.indexOf(b.dataset.tab));
          workspaceRemovedTabs.forEach(tab=>{
            if(!tabs)return;
            const before=[...tabs.children].find(item=>ordered.indexOf(item.dataset.tab)>ordered.indexOf(tab.dataset.tab));
            tabs.insertBefore(tab,before||null);
          });
          workspaceRemovedTabs=[];
        }
      }
      dom.workspaceContent.replaceChildren();
      dom.workspaceModal.classList.remove('show');
      dom.workspaceModal.classList.remove('workspace-search-open');
      dom.workspaceModal.classList.remove('workspace-library-open');
      dom.workspaceModal.setAttribute('aria-hidden','true');
    }

    // GitHub Release 信息：版本、发布时间、安装包大小与更新日志。
    let clientReleaseCache={at:0,data:null};
    function formatFileSize(bytes){
      const value=Number(bytes)||0;
      if(value<=0)return '';
      return value>=1024*1024?`${(value/1048576).toFixed(1)} MB`:`${Math.round(value/1024)} KB`;
    }
    function applyClientReleaseInfo(release){
      if(!dom.clientDownloadMeta)return;
      const name=String(release?.tag_name||release?.name||'').replace(/^v/,'');
      const published=release?.published_at?new Date(release.published_at).toLocaleDateString('zh-CN'):'';
      dom.clientDownloadMeta.textContent=name?`最新版本 v${name}${published?` · ${published} 发布`:''}`:'版本信息暂时不可用，下载链接依然有效。';
      const assets=Array.isArray(release?.assets)?release.assets:[];
      const sizeOf=(suffix)=>{
        const asset=assets.find(item=>String(item.name||'').toLowerCase().endsWith(suffix));
        return asset?formatFileSize(asset.size):'';
      };
      const exe=sizeOf('setup-x64.exe');
      const msi=sizeOf('setup-x64.msi');
      const apk=sizeOf('halo-music.apk');
      if(dom.clientDownloadExeSize&&exe)dom.clientDownloadExeSize.textContent=`.exe · NSIS · ${exe}`;
      if(dom.clientDownloadMsiSize&&msi)dom.clientDownloadMsiSize.textContent=`.msi · ${msi}`;
      if(dom.clientDownloadApkSize&&apk)dom.clientDownloadApkSize.textContent=`.apk · ${apk}`;
      if(!dom.clientDownloadNotes)return;
      dom.clientDownloadNotes.replaceChildren();
      const lines=String(release?.body||'')
        .split(/\r?\n/)
        .map(line=>line.replace(/^[-*]\s*/,'').trim())
        .filter(line=>line&&!line.startsWith('#'))
        .slice(0,6);
      (lines.length?lines:['本次更新内容请查看 GitHub Release']).forEach(line=>{
        const li=document.createElement('li');
        li.textContent=line.slice(0,120);
        dom.clientDownloadNotes.appendChild(li);
      });
    }
    async function loadClientReleaseInfo(){
      if(clientReleaseCache.data&&Date.now()-clientReleaseCache.at<10*60*1000){
        applyClientReleaseInfo(clientReleaseCache.data);
        return;
      }
      try{
        const response=await fetch('https://api.github.com/repos/zhoujungis/halo_music/releases/latest',{headers:{Accept:'application/vnd.github+json'}});
        if(!response.ok)throw new Error(`release info ${response.status}`);
        const data=await response.json();
        clientReleaseCache={at:Date.now(),data};
        applyClientReleaseInfo(data);
      }catch(error){
        console.warn('client release info unavailable',error);
        if(dom.clientDownloadMeta)dom.clientDownloadMeta.textContent='版本信息暂时获取失败，下载链接仍然可以正常使用。';
      }
    }

    function openClientDownloadModal(){
      const ios=isIOSDevice();
      if(dom.clientDownloadGeneric)dom.clientDownloadGeneric.hidden=ios;
      if(dom.iosInstallGuide)dom.iosInstallGuide.hidden=!ios;
      if(ios){
        if(dom.iosNotSafariTip)dom.iosNotSafariTip.hidden=isIOSSafari();
        if(dom.iosAlreadyInstalled)dom.iosAlreadyInstalled.hidden=!isStandaloneApp();
      }
      dom.clientDownloadModal.classList.add('show');
      dom.clientDownloadModal.setAttribute('aria-hidden','false');
      loadClientReleaseInfo();
    }

    function closeClientDownloadModal(){
      dom.clientDownloadModal.classList.remove('show');
      dom.clientDownloadModal.setAttribute('aria-hidden','true');
    }

    function openInfoModal(modal){
      if(!modal)return;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden','false');
    }

    function closeInfoModal(modal){
      if(!modal)return;
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden','true');
    }

    function setDesktopView(view){
      const next=['search','toplist','lyrics','queue','me'].includes(view)?view:'lyrics';
      document.body.dataset.desktopView=next;
      const title=document.querySelector('.playlist-panel [data-i18n="playlistTitle"]');
      if(title)title.textContent=next==='me'?'我的音乐':'播放队列';
      document.querySelectorAll('.desktop-nav [data-desktop-view]').forEach(button=>{
        if(button.dataset.desktopView===next)button.setAttribute('aria-current','page');
        else button.removeAttribute('aria-current');
      });
      if(next==='queue')document.querySelector('.playlist-tab[data-tab="results"]')?.click();
      if(next==='me')document.querySelector('.playlist-tab[data-tab="favorites"]')?.click();
      if(next==='toplist')renderToplistPage();
      if(next==='search')setTimeout(()=>dom.searchInput?.focus(),80);
    }

    function setMobileView(view, options={}){
      const next=mobileViews.includes(view)?view:'search';
      document.body.dataset.mobileView=next;
      if(next==='queue'||next==='me'){
        const title=document.querySelector('.playlist-panel [data-i18n="playlistTitle"]');
        if(title)title.textContent=next==='me'?'我的音乐':'播放队列';
      }
      updateMobileLyricWindow(state.currentLyricIndex);
      document.querySelectorAll('[data-mobile-view]').forEach(btn=>{
        const active=btn.dataset.mobileView===next;
        if(active)btn.setAttribute('aria-current','page');
        else btn.removeAttribute('aria-current');
      });
      const isMobile=window.matchMedia('(max-width: 760px)').matches;
      document.querySelectorAll('.layout > .panel').forEach(panel=>{
        const panelView=panel.classList.contains('search-panel')?'search'
          :panel.classList.contains('player-panel')?'lyrics'
          :panel.classList.contains('toplist-panel')?'toplist'
          :'library';
        const visible=panelView===next||(panelView==='library'&&(next==='queue'||next==='me'));
        panel.setAttribute('aria-hidden',String(!visible&&isMobile));
      });
      if(next==='toplist')renderToplistPage();
      if(next==='me' && options.openFavorites){
        document.querySelector('.playlist-tab[data-tab="favorites"]')?.click();
      }
      if(next==='me' && isMobile && !options.openFavorites){
        const activeTab=document.querySelector('.playlist-tab.active')?.dataset.tab;
        if(activeTab==='results')document.querySelector('.playlist-tab[data-tab="favorites"]')?.click();
      }
      if((next==='lyrics'||next==='queue') && isMobile){
        document.querySelector('.playlist-tab[data-tab="results"]')?.click();
      }
    }

    function setupMobileNavigation(){
      setMobileView(document.body.dataset.mobileView||'search');
      dom.mobileNav.querySelectorAll('[data-mobile-view]').forEach(btn=>{
        btn.addEventListener('click',()=>setMobileView(btn.dataset.mobileView));
      });

      let touchStart=null;
      let suppressClickUntil=0;
      dom.layout.addEventListener('touchstart',event=>{
        if(event.touches.length!==1 || event.target.closest('input, select, audio'))return;
        const touch=event.touches[0];
        touchStart={x:touch.clientX,y:touch.clientY};
      },{passive:true});
      dom.layout.addEventListener('touchend',event=>{
        if(!touchStart || !event.changedTouches.length)return;
        const touch=event.changedTouches[0];
        const dx=touch.clientX-touchStart.x;
        const dy=touch.clientY-touchStart.y;
        touchStart=null;
        if(Math.abs(dx)<64 || Math.abs(dx)<Math.abs(dy)*1.25)return;
        const currentIndex=mobileViews.indexOf(document.body.dataset.mobileView||'search');
        const nextIndex=Math.max(0,Math.min(mobileViews.length-1,currentIndex+(dx<0?1:-1)));
        if(nextIndex!==currentIndex){
          suppressClickUntil=Date.now()+350;
          setMobileView(mobileViews[nextIndex]);
        }
      },{passive:true});
      dom.layout.addEventListener('click',event=>{
        if(Date.now()<suppressClickUntil){event.preventDefault();event.stopPropagation();}
      },true);
      window.matchMedia('(max-width: 760px)').addEventListener('change',event=>{
        document.querySelectorAll('.layout > .panel').forEach(panel=>panel.setAttribute('aria-hidden',event.matches?panel.getAttribute('aria-hidden'):'false'));
        setMobileView(document.body.dataset.mobileView||'search');
      });
    }

    function setPlaymodeUI(){
      document.querySelectorAll('.playmode-btn').forEach(btn=>{
        btn.classList.toggle('active',btn.dataset.mode===state.playMode);
      });
    }

    function setupEvents(){
      setupMediaSessionHandlers();
      setupNativeRemoteCommands();

      document.querySelectorAll('.desktop-nav [data-desktop-view]').forEach(button=>{
        button.addEventListener('click',()=>setDesktopView(button.dataset.desktopView));
      });

      dom.searchBtn.addEventListener('click',()=>{
        state.searchKeyword=dom.searchInput.value.trim(); state.noMoreResults=false;
        exitSearchSelectMode();
        searchAllSources(true);
      });
      dom.searchSelectToggle?.addEventListener('click',()=>setSearchSelectMode(!state.searchSelectMode));
      dom.searchBatchSelectAll.addEventListener('change',()=>{
        const tracks=getInterleavedSearchList();
        if(!tracks.length){
          dom.searchBatchSelectAll.checked=false;
          showToast(t('searchBatchNoResults'));
          return;
        }
        if(dom.searchBatchSelectAll.checked)tracks.forEach(track=>state.selectedSearchUids.add(track.uid));
        else state.selectedSearchUids.clear();
        updateBatchToolbar();
        renderMiniSearchList();
        renderPlaylistList();
      });
      dom.searchBatchQueue.addEventListener('click',addSelectedToPlayQueue);
      dom.searchBatchFavorite.addEventListener('click',addSelectedToFavorites);
      dom.searchBatchPlaylist.addEventListener('click',openBatchSavePlaylistModal);
      dom.searchInput.addEventListener('keydown',e=>{
        if(e.key==='Enter'){
          state.searchKeyword=dom.searchInput.value.trim();
          state.noMoreResults=false;
          searchAllSources(true);
        }
      });

      dom.searchMiniList.addEventListener('scroll',()=>{
        if(!canAutoLoadMore())return;
        if(dom.searchMiniList.scrollTop + dom.searchMiniList.clientHeight >= dom.searchMiniList.scrollHeight-10){
          requestMoreResults();
        }
      });

      dom.playlistMain.addEventListener('scroll',()=>{
        const activeTab=document.querySelector('.playlist-tab.active')?.dataset.tab||'results';
        if(activeTab!=='results')return;
        if(!canAutoLoadMore())return;
        if(dom.playlistMain.scrollTop + dom.playlistMain.clientHeight >= dom.playlistMain.scrollHeight-10){
          requestMoreResults();
        }
      });

      dom.playBtn.addEventListener('click',togglePlayPause);
      if(dom.coverWrapper){
        dom.coverWrapper.addEventListener('click',togglePlayPause);
        dom.coverWrapper.addEventListener('keydown',event=>{
          if(event.key==='Enter'||event.key===' '){
            event.preventDefault();
            togglePlayPause();
          }
        });
      }
      dom.prevBtn.addEventListener('click',()=>playNext('prev'));
      dom.nextBtn.addEventListener('click',()=>playNext('next'));
      dom.favBtn.addEventListener('click',toggleFavoriteCurrent);
      dom.saveToPlaylistBtn.addEventListener('click',openSavePlaylistModal);
      dom.downloadBtn?.addEventListener('click',downloadCurrentTrack);

      dom.volumeSlider.addEventListener('input',()=>{
        dom.audio.volume=parseFloat(dom.volumeSlider.value);
      });

      dom.audio.addEventListener('timeupdate',()=>{
        const cur=dom.audio.currentTime||0, dur=dom.audio.duration||0;
        dom.currentTime.textContent=formatTime(cur);
        dom.totalTime.textContent=formatTime(dur||0);
        if(dur>0){
          const r=cur/dur;
          dom.progressBar.style.transform='scaleX('+r+')';
          const w=dom.progressWrapper.clientWidth;
          dom.progressHandle.style.left=(w*r)+'px';
        }
        const intensity = Math.abs(Math.sin(cur * 2.3));
        audioLevel = 0.3 + 0.7 * intensity * (dom.audio.volume || 1);
        updateLyricsHighlight(cur);
        pushNativePlaybackState();
      });
      dom.audio.addEventListener('play',()=>{
        consecutivePlayFailures=0;
        if(state.currentTrack)state.currentTrack._refreshTries=0;
        state.isPlaying=true;
        updateDesktopPlaybackVisual();
        updatePlayMarks();
        dom.playBtn.textContent='⏸';
        dom.playerStatus.textContent=t('playerStatusPlaying');
        updateMediaSession(state.currentTrack);
        pushNativePlaybackState(true);
      });
      dom.audio.addEventListener('pause',()=>{
        state.isPlaying=false;
        updateDesktopPlaybackVisual();
        updatePlayMarks();
        dom.playBtn.textContent='▶';
        dom.playerStatus.textContent=t('playerStatusPaused');
        audioLevel = 0;
        updateMediaSession(state.currentTrack);
        pushNativePlaybackState(true);
      });
      dom.audio.addEventListener('waiting',()=>{
        if(!state.isPlaying)return;
        dom.playerStatus.textContent=t('playerStatusBuffering');
      });
      dom.audio.addEventListener('playing',()=>{
        if(!state.isPlaying)return;
        dom.playerStatus.textContent=t('playerStatusPlaying');
      });
      dom.audio.addEventListener('canplay',()=>{
        if(state.isPlaying)dom.playerStatus.textContent=t('playerStatusPlaying');
      });
      dom.audio.addEventListener('ended',()=>{
        audioLevel = 0;
        advanceAfterTrackEnds();
      });
      // 网易免费音源对版权歌曲只给 30 秒试听：元数据一到就查时长。
      dom.audio.addEventListener('loadedmetadata',()=>{
        const track=state.currentTrack;
        if(!track||track._previewChecked)return;
        track._previewChecked=true;
        const dur=dom.audio.duration;
        if(!isFinite(dur)||dur<=0||dur>PREVIEW_MAX_SECONDS)return;
        handlePreviewClip(track);
      });
      dom.audio.addEventListener('error',()=>{
        const track=state.currentTrack;
        if(!track)return;
        // 记录出错时的请求代数：若错误处理期间用户/自动跳已切歌，放弃过期恢复。
        const requestToken=playbackRequestToken;
        // 0) 本地文件播不了就丢掉本地路径，回退在线音源。
        if(track.localAudio){
          const local=track.localAudio;
          track.localAudio='';
          track.audioUrl='';
          track.audioCandidates=[];
          track.detailsLoaded=false;
          track._refreshTries=0;
          try{URL.revokeObjectURL(local);}catch(error){}
          showToast(t('toastLocalFallback'));
          ensureTrackDetails(track,{forceRefresh:true}).then(()=>{
            if(requestToken!==playbackRequestToken)return;
            if(track.audioUrl)playTrack(track,state.playContext,{detailsReady:true});
            else showToast(t('toastPlayError'));
          }).catch(()=>{
            if(requestToken!==playbackRequestToken)return;
            showToast(t('toastPlayError'));
            dom.playerStatus.textContent=t('playerStatusIdle');
          });
          return;
        }
        // 1) 先切换同曲的其它已校验候选线路（服务器返回的多条音源）。
        const candidates=track.audioCandidates||[];
        const next=candidates[audioCandidateIndex+1];
        if(next&&next!==track.audioUrl){
          audioCandidateIndex+=1;
          track.audioUrl=next;
          releaseActivePlaybackBlob();
          dom.audio.autoplay=true;
          dom.audio.src=next;
          dom.audio.load();
          dom.audio.play().catch(()=>{});
          return;
        }
        // 2) 服务器缓存线路可能已失效：绕过缓存强制重新解析并更新缓存。
        const refreshTries=track._refreshTries||0;
        if(refreshTries>=2){
          handleTerminalPlayFailure();
          return;
        }
        track._refreshTries=refreshTries+1;
        ensureTrackDetails(track,{forceRefresh:true}).then(()=>{
          if(requestToken!==playbackRequestToken)return;
          if(track.audioUrl){
            playTrack(track,state.playContext,{detailsReady:true});
          }else{
            handleTerminalPlayFailure();
          }
        }).catch(()=>{
          if(requestToken!==playbackRequestToken)return;
          handleTerminalPlayFailure();
        });
      });

      // 进度条：按住拖拽即可连续快进/快退。
      const seekToClientX=clientX=>{
        const rect=dom.progressWrapper.getBoundingClientRect();
        const ratio=Math.max(0,Math.min(1,(clientX-rect.left)/rect.width));
        const dur=dom.audio.duration||0;
        if(dur>0)dom.audio.currentTime=dur*ratio;
      };
      dom.progressWrapper.addEventListener('pointerdown',event=>{
        if(!dom.audio.src)return;
        event.preventDefault();
        seekToClientX(event.clientX);
        const onMove=moveEvent=>seekToClientX(moveEvent.clientX);
        const onUp=()=>{
          window.removeEventListener('pointermove',onMove);
          window.removeEventListener('pointerup',onUp);
          window.removeEventListener('pointercancel',onUp);
        };
        window.addEventListener('pointermove',onMove);
        window.addEventListener('pointerup',onUp);
        window.addEventListener('pointercancel',onUp);
      });

      document.querySelectorAll('.playlist-tab').forEach(tab=>{
        tab.addEventListener('click',()=>{
          document.querySelectorAll('.playlist-tab').forEach(el=>el.classList.toggle('active',el===tab));
          const tName=tab.dataset.tab;
          if(tName==='profile'){
            if(!state.isAuthenticated){closeAccountProfile();renderPlaylistList();return;}
            loadAccountProfile();
            return;
          }
          closeAccountProfile();
          state.mobilePlaylistDetailId=null;
          if(tName==='results'){
            state.playContext.type='queue';state.playContext.playlistId=null;
          }else if(tName==='favorites'){
            state.playContext.type='favorites';state.playContext.playlistId=null;
          }else{
            state.playContext.type='playlist';
            if(state.playlists.length&&!state.playContext.playlistId)state.playContext.playlistId=state.playlists[0].id;
          }
          updatePlaymodeVisibility();
          renderPlaylistList();
        });
      });

      dom.deletePlaylistBtn.addEventListener('click',deleteSelectedPlaylist);
      dom.editPlaylistBtn?.addEventListener('click',()=>{
        const pl=state.playlists.find(item=>item.id===getSelectedPlaylistId());
        if(!pl){showToast(t('toastNeedPlaylistSelected'));return;}
        openPlaylistModal(pl);
      });
      dom.sharePlaylistBtn?.addEventListener('click',shareCurrentPlaylist);
      dom.insightsShareCard?.addEventListener('click',buildInsightsShareCard);
      dom.newPlaylistBtn.addEventListener('click',()=>openPlaylistModal());
      dom.importPlaylistBtn.addEventListener('click',openImportPlaylistModal);
      dom.importPlaylistFileBtn.addEventListener('click',()=>dom.importPlaylistInput.click());
      dom.importPlaylistConfirm.addEventListener('click',importPlaylistFromLink);
      dom.importPlaylistCancel.addEventListener('click',closeImportPlaylistModal);
      dom.importPlaylistClose.addEventListener('click',closeImportPlaylistModal);
      dom.importPlaylistModal.addEventListener('click',e=>{if(e.target===dom.importPlaylistModal)closeImportPlaylistModal();});
      dom.importPlaylistUrl.addEventListener('keydown',e=>{
        if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();importPlaylistFromLink();}
      });
      dom.importPlaylistUrl.addEventListener('paste',()=>{
        if(window.matchMedia('(max-width:760px) and (hover:none)').matches){
          setTimeout(()=>dom.importPlaylistUrl.blur(),0);
        }
      });
      dom.importPlaylistInput.addEventListener('change',handleImportPlaylistFile);
      dom.exportPlaylistBtn.addEventListener('click',exportPlaylistData);
      dom.playlistConfirmBtn.addEventListener('click',createPlaylist);
      dom.playlistCancelBtn.addEventListener('click',closePlaylistModal);
      dom.playlistCloseBtn.addEventListener('click',closePlaylistModal);
      dom.playlistModal.addEventListener('click',e=>{if(e.target===dom.playlistModal)closePlaylistModal();});
      dom.savePlaylistCloseBtn.addEventListener('click',closeSavePlaylistModal);
      dom.savePlaylistCreateBtn.addEventListener('click',createPlaylistForTrack);
      dom.savePlaylistModal.addEventListener('click',e=>{if(e.target===dom.savePlaylistModal)closeSavePlaylistModal();});
      dom.mobilePlaylistBack.addEventListener('click',closeMobilePlaylistDetail);
      dom.mobilePlaylistDelete.addEventListener('click',deleteSelectedPlaylist);
      dom.clientDownloadButton.addEventListener('click',openClientDownloadModal);
      dom.clientDownloadClose.addEventListener('click',closeClientDownloadModal);
      dom.clientDownloadModal.addEventListener('click',e=>{if(e.target===dom.clientDownloadModal)closeClientDownloadModal();});

      [
        [dom.aboutLink,dom.aboutModal,dom.aboutClose],
        [dom.privacyLink,dom.privacyModal,dom.privacyClose],
        [dom.disclaimerLink,dom.disclaimerModal,dom.disclaimerClose]
      ].forEach(([link,modal,close])=>{
        link?.addEventListener('click',()=>openInfoModal(modal));
        close?.addEventListener('click',()=>closeInfoModal(modal));
        modal?.addEventListener('click',e=>{if(e.target===modal)closeInfoModal(modal);});
      });
      dom.workspaceCloseBtn.addEventListener('click',closeWorkspace);
      dom.workspaceModal.addEventListener('click',e=>{if(e.target===dom.workspaceModal)closeWorkspace();});

      dom.androidUpdateClose.addEventListener('click',()=>dismissAndroidUpdate(pendingAndroidUpdateVersion));
      dom.androidUpdateLater.addEventListener('click',()=>dismissAndroidUpdate(pendingAndroidUpdateVersion));
      dom.androidUpdateInstall.addEventListener('click',()=>{
        if(!pendingAndroidUpdateUrl)return;
        window.location.assign(pendingAndroidUpdateUrl);
      });
      dom.androidUpdateModal.addEventListener('click',e=>{if(e.target===dom.androidUpdateModal)dismissAndroidUpdate(pendingAndroidUpdateVersion);});

      dom.themeToggle.addEventListener('click',toggleTheme);
      dom.accountNavButton?.addEventListener('click',()=>{
        if(!state.isAuthenticated){openLoginModal('login');return;}
        if(window.matchMedia('(max-width: 760px)').matches)setMobileView('me');
        else setDesktopView('me');
      });
      dom.loginCloseBtn.addEventListener('click',closeLoginModal);
      dom.loginModal.addEventListener('click',e=>{if(e.target===dom.loginModal)closeLoginModal();});
      document.addEventListener('keydown',e=>{
        if(e.key==='Escape'&&dom.loginModal.classList.contains('show')){
          e.preventDefault();
          closeLoginModal();
        }
      });
      // 播放器快捷键：Space 播放/暂停，P/N 上下首，F 收藏，←/→ 快退快进。
      // 输入场景（输入框/弹窗/按钮焦点）不劫持，避免打断打字与原生激活。
      document.addEventListener('keydown',e=>{
        if(e.ctrlKey||e.metaKey||e.altKey)return;
        const target=e.target;
        if(target instanceof Element&&target.closest('input, textarea, select, [contenteditable]'))return;
        if(e.key!=='Escape'&&document.querySelector('.modal-backdrop.show'))return;
        if(target instanceof Element&&target.closest('button, a, [role="button"]')&&e.key===' ')return;
        if(e.key===' '){
          e.preventDefault();
          togglePlayPause();
        }
        else if(e.code==='KeyP'&&!e.repeat)playNext('prev');
        else if(e.code==='KeyN'&&!e.repeat)playNext('next');
        else if(e.code==='KeyF'&&!e.repeat){if(state.currentTrack)toggleFavoriteCurrent();}
        else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
          if(!dom.audio.src||!isFinite(dom.audio.duration)||dom.audio.duration<=0)return;
          e.preventDefault();
          const delta=e.key==='ArrowLeft'?-5:5;
          dom.audio.currentTime=Math.max(0,Math.min(dom.audio.duration,dom.audio.currentTime+delta));
        }
        else if(e.key==='ArrowUp'||e.key==='ArrowDown'){
          e.preventDefault();
          const step=e.key==='ArrowUp'?0.05:-0.05;
          const next=Math.max(0,Math.min(1,(dom.audio.volume||0)+step));
          dom.audio.volume=next;
          dom.audio.muted=false;
          dom.volumeSlider.value=String(next);
        }
        else if(e.code==='KeyM'&&!e.repeat){
          dom.audio.muted=!dom.audio.muted;
          showToast(dom.audio.muted?'已静音':'已取消静音');
        }
      });
      dom.loginForm.addEventListener('submit',e=>{e.preventDefault();submitLogin();});
      dom.registerForm.addEventListener('submit',e=>{e.preventDefault();submitRegister();});
      dom.registerSendCode.addEventListener('click',sendRegisterCode);
      dom.authTabLogin.addEventListener('click',()=>setAuthMode('login'));
      dom.authTabRegister.addEventListener('click',()=>setAuthMode('register'));
      dom.googleAuthBtn.addEventListener('click',startGoogleAuth);
      document.querySelectorAll('.auth-password-toggle').forEach(button=>{
        button.addEventListener('click',()=>{
          const input=$(button.dataset.target);
          if(!input)return;
          const show=input.type==='password';
          input.type=show?'text':'password';
          button.textContent=show?'隐藏':'显示';
          button.setAttribute('aria-label',show?'隐藏密码':'显示密码');
          input.focus();
        });
      });
      dom.accountProfileForm.addEventListener('submit',saveAccountProfile);
      dom.accountPasswordForm.addEventListener('submit',changeAccountPassword);
      dom.accountLogout.addEventListener('click',toggleAuth);
      dom.accountDelete.addEventListener('click',async()=>{
        if(!dom.accountDeletePassword.value){showToast('请输入当前密码以确认注销');return;}
        dom.accountDelete.disabled=true;
        try{
          await accountRequest('/api/account',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:dom.accountDeletePassword.value})});
          dom.audio.pause();state.isAuthenticated=false;state.profileName='';state.favorites=[];state.playlists=[];state.playQueue=[];state.currentTrack=null;document.body.classList.remove('has-track');
          closeAccountProfile();setAuthGate(false);renderPlaylistList();showToast('账户及关联数据已注销');
        }catch(error){showToast(error.message);}
        finally{dom.accountDelete.disabled=false;}
      });

      document.querySelectorAll('.playmode-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          state.playMode=btn.dataset.mode;
          setPlaymodeUI();
          if(state.playMode==='list')showToast(t('toastPlaymodeList'));
          else if(state.playMode==='single')showToast(t('toastPlaymodeSingle'));
          else showToast(t('toastPlaymodeShuffle'));
        });
      });
      dom.clearQueueBtn?.addEventListener('click',clearPlayQueue);

    }

    // ===================== 初始化 =====================

    // ===================== 歌单分享 & 听歌分享卡 =====================

    let lastAccountSummary = null;

    async function copyTextToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // fall through to the legacy path
      }
      try {
        const input = document.createElement('textarea');
        input.value = text;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        const ok = document.execCommand('copy');
        input.remove();
        return ok;
      } catch (error) {
        return false;
      }
    }

    async function shareCurrentPlaylist() {
      if (!requireLibraryAccess()) return;
      const plId = getSelectedPlaylistId();
      const pl = state.playlists.find((item) => item.id === plId);
      if (!pl || !pl.tracks.length) {
        showToast('歌单里还没有歌曲，先加几首再分享吧');
        return;
      }
      const tracks = pl.tracks.map(serializeTrack).filter(Boolean);
      try {
        const response = await fetch('/api/share', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: pl.name, description: pl.desc || '', tracks }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          showToast(data.error || '分享失败，请稍后再试');
          return;
        }
        const url = data.url || `https://music.zhoujun.dev/s/${data.token}`;
        const copied = await copyTextToClipboard(url);
        showToast(copied ? `分享链接已复制：${url}` : `分享链接：${url}`, 5000);
      } catch (error) {
        console.warn('share playlist failed', error);
        showToast('分享失败，请稍后再试');
      }
    }

    async function importSharedPlaylist(token) {
      const clean = String(token || '').trim();
      if (!/^[a-z0-9]{6,32}$/i.test(clean)) return;
      try {
        const response = await fetch(`/api/share?id=${encodeURIComponent(clean)}`);
        if (!response.ok) throw new Error(`share ${response.status}`);
        const data = await response.json();
        const tracks = (Array.isArray(data.tracks) ? data.tracks : [])
          .map(deserializeTrack)
          .filter(Boolean);
        if (!tracks.length) {
          showToast('这个分享的歌单是空的');
          return;
        }
        const id = `pl-share-${clean}`;
        let playlist = state.playlists.find((item) => item.id === id);
        if (!playlist) {
          playlist = {
            id,
            name: data.name || '分享的歌单',
            desc: data.description || '',
            tracks,
          };
          state.playlists.push(playlist);
        }
        tracks.forEach((track) => {
          if (track.uid && !state.trackMap.has(track.uid)) state.trackMap.set(track.uid, track);
        });
        saveLibraryToStorage();
        renderPlaylistOptions();
        renderPlaylistList();
        showToast(`已导入歌单：${playlist.name}`, 3000);
      } catch (error) {
        console.warn('import shared playlist failed', error);
        showToast('分享链接无效或已失效');
      }
    }

    function importSharedFromUrl() {
      let share = '';
      try {
        share = new URL(window.location.href).searchParams.get('share') || '';
      } catch (error) {
        return;
      }
      if (!share) return;
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('share');
        history.replaceState(null, '', url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : '') + url.hash);
      } catch (error) {}
      importSharedPlaylist(share);
    }

    function drawRoundRect(ctx, x, y, width, height, radius) {
      const r = Math.min(radius, width / 2, height / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + width, y, x + width, y + height, r);
      ctx.arcTo(x + width, y + height, x, y + height, r);
      ctx.arcTo(x, y + height, x, y, r);
      ctx.arcTo(x, y, x + width, y, r);
      ctx.closePath();
    }

    function fitCanvasText(ctx, text, maxWidth) {
      const value = String(text || '');
      if (ctx.measureText(value).width <= maxWidth) return value;
      let cut = value;
      while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxWidth) {
        cut = cut.slice(0, -1);
      }
      return `${cut}…`;
    }

    function drawInsightsCard(canvas, summary, profileName) {
      const W = 1080;
      const H = 1440;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const INK = '#17201a';
      const MUTED = '#6a766c';
      const GREEN = '#2f5a45';
      const CREAM = '#f7f3e8';
      const ACCENT = '#b5643f';
      const FONT = '"PingFang SC", "Source Han Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
      const M = 64;
      const RIGHT = W - M;
      const EN_CARD = window.HaloI18n?.lang === 'en';
      const L = (zh, en) => (EN_CARD ? en : zh);

      // 纸张底色
      const paper = ctx.createLinearGradient(0, 0, 0, H);
      paper.addColorStop(0, '#fdfbf6');
      paper.addColorStop(1, '#f0eade');
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, W, H);

      // 右上角柔光
      const glow = ctx.createRadialGradient(W - 40, 40, 20, W - 40, 40, 420);
      glow.addColorStop(0, 'rgba(63,107,87,0.14)');
      glow.addColorStop(1, 'rgba(63,107,87,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(W - 480, 0, 480, 480);

      // 品牌
      ctx.save();
      ctx.shadowColor = 'rgba(47,90,69,0.28)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = GREEN;
      drawRoundRect(ctx, M, 64, 64, 64, 18);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = CREAM;
      ctx.font = `700 34px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText('H', M + 32, 64 + 43);
      ctx.textAlign = 'left';
      ctx.fillStyle = INK;
      ctx.font = `600 24px ${FONT}`;
      ctx.fillText('HALO MUSIC', M + 84, 96);
      ctx.fillStyle = MUTED;
      ctx.font = `400 20px ${FONT}`;
      ctx.fillText(L('听歌报告', 'LISTENING REPORT'), M + 84, 124);
      const now = new Date();
      const stamp = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
      ctx.textAlign = 'right';
      ctx.font = `400 22px ${FONT}`;
      ctx.fillText(stamp, RIGHT, 100);
      ctx.textAlign = 'left';

      // 标题
      ctx.fillStyle = INK;
      ctx.font = `700 68px ${FONT}`;
      ctx.fillText(L('我的听歌报告', 'My Listening Report'), M, 244);
      const start = new Date(Date.now() - 29 * 86400000);
      const rangeText = `${String(start.getMonth() + 1).padStart(2, '0')}.${String(start.getDate()).padStart(2, '0')} – ${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
      ctx.fillStyle = MUTED;
      ctx.font = `400 26px ${FONT}`;
      const nameText = String(profileName || '').trim();
      ctx.fillText(fitCanvasText(ctx, L(`最近 30 天 · ${rangeText}${nameText ? ` · ${nameText}` : ''}`, `Last 30 days · ${rangeText}${nameText ? ` · ${nameText}` : ''}`), 800), M, 292);

      // 主视觉：累计时长
      const heroY = 330;
      const heroH = 306;
      ctx.save();
      ctx.shadowColor = 'rgba(23,32,26,0.22)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 18;
      const heroFill = ctx.createLinearGradient(M, heroY, RIGHT, heroY + heroH);
      heroFill.addColorStop(0, '#356549');
      heroFill.addColorStop(1, '#264838');
      ctx.fillStyle = heroFill;
      drawRoundRect(ctx, M, heroY, RIGHT - M, heroH, 36);
      ctx.fill();
      ctx.restore();

      // 同心圆装饰
      ctx.save();
      drawRoundRect(ctx, M, heroY, RIGHT - M, heroH, 36);
      ctx.clip();
      ctx.strokeStyle = 'rgba(247,243,232,0.10)';
      ctx.lineWidth = 2;
      for (const radius of [132, 196, 262]) {
        ctx.beginPath();
        ctx.arc(RIGHT - 130, heroY + 34, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      ctx.fillStyle = 'rgba(247,243,232,0.72)';
      ctx.font = `400 26px ${FONT}`;
      ctx.fillText(L('累计播放时长', 'TOTAL LISTENING TIME'), M + 48, heroY + 66);

      const hours = Number(summary.totalSeconds || 0) / 3600;
      const hoursText = hours >= 100 ? String(Math.round(hours)) : hours >= 10 ? String(Math.round(hours)) : hours.toFixed(1);
      ctx.fillStyle = CREAM;
      ctx.font = `700 132px ${FONT}`;
      ctx.fillText(hoursText, M + 44, heroY + 212);
      const hoursWidth = ctx.measureText(hoursText).width;
      ctx.font = `500 40px ${FONT}`;
      ctx.fillText(L('小时', 'hrs'), M + 44 + hoursWidth + 18, heroY + 206);

      const favArtist = mergeRankedRows(summary.topArtists || [], (item) => normalizeMusicMatchText(item.artist))[0]?.artist || L('暂无', 'None yet');
      ctx.font = `400 24px ${FONT}`;
      ctx.fillStyle = 'rgba(247,243,232,0.72)';
      ctx.fillText(fitCanvasText(ctx, L(`本月 ${Number(summary.month?.plays || 0)} 次播放 · 最常听 ${favArtist}`, `${Number(summary.month?.plays || 0)} plays this month · Most played ${favArtist}`), 700), M + 48, heroY + 268);

      // 三张统计卡
      const statY = 676;
      const statH = 152;
      const statW = 304;
      const gap = 20;
      const stats = [
        [Number(summary.plays || 0).toLocaleString(), L('次播放', 'plays')],
        [Number(summary.uniqueTracks || 0).toLocaleString(), L('首歌曲', 'songs')],
        [favArtist, L('最常听歌手', 'Top artist')],
      ];
      stats.forEach(([value, label], index) => {
        const x = M + index * (statW + gap);
        ctx.save();
        ctx.shadowColor = 'rgba(23,32,26,0.08)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 10;
        ctx.fillStyle = '#ffffff';
        drawRoundRect(ctx, x, statY, statW, statH, 26);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = ['#3f6b57', '#b5643f', '#5a6e8c'][index];
        ctx.beginPath();
        ctx.arc(x + 34, statY + 26, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = INK;
        ctx.font = `700 ${index === 2 ? 34 : 46}px ${FONT}`;
        ctx.fillText(fitCanvasText(ctx, value, statW - 56), x + 28, statY + 78);
        ctx.fillStyle = MUTED;
        ctx.font = `400 24px ${FONT}`;
        ctx.fillText(label, x + 28, statY + 120);
      });

      // 最近 7 天面积图
      const chartTitleY = 900;
      ctx.fillStyle = INK;
      ctx.font = `600 30px ${FONT}`;
      ctx.fillText(L('最近 7 天', 'Last 7 days'), M, chartTitleY);
      const weekTotal = (Array.isArray(summary.daily) ? summary.daily : []).reduce((sum, row) => sum + Number(row.plays || 0), 0);

      const daily = Array.isArray(summary.daily) ? summary.daily : [];
      const byDay = new Map(daily.map((row) => [String(row.day), row]));
      const weekLabels = EN_CARD ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['日', '一', '二', '三', '四', '五', '六'];
      const points = [];
      for (let offset = 6; offset >= 0; offset -= 1) {
        const date = new Date(Date.now() - offset * 86400000 + 8 * 3600000);
        const key = date.toISOString().slice(0, 10);
        points.push({
          label: EN_CARD ? weekLabels[date.getUTCDay()] : `周${weekLabels[date.getUTCDay()]}`,
          value: Number(byDay.get(key)?.plays || 0),
        });
      }
      const top = 962;
      const bottom = 1102;
      const maxValue = Math.max(1, ...points.map((item) => item.value));
      const step = (RIGHT - M) / (points.length - 1);
      const coords = points.map((item, index) => ({
        x: M + index * step,
        y: bottom - (item.value / maxValue) * (bottom - top),
      }));

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(coords[0].x, bottom);
      coords.forEach((point, index) => {
        if (index === 0) {
          ctx.lineTo(point.x, point.y);
          return;
        }
        const prev = coords[index - 1];
        const midX = (prev.x + point.x) / 2;
        ctx.bezierCurveTo(midX, prev.y, midX, point.y, point.x, point.y);
      });
      ctx.lineTo(coords[coords.length - 1].x, bottom);
      ctx.closePath();
      const area = ctx.createLinearGradient(0, top, 0, bottom);
      area.addColorStop(0, 'rgba(63,107,87,0.34)');
      area.addColorStop(1, 'rgba(63,107,87,0.02)');
      ctx.fillStyle = area;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      coords.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
          return;
        }
        const prev = coords[index - 1];
        const midX = (prev.x + point.x) / 2;
        ctx.bezierCurveTo(midX, prev.y, midX, point.y, point.x, point.y);
      });
      ctx.strokeStyle = '#3f6b57';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();

      coords.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#fdfbf6';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#3f6b57';
        ctx.stroke();
        ctx.fillStyle = MUTED;
        ctx.font = `400 22px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText(points[index].label, point.x, bottom + 40);
        ctx.fillStyle = INK;
        ctx.font = `600 22px ${FONT}`;
        ctx.fillText(String(points[index].value), point.x, point.y - 24);
      });
      ctx.textAlign = 'right';
      ctx.fillStyle = MUTED;
      ctx.font = `400 24px ${FONT}`;
      ctx.fillText(L(`共 ${weekTotal} 次播放`, `${weekTotal} plays total`), RIGHT, chartTitleY);
      ctx.textAlign = 'left';

      // 底部双栏
      const sectionY = 1206;
      const rowStart = 1262;
      const rowGap = 60;
      ctx.fillStyle = INK;
      ctx.font = `600 28px ${FONT}`;
      ctx.fillText(L('最常听歌手', 'Top artists'), M, sectionY);
      ctx.fillText(L('最常听歌曲', 'Top songs'), 560, sectionY);

      const artistColors = ['#3f6b57', '#b5643f', '#5a6e8c'];
      const artists = mergeRankedRows(summary.topArtists || [], (item) => normalizeMusicMatchText(item.artist)).slice(0, 3);
      artists.forEach((item, index) => {
        const y = rowStart + index * rowGap;
        ctx.beginPath();
        ctx.arc(M + 24, y - 9, 24, 0, Math.PI * 2);
        ctx.fillStyle = artistColors[index % artistColors.length];
        ctx.fill();
        ctx.fillStyle = CREAM;
        ctx.font = `600 22px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText(String(item.artist || '?').slice(0, 1), M + 24, y);
        ctx.textAlign = 'left';
        ctx.fillStyle = INK;
        ctx.font = `600 26px ${FONT}`;
        const name = fitCanvasText(ctx, item.artist || L('未知歌手', 'Unknown artist'), 240);
        ctx.fillText(name, M + 64, y);
        const nameWidth = ctx.measureText(name).width;
        ctx.fillStyle = MUTED;
        ctx.font = `400 22px ${FONT}`;
        ctx.fillText(L(`${Number(item.plays || 0)} 次`, `${Number(item.plays || 0)} plays`), M + 64 + nameWidth + 14, y);
      });

      const tracks = mergeRankedRows(summary.topTracks || [], (item) => `${normalizeMusicMatchText(item.title)}|${normalizeMusicMatchText(item.artist)}`).slice(0, 3);
      tracks.forEach((item, index) => {
        const y = rowStart + index * rowGap;
        ctx.fillStyle = ACCENT;
        ctx.font = `700 22px ${FONT}`;
        ctx.fillText(`0${index + 1}`, 560, y);
        ctx.fillStyle = INK;
        ctx.font = `600 26px ${FONT}`;
        const title = fitCanvasText(ctx, item.title || L('未知歌曲', 'Unknown song'), 260);
        ctx.fillText(title, 606, y);
        const titleWidth = ctx.measureText(title).width;
        ctx.fillStyle = MUTED;
        ctx.font = `400 22px ${FONT}`;
        ctx.fillText(fitCanvasText(ctx, item.artist || '', RIGHT - 606 - titleWidth - 16), 606 + titleWidth + 14, y);
      });

      // 页脚
      ctx.strokeStyle = 'rgba(23,32,26,0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(M, 1392);
      ctx.lineTo(RIGHT, 1392);
      ctx.stroke();
      ctx.fillStyle = MUTED;
      ctx.font = `400 22px ${FONT}`;
      ctx.fillText('HALO MUSIC · music.zhoujun.dev', M, 1428);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#8f9a91';
      ctx.fillText(L('把听过的歌，变成自己的时间线', 'Every song you’ve heard, on your own timeline.'), RIGHT, 1428);
      ctx.textAlign = 'left';

      return { width: W, height: H };
    }

    function buildInsightsShareCard() {
      const summary = lastAccountSummary;
      if (!summary || !Number(summary.plays || 0)) {
        showToast('还没有听歌数据，先播放几首歌再来生成');
        return;
      }
      const canvas = document.createElement('canvas');
      drawInsightsCard(canvas, summary, state.profileName || '我的音乐');
      canvas.toBlob((blob) => {
        if (!blob) {
          showToast('分享卡生成失败，请稍后再试');
          return;
        }
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `halo-insights-${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        showToast('分享卡已生成');
      }, 'image/png');
    }

    // 英文界面下，页脚内容页链接指向 /en/ 版本。
    function syncFooterLanguage(){
      const en=uiLang()==='en';
      document.querySelectorAll('footer .footer-link').forEach(link=>{
        const base=link.dataset.baseHref||link.getAttribute('href')||'';
        if(!base.startsWith('/'))return;
        if(!link.dataset.baseHref)link.dataset.baseHref=base;
        link.setAttribute('href',en?(base.startsWith('/en/')?base:`/en${base}`):(base.replace(/^\/en/,'')||'/'));
      });
    }

    // 语言切换后，榜单/推荐属于“按语言取不同数据”，必须清缓存重拉。
    function handleLanguageChange(){
      toplistCache={};
      toplistLoading={};
      toplistFailed={};
      recommendCache={tracks:[],basis:'',at:0};
      recommendFailed=false;
      recommendLoading=false;
      activeToplistChart='hot';
      syncFooterLanguage();
      renderToplistPage();
      renderMiniSearchList();
      if(state.isAuthenticated&&dom.listeningSummary)loadAccountSummary?.();
    }

    function init(){
      setupDOM();
      document.addEventListener('halo:langchange',handleLanguageChange);
      syncFooterLanguage();
      try{applyTheme(localStorage.getItem(THEME_STORAGE_KEY)||'light');}catch(e){applyTheme('light');}
      setupParticles();
      setupRipple();
      setupEvents();
      setupMobileNavigation();
      setDesktopView(document.body.dataset.desktopView||'lyrics');
      applyStaticText();
      loadPlayQueueFromStorage();
      renderPlaylistOptions();
      renderPlaylistList();
      renderMiniSearchList();
      updateBatchToolbar();
      // Paint the lyrics surface up front so an idle player shows its hint
      // instead of an empty void.
      renderLyrics();
      setPlaymodeUI();
      updateDesktopPlaybackVisual();
      dom.audio.volume=parseFloat(dom.volumeSlider.value);
      updateAuthUI();
      loadAuthSession();
      checkForAndroidUpdate();
      importSharedFromUrl();
    }

    document.addEventListener('DOMContentLoaded',init);
  })();
