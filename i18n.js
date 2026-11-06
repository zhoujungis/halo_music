(function () {
  const LANG_KEY = 'halo-music-lang';
  const EN = {
    // ===== shell / nav =====
    'Halo音乐': 'Halo Music',
    'HALO Music': 'HALO Music',
    '发现': 'Discover',
    '榜单': 'Charts',
    '正在播放': 'Now Playing',
    '播放队列': 'Queue',
    '队列': 'Queue',
    '我的音乐': 'My Music',
    '我的': 'Me',
    '登录': 'Log in',
    '登录账号': 'Account',
    '下载客户端': 'Download app',
    '切换亮色/暗色': 'Toggle theme',
    '主导航': 'Main navigation',
    '移动端导航': 'Mobile navigation',
    '站内信息': 'Site links',
    '搜索': 'Search',
    '关于本站': 'About',
    '使用指南': 'Guide',
    '常见问题': 'FAQ',
    '热门榜单': 'Charts',
    '隐私政策': 'Privacy',
    '服务条款': 'Terms',
    '免责声明': 'Disclaimer',
    '站点介绍': 'About this site',
    '本站仅作为学习演示，音乐版权归各平台与原作者所有。': 'A learning demo only. All music rights belong to the respective platforms and artists.',
    'Halo Music 是一个轻量、简洁、跨平台的个人音乐空间：搜索并播放音乐、管理收藏与歌单、查看听歌分析。': 'Halo Music is a lightweight, cross-platform music space: search and play music, manage favorites and playlists, and review your listening stats.',
    '启用 JavaScript 后可使用完整播放器；你也可以先浏览': 'JavaScript is required for the full player. You can still browse',
    '语言': 'Language',
    '中文': '中文',
    'English': 'English',

    // ===== search =====
    '歌曲搜索': 'Search songs',
    '输入歌名 / 歌手，回车搜索…': 'Search songs or artists, press Enter…',
    '基于推荐算法，猜你想搜“周杰伦”': 'Based on your listening, try “Jay Chou”',
    '选择': 'Select',
    '全选': 'Select all',
    '取消全选': 'Clear',
    '取消': 'Cancel',
    '加入播放列表': 'Add to queue',
    '加入收藏': 'Add to favorites',
    '加入歌单': 'Add to playlist',
    '最近搜索': 'Recent searches',
    '清空': 'Clear',
    '没有找到相关歌曲': 'No songs found',
    '换个关键词试试，或从最近搜索里再挑一个': 'Try another keyword or pick one from recent searches',
    '推荐歌曲': 'Recommended songs',
    '推荐歌手': 'Recommended artists',
    '查看榜单': 'View charts',
    '正在获取…': 'Loading…',
    '榜单每日 02:00 更新，稍后再来看看': 'Charts update daily at 02:00. Check back soon.',
    '推荐每日更新，稍后再来看看': 'Recommendations refresh daily. Check back soon.',
    '正在准备推荐…': 'Preparing recommendations…',
    '正在搜索多个音源…': 'Searching across sources…',
    '正在搜索中…': 'Searching…',
    '搜索完成。': 'Search complete.',
    '请至少选择一个音乐源。': 'Select at least one source.',
    '暂无搜索结果': 'No results',
    '搜索即可播放 · 登录后可收藏与同步歌单': 'Search to play · Log in to favorite and sync playlists',
    '请先选择歌曲。': 'Select songs first.',
    '批量保存到歌单': 'Save to playlist',
    '选择歌单保存已选歌曲（已存在的歌曲会自动跳过）': 'Pick a playlist. Songs already in it are skipped.',
    '已保存': 'Saved',
    '打开歌单': 'Open playlist',
    '每日 02:00 更新': 'Updated daily at 02:00',
    '热歌': 'Top Hits',
    '新歌': 'New Releases',
    '飙升': 'Trending',
    '热歌榜': 'Top Hits',
    '新歌榜': 'New Releases',
    '飙升榜': 'Trending',
    '搜索多个音源': 'Search multiple sources',
    '未知歌曲': 'Unknown song',
    '未知歌手': 'Unknown artist',
    '歌手名': 'Artist',
    '艺术家': 'Artist',
    '歌手': 'Artist',
    '专辑': 'Album',
    '专辑图片': 'Cover art',
    '歌曲名称': 'Song title',
    '歌名': 'Title',
    '详情解析失败': 'Failed to load details',
    'QQ源 搜索失败': 'QQ source search failed',
    'QQ源 关键词缺失': 'QQ source: missing keyword',

    // ===== player =====
    '空闲': 'Idle',
    '加载音源中…': 'Loading source…',
    '播放中': 'Playing',
    '已暂停': 'Paused',
    '缓冲中…': 'Buffering…',
    '播放失败': 'Playback failed',
    '暂无歌词，试着播放一首支持歌词的歌曲。': 'No lyrics yet. Try a song that supports lyrics.',
    '收藏 (F)': 'Favorite (F)',
    '保存到歌单': 'Save to playlist',
    '下载当前歌曲': 'Download this song',
    '上一首 (P)': 'Previous (P)',
    '播放/暂停 (Space)': 'Play/Pause (Space)',
    '下一首 (N)': 'Next (N)',
    '音量': 'Volume',
    '打开我的音乐': 'Open My Music',
    '这首歌暂时没有歌词': 'No lyrics for this song yet',
    '还没有在播放的歌曲': 'Nothing playing',
    '先听旋律吧～': 'Just enjoy the melody',
    '搜索一首歌，开始播放': 'Search for a song to start playing',
    '试听片段，正在切换完整音源…': 'Preview only — switching to the full track…',
    '免费音源没有这首歌的完整版': 'No full version available on free sources',
    '这首歌在免费音源只有试听片段': 'This song is only a preview on free sources',
    '这首歌已经在本地下载目录里，正在播放本地文件': 'Playing the local download',
    '本地文件无法播放，已切回在线音源': 'Local file failed, switched back to streaming',
    '隐藏': 'Hide',
    '显示': 'Show',
    '隐藏密码': 'Hide password',
    '显示密码': 'Show password',
    '已静音': 'Muted',
    '已取消静音': 'Unmuted',
    '切换暗色模式': 'Switch to dark mode',
    '切换亮色模式': 'Switch to light mode',

    // ===== playlists / library =====
    '播放列表': 'Queue',
    '收藏': 'Favorites',
    '歌单': 'Playlists',
    '我的信息': 'My Info',
    '清空播放列表': 'Clear queue',
    '删除歌单': 'Delete playlist',
    '编辑歌单': 'Edit playlist',
    '分享歌单': 'Share playlist',
    '新建歌单': 'New playlist',
    '导入歌单': 'Import playlist',
    '导出歌单': 'Export playlist',
    '支持网易云音乐、汽水音乐和 QQ 音乐分享链接': 'Supports share links from NetEase, Qishui, and QQ Music',
    '正在加载…': 'Loading…',
    '登录后查看收藏与歌单': 'Log in to see favorites and playlists',
    '搜索和播放无需登录；登录后会同步收藏与歌单到你的账号': 'Searching and playback don’t require an account; logging in syncs favorites and playlists.',
    '还没有收藏歌曲': 'No favorites yet',
    '去搜索页发现喜欢的音乐': 'Search to find music you like',
    '还没有自建歌单': 'No playlists yet',
    '创建一张歌单，把喜欢的歌收在一起': 'Create a playlist to collect your favorite songs',
    '登录 / 注册': 'Log in / Sign up',
    '去搜索': 'Search',
    '新建': 'New',
    '导入': 'Import',
    '导出': 'Export',
    '从播放列表移除': 'Remove from queue',
    '播放列表为空': 'Queue is empty',
    '从歌单移除': 'Remove from playlist',
    '未命名歌单': 'Untitled playlist',
    '← 歌单': '← Playlists',
    '队列为空': 'Queue is empty',
    '加入当前歌曲': 'Add current song',
    '从搜索结果或收藏中把歌曲加入队列。': 'Add songs from search results or favorites.',
    '编辑': 'Edit',
    '分享': 'Share',

    // ===== account =====
    '我的账号': 'My account',
    '登录后查看收藏与歌单': 'Log in to see favorites and playlists',
    '个人资料': 'Profile',
    '用户名': 'Username',
    '头像图片地址': 'Avatar URL',
    '保存资料': 'Save profile',
    '修改密码': 'Change password',
    '当前密码': 'Current password',
    '新密码': 'New password',
    '更新密码': 'Update password',
    '注销账户': 'Delete account',
    '注销后账号、收藏、歌单和听歌记录都会删除，无法恢复。': 'This permanently deletes your account, favorites, playlists, and listening history.',
    '输入当前密码确认': 'Enter your current password to confirm',
    '永久注销账户': 'Delete account permanently',
    '退出登录': 'Log out',
    '资料已保存': 'Profile saved',
    '密码已更新': 'Password updated',
    '账户及关联数据已注销': 'Account deleted',
    '请输入当前密码以确认注销': 'Enter your current password to confirm deletion',
    '已退出登录，收藏和歌单已隐藏': 'Logged out. Favorites and playlists are hidden.',
    '已使用 Google 账号登录': 'Signed in with Google',
    '登录后才能收藏和管理歌单': 'Log in to favorite songs and manage playlists',
    '登录成功，收藏与歌单已同步': 'Logged in — favorites and playlists synced',
    '请输入用户名和密码': 'Enter your username and password',
    '登录中…': 'Logging in…',
    '请求失败，请稍后重试': 'Request failed. Try again.',
    '网络错误，无法连接登录服务': 'Network error — can’t reach the login service.',
    '登录失败，请稍后重试': 'Login failed. Try again.',
    '请输入有效的邮箱地址': 'Enter a valid email address',
    '重新发送': 'Resend',
    '验证码发送失败，请稍后重试': 'Couldn’t send the code. Try again.',
    '发送验证码': 'Send code',
    '验证码已发送，请检查邮箱': 'Code sent — check your inbox.',
    '网络错误，无法发送验证码': 'Network error — couldn’t send the code.',
    '请输入 6 位邮箱验证码': 'Enter the 6-digit email code',
    '用户名需为 3–20 位': 'Username must be 3–20 characters',
    '密码至少需要 8 位': 'Password must be at least 8 characters',
    '创建中…': 'Creating…',
    '注册失败，请稍后重试': 'Sign-up failed. Try again.',
    '账号创建成功，已自动登录': 'Account created — you’re logged in.',
    '网络错误，无法连接注册服务': 'Network error — can’t reach the sign-up service.',
    '创建账号': 'Create account',
    '登录 HALO MUSIC': 'Log in to HALO MUSIC',
    '创建 HALO MUSIC 账号': 'Create your HALO MUSIC account',
    '登录后可同步收藏与歌单；搜索和播放无需登录': 'Log in to sync favorites and playlists; searching and playback don’t require an account.',
    '邮箱验证码注册，或直接使用 Google 账号': 'Sign up with an email code, or continue with Google',
    '使用 Google 账号继续': 'Continue with Google',
    '使用 Google 账号注册': 'Sign up with Google',
    '或使用邮箱': 'or use email',
    '注册': 'Sign up',
    '密码': 'Password',
    '至少 8 位密码': 'At least 8 characters',
    '3–20 位字母、数字、下划线或中文': '3–20 letters, digits, underscores or Chinese',
    '3–20 位字符': '3–20 characters',
    '6 位数字': '6-digit code',
    'https://…（可留空）': 'https://… (optional)',
    '至少 8 位': 'At least 8 characters',
    '邮箱': 'Email',
    '邮箱验证码': 'Email code',
    '设置密码': 'Set a password',
    '验证码由 Resend 发送，10 分钟内有效。': 'Codes are sent via Resend and valid for 10 minutes.',
    '账号入口': 'Account',
    '关闭登录': 'Close login',
    'Google 登录尚未配置，请联系管理员': 'Google sign-in isn’t configured yet.',
    '账号数据库暂不可用': 'Account database unavailable.',
    '已取消 Google 登录': 'Google sign-in cancelled.',
    '登录会话已过期，请重试': 'Session expired. Try again.',
    'Google 授权失败，请重试': 'Google authorization failed. Try again.',
    '无法读取 Google 资料，请重试': 'Couldn’t read your Google profile. Try again.',
    'Google 账号邮箱未验证，无法登录': 'Your Google email isn’t verified.',
    '该邮箱已绑定其他 Google 账号': 'This email is linked to another Google account.',
    'Google 登录失败，请稍后重试': 'Google sign-in failed. Try again.',

    // ===== modals =====
    '给你的歌单取一个可爱的名字吧～': 'Give your playlist a name',
    '例如：通勤歌单 / 宝可梦歌单': 'e.g. Commute mix / Pokémon mix',
    '一句话介绍这张歌单（可选）': 'One-line description (optional)',
    '确定': 'OK',
    '导入平台歌单': 'Import a playlist',
    '粘贴歌单分享文本或链接，系统会自动识别平台并导入歌曲。': 'Paste a share link or text; we’ll detect the platform and import the songs.',
    '粘贴分享文本或歌单链接…': 'Paste a share link or text…',
    '仅支持公开歌单；大型 QQ 歌单最多导入前 1200 首。': 'Public playlists only; large QQ playlists import up to 1,200 songs.',
    '从 JSON 文件导入': 'Import from JSON file',
    '开始导入': 'Start import',
    '正在解析歌单…': 'Parsing playlist…',
    '网易云音乐': 'NetEase Cloud Music',
    '汽水音乐': 'Qishui Music',
    'QQ 音乐': 'QQ Music',
    'QQ音乐': 'QQ Music',
    '网易云': 'NetEase',
    '哔哩哔哩': 'Bilibili',
    '支持的平台': 'Supported platforms',
    '关闭': 'Close',
    '关闭更新提示': 'Close update notice',
    '关闭下载客户端': 'Close download dialog',
    '选择一张歌单保存当前歌曲': 'Pick a playlist to save this song',
    '还没有歌单，先创建一张吧': 'No playlists yet — create one first',
    '保存到歌单': 'Save to playlist',
    '下载客户端': 'Download app',
    '下载 HALO Music 桌面端或安卓客户端。': 'Download HALO Music for desktop or Android.',
    '正在获取最新版本信息…': 'Fetching the latest version…',
    'Windows 安装包': 'Windows installer',
    '安卓客户端': 'Android app',
    '系统要求': 'Requirements',
    'Windows 10 及以上（64 位）· Android 6.0 及以上。macOS / Linux 暂未提供安装包，可直接使用网页版。': 'Windows 10+ (64-bit) · Android 6.0+. No macOS/Linux build yet — use the web app.',
    '本次更新': 'What’s new',
    '正在获取更新日志…': 'Fetching release notes…',
    'SHA256 校验文件': 'SHA256 checksums',
    'iPhone 不需要安装包：把本站添加到主屏幕，就能像 App 一样全屏使用。': 'No install needed on iPhone: add this site to your Home Screen to use it full screen.',
    '你已经把 HALO Music 添加到主屏幕了，直接从桌面图标打开即可。': 'You’ve already added HALO Music to your Home Screen — open it from there.',
    '当前不是 Safari：请点右上角「…」选择「在 Safari 中打开」，再按下面的步骤添加。': 'Not Safari: tap “…” and choose “Open in Safari”, then follow the steps below.',
    '在 Safari 点分享按钮，选择“添加到主屏幕”，图标就会出现在主屏幕上': 'In Safari, tap Share and choose “Add to Home Screen”.',
    '拷贝链接': 'Copy link',
    '添加到主屏幕': 'Add to Home Screen',
    '加入书签': 'Add bookmark',
    '点底部工具栏的「分享」': 'Tap “Share” in the bottom toolbar',
    '就是那个方框加向上箭头的按钮。': 'It’s the square with an arrow pointing up.',
    '在菜单里选「添加到主屏幕」': 'Choose “Add to Home Screen”',
    '菜单可能需要往下滑一点才能看到。': 'You may need to scroll down in the menu.',
    '点右上角「添加」': 'Tap “Add” in the top-right corner',
    '桌面就会出现 Halo音乐 图标，点开是全屏的。': 'The Halo Music icon appears on your Home Screen and opens full screen.',
    '发现新版本': 'Update available',
    '新的 Android 版本已经准备好了。': 'A new Android version is ready.',
    '当前版本': 'Current version',
    '稍后': 'Later',
    '立即更新': 'Update now',
    '优化播放体验': 'Playback improvements',
    '下载并安装 Android 更新': 'Download and install the Android update',
    '暂时没有可用的下载地址': 'No download available right now',
    '最新版本': 'Latest version',
    '版本信息暂时获取失败，下载链接仍然可以正常使用。': 'Couldn’t load version info, but the download links still work.',
    '本次更新内容请查看 GitHub Release': 'See the GitHub Release for details.',
    '更新日志与校验文件来自 GitHub Release：': 'Release notes and checksums come from GitHub Releases: ',
    '版本信息暂时不可用，下载链接依然有效。': 'Version info unavailable, but download links still work.',

    // ===== toasts / actions =====
    '已添加到收藏': 'Added to favorites',
    '已从收藏移除': 'Removed from favorites',
    '已添加到歌单': 'Added to playlist',
    '该歌曲已在当前列表里~': 'Already in this list',
    '已经没有更多搜索结果啦~': 'No more results',
    '搜索时发生了一点小错误，请稍后再试。': 'Something went wrong while searching. Try again.',
    '播放失败，请稍后再试。': 'Playback failed. Try again.',
    '播放失败，已自动切换下一首。': 'Playback failed — skipping to the next song.',
    'QQ 音乐暂无可用音源，已切换网易云音频': 'No QQ source available — using NetEase audio',
    '免费音源只有试听，已切换完整音源': 'Preview only — switched to the full track',
    'QQ 与网易云都没有可播放的版本，请稍后再试': 'No playable version available. Try again later.',
    '登录后才能下载歌曲': 'Log in to download songs',
    '今日该平台下载额度已用完': 'Today’s download limit is used up',
    '下载失败，请稍后再试': 'Download failed. Try again.',
    '已开始下载': 'Download started',
    '已切换歌词炫酷效果。': 'Lyrics effect switched.',
    '歌单创建成功。': 'Playlist created.',
    '歌单已删除。': 'Playlist deleted.',
    '已从歌单移除。': 'Removed from playlist.',
    '确定要删除这个歌单吗？': 'Delete this playlist?',
    '确定要从歌单中移除这首歌吗？': 'Remove this song from the playlist?',
    '导入完成': 'Import complete',
    '导入文件里没有可用歌单或收藏。': 'No playlists or favorites found in the file.',
    '导入失败，请确认文件是本站导出的 JSON。': 'Import failed — make sure it’s a JSON file exported from this site.',
    '已导出歌单文件。': 'Playlist file exported.',
    '暂无可导出的歌单。': 'Nothing to export yet.',
    '当前歌单为空，先添加几首歌吧~': 'This playlist is empty — add some songs first.',
    '播放模式：列表循环': 'Play mode: repeat all',
    '播放模式：单曲循环': 'Play mode: repeat one',
    '播放模式：随机播放': 'Play mode: shuffle',
    '请先选择一个歌单。': 'Select a playlist first.',
    '当前没有正在播放的歌曲。': 'Nothing is playing.',
    '播放列表已清空': 'Queue cleared',
    '确定要清空播放列表吗？': 'Clear the queue?',
    '已加入播放列表': 'Added to queue',
    '歌曲已在播放列表': 'Already in the queue',
    '歌单已更新': 'Playlist updated',
    '请粘贴歌单分享链接。': 'Paste a playlist share link.',
    '歌单里还没有歌曲，先加几首再分享吧': 'Add some songs before sharing this playlist.',
    '分享失败，请稍后再试': 'Couldn’t create the share link. Try again.',
    '这个分享的歌单是空的': 'This shared playlist is empty.',
    '分享的歌单': 'Shared playlist',
    '分享链接无效或已失效': 'This share link is invalid or expired.',
    '还没有听歌数据，先播放几首歌再来生成': 'Play some songs first, then generate your card.',
    '分享卡生成失败，请稍后再试': 'Couldn’t generate the card. Try again.',
    '分享卡已生成': 'Share card generated',
    '资料已保存': 'Profile saved',

    // ===== insights =====
    '听歌分析': 'Listening stats',
    '生成分享卡': 'Share card',
    '开始播放歌曲后，这里会生成你的听歌分析。': 'Play some songs and your listening stats will appear here.',
    '次播放': 'plays',
    '总时长': 'Total time',
    '首歌曲': 'songs',
    '本月播放': 'This month',
    '最近 7 天': 'Last 7 days',
    '听歌时段': 'Time of day',
    '最常听歌手': 'Top artists',
    '最常听歌曲': 'Top songs',
    '凌晨': 'Late night',
    '早晨': 'Morning',
    '上午': 'Late morning',
    '下午': 'Afternoon',
    '傍晚': 'Evening',
    '深夜': 'Night',
    '我的听歌报告': 'My Listening Report',
    '累计播放时长': 'Total listening time',
    '小时': 'hours',
    '暂无': 'None yet',
    '把听过的歌，变成自己的时间线': 'Every song you’ve heard, on your own timeline.',
    '听歌报告': 'Listening report',

    // ===== legal (about / privacy / disclaimer) =====
    'HALO Music 是一个轻量、简洁、跨平台的个人音乐空间：发现音乐、管理收藏、创建歌单、记录聆听。': 'HALO Music is a lightweight, cross-platform personal music space: discover music, manage favorites, create playlists, and track your listening.',
    '你可以做什么': 'What you can do',
    '发现音乐：推荐歌曲、热门榜单与热门歌手，也可以直接搜索想听的歌': 'Discover music: recommendations, charts, popular artists, or direct search.',
    '管理收藏：收藏喜欢的歌曲，创建自己的歌单，导入或导出平台歌单': 'Manage favorites: save songs, build playlists, and import or export playlists.',
    '记录聆听：听歌总结与最近播放；支持 Windows、Android 客户端，iPhone 可添加到主屏幕': 'Track listening: listening summaries and recent plays. Windows and Android apps available; on iPhone, add to Home Screen.',
    '关于内容来源': 'About content sources',
    'HALO Music 只展示第三方平台公开的检索结果并代理播放地址，不存储、不制作任何音频文件。音乐、封面与歌词的版权归各平台及原作者所有，详见免责声明。': 'HALO Music only displays public search results from third-party platforms and proxies playback URLs. It does not store or create audio files. Music, covers, and lyrics belong to their respective platforms and creators — see the disclaimer.',
    '版本与反馈': 'Version and feedback',
    '当前版本': 'Current version',
    '1. 我们收集什么': '1. What we collect',
    '账号信息': 'Account data',
    '：邮箱、用户名，以及密码的单向哈希（PBKDF2-SHA256，10 万次迭代加随机盐，不保存明文密码）；可选的显示名与头像图片地址。': ': email, username, and a one-way password hash (PBKDF2-SHA256, 100k iterations with a random salt — no plaintext passwords); optional display name and avatar URL.',
    'Google 登录': 'Google sign-in',
    '：接收 Google 提供的账号标识、已验证邮箱、昵称与头像地址，不接触你的 Google 密码。': ': we receive your Google account ID, verified email, name, and avatar URL. We never see your Google password.',
    '音乐库': 'Library',
    '：收藏的歌曲与自建歌单，以 JSON 形式整体保存。': ': favorites and playlists, stored as JSON.',
    '听歌记录': 'Listening history',
    '：曲目标识、歌名、歌手与播放时间，仅用于向你展示听歌总结与最近播放，不用于广告投放或用户画像。': ': track ID, title, artist, and play time, used only to show your listening stats and recent plays — never for ads or profiling.',
    '邮箱验证码': 'Email codes',
    '：只保存验证码哈希、请求 IP 哈希与过期时间。验证码 10 分钟后失效；发送频控用的 IP 哈希 24 小时后清理，仅用于限制请求频率，不用于限制账号数量。': ': only the code hash, hashed IP, and expiry are stored. Codes expire after 10 minutes; rate-limit IP hashes are deleted after 24 hours and are never used to limit accounts.',
    '缓存': 'Cache',
    '：搜索关键词缓存约 45 秒，音源解析结果最长 365 天（用于加速播放与避免重复解析），匿名访问也会产生。': ': search keywords are cached for about 45 seconds; resolved audio URLs for up to 365 days (to speed up playback and avoid repeated lookups). This also applies to anonymous visits.',
    '2. 浏览器本地存储': '2. Local browser storage',
    '主题偏好、歌单与播放队列的本地副本保存在 localStorage。登录态使用 HttpOnly Cookie': 'Theme preference, playlists, and the queue are stored locally in localStorage. Your session uses an HttpOnly cookie',
    '（Secure、SameSite=Lax，30 天有效），页面脚本无法读取其内容。': ' (Secure, SameSite=Lax, 30 days), unreadable by page scripts.',
    '3. 第三方服务': '3. Third-party services',
    'Cloudflare：页面托管、接口运行与数据库存储。': 'Cloudflare: page hosting, API runtime, and database storage.',
    'Resend：发送注册验证码邮件。': 'Resend: sending registration codes.',
    'Google：OAuth 登录。': 'Google: OAuth sign-in.',
    'Google AdSense：在本站展示广告，可能使用 Cookie 或类似技术记录你访问本站及其他网站的情况，用于展示个性化广告。你可以在': 'Google AdSense: serves ads on this site and may use cookies to record visits to this and other sites for personalized ads. You can manage this in',
    'Google 广告设置': 'Google Ad Settings',
    '中管理或关闭个性化广告。': '.',
    'QQ 音乐、网易云音乐、汽水音乐、哔哩哔哩及其公开解析接口：搜索与播放；搜索关键词会发送给对应平台。': 'QQ Music, NetEase Cloud Music, Qishui Music, Bilibili and their public parsing endpoints: search and playback; keywords are sent to those platforms.',
    '本站通过 Google AdSense 展示广告，相关 Cookie 由 Google 及其合作伙伴设置；除此之外没有接入第三方统计或行为追踪脚本。': 'Ads are served through Google AdSense, and related cookies are set by Google and its partners. No other analytics or tracking scripts are used.',
    '4. 数据用途': '4. How data is used',
    '上述数据仅用于登录、同步收藏与歌单、向你展示听歌总结与最近播放、以及检索与播放内容。听歌记录只服务于你自己可见的统计功能，不用于广告投放、推荐营销或用户画像。搜索关键词与曲目标识会发送给对应的第三方平台以完成检索与播放。': 'This data is used only for sign-in, syncing favorites and playlists, showing your listening stats and recent plays, and searching and playing content. Listening history powers only stats you can see; it is never used for ads, marketing, or profiling. Keywords and track IDs are sent to third-party platforms to complete search and playback.',
    '5. 保留、导出与删除': '5. Retention, export, and deletion',
    '账号数据保留到你主动注销。在「我的信息」中永久注销后，账号、收藏、歌单、听歌记录与会话会被删除，且无法恢复；Cloudflare 的底层备份副本可能在一段时间内仍保留历史快照，到期后自动清除。如需导出自己的收藏、歌单与听歌记录，可通过': 'Account data is kept until you delete your account. Deleting it in “My Info” removes your account, favorites, playlists, listening history, and sessions — this cannot be undone. Cloudflare backups may retain snapshots for a while, then expire automatically. To export your data, contact us at',
    '6. 安全': '6. Security',
    '全站使用 HTTPS，会话 Cookie 设置了 HttpOnly、Secure 与 SameSite，密码只保存哈希。但任何互联网服务都无法保证绝对安全，请不要复用其他网站的重要密码。': 'The site uses HTTPS; session cookies are HttpOnly, Secure, and SameSite; passwords are stored only as hashes. No service can guarantee absolute security — never reuse an important password here.',
    '7. 未成年人': '7. Minors',
    '本项目为学习演示，不面向 14 岁以下儿童，也不会刻意收集其个人信息。': 'This is a learning demo, not aimed at children under 14, and we don’t knowingly collect their data.',
    '8. 变更与联系': '8. Changes and contact',
    '政策如有变更会直接更新在本页；有疑问请通过': 'Any changes will be posted on this page. Questions? Contact',
    '版权归属': 'Copyright',
    '本站不存储、不制作任何音频文件，只展示第三方平台公开的检索结果并代理其播放地址。音乐、封面与歌词的版权归各平台及原作者所有。': 'This site stores and creates no audio files. It only displays public search results from third-party platforms and proxies their playback URLs. Music, covers, and lyrics belong to their respective platforms and creators.',
    '服务性质': 'Nature of the service',
    '本站是学习与演示项目，不提供付费服务，也不保证接口长期可用。上游平台调整策略时，部分歌曲可能无法播放或下载。': 'This is a learning and demo project with no paid services and no guarantee of long-term availability. If upstream platforms change policy, some songs may stop playing or downloading.',
    '第三方内容': 'Third-party content',
    '搜索结果与音源来自第三方，本站无法完全控制其准确性与合法性。若相关内容侵犯了你的权益，请通过': 'Search results and audio come from third parties; we can’t fully control their accuracy or legality. If something infringes your rights, contact us at',
    '使用责任': 'Your responsibility',
    '请勿将本站用于商业用途或任何违反当地法律法规的场景，因使用本站产生的后果由使用者自行承担。': 'Don’t use this site commercially or in any way that violates local law. You are responsible for the consequences of your use.',
    '客户端与外部链接': 'Clients and external links',
    '桌面端与安卓客户端按「现状」提供，下载链接指向对应的 GitHub Release，请自行评估安装风险。': 'Desktop and Android clients are provided “as is”; downloads point to the corresponding GitHub Release. Evaluate installation risk yourself.',
    '账号安全': 'Account security',
    '本站账号仅用于演示功能，请勿使用与其他重要服务相同的密码。': 'Accounts here are for demo purposes only — don’t reuse an important password.'
  };

  const PATTERNS = [
    [/^已收藏 (\d+) 首歌曲$/, (m) => `Added ${m[1]} song${m[1] === '1' ? '' : 's'} to favorites`],
    [/^已保存 (\d+) 首$/, (m) => `Saved ${m[1]}`],
    [/^已加入播放列表 (\d+) 首$/, (m) => `Added ${m[1]} to queue`],
    [/^(\d+) 首歌曲$/, (m) => `${m[1]} song${m[1] === '1' ? '' : 's'}`],
    [/^(\d+) 秒$/, (m) => `${m[1]}s`],
    [/^(\d+) 小时 (\d+) 分钟$/, (m) => `${m[1]}h ${m[2]}m`],
    [/^(\d+) 小时$/, (m) => `${m[1]}h`],
    [/^(\d+) 分钟$/, (m) => `${m[1]}m`],
    [/^(\d+)s 后重发$/, (m) => `Resend in ${m[1]}s`],
    [/^当前版本 (.+) · 最新版本 (.+)$/, (m) => `Current ${m[1]} · Latest ${m[2]}`],
    [/^当前版本 (v?[\d.]+) · 最新版本 (v?[\d.]+)$/, (m) => `Current ${m[1]} · Latest ${m[2]}`],
    [/^近 30 天新发现 (\d+) 首歌$/, (m) => `${m[1]} new songs in 30 days`],
    [/^共 (\d+) 次播放$/, (m) => `${m[1]} plays total`],
    [/^(\d+) 次$/, (m) => `${m[1]} plays`],
    [/^本月 (\d+) 次播放 · 最常听 (.+)$/, (m) => `${m[1]} plays this month · Most played ${m[2]}`],
    [/^账号：(.+) · 收藏 (\d+) · 歌单 (\d+)$/, (m) => `Account: ${m[1]} · Favorites ${m[2]} · Playlists ${m[3]}`],
    [/^分享链接已复制：(.+)$/, (m) => `Share link copied: ${m[1]}`],
    [/^分享链接：(.+)$/, (m) => `Share link: ${m[1]}`],
    [/^已导入歌单：(.+)$/, (m) => `Imported playlist: ${m[1]}`],
    [/^已开始下载，今日该平台剩余 (\d+) 首$/, (m) => `Download started — ${m[1]} left today`],
    [/^当前正在播放《(.+)》。把歌曲加入队列后，可以手动管理接下来的播放顺序。$/, (m) => `Now playing “${m[1]}”. Add songs to the queue to manage what plays next.`],
    [/^最近 30 天 · (.+)$/, (m) => `Last 30 days · ${m[1]}`],
    [/^周([日一二三四五六])$/, (m) => {
      const map = { 日: 'Sun', 一: 'Mon', 二: 'Tue', 三: 'Wed', 四: 'Thu', 五: 'Fri', 六: 'Sat' };
      return map[m[1]] || m[1];
    }],
    [/^(.+)榜$/, (m) => {
      const map = { 热歌: 'Top Hits', 新歌: 'New Releases', 飙升: 'Trending' };
      return map[m[1]] || `${m[1]} chart`;
    }],
    [/^最新版本 (v?[\d.]+)$/, (m) => `Latest ${m[1]}`],
    [/^最新版本 (v?[\d.]+) · (.+) 发布$/, (m) => `Latest ${m[1]} · released ${m[2]}`],
    [/^版本信息暂时不可用，下载链接依然有效。$/, () => 'Version info unavailable, but download links still work.'],
    [/^(.+) 次播放$/, (m) => `${m[1]} plays`],
    [/^已导入歌单：(.+)$/, (m) => `Imported playlist: ${m[1]}`]
  ];

  const SKIP_SELECTOR = [
    '[data-i18n-skip]',
    'script',
    'style',
    'option',
    '#track-title',
    '#track-artist',
    '.mini-title',
    '.mini-artist',
    '.discovery-recent-meta',
    '.discovery-podium-copy',
    '.discovery-artist-name',
    '.insights-row-copy',
    '.playlist-card-copy',
    '.playlist-card-desc',
    '.search-history-term',
    '.lyrics-wrap',
    '.lyrics-lines',
    '.lyric-line',
    '.toast-body'
  ].join(',');

  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  const EN_ATTR_CACHE = new WeakMap();
  const ZH_TEXT_CACHE = new WeakMap();
  const ATTR_ZH_CACHE = new WeakMap();

  function normalizeLang(value) {
    return String(value || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }

  // 大陆/港澳台常用时区：这些时区优先按中文，其余时区按英文。
  const CN_TIMEZONES = new Set([
    'Asia/Shanghai', 'Asia/Chongqing', 'Asia/Harbin', 'Asia/Urumqi', 'Asia/Kashgar',
    'Asia/Macau', 'Asia/Hong_Kong', 'Asia/Taipei', 'PRC', 'ROC', 'Hongkong'
  ]);

  function clientTimeZone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (error) {
      return '';
    }
  }

  function detectByTimeZone(timeZone) {
    const tz = String(timeZone || '').trim();
    if (!tz) return '';
    if (CN_TIMEZONES.has(tz)) return 'zh';
    // 明确落在其他地区时区：按英文，避免受 VPN 出口 IP 影响。
    if (!/^(Etc\/|UTC$|GMT$)/i.test(tz)) return 'en';
    return '';
  }

  function detectByLanguage(value) {
    const list = Array.isArray(value) ? value : [value];
    for (const item of list) {
      if (/^zh/i.test(String(item || ''))) return 'zh';
      if (/^[a-z]{2}(-|$)/i.test(String(item || ''))) return 'en';
    }
    return '';
  }

  function autoDetect() {
    const timeZone = clientTimeZone();
    const byTimeZone = detectByTimeZone(timeZone);
    if (byTimeZone) return { lang: byTimeZone, source: `timezone:${timeZone}`, ambiguous: false };
    const languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    const byLanguage = detectByLanguage(languages);
    if (byLanguage) return { lang: byLanguage, source: `language:${languages[0]}`, ambiguous: !timeZone || /^(Etc\/|UTC$|GMT$)/i.test(timeZone) };
    return { lang: 'en', source: 'default', ambiguous: true };
  }

  function storedLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (error) {}
    return '';
  }

  function detectLang() {
    const saved = storedLang();
    if (saved) return { lang: saved, source: 'stored', fixed: true, ambiguous: false };
    return { ...autoDetect(), fixed: false };
  }

  const initial = detectLang();
  let lang = initial.lang;
  let langSource = initial.source;
  let applying = false;

  function lookup(text) {
    const key = text.trim();
    if (!key) return '';
    if (Object.prototype.hasOwnProperty.call(EN, key)) return EN[key];
    for (const [pattern, replacer] of PATTERNS) {
      const match = key.match(pattern);
      if (match) return replacer(match);
    }
    return '';
  }

  function isSkipped(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    return Boolean(parent.closest(SKIP_SELECTOR));
  }

  function translateTextNode(node) {
    const current = node.nodeValue;
    if (!current || !/[\u4e00-\u9fff]/.test(current)) return;
    if (isSkipped(node)) return;
    if (!ZH_TEXT_CACHE.has(node)) ZH_TEXT_CACHE.set(node, current);
    const lead = current.match(/^\s*/)[0];
    const trail = current.match(/\s*$/)[0];
    const core = current.trim();
    const translated = lookup(core);
    if (!translated || translated === core) return;
    node.nodeValue = `${lead}${translated}${trail}`;
  }

  function restoreTextNode(node) {
    const original = ZH_TEXT_CACHE.get(node);
    if (original == null) return;
    if (node.nodeValue && /[\u4e00-\u9fff]/.test(node.nodeValue)) {
      ZH_TEXT_CACHE.delete(node);
      return;
    }
    node.nodeValue = original;
  }

  function translateAttributes(el) {
    for (const attr of ATTRS) {
      if (!el.hasAttribute || !el.hasAttribute(attr)) continue;
      const current = el.getAttribute(attr);
      if (!current || !/[\u4e00-\u9fff]/.test(current)) continue;
      let cache = ATTR_ZH_CACHE.get(el);
      if (!cache) {
        cache = {};
        ATTR_ZH_CACHE.set(el, cache);
      }
      if (!(attr in cache)) cache[attr] = current;
      const translated = lookup(current);
      if (translated) el.setAttribute(attr, translated);
    }
  }

  function restoreAttributes(el) {
    const cache = ATTR_ZH_CACHE.get(el);
    if (!cache) return;
    for (const attr of Object.keys(cache)) {
      const current = el.getAttribute(attr);
      if (current && /[\u4e00-\u9fff]/.test(current)) continue;
      el.setAttribute(attr, cache[attr]);
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      if (lang === 'en') translateTextNode(root);
      else restoreTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE) {
      if (root.matches(SKIP_SELECTOR)) return;
      if (lang === 'en') translateAttributes(root);
      else restoreAttributes(root);
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (lang === 'en') {
          return node.nodeValue && /[\u4e00-\u9fff]/.test(node.nodeValue)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (lang === 'en') translateTextNode(node);
      else restoreTextNode(node);
    });
    if (root.querySelectorAll) {
      root.querySelectorAll('*').forEach((el) => {
        if (el.closest(SKIP_SELECTOR)) return;
        if (lang === 'en') translateAttributes(el);
        else restoreAttributes(el);
      });
    }
  }

  function updateToggles() {
    document.querySelectorAll('[data-lang-toggle]').forEach((button) => {
      button.textContent = lang === 'en' ? '中文' : 'EN';
      button.setAttribute('title', lang === 'en' ? '切换到中文' : 'Switch to English');
      button.setAttribute('aria-label', lang === 'en' ? '切换到中文' : 'Switch to English');
    });
  }

  function apply(nextLang) {
    lang = nextLang;
    applying = true;
    try {
      document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
      if (lang === 'en' && document.title === 'Halo音乐') document.title = 'Halo Music';
      if (lang === 'zh' && document.title === 'Halo Music') document.title = 'Halo音乐';
      walk(document.body);
      updateToggles();
      document.dispatchEvent(new CustomEvent('halo:langchange', { detail: { lang } }));
    } finally {
      applying = false;
    }
  }

  function setLang(nextLang) {
    const normalized = nextLang === 'zh' ? 'zh' : 'en';
    try { localStorage.setItem(LANG_KEY, normalized); } catch (error) {}
    langSource = 'manual';
    apply(normalized);
  }

  // 时区/语言都无法判断（例如系统时区为 UTC）时，才用边缘节点的国家作为兜底。
  // 有明确时区时不会使用 IP 归属地，避免 VPN 出口影响判断。
  async function refineWithCountry() {
    let cached = '';
    try { cached = sessionStorage.getItem('halo-music-geo') || ''; } catch (error) {}
    let country = cached;
    if (!country) {
      try {
        const response = await fetch('/api/geo', { headers: { accept: 'application/json' } });
        if (response.ok) {
          const data = await response.json();
          country = String(data?.country || '').toUpperCase();
          if (country) {
            try { sessionStorage.setItem('halo-music-geo', country); } catch (error) {}
          }
        }
      } catch (error) {
        return;
      }
    }
    if (!country) return;
    const next = country === 'CN' ? 'zh' : 'en';
    if (next === lang) return;
    langSource = `country:${country}`;
    apply(next);
  }

  const observer = new MutationObserver((mutations) => {
    if (applying) return;
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        if (mutation.target.nodeType !== Node.ELEMENT_NODE) continue;
        if (lang === 'en') translateAttributes(mutation.target);
        else restoreAttributes(mutation.target);
        continue;
      }
      if (mutation.type === 'characterData') {
        if (lang === 'en') translateTextNode(mutation.target);
        continue;
      }
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (lang === 'en') translateTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          walk(node);
        }
      });
    }
  });

  function boot() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest?.('[data-lang-toggle]');
      if (!button) return;
      event.preventDefault();
      setLang(lang === 'en' ? 'zh' : 'en');
    });
    apply(lang);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label', 'alt'],
    });
    if (!initial.fixed && initial.ambiguous) refineWithCountry();
  }

  window.HaloI18n = {
    get lang() { return lang; },
    get source() { return langSource; },
    setLang,
    translate: (text) => lookup(text),
    preview: (timeZone, languages) => detectByTimeZone(timeZone) || detectByLanguage(languages) || 'en',
    t: (zh, en) => (lang === 'en' ? en : zh),
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
