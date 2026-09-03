
  (function(){
    const APP_VERSION = '2.0.0';
    const ANDROID_UPDATE_STORAGE_KEY = 'halo-music-android-update-dismissed';
    // 临时验收开关：打开后 QQ 歌曲会直接走哔哩哔哩兜底，测试完成后改回 false。
    const QQ_BILIBILI_FALLBACK_TEST_MODE = true;

    const translations = {
      zh: {
        appTitle:"HALO 音乐广场",
        shortcutHint:"快捷键：Space 播放/暂停 · ←/→ 跳转 · ↑/↓ 音量 · N/P 切歌 · F 收藏 · L 切换歌词效果",
        shortcutPanelTitle:"快捷键说明",
        shortcutPanelDesc:"使用键盘可以更加方便地控制 HALO 音乐广场：",
        shortcutPlayPause:"播放 / 暂停",
        shortcutSeek:"快退 / 快进 5 秒",
        shortcutVolume:"音量加 / 减",
        shortcutPrevNext:"上一首 / 下一首",
        shortcutFav:"收藏 / 取消收藏当前歌曲",
        shortcutLyricsFX:"切换歌词炫酷效果",
        shortcutMute:"静音 / 取消静音",
        shortcutFocusSearch:"聚焦搜索框",
        shortcutCloseModal:"提示：按 Esc 可以关闭弹窗。",
        searchTitle:"歌曲搜索",
        searchButton:"搜索",
        searchStatusIdle:"基于推荐算法，猜你想搜“周杰伦”",
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
        lyricsEmpty:"暂无歌词，试着播放一首支持歌词的歌曲。",
        playlistTitle:"播放列表",
        tabResults:"正在播放",
        tabFavorites:"收藏",
        tabCustomLists:"歌单",
        playlistInfoResults:"正在播放列表",
        playlistInfoFavorites:"收藏列表",
        playlistInfoPlaylist:"歌单",
        libraryLoginTitle:"登录后同步收藏",
        libraryLoginDescription:"登录账号后管理收藏与歌单",
        libraryEmptyFavoritesTitle:"还没有收藏歌曲",
        libraryEmptyFavoritesDescription:"去搜索页发现喜欢的音乐",
        libraryEmptyPlaylistsTitle:"还没有自建歌单",
        libraryEmptyPlaylistsDescription:"创建一张歌单，把喜欢的歌收在一起",
        libraryLoginAction:"登录",
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
        toastNeedKeyword:"请先输入搜索关键词。",
        toastSearchError:"搜索时发生了一点小错误，请稍后再试。",
        toastPlayError:"播放失败，请稍后再试。",
        toastBilibiliFallback:"QQ 音乐不可用，已切换哔哩哔哩音频",
        toastBilibiliFallbackError:"哔哩哔哩兜底失败，请稍后再试",
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
        modalNewPlaylistTitle:"新建歌单",
        modalNewPlaylistDesc:"给你的歌单取一个可爱的名字吧～",
        modalConfirm:"确定",
        modalCancel:"取消"
      },
      en: {
        appTitle:"HALO Music Square",
        shortcutHint:"Shortcuts: Space Play/Pause · ←/→ Seek · ↑/↓ Volume · N/P Track · F Fav · L Lyrics FX",
        shortcutPanelTitle:"Keyboard Shortcuts",
        shortcutPanelDesc:"Control HALO Music Square more easily with your keyboard:",
        shortcutPlayPause:"Play / Pause",
        shortcutSeek:"Seek backward / forward 5s",
        shortcutVolume:"Volume up / down",
        shortcutPrevNext:"Previous / Next track",
        shortcutFav:"Favorite / unfavorite current track",
        shortcutLyricsFX:"Toggle lyrics FX",
        shortcutMute:"Mute / unmute",
        shortcutFocusSearch:"Focus on search box",
        shortcutCloseModal:"Tip: press Esc to close dialogs.",
        searchTitle:"Search",
        searchButton:"Search",
        searchStatusIdle:"Based on recommendations, try \"Jay Chou\"",
        searchStatusSearching:"Searching…",
        searchStatusDone:"Search completed.",
        searchStatusNoSource:"Please select at least one music source.",
        searchBatchNoResults:"No search results.",
        searchBatchSelectAll:"Select all",
        searchBatchUnselectAll:"Deselect all",
        searchBatchFavorite:"Add favorites",
        searchBatchPlaylist:"Add to playlist",
        searchBatchNeedSelection:"Select at least one song first.",
        searchBatchFavoriteResult:"Added {added} songs to favorites",
        searchBatchPlaylistTitle:"Save selected songs",
        searchBatchPlaylistDescription:"Choose a playlist. Songs already in it will be skipped.",
        searchBatchPlaylistSaved:"Saved {added}",
        playerTitle:"Now Playing",
        playerStatusIdle:"Idle",
        playerStatusLoading:"Loading audio…",
        playerStatusPlaying:"Playing",
        playerStatusPaused:"Paused",
        lyricsEmpty:"No lyrics yet. Try a song with LRC lyrics.",
        playlistTitle:"Playlists",
        tabResults:"Now Playing",
        tabFavorites:"Favorites",
        tabCustomLists:"Playlists",
        playlistInfoResults:"Now Playing",
        playlistInfoFavorites:"Favorites List",
        playlistInfoPlaylist:"Playlist",
        libraryLoginTitle:"Sign in to sync your library",
        libraryLoginDescription:"Manage favorites and playlists with your account.",
        libraryEmptyFavoritesTitle:"No favorites yet",
        libraryEmptyFavoritesDescription:"Find music you love from Search.",
        libraryEmptyPlaylistsTitle:"No playlists yet",
        libraryEmptyPlaylistsDescription:"Create a playlist to keep your favorite songs together.",
        libraryLoginAction:"Sign in",
        libraryBrowseAction:"Browse music",
        libraryCreateAction:"New",
        mobileImportAction:"Import",
        mobileExportAction:"Export",
        saveToPlaylistTitle:"Save to playlist",
        saveToPlaylistDescription:"Choose a playlist for the current track.",
        saveToPlaylistEmpty:"No playlists yet. Create one first.",
        playlistAlreadyContains:"Saved",
        playlistOpenLabel:"Open playlist",
        newPlaylist:"New playlist",
        queueAdd:"Add to queue",
        queueRemove:"Remove from queue",
        queueEmpty:"The playback list is empty",
        importPlaylist:"Import playlist",
        modalImportPlaylistTitle:"Import playlist",
        modalImportPlaylistDesc:"Paste a shared playlist message or URL. The platform will be detected automatically.",
        importPlaylistPlaceholder:"Paste a shared message or playlist URL…",
        importPlaylistNote:"Public playlists only. Large QQ Music playlists are limited to the first 1,200 tracks.",
        importPlaylistFile:"Import JSON file",
        importPlaylistConfirm:"Import",
        importPlaylistLoading:"Parsing playlist…",
        providerNeteaseFull:"Netease Cloud Music",
        providerQishuiFull:"Qishui Music",
        providerQQFull:"QQ Music",
        exportPlaylist:"Export playlist",
        deletePlaylist:"Delete playlist",
        removeFromPlaylist:"Remove from playlist",
        footerText:"For demo only. All music copyrights belong to original owners.",
        toastAddedFavorite:"Added to favorites",
        toastRemovedFavorite:"Removed from favorites",
        toastAddedToPlaylist:"Added to playlist",
        toastAlreadyInList:"This song is already in this list.",
        toastNoMore:"No more results to load.",
        toastNeedKeyword:"Please enter a search keyword first.",
        toastSearchError:"An error occurred while searching.",
        toastPlayError:"Playback failed. Please try again.",
        toastBilibiliFallback:"QQ Music is unavailable; switched to Bilibili audio.",
        toastBilibiliFallbackError:"Bilibili fallback failed. Please try again.",
        toastLyricStyleSwitched:"Lyrics FX toggled.",
        toastPlaylistCreated:"Playlist created.",
        toastPlaylistDeleted:"Playlist deleted.",
        toastTrackRemovedFromPlaylist:"Removed from playlist.",
        confirmDeletePlaylist:"Delete this playlist?",
        confirmRemoveTrack:"Remove this song from the playlist?",
        toastPlaylistImported:"Import completed",
        toastPlaylistImportEmpty:"No usable playlists or favorites found in this file.",
        toastPlaylistImportError:"Import failed. Please choose a JSON file exported by this site.",
        toastPlaylistExported:"Playlist file exported.",
        toastPlaylistExportEmpty:"No playlist to export.",
        toastPlaylistEmpty:"Playlist is empty. Add some songs first.",
        toastPlaymodeList:"Play mode: list loop",
        toastPlaymodeSingle:"Play mode: single loop",
        toastPlaymodeShuffle:"Play mode: shuffle",
        toastNeedPlaylistSelected:"Please select a playlist first.",
        toastNoCurrentTrack:"No track is currently playing.",
        sourceNetease:"Netease",
        sourceQQ:"QQ Music",
        sourceBilibili:"Bilibili",
        sourceQishui:"Qishui Music",
        modalNewPlaylistTitle:"Create Playlist",
        modalNewPlaylistDesc:"Give your playlist a cute name!",
        modalConfirm:"Confirm",
        modalCancel:"Cancel"
      }
    };

    const state = {
      language:'zh',
      enabledSources:{netease:true, qq:true},
      perSourceLimit:30,
      perSourceCurrentLimit:{netease:30, qq:30},
      perSourcePage:{netease:1, qq:1},

      searchKeyword:'',
      searchResults:[],
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
    const ANNOUNCEMENT_STORAGE_KEY = 'halo-music-announcement-2026-08-v3';

    const dom = {};
    let audioLevel = 0;
    let librarySaveChain = Promise.resolve();
    let createPlaylistForCurrentTrack = false;
    let pendingPlaylistTracks = [];
    let nextAudioPreload = null;
    let activePlaybackBlobUrl = '';
    let nextTrackPrepareToken = 0;
    let preparedNextTrack = null;
    let workspaceRemovedTabs = [];
    let workspaceRemovedPlaylistControls = [];
    let workspaceDesktopPlaylistId = null;
    let pendingAndroidUpdateUrl = '';
    let pendingAndroidUpdateVersion = '';

    function $(id){return document.getElementById(id);}
    function t(k){const lang=state.language;return (translations[lang]&&translations[lang][k])||translations.zh[k]||k;}
    function sourceTranslationKey(source){
      if(source==='netease')return 'sourceNetease';
      if(source==='qq')return 'sourceQQ';
      if(source==='bilibili')return 'sourceBilibili';
      if(source==='qishui')return 'sourceQishui';
      return 'sourceNetease';
    }
    function trackDisplaySource(track){
      return track?.playbackSource || track?.source || 'netease';
    }
    function showToast(msg){
      const toast=$('toast'); if(!toast)return;
      toast.textContent=msg;
      toast.classList.add('show');
      setTimeout(()=>toast.classList.remove('show'),2000);
    }
    function updateDesktopPlaybackVisual(){
      dom.playerPanel?.classList.toggle('is-playing',Boolean(state.isPlaying));
    }
    function updateAuthUI(){
      document.body.classList.toggle('auth-gated',!state.isAuthenticated);
    }
    function setAuthGate(authenticated){
      state.isAuthenticated=Boolean(authenticated);
      document.body.classList.toggle('auth-gated',!state.isAuthenticated);
    }
    function setAuthMode(){
      dom.loginTitle.textContent='登录后开始播放';
      dom.loginDescription.textContent='访客可以搜索和浏览。登录后才可解析和播放歌曲。';
      dom.loginSubmit.textContent='登录';
      dom.loginPasswordInput.autocomplete='current-password';
      dom.loginAccountInput.focus();
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
        if(!authenticated)openLoginModal();
      }
    }
    function openLoginModal(){
      setAuthMode();
      dom.loginModal.classList.add('show');
      dom.loginModal.setAttribute('aria-hidden','false');
      setTimeout(()=>dom.loginAccountInput.focus(),40);
    }
    function closeLoginModal(){
      if(!state.isAuthenticated)return;
      dom.loginModal.classList.remove('show');
      dom.loginModal.setAttribute('aria-hidden','true');
      dom.loginPasswordInput.value='';
    }
    function requirePlayback(){
      if(state.isAuthenticated)return true;
      showToast('登录后即可解析并播放歌曲');
      openLoginModal();
      return false;
    }
    function requireLibraryAccess(){
      if(state.isAuthenticated)return true;
      showToast('登录后才能收藏和管理歌单');
      openLoginModal();
      return false;
    }
    async function submitLogin(){
      const username=dom.loginAccountInput.value.trim();
      const password=dom.loginPasswordInput.value;
      if(!username||!password){showToast('请输入用户名和密码');return;}
      dom.loginSubmit.disabled=true;
      try{
        const response=await fetch('/api/login',{
          method:'POST',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({username,password})
        });
        const data=await response.json().catch(()=>({}));
        if(!response.ok){showToast(data.error||'请求失败，请稍后重试');return;}
        setAuthGate(true);
        state.profileName=data.username||username;
        closeLoginModal();
        updateAuthUI();
        await loadLibraryForAuthenticatedUser();
        loadPlayQueueFromStorage(getPlayQueueStorageKey(state.profileName));
        renderPlaylistList();
        showToast('登录成功，已解锁播放');
      }catch(e){
        showToast('网络错误，无法连接登录服务');
      }finally{dom.loginSubmit.disabled=false;}
    }
    async function toggleAuth(){
      if(!state.isAuthenticated){openLoginModal();return;}
      await librarySaveChain;
      try{await fetch('/api/logout',{method:'POST',credentials:'same-origin'});}catch(e){}
      dom.audio.pause();
      state.isAuthenticated=false;
      state.profileName='';
      state.favorites=[];
      state.playlists=[];
      state.playQueue=[];
      state.playContext={type:'results',index:-1,playlistId:null};
      renderPlaylistOptions();
      renderPlaylistList();
      updateMainFavButton();
      setAuthGate(false);
      openLoginModal();
      updateAuthUI();
      showToast('已退出登录，播放功能已锁定');
    }
    function applyTheme(theme){
      const next=theme==='light'?'light':'dark';
      document.documentElement.dataset.theme=next;
      dom.themeIcon.textContent=next==='light'?'☾':'☀';
      dom.themeToggle.title=next==='light'?'切换暗色模式':'切换亮色模式';
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

    function setLanguage(lang){
      if(lang!=='zh' && lang!=='en') lang='zh';
      state.language=lang;
      try{localStorage.setItem('halo-music-lang',lang);}catch(e){}
      document.querySelectorAll('.lang-btn').forEach(btn=>{
        btn.classList.toggle('active',btn.dataset.lang===lang);
      });
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const key=el.dataset.i18n;
        if(key) el.textContent = t(key);
      });
      document.querySelectorAll('[data-i18n-title]').forEach(el=>{
        const key=el.dataset.i18nTitle;
        if(key){el.title=t(key);el.setAttribute('aria-label',t(key));}
      });
      dom.searchInput.placeholder = lang==='zh'
        ? '输入歌名 / 歌手，回车搜索…'
        : 'Type song / artist, press Enter…';
      dom.playlistNameInput.placeholder = lang==='zh'
        ? '例如：通勤歌单 / 宝可梦歌单'
        : 'e.g. Commute mix / Pokemon list';
      renderPlaylistOptions();
      updatePlaylistInfoLabel();
    }

    // ========== 旧的质量映射函数，暂时保留（不再使用 API 的 quality 字段） ==========
    function neteaseQualityToTag(q){
      const s = (q || '').toString().toLowerCase();
      if (/lossless|无损|flac|ape|wav|hi-?res|sq|臻品|臻音|高清臻音|spatial/.test(s)) return 'lossless';
      return 'normal';
    }

    // ========== 新增：统一根据音频链接后缀判断音质 ==========
    function inferQualityFromUrl(url){
      if(!url) return {tag:null,label:''};
      let base = url.split('?')[0].toLowerCase();
      const m = base.match(/\.([a-z0-9]+)$/);
      const ext = m ? m[1] : '';
      const losslessExts = ['flac','wav','ape','alac','aiff'];
      if (losslessExts.includes(ext)) {
        return {tag:'lossless', label:'LOSSLESS'};
      }
      // 其他一律当作 320K 显示
      return {tag:'320k', label:'320K'};
    }

    // ===================== 歌单缓存 / 导出 =====================

    function serializeTrack(track){
      if(!track) return null;
      const keys=[
        'uid','source','displayIndex','keyword','songid','songMid','qqId','qqSearchKey','qqIndex',
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
            name:pl.name || (state.language==='zh'?'未命名歌单':'Untitled Playlist'),
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
          name:importText(name,raw?.name,raw?.title,raw?.dissname,raw?.playlistName,raw?.listName,state.language==='zh'?'导入歌单':'Imported Playlist'),
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

        const fallbackName=state.language==='zh' ? '导入歌单' : 'Imported Playlist';
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
      const base=state.language==='zh'
        ? `${t('toastPlaylistImported')}：新增 ${stat.addedPlaylists} 个歌单，${stat.addedFavorites} 首收藏，${stat.addedPlaylistTracks} 首歌单歌曲。`
        : `${t('toastPlaylistImported')}: ${stat.addedPlaylists} playlists, ${stat.addedFavorites} favorites, ${stat.addedPlaylistTracks} playlist tracks added.`;
      if(!meta.truncated)return base;
      return state.language==='zh'
        ? `${base} 原歌单共 ${meta.total} 首，已按平台限制导入前 ${meta.imported} 首。`
        : `${base} The source has ${meta.total} tracks; the first ${meta.imported} were imported.`;
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
      if(!url){showToast(state.language==='zh'?'请粘贴歌单分享链接。':'Paste a playlist URL first.');return;}
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
        showToast(playlistImportSuccessMessage(stat,{truncated:data.truncated,total:data.total,imported}));
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
            showToast(playlistImportSuccessMessage(stat));
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

    // 网易云搜索：qijieya meting search
    async function searchNetease(kw, page, num){
      const requestLimit=Math.max(1,page||1)*Math.max(1,num||10);
      const url=`https://api.qijieya.cn/meting/?type=search&id=${encodeURIComponent(kw)}&limit=${encodeURIComponent(requestLimit)}&server=netease`;
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
        const res=await fetch(url);
        const json=await res.json();
        if(!Array.isArray(json))return 0;

        json.forEach((it, idx)=>{
          const songId = pickQueryParam(it.url, 'id') || `${kw}-${idx+1}`;
          const uid=`netease-${songId}`;
          if(state.trackMap.has(uid))return;

          const track={
            uid,
            source:'netease',
            displayIndex:idx+1,
            keyword:kw,

            songid:songId,
            title:it.name||'',
            artist:it.artist||'',
            album:'',

            cover:it.pic||null,
            audioUrl:it.url||null,
            lrc:null,
            lrcUrl:it.lrc||null,

            detailsLoaded:false,
            quality:null,
            qualityLabel:null
          };
          if(isDuplicateSearchTrack(track))return;
          state.trackMap.set(uid,track);
          state.searchResults.push(track);
          added++;
        });

      }catch(e){console.error('netease(qijieya meting)',e);}
      return added;
    }

    // QQ 搜索：由同源 Function 在官方接口和多个备用源之间自动切换。
    async function searchQQ(kw, limit) {
      const url=`/api/music?action=qq_search&q=${encodeURIComponent(kw)}&limit=${encodeURIComponent(limit)}`;
      let added=0;
      try{
        const res=await fetch(url);
        const json=await res.json();
        if(!res.ok||json.code!==200||!Array.isArray(json.data))throw new Error(json.error||'QQ 搜索失败');
        json.data.forEach((it,idx)=>{
          const mid=String(it.mid||'').trim();
          if(!mid)return;
          const uid=`qq-${mid}`;
          if(state.trackMap.has(uid))return;
          const track={
            uid,
            source:'qq',
            displayIndex:idx+1,
            keyword:kw,
            qqSearchKey:kw,
            qqIndex:idx+1,
            qqId:mid,
            songid:mid,
            songMid:mid,
            mediaMid:it.mediaMid||mid,
            title:it.name||'',
            artist:it.artist||'',
            album:it.album||'',
            cover:it.cover||null,
            duration:Number(it.duration)||0,
            audioUrl:null,
            lrc:null,
            lrcUrl:null,
            detailsLoaded:false,
            quality:null,
            qualityLabel:null,
            qqQualityText:it.pay||null,
            pay:it.pay||null,
            resolverSource:json.source||null
          };
          if(isDuplicateSearchTrack(track))return;
          state.trackMap.set(uid,track);
          state.searchResults.push(track);
          added++;
        });
      }catch(e){
        console.error('qq search pool',e);
      }
      return added;
    }

    // ===================== 聚合搜索 =====================

    async function searchAllSources(reset){
      if(!state.searchKeyword){showToast(t('toastNeedKeyword'));return;}
      const enabled=Object.keys(state.enabledSources).filter(k=>state.enabledSources[k]);
      if(!enabled.length){showToast(t('searchStatusNoSource'));return;}
      state.searchInProgress=true;
      dom.searchStatus.textContent=t('searchStatusSearching');

      if(reset){
        Object.keys(state.perSourceCurrentLimit)
          .forEach(k=>state.perSourceCurrentLimit[k]=state.perSourceLimit);
        Object.keys(state.perSourcePage).forEach(k=>state.perSourcePage[k]=1);

        state.searchResults=[];
        state.trackMap.clear();
        state.noMoreResults=false;
        state.selectedSearchUids.clear();
        updateBatchToolbar();
      }

      const kw=state.searchKeyword;
      const tasks=[];
      for(const s of enabled){
        const limit=state.perSourceCurrentLimit[s]||state.perSourceLimit;
        if(s==='netease')tasks.push(searchNetease(kw, 1, state.perSourceLimit));
        if(s==='qq')tasks.push(searchQQ(kw,limit));
      }
      let added=0;
      try{
        const res=await Promise.all(tasks);
        added=res.reduce((a,b)=>a+(b||0),0);
      }catch(e){
        console.error(e);
        showToast(t('toastSearchError'));
      }

      state.searchInProgress=false;
      dom.searchStatus.textContent=t('searchStatusDone');
      renderMiniSearchList();
      renderPlaylistList();
      updateBatchToolbar();
      if(state.isAuthenticated&&!state.currentTrack && state.searchResults.length){
        playFromList('search',0);
      }
      state.noMoreResults=true;
    }

    // ===================== 各平台详情 =====================

    // 网易云详情：搜索结果已返回播放、封面、歌词接口，这里只补全缓存歌曲和歌词内容
    async function fetchNeteaseDetails(track){
      if(track.songid){
        if(!track.audioUrl){
          track.audioUrl=`https://api.qijieya.cn/meting/?server=netease&type=url&id=${encodeURIComponent(track.songid)}`;
        }
        if(!track.lrcUrl){
          track.lrcUrl=`https://api.qijieya.cn/meting/?server=netease&type=lrc&id=${encodeURIComponent(track.songid)}`;
        }
      }

      if(track.audioUrl){
        const q=inferQualityFromUrl(track.audioUrl);
        track.quality=q.tag;
        track.qualityLabel=q.label;
      }

      if(!track.lrc && track.lrcUrl){
        try{
          const lr=await fetch(track.lrcUrl);
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
          console.warn('netease(qijieya meting) lyric fetch failed', e);
        }
      }

      track.detailsLoaded=true;
    }

    // 服务器端 tang 解析失败或共享出口 IP 被限流时，浏览器用用户自己的 IP
    // 直连 tang 拿 VIP 播放链接，再交回服务器校验代理。
    // tang 慢窗口会拖到 15~20 秒才应答，这里给足 25 秒耐心等；
    // 服务器侧先成功时由外部 signal 提前取消，避免白白占用请求。
    async function resolveQqViaBrowserTang(keyword,mid,{signal:externalSignal}={}){
      try{
        const controller=new AbortController();
        const onExternalAbort=()=>controller.abort();
        if(externalSignal){
          if(externalSignal.aborted){controller.abort();}
          else externalSignal.addEventListener('abort',onExternalAbort,{once:true});
        }
        const timer=setTimeout(()=>controller.abort(),25000);
        try{
          const res=await fetch(`https://tang.api.s01s.cn/music_open_api.php?msg=${encodeURIComponent(keyword)}&type=json&mid=${encodeURIComponent(mid)}`,{signal:controller.signal});
          const j=await res.json();
          const data=(j&&typeof j==='object'&&!Array.isArray(j))?j:null;
          if(!data||(data.song_mid&&data.song_mid!==mid))return null;
          const lyric=String(data.song_lyric||data.lyric||'');
          for(const key of ['song_play_url_hq','song_play_url_standard','song_play_url','song_play_url_sq','song_play_url_pq']){
            const u=String(data[key]||'');
            if(/^https?:\/\//i.test(u))return {url:u,lyric};
          }
          return null;
        }finally{
          clearTimeout(timer);
          if(externalSignal)externalSignal.removeEventListener('abort',onExternalAbort);
        }
      }catch(e){
        if(e&&e.name!=='AbortError')console.warn('QQ browser tang resolver unavailable',e);
        return null;
      }
    }

    // QQ 详情和音频统一走同源代理池，避免浏览器跨域和单点失效。
    async function fetchQQDetails(track,options={}) {
      if(QQ_BILIBILI_FALLBACK_TEST_MODE&&track?.source==='qq'){
        throw new Error('QQ fallback test mode');
      }
      const keyword=(track.qqSearchKey||track.keyword||`${track.title||''} ${track.artist||''}`).trim();
      const mid=String(track.qqId||track.songMid||track.songid||'').trim();
      if(!mid)throw new Error('QQ 音乐歌曲 ID 缺失');
      const params=new URLSearchParams({action:'qq_detail',id:mid,q:keyword});
      if(track.mediaMid)params.set('media_mid',track.mediaMid);
      if(track.duration)params.set('duration',String(track.duration));
      if(track.title)params.set('title',track.title);
      if(track.artist)params.set('artist',track.artist);
      // 播放失败后的重试：绕过服务器缓存强制重新解析并更新缓存。
      if(options.forceRefresh)params.set('refresh','1');
      // 先请求服务器，让已有 D1 缓存直接命中；只有服务器解析失败时才调用
      // 浏览器 tang，避免每次播放都重复请求同一首歌。
      const fetchServer=async(p)=>{
        const ctrl=new AbortController();
        const timer=setTimeout(()=>ctrl.abort(),10000);
        try{
          const r=await fetch(`/api/music?${p}`,{signal:ctrl.signal});
          return {r,json:await r.json()};
        }catch(e){
          return {r:null,json:{code:0}};
        }finally{clearTimeout(timer);}
      };
      let {r:res,json}=await fetchServer(params);
      let browserLyric='';
      let rawBrowserUrl='';
      if(!res||!res.ok||json.code!==200||!json.data||!json.data.audioUrl){
        // 服务器侧失败后，用浏览器解析结果重试一次。
        const browser=await resolveQqViaBrowserTang(keyword,mid);
        if(browser&&browser.url){
          // 页面是 https，直接播放必须用 https，否则会被浏览器当混合内容拦截。
          rawBrowserUrl=browser.url.replace(/^http:/i,'https:');
          browserLyric=browser.lyric||'';
          params.set('resolved_url',browser.url);
          const retry=await fetchServer(params);
          res=retry.r;
          json=retry.json;
        }
      }
      if(!res||!res.ok||json.code!==200||!json.data){
        // 服务器重试仍失败：直接播放浏览器解析到的原始地址（用户 IP 直连）。
        if(rawBrowserUrl){
          Object.assign(track,{
            audioUrl:rawBrowserUrl,
            audioCandidates:[rawBrowserUrl],
            playbackSource:'qq',
            lrc:browserLyric||track.lrc||null,
            lrcUrl:null,
            quality:null,
            qualityLabel:null,
            detailsLoaded:true
          });
          return;
        }
        throw new Error(json.error||'QQ 音乐详情获取失败');
      }
      const d=json.data;
      const audioCandidates=Array.isArray(d.audioUrls)&&d.audioUrls.length
        ?d.audioUrls.map(u=>u.url).filter(Boolean)
        :(d.audioUrl?[d.audioUrl]:[]);
      Object.assign(track,{
        title:d.name||track.title,
        artist:d.artist||track.artist,
        album:d.album||track.album,
        cover:d.cover||track.cover,
        pageUrl:d.pageUrl||track.pageUrl,
        audioUrl:d.audioUrl||track.audioUrl,
        audioCandidates,
        playbackSource:'qq',
        lrc:d.lyric||browserLyric||track.lrc||null,
        lrcUrl:null,
        quality:d.quality||track.quality||null,
        qualityLabel:d.qualityLabel||track.qualityLabel||null,
        detailsLoaded:true
      });
    }

    async function fetchBilibiliFallback(track){
      if(!track||track.source!=='qq')throw new Error('Bilibili fallback is only available for QQ tracks');
      if(track._bilibiliFallbackTried)throw new Error('Bilibili fallback already attempted');
      track._bilibiliFallbackTried=true;
      const title=String(track.title||'').trim();
      const artist=String(track.artist||'').trim();
      const query=[artist,title].filter(Boolean).join(' ').trim();
      if(!query)throw new Error('Bilibili fallback query is empty');
      const params=new URLSearchParams({action:'bili_search',q:query,title,artist});
      if(track.duration)params.set('duration',String(track.duration));
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),20000);
      try{
        const response=await fetch(`/api/music?${params}`,{cache:'no-store',signal:controller.signal});
        let json=null;
        try{json=await response.json();}catch(error){json=null;}
        if(!response.ok||json?.code!==200||!Array.isArray(json?.data)){
          throw new Error(json?.error||'Bilibili search failed');
        }
        const candidates=json.data.filter(item=>item&&item.audioUrl);
        if(!candidates.length)throw new Error('No matching Bilibili video found');
        let lastError=null;
        for(const candidate of candidates){
          try{
            const probe=await fetch(candidate.audioUrl,{cache:'no-store',headers:{range:'bytes=0-1',accept:'audio/*,video/mp4,*/*'},signal:controller.signal});
            if(!probe.ok){
              let detail='Bilibili audio unavailable';
              try{const payload=await probe.json();detail=payload?.error||detail;}catch(error){}
              throw new Error(detail);
            }
            probe.body?.cancel();
            Object.assign(track,{
              audioUrl:candidate.audioUrl,
              audioCandidates:[candidate.audioUrl],
              playbackSource:'bilibili',
              bilibiliBvid:candidate.bvid||'',
              bilibiliAid:candidate.aid||'',
              bilibiliPage:Number(candidate.page)||1,
              fallbackDuration:Number(candidate.duration)||track.duration||0,
              duration:Number(track.duration)||Number(candidate.duration)||0,
              cover:track.cover||candidate.cover||null,
              pageUrl:track.pageUrl||candidate.pageUrl||'',
              detailsLoaded:true
            });
            // Bilibili is used only for audio here. Fetch QQ's lyric data
            // independently so an audio-source failure does not remove lyrics.
            if(!track.lrc && track.qqId){
              try{
                const lyricParams=new URLSearchParams({action:'qq_lyric',id:String(track.qqId)});
                const lyricResponse=await fetch(`/api/music?${lyricParams}`,{cache:'no-store'});
                const lyricJson=await lyricResponse.json().catch(()=>null);
                const lyric=lyricJson?.data?.lyric||'';
                if(lyricResponse.ok&&lyricJson?.code===200&&lyric)track.lrc=lyric;
              }catch(error){
                console.warn('QQ lyric fallback unavailable',error);
              }
            }
            showToast(t('toastBilibiliFallback'));
            return candidate;
          }catch(error){
            if(controller.signal.aborted)throw error;
            lastError=error;
          }
        }
        throw lastError||new Error('Bilibili audio unavailable');
      }catch(error){
        track._bilibiliFallbackError=error?.message||'Bilibili fallback failed';
        throw error;
      }finally{
        clearTimeout(timer);
      }
    }

    function normalizeMusicMatchText(value){
      return String(value||'').toLowerCase().replace(/[\s\-—_·•()（）【】\[\]《》'".,，。:：;；!?！？]/g,'');
    }

    function scoreQQImportCandidate(track,candidate){
      const targetTitle=normalizeMusicMatchText(track.title);
      const targetArtist=normalizeMusicMatchText(track.artist);
      const title=normalizeMusicMatchText(candidate.song_title||candidate.song_name);
      const artist=normalizeMusicMatchText(candidate.singer_name);
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
        const response=await fetch(`https://tang.api.s01s.cn/music_open_api.php?msg=${encodeURIComponent(keyword)}&type=json`);
        const json=await response.json();
        const candidates=Array.isArray(json)?json:(Array.isArray(json?.data)?json.data:[]);
        const matched=candidates
          .filter(item=>item&&item.song_mid)
          .map(item=>({item,score:scoreQQImportCandidate(track,item)}))
          .sort((a,b)=>b.score-a.score)[0];
        if(!matched||matched.score<45)throw new Error('qishui track match failed');
        track.qqId=matched.item.song_mid;
        track.songMid=matched.item.song_mid;
        track.qqSearchKey=keyword;
      }
      await fetchQQDetails(track);
    }

    let audioCandidateIndex=0;

    async function ensureTrackDetails(track, options={}){
      if(!options.forceRefresh && track.detailsLoaded && track.audioUrl && (track.lrc || !track.lrcUrl)) return;
      if(!options.silent)dom.playerStatus.textContent=t('playerStatusLoading');
      try{
        if(track.source==='netease') await fetchNeteaseDetails(track);
        else if(track.source==='qishui') await fetchQishuiDetails(track);
        else {
          try{
            await fetchQQDetails(track,options);
          }catch(error){
            if(track.source!=='qq'||track._bilibiliFallbackTried)throw error;
            try{
              await fetchBilibiliFallback(track);
              return;
            }catch(fallbackError){
              console.warn('Bilibili fallback unavailable',fallbackError);
              throw error;
            }
          }
        }
      }catch(e){
        console.warn(track.source+' 详情解析失败',e);
        throw e;
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
      const wrap=dom.lyricsInner;
      wrap.querySelectorAll('.lyrics-line.active').forEach(el=>el.classList.remove('active'));
      const act=wrap.querySelector(`.lyrics-line[data-index="${idx}"]`);
      if(act){
        act.classList.add('active');
        const box=dom.lyricsContainer;
        box.scrollTo({top:act.offsetTop-box.clientHeight*0.45,behavior:'smooth'});
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
      if(!requirePlayback())return;
      state.currentTrack=track;
      state.playContext=context||state.playContext;
      renderPlaylistList();
      scrollCurrentTrackIntoView();

      const applyUI=()=>{
        dom.trackTitle.textContent=track.title||'';
        dom.trackArtist.textContent=track.artist||'';

        const sk=trackDisplaySource(track);
        const key=sourceTranslationKey(sk);
        dom.trackSourcePill.style.display='inline-flex';
        dom.trackSourcePill.className='source-pill source-'+sk;
        dom.trackSourcePill.innerHTML='';
        const dot=document.createElement('span');
        dot.className='source-dot '+sk;
        const txt=document.createElement('span');
        txt.textContent=t(key);
        dom.trackSourcePill.appendChild(dot);
        dom.trackSourcePill.appendChild(txt);

        // 显示音质：LOSSLESS 或 320K（根据 qualityLabel）
        if (track.qualityLabel) {
          dom.trackQualityPill.style.display = 'inline-block';
          dom.trackQualityPill.textContent = track.qualityLabel;
        } else {
          dom.trackQualityPill.style.display = 'none';
        }

        if(track.cover){
          dom.coverImg.src=track.cover;
          dom.coverImg.style.display='block';
          dom.coverPlaceholder.style.display='none';
        }else{
          dom.coverImg.style.display='none';
          dom.coverPlaceholder.style.display='flex';
        }
      };

      dom.playerStatus.textContent=t('playerStatusLoading');
      applyUI();

      state.lyricLines = track.lrc ? parseLRC(track.lrc) : [];
      renderLyrics();
      updateMainFavButton();

      try{
        if(!options.detailsReady || !track.audioUrl)await ensureTrackDetails(track);
        applyUI();
        state.lyricLines = track.lrc ? parseLRC(track.lrc) : [];
        renderLyrics();
        if(!track.audioUrl){showToast(t('toastPlayError'));dom.playerStatus.textContent=t('playerStatusIdle');return;}
        audioCandidateIndex=Math.max(0,(track.audioCandidates||[]).indexOf(track.audioUrl));
        const preloadedUrl=await takePreloadedAudio(track);
        releaseActivePlaybackBlob();
        activePlaybackBlobUrl=preloadedUrl;
        dom.audio.autoplay=true;
        dom.audio.src=preloadedUrl||track.audioUrl;
        dom.audio.load();
        const playback=dom.audio.play();
        await playback;
        state.isPlaying=true;
        updateDesktopPlaybackVisual();
        dom.playBtn.textContent='⏸';
        dom.playerStatus.textContent=t('playerStatusPlaying');
        updateMediaSession(track);
        prepareUpcomingTrack();
      }catch(e){
        console.error(e);
        showToast(track._bilibiliFallbackError?t('toastBilibiliFallbackError'):t('toastPlayError'));
        dom.playerStatus.textContent=t('playerStatusIdle');
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
      const url=new URL(track.audioUrl,window.location.href).href;
      if(nextAudioPreload?.url===url)return;
      stopPreloadedAudio();
      const controller=new AbortController();
      const entry={url,blobUrl:'',controller,promise:null};
      nextAudioPreload=entry;
      entry.promise=fetch(url,{cache:'force-cache',credentials:'same-origin',signal:controller.signal})
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
      if(index<0)index=list.length-1;
      if(index>=list.length)index=0;
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

    function updateBatchToolbar(){
      if(!dom.searchBatchToolbar)return;
      const allTracks=getInterleavedSearchList();
      const allSelected=allTracks.length>0&&allTracks.every(track=>state.selectedSearchUids.has(track.uid));
      dom.searchBatchSelectAll.checked=allSelected;
      dom.searchBatchSelectAll.title=t(allSelected?'searchBatchUnselectAll':'searchBatchSelectAll');
      dom.searchBatchSelectAll.setAttribute('aria-label',dom.searchBatchSelectAll.title);
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
      if(!requireLibraryAccess())return;
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
      if(!track||!requireLibraryAccess())return false;
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
        count.textContent=state.language==='zh'?`${pl.tracks.length} 首歌曲`:`${pl.tracks.length} tracks`;
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

    function openAnnouncementModal(){
      dom.announcementModal.classList.add('show');
      dom.announcementModal.setAttribute('aria-hidden','false');
    }

    function closeAnnouncementModal(){
      dom.announcementModal.classList.remove('show');
      dom.announcementModal.setAttribute('aria-hidden','true');
      try{localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY,'dismissed');}catch(e){}
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
        if(dom.announcementModal.classList.contains('show')){
          window.setTimeout(()=>checkForAndroidUpdate(),500);
          return;
        }
        showAndroidUpdateModal(data,latestVersion);
      }catch(error){
        console.warn('Android update check failed:',error);
      }
    }

    function showAnnouncementIfNeeded(){
      let dismissed=false;
      try{dismissed=localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY)==='dismissed';}catch(e){}
      if(!dismissed)setTimeout(openAnnouncementModal,120);
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

    function renderMiniSearchList(){
      const wrap=dom.searchMiniList;
      wrap.innerHTML='';
      const out=getInterleavedSearchList();
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
        const badge=document.createElement('div');
        badge.className='mini-badge'; badge.textContent='#'+(i+1);
        right.appendChild(badge);
        item.appendChild(meta);item.appendChild(right);
        item.addEventListener('click',()=>{
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
          ? (state.language==='zh'?`${pl.tracks.length} 首歌曲`:`${pl.tracks.length} tracks`)
          : '';
      }
    }

    function updatePlaymodeVisibility(){
      const activeTab=document.querySelector('.playlist-tab.active')?.dataset.tab||'results';
      dom.playlistPanel?.querySelector('.playmode-row')?.classList.toggle('is-hidden',activeTab!=='results');
    }

    function isMobileLibraryView(){
      return window.matchMedia('(max-width: 760px)').matches&&document.body.dataset.mobileView==='me';
    }

    function isDesktopLibraryWorkspace(){
      return window.matchMedia('(min-width: 761px)').matches
        && dom.workspaceContent?.classList.contains('workspace-library-only');
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
        const name=document.createElement('strong');
        name.textContent=playlist.name;
        const count=document.createElement('span');
        count.textContent=state.language==='zh'?`${playlist.tracks.length} 首歌曲`:`${playlist.tracks.length} tracks`;
        card.append(name,count);
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
      const importBtn=document.createElement('button');
      importBtn.type='button';importBtn.className='btn btn-ghost mobile-playlist-tool ripple-target';
      importBtn.title=t('importPlaylist');importBtn.setAttribute('aria-label',t('importPlaylist'));importBtn.textContent=t('mobileImportAction');
      importBtn.addEventListener('click',()=>dom.importPlaylistBtn.click());
      const exportBtn=document.createElement('button');
      exportBtn.type='button';exportBtn.className='btn btn-ghost mobile-playlist-tool ripple-target';
      exportBtn.title=t('exportPlaylist');exportBtn.setAttribute('aria-label',t('exportPlaylist'));exportBtn.textContent=t('mobileExportAction');
      exportBtn.addEventListener('click',()=>dom.exportPlaylistBtn.click());
      toolbar.appendChild(create);toolbar.appendChild(importBtn);toolbar.appendChild(exportBtn);
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
        const art=document.createElement('span');
        art.className='mobile-playlist-card-art';art.textContent=(playlist.name||'P').slice(0,1).toUpperCase();
        const copy=document.createElement('span');
        const name=document.createElement('strong');
        const count=document.createElement('small');
        name.textContent=playlist.name;
        count.textContent=state.language==='zh'?`${playlist.tracks.length} 首歌曲`:`${playlist.tracks.length} tracks`;
        const arrow=document.createElement('b');arrow.setAttribute('aria-hidden','true');arrow.textContent='\u203A';
        copy.appendChild(name);copy.appendChild(count);
        card.appendChild(art);card.appendChild(copy);card.appendChild(arrow);
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
        action.addEventListener('click',()=>setMobileView('search'));
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
      let list=[];
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
        icon.textContent='+';
        const copy=document.createElement('div');
        copy.className='library-empty-copy';
        const title=document.createElement('strong');
        title.textContent=t('queueEmpty');
        copy.appendChild(title);
        empty.appendChild(icon);empty.appendChild(copy);
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
        const sSpan=document.createElement('span');
        const displaySource=trackDisplaySource(track);
        const dot=document.createElement('span'); dot.className='source-dot '+displaySource;
        const key=sourceTranslationKey(displaySource);
        const txt=document.createElement('span'); txt.textContent=t(key);
        sSpan.appendChild(dot);sSpan.appendChild(txt);
        sub.appendChild(aSpan);sub.appendChild(sSpan);
        meta.appendChild(title);meta.appendChild(sub);

        const act=document.createElement('div');
        act.className='track-actions';
        const pBtn=document.createElement('button');
        pBtn.className='btn btn-secondary btn-icon ripple-target'; pBtn.textContent='▶';
        const fBtn=document.createElement('button');
        fBtn.className='btn btn-secondary btn-icon ripple-target'; fBtn.textContent='❤';
        if(isFavorite(track)) fBtn.classList.add('btn-fav-active');
        const removeBtn=document.createElement('button');
        removeBtn.className='btn btn-ghost btn-icon ripple-target';
        removeBtn.textContent='×';
        removeBtn.title=t('removeFromPlaylist');

        pBtn.addEventListener('click',ev=>{
          ev.stopPropagation();
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

    function openPlaylistModal(){
      if(!requireLibraryAccess())return;
      dom.playlistModal.classList.add('show');
      dom.playlistNameInput.value='';
      setTimeout(()=>dom.playlistNameInput.focus(),50);
    }
    function closePlaylistModal(){
      dom.playlistModal.classList.remove('show');
      createPlaylistForCurrentTrack=false;
      pendingPlaylistTracks=[];
    }
    function createPlaylist(){
      if(!requireLibraryAccess())return;
      let name=dom.playlistNameInput.value.trim();
      if(!name)name=state.language==='zh'?'未命名歌单':'Untitled Playlist';
      const id='pl-'+Date.now()+'-'+Math.random().toString(16).slice(2);
      const pl={id,name,tracks:[]};
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
      const canvas=$('bg-canvas');const ctx=canvas.getContext('2d');
      function resize(){
        const dpr=window.devicePixelRatio||1;
        canvas.width=window.innerWidth*dpr;
        canvas.height=window.innerHeight*dpr;
        ctx.setTransform(dpr,0,0,dpr,0,0);
      }
      resize();window.addEventListener('resize',resize);
      const parts=[];
      const N=90;
      for(let i=0;i<N;i++){
        parts.push({
          x:Math.random()*window.innerWidth,
          y:Math.random()*window.innerHeight,
          vx:(Math.random()-0.5)*0.4,
          vy:(Math.random()-0.5)*0.4,
          r:1+Math.random()*2.5,
          baseR:1+Math.random()*2.5,
          hue:200+Math.random()*120,
          a:0.22+Math.random()*0.3
        });
      }
      let mouse={x:window.innerWidth/2,y:window.innerHeight/2};
      window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
      function tick(){
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
              ctx.strokeStyle=`rgba(120,160,255,${al})`;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(tick);
      }
      tick();
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

    // ===================== DOM / 事件绑定 =====================

    function setupDOM(){
      dom.searchInput=$('search-input');
      dom.searchBtn=$('search-btn');
      dom.searchStatus=$('search-status');
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
      dom.mobilePlaylistBack=$('mobile-playlist-back');
      dom.mobilePlaylistDelete=$('mobile-playlist-delete');
      dom.playlistSelectRow=$('playlist-select-row');
      dom.playlistSelectTools=$('playlist-select-tools');
      dom.playlistSelect=$('playlist-select');
      dom.deletePlaylistBtn=$('delete-playlist-btn');
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
      dom.playlistConfirmBtn=$('playlist-confirm-btn');
      dom.playlistCancelBtn=$('playlist-cancel-btn');
      dom.playlistCloseBtn=$('playlist-close');

      dom.savePlaylistModal=$('save-playlist-modal');
      dom.savePlaylistOptions=$('save-playlist-options');
      dom.savePlaylistTitle=$('save-playlist-title');
      dom.savePlaylistDescription=$('save-playlist-description');
      dom.savePlaylistCloseBtn=$('save-playlist-close');
      dom.savePlaylistCreateBtn=$('save-playlist-create');

      dom.shortcutToggleBtn=$('shortcut-toggle-btn');
      dom.shortcutModal=$('shortcut-modal');
      dom.shortcutCloseBtn=$('shortcut-close');
      dom.settingsToggleBtn=$('settings-toggle-btn');
      dom.settingsModal=$('settings-modal');
      dom.settingsCloseBtn=$('settings-close');
      dom.clientDownloadButton=$('client-download-button');
      dom.clientDownloadModal=$('client-download-modal');
      dom.clientDownloadClose=$('client-download-close');
      dom.workspaceModal=$('workspace-modal');
      dom.workspaceContent=$('workspace-content');
      dom.workspaceTitle=$('workspace-title');
      dom.workspaceCloseBtn=$('workspace-close');

      dom.themeToggle=$('theme-toggle');
      dom.themeIcon=$('theme-icon');
      dom.loginModal=$('login-modal');
      dom.loginForm=$('login-form');
      dom.loginTitle=$('login-title');
      dom.loginDescription=$('login-description');
      dom.loginAccountInput=$('login-account-input');
      dom.loginPasswordInput=$('login-password-input');
      dom.loginSubmit=$('login-submit');
      dom.loginCloseBtn=$('login-close');
      dom.announcementModal=$('announcement-modal');
      dom.announcementClose=$('announcement-close');
      dom.announcementConfirm=$('announcement-confirm');
      dom.androidUpdateModal=$('android-update-modal');
      dom.androidUpdateClose=$('android-update-close');
      dom.androidUpdateLater=$('android-update-later');
      dom.androidUpdateInstall=$('android-update-install');
      dom.androidUpdateVersion=$('android-update-version');
      dom.androidUpdateCurrent=$('android-update-current');
      dom.androidUpdateNotes=$('android-update-notes');
      dom.mobileNav=$('mobile-nav');
      dom.layout=document.querySelector('.layout');
    }

    const mobileViews=['search','lyrics','me'];

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

    function openSettings(){
      dom.settingsModal.classList.add('show');
      dom.settingsModal.setAttribute('aria-hidden','false');
    }

    function closeSettings(){
      dom.settingsModal.classList.remove('show');
      dom.settingsModal.setAttribute('aria-hidden','true');
    }

    function openClientDownloadModal(){
      dom.clientDownloadModal.classList.add('show');
      dom.clientDownloadModal.setAttribute('aria-hidden','false');
    }

    function closeClientDownloadModal(){
      dom.clientDownloadModal.classList.remove('show');
      dom.clientDownloadModal.setAttribute('aria-hidden','true');
    }

    function setMobileView(view, options={}){
      const next=mobileViews.includes(view)?view:'search';
      document.body.dataset.mobileView=next;
      document.querySelectorAll('[data-mobile-view]').forEach(btn=>{
        const active=btn.dataset.mobileView===next;
        if(active)btn.setAttribute('aria-current','page');
        else btn.removeAttribute('aria-current');
      });
      document.querySelectorAll('.layout > .panel').forEach(panel=>{
        const panelView=panel.classList.contains('search-panel')?'search':panel.classList.contains('player-panel')?'lyrics':'me';
        panel.setAttribute('aria-hidden',String(panelView!==next && window.matchMedia('(max-width: 760px)').matches));
      });
      if(next==='me'){
        const activeTab=document.querySelector('.playlist-tab.active')?.dataset.tab;
        if(activeTab==='results' || options.openFavorites){
          document.querySelector('.playlist-tab[data-tab="favorites"]')?.click();
        }
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
        if(event.matches)setMobileView(document.body.dataset.mobileView||'search');
      });
    }

    function setPlaymodeUI(){
      document.querySelectorAll('.playmode-btn').forEach(btn=>{
        btn.classList.toggle('active',btn.dataset.mode===state.playMode);
      });
    }

    function setupEvents(){
      setupMediaSessionHandlers();
      document.querySelectorAll('.lang-btn').forEach(btn=>{
        btn.addEventListener('click',()=>setLanguage(btn.dataset.lang));
      });

      dom.searchBtn.addEventListener('click',()=>{
        state.searchKeyword=dom.searchInput.value.trim(); state.noMoreResults=false;
        searchAllSources(true);
      });
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
      });
      dom.audio.addEventListener('play',()=>{
        state.isPlaying=true;
        updateDesktopPlaybackVisual();
        dom.playBtn.textContent='⏸';
        dom.playerStatus.textContent=t('playerStatusPlaying');
        updateMediaSession(state.currentTrack);
      });
      dom.audio.addEventListener('pause',()=>{
        state.isPlaying=false;
        updateDesktopPlaybackVisual();
        dom.playBtn.textContent='▶';
        dom.playerStatus.textContent=t('playerStatusPaused');
        audioLevel = 0;
        updateMediaSession(state.currentTrack);
      });
      dom.audio.addEventListener('ended',()=>{
        audioLevel = 0;
        advanceAfterTrackEnds();
      });
      dom.audio.addEventListener('error',()=>{
        const track=state.currentTrack;
        if(!track)return;
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
          if(track.source==='qq'&&!track._bilibiliFallbackTried){
            fetchBilibiliFallback(track).then(()=>{
              playTrack(track,state.playContext,{detailsReady:true});
            }).catch(()=>{
              showToast(t('toastBilibiliFallbackError'));
              dom.playerStatus.textContent=t('playerStatusIdle');
            });
            return;
          }
          showToast(t('toastPlayError'));
          dom.playerStatus.textContent=t('playerStatusIdle');
          return;
        }
        track._refreshTries=refreshTries+1;
        ensureTrackDetails(track,{forceRefresh:true}).then(()=>{
          if(track.audioUrl){
            playTrack(track,state.playContext,{detailsReady:true});
          }else{
            showToast(t('toastPlayError'));
            dom.playerStatus.textContent=t('playerStatusIdle');
          }
        }).catch(()=>{
          showToast(t('toastPlayError'));
          dom.playerStatus.textContent=t('playerStatusIdle');
        });
      });

      dom.progressWrapper.addEventListener('click',e=>{
        const rect=dom.progressWrapper.getBoundingClientRect();
        const r=(e.clientX-rect.left)/rect.width;
        const dur=dom.audio.duration||0;
        dom.audio.currentTime=Math.max(0,Math.min(dur,dur*r));
      });

      document.querySelectorAll('.playlist-tab').forEach(tab=>{
        tab.addEventListener('click',()=>{
          document.querySelectorAll('.playlist-tab').forEach(el=>el.classList.toggle('active',el===tab));
          const tName=tab.dataset.tab;
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
      dom.newPlaylistBtn.addEventListener('click',openPlaylistModal);
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
      dom.shortcutToggleBtn.addEventListener('click',()=>{dom.shortcutModal.classList.add('show');});
      dom.shortcutCloseBtn.addEventListener('click',()=>{dom.shortcutModal.classList.remove('show');});
      dom.shortcutModal.addEventListener('click',e=>{if(e.target===dom.shortcutModal)dom.shortcutModal.classList.remove('show');});
      dom.settingsToggleBtn.addEventListener('click',openSettings);
      dom.settingsCloseBtn.addEventListener('click',closeSettings);
      dom.settingsModal.addEventListener('click',e=>{if(e.target===dom.settingsModal)closeSettings();});
      dom.clientDownloadButton.addEventListener('click',()=>{
        closeSettings();
        openClientDownloadModal();
      });
      dom.clientDownloadClose.addEventListener('click',closeClientDownloadModal);
      dom.clientDownloadModal.addEventListener('click',e=>{if(e.target===dom.clientDownloadModal)closeClientDownloadModal();});
      dom.settingsModal.querySelectorAll('[data-desktop-view]').forEach(button=>{
        button.addEventListener('click',()=>{
          const view=button.dataset.desktopView;
          closeSettings();
          if(view==='lyrics'){
            closeWorkspace();
            return;
          }
          if((view==='favorites'||view==='playlists')&&!state.isAuthenticated){
            requireLibraryAccess();
            return;
          }
          openWorkspace(view);
        });
      });
      dom.workspaceCloseBtn.addEventListener('click',closeWorkspace);
      dom.workspaceModal.addEventListener('click',e=>{if(e.target===dom.workspaceModal)closeWorkspace();});

      dom.announcementClose.addEventListener('click',closeAnnouncementModal);
      dom.announcementConfirm.addEventListener('click',closeAnnouncementModal);
      dom.announcementModal.addEventListener('click',e=>{if(e.target===dom.announcementModal)closeAnnouncementModal();});
      dom.androidUpdateClose.addEventListener('click',()=>dismissAndroidUpdate(pendingAndroidUpdateVersion));
      dom.androidUpdateLater.addEventListener('click',()=>dismissAndroidUpdate(pendingAndroidUpdateVersion));
      dom.androidUpdateInstall.addEventListener('click',()=>{
        if(!pendingAndroidUpdateUrl)return;
        window.location.assign(pendingAndroidUpdateUrl);
      });
      dom.androidUpdateModal.addEventListener('click',e=>{if(e.target===dom.androidUpdateModal)dismissAndroidUpdate(pendingAndroidUpdateVersion);});

      dom.themeToggle.addEventListener('click',toggleTheme);
      dom.loginCloseBtn.addEventListener('click',closeLoginModal);
      dom.loginModal.addEventListener('click',e=>{if(e.target===dom.loginModal)closeLoginModal();});
      dom.loginForm.addEventListener('submit',e=>{e.preventDefault();submitLogin();});

      document.querySelectorAll('.playmode-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          state.playMode=btn.dataset.mode;
          setPlaymodeUI();
          if(state.playMode==='list')showToast(t('toastPlaymodeList'));
          else if(state.playMode==='single')showToast(t('toastPlaymodeSingle'));
          else showToast(t('toastPlaymodeShuffle'));
        });
      });

      document.addEventListener('keydown',e=>{
        const tag=document.activeElement.tagName.toLowerCase();
        const typing=(tag==='input'||tag==='textarea');
        const playlistOpen=dom.playlistModal.classList.contains('show');
        const importPlaylistOpen=dom.importPlaylistModal.classList.contains('show');
        const savePlaylistOpen=dom.savePlaylistModal.classList.contains('show');
        const shortcutOpen=dom.shortcutModal.classList.contains('show');
        const settingsOpen=dom.settingsModal.classList.contains('show');
        const clientDownloadOpen=dom.clientDownloadModal.classList.contains('show');
        const workspaceOpen=dom.workspaceModal.classList.contains('show');
        const loginOpen=dom.loginModal.classList.contains('show');
        const announcementOpen=dom.announcementModal.classList.contains('show');
        const androidUpdateOpen=dom.androidUpdateModal.classList.contains('show');
        if(e.key==='Escape'){
          if(announcementOpen)closeAnnouncementModal();
          if(playlistOpen)closePlaylistModal();
          if(importPlaylistOpen)closeImportPlaylistModal();
          if(savePlaylistOpen)closeSavePlaylistModal();
          if(shortcutOpen)dom.shortcutModal.classList.remove('show');
          if(settingsOpen)closeSettings();
          if(clientDownloadOpen)closeClientDownloadModal();
          if(workspaceOpen)closeWorkspace();
          if(loginOpen)closeLoginModal();
          if(androidUpdateOpen)dismissAndroidUpdate(pendingAndroidUpdateVersion);
          return;
        }

        if(playlistOpen || importPlaylistOpen || savePlaylistOpen || shortcutOpen || settingsOpen || clientDownloadOpen || workspaceOpen || loginOpen || announcementOpen || androidUpdateOpen){
          return;
        }

        if(e.code==='Space'&&!typing){e.preventDefault();togglePlayPause();}
        if(e.key==='ArrowRight'&&!typing){dom.audio.currentTime=(dom.audio.currentTime||0)+5;}
        if(e.key==='ArrowLeft'&&!typing){dom.audio.currentTime=Math.max(0,(dom.audio.currentTime||0)-5);}
        if(e.key==='ArrowUp'&&!typing){dom.audio.volume=Math.min(1,(dom.audio.volume||0)+0.05);dom.volumeSlider.value=dom.audio.volume;}
        if(e.key==='ArrowDown'&&!typing){dom.audio.volume=Math.max(0,(dom.audio.volume||0)-0.05);dom.volumeSlider.value=dom.audio.volume;}
        if((e.key==='n'||e.key==='N')&&!typing)playNext('next');
        if((e.key==='p'||e.key==='P')&&!typing)playNext('prev');
        if((e.key==='f'||e.key==='F')&&!typing)toggleFavoriteCurrent();
        if((e.key==='l'||e.key==='L')&&!typing){
          state.lyricsAlt=!state.lyricsAlt;
          dom.lyricsContainer.classList.toggle('alt-style',state.lyricsAlt);
          showToast(t('toastLyricStyleSwitched'));
        }
        if((e.key==='m'||e.key==='M')&&!typing){
          state.muted=!state.muted;
          dom.audio.muted=state.muted;
        }
        if(e.key==='/'&&!typing){e.preventDefault();dom.searchInput.focus();dom.searchInput.select();}
      });
    }

    // ===================== 初始化 =====================

    function init(){
      setupDOM();
      try{const lg=localStorage.getItem('halo-music-lang'); if(lg)state.language=lg;}catch(e){}
      try{applyTheme(localStorage.getItem(THEME_STORAGE_KEY)||'dark');}catch(e){applyTheme('dark');}
      setupParticles();
      setupRipple();
      setupEvents();
      setupMobileNavigation();
      setLanguage(state.language);
      loadPlayQueueFromStorage();
      renderPlaylistOptions();
      renderPlaylistList();
      setPlaymodeUI();
      updateDesktopPlaybackVisual();
      dom.audio.volume=parseFloat(dom.volumeSlider.value);
      updateAuthUI();
      loadAuthSession();
    }

    document.addEventListener('DOMContentLoaded',init);
  })();
