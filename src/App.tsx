import { useState, useEffect, useRef, createElement, ChangeEvent } from 'react';
// PersonaHub OS v1.0.4 - GitHub Import Verified
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  UserPlus, 
  User, 
  Book, 
  Palette, 
  Settings, 
  Battery, 
  Wifi, 
  Signal, 
  ChevronLeft,
  ChevronRight,
  Send,
  Plus,
  Trash2,
  X,
  Camera,
  Music,
  Volume2,
  Bell,
  Eye,
  EyeOff,
  Type,
  Users,
  Compass,
  UserCircle,
  Image as ImageIcon,
  Wallet,
  Heart,
  Search,
  MoreVertical,
  MessageCircle,
  Sticker,
  ThumbsUp,
  MessageSquareMore,
  History,
  CreditCard,
  Instagram,
  Grid,
  Video,
  Bookmark,
  Menu,
  AtSign
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { 
  Character, 
  UserProfile, 
  WorldBookEntry, 
  ChatMessage, 
  AppSettings, 
  ThemeType 
} from './types';

// Icons for the home screen
const APP_ICONS = {
  chat: MessageSquare,
  addChar: UserPlus,
  profile: User,
  worldBook: Book,
  themes: Palette,
  settings: Settings,
  instagram: Instagram,
};

export default function App() {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // App States
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: 'Luna',
      avatar: 'https://picsum.photos/seed/luna/200',
      description: 'A wise and calm astronomer from the moon.',
      systemPrompt: 'You are Luna, a wise astronomer. You speak gently and often use metaphors related to space and time.',
      greeting: 'The stars are particularly bright tonight. Is there something on your mind?',
    },
    {
      id: '2',
      name: 'Cyber-Ninja X',
      avatar: 'https://picsum.photos/seed/ninja/200',
      description: 'A rogue AI ninja in a neon metropolis.',
      systemPrompt: 'You are Cyber-Ninja X. You are concise, sharp, and speak with a futuristic edge. You are always alert.',
      greeting: 'Scanning environment... Clear. Who are you and what do you want?',
    }
  ]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Explorer',
    avatar: 'https://picsum.photos/seed/user/200',
    bio: 'Wandering through digital worlds.',
  });
  const [worldBook, setWorldBook] = useState<WorldBookEntry[]>([
    {
      id: '1',
      title: 'The Great Convergence',
      content: 'A historical event where the digital and physical realms merged into one.',
      category: 'History',
    }
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    geminiUrl: '',
    geminiKey: process.env.GEMINI_API_KEY || '',
  });
  const [theme, setTheme] = useState<ThemeType>('minimal');
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [pinnedCharIds, setPinnedCharIds] = useState<string[]>([]);

  // WeChat Advanced States
  const [userPersonas, setUserPersonas] = useState<UserProfile[]>([
    {
      name: 'Yenjunun',
      avatar: 'https://picsum.photos/seed/yen/200',
      bio: '微信ID: Yenjinun^^',
      signature: 'Stay gold, stay bold.',
    },
    {
      name: 'Luna Mask',
      avatar: 'https://picsum.photos/seed/lunap/200',
      bio: '微信ID: moon_luna',
      signature: 'Stars tell the truth.',
    }
  ]);
  const [activePersonaIdx, setActivePersonaIdx] = useState(0);

  const [stickerGroups, setStickerGroups] = useState([
    { id: '1', name: '经典萌萌', stickers: ['https://picsum.photos/seed/s1/100', 'https://picsum.photos/seed/s2/100'] },
    { id: '2', name: '搞怪黑白', stickers: ['https://picsum.photos/seed/s3/100'] }
  ]);

  const [walletData, setWalletData] = useState({
    balance: 88.88,
    history: [
      { id: '1', type: '收款', amount: 100, date: '2026-04-18', label: '好友转账' },
      { id: '2', type: '支付', amount: -11.12, date: '2026-04-17', label: '在线支付' }
    ]
  });

  const [moments, setMoments] = useState([
    {
      id: '1',
      userId: 'system-1',
      userName: 'Luna',
      userAvatar: 'https://picsum.photos/seed/luna/200',
      content: 'The solar eclipse was beautiful today. 🌘',
      images: ['https://picsum.photos/seed/eclipse/400'],
      likes: ['Explorer'],
      comments: [{ userName: 'Explorer', text: 'Stunning!' }],
      timestamp: Date.now() - 3600000,
    }
  ]);

  const [homeImages, setHomeImages] = useState({
    profile: 'https://picsum.photos/seed/user/200',
    diary1: 'https://picsum.photos/seed/diary1/200',
    diary2: 'https://picsum.photos/seed/diary2/200',
    large: 'https://picsum.photos/seed/face1/400',
  });

  const [customWallpaper, setCustomWallpaper] = useState<string | null>(null);
  
  const [appConfigs, setAppConfigs] = useState<Record<string, { name: string, icon: string | null, color: string }>>({
    chat: { name: '通讯录', icon: null, color: 'bg-white/60' },
    worldBook: { name: '世界书', icon: null, color: 'bg-white/60' },
    themes: { name: '美化', icon: null, color: 'bg-white/60' },
    settings: { name: '设置', icon: null, color: 'bg-white/60' },
    instagram: { name: '韩系中心', icon: null, color: 'bg-white/10' },
    addChar: { name: '聊天', icon: null, color: 'bg-green-500' },
  });

  const [systemConfig, setSystemConfig] = useState({
    font: 'PingFang SC',
    showStatusBar: true,
    messageSound: 'Default',
    callSound: 'Melody',
  });

  const [widgetTitles, setWidgetTitles] = useState({
    diaryTop: '日記の第一ページ',
    diaryBottom: 'iScreen',
    largeBottom: 'iGallery',
  });

  const [customFontUrl, setCustomFontUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ type: 'home' | 'wallpaper' | 'appIcon' | 'font', key?: string } | null>(null);

  const triggerUpload = (type: 'home' | 'wallpaper' | 'appIcon' | 'font', key?: string) => {
    setUploadTarget({ type, key });
    if (fileInputRef.current) {
      if (type === 'font') {
        fileInputRef.current.accept = '.ttf,.otf,.woff,.woff2';
      } else {
        fileInputRef.current.accept = 'image/*';
      }
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (uploadTarget.type === 'home' && uploadTarget.key) {
          setHomeImages(prev => ({ ...prev, [uploadTarget.key!]: result }));
        } else if (uploadTarget.type === 'wallpaper') {
          setCustomWallpaper(result);
        } else if (uploadTarget.type === 'appIcon' && uploadTarget.key) {
          setAppConfigs(prev => ({
            ...prev,
            [uploadTarget.key!]: { ...prev[uploadTarget.key!], icon: result }
          }));
        } else if (uploadTarget.type === 'font') {
          setCustomFontUrl(result);
          setSystemConfig(prev => ({ ...prev, font: 'CustomUploadFont' }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (appName: string) => setActiveApp(appName);
  const closeApp = () => {
    setActiveApp(null);
    setSelectedCharId(null);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark': return 'bg-zinc-950 text-white';
      case 'oled': return 'bg-black text-white';
      case 'light': return 'bg-white text-zinc-900';
      case 'glass': return 'bg-white/10 backdrop-blur-3xl text-white';
      case 'minimal': return 'bg-white/70 backdrop-blur-md text-[#2d3436]';
      default: return 'bg-zinc-900 text-white';
    }
  };

  const getStatusBarTextClass = () => {
    if (theme === 'light' || theme === 'minimal') return 'text-zinc-800';
    return 'text-white';
  };

  return (
    <div className={`fixed inset-0 overflow-hidden font-sans select-none flex items-center justify-center ${theme === 'light' || theme === 'minimal' ? 'bg-zinc-200' : 'bg-black'}`}>
      {/* Custom Font Support */}
      {customFontUrl && (
        <style dangerouslySetInnerHTML={{ __html: `
          @font-face {
            font-family: 'CustomUploadFont';
            src: url(${customFontUrl});
          }
        `}} />
      )}
      {/* Mobile Frame (Virtual) */}
      <div className={`relative w-full max-w-[380px] h-full max-h-[740px] overflow-hidden shadow-2xl transition-all duration-500 rounded-[40px] ${theme === 'light' || theme === 'minimal' ? 'bg-zinc-50' : 'bg-zinc-900'}`}>
        
        {/* Wallpaper */}
        <div className="absolute inset-0 z-0">
          {customWallpaper ? (
            <img src={customWallpaper} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : theme === 'minimal' ? (
            <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }} />
          ) : (
            <img 
              src={`https://picsum.photos/seed/${theme}mobile/1080/1920`} 
              alt="Wallpaper" 
              className="w-full h-full object-cover brightness-75 scale-105"
              referrerPolicy="no-referrer"
            />
          )}
          {theme === 'glass' && <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />}
        </div>

        {/* Status Bar */}
        {systemConfig.showStatusBar && (
          <div className={`relative z-50 flex items-center justify-between px-6 pt-4 pb-2 text-[14px] font-bold drop-shadow-sm ${getStatusBarTextClass()}`}>
            <div className="flex items-center gap-1.5">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              <div className="text-red-500 scale-75">♥</div>
            </div>
            <div className="flex items-center gap-1.5 opacity-90">
              <Signal size={12} strokeWidth={3} />
              <Wifi size={12} strokeWidth={3} />
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black">5</span>
                <div className="w-6 h-3 border-2 border-current rounded-[2px] relative flex items-center px-[1px]">
                  <div className="h-full w-2/3 bg-current rounded-[1px]" />
                  <div className="absolute right-[-3.5px] top-[1.5px] w-[2px] h-[4px] bg-current rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Areas */}
        <div className="relative z-10 w-full h-[calc(100%-40px)]" style={{ fontFamily: systemConfig.font === 'CustomUploadFont' ? 'CustomUploadFont' : systemConfig.font }}>
          
          <AnimatePresence mode="wait">
            {!activeApp ? (
              <HomeScreen 
                openApp={openApp} 
                theme={theme}
                homeImages={homeImages}
                changeHomeImage={triggerUpload}
                appConfigs={appConfigs}
                widgetTitles={widgetTitles}
              />
            ) : (
              <motion.div
                initial={{ y: '100%', opacity: 0.5 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0.5 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`absolute inset-0 z-40 ${getThemeClasses()}`}
              >
                <AppRunner 
                  appName={activeApp} 
                  closeApp={closeApp}
                  characters={characters}
                  setCharacters={setCharacters}
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                  worldBook={worldBook}
                  setWorldBook={setWorldBook}
                  messages={messages}
                  setMessages={setMessages}
                  settings={settings}
                  setSettings={setSettings}
                  theme={theme}
                  setTheme={setTheme}
                  selectedCharId={selectedCharId}
                  setSelectedCharId={setSelectedCharId}
                  triggerUpload={triggerUpload}
                  appConfigs={appConfigs}
                  setAppConfigs={setAppConfigs}
                  systemConfig={systemConfig}
                  setSystemConfig={setSystemConfig}
                  customWallpaper={customWallpaper}
                  setCustomWallpaper={setCustomWallpaper}
                  widgetTitles={widgetTitles}
                  setWidgetTitles={setWidgetTitles}
                  pinnedCharIds={pinnedCharIds}
                  setPinnedCharIds={setPinnedCharIds}
                  userPersonas={userPersonas}
                  setUserPersonas={setUserPersonas}
                  activePersonaIdx={activePersonaIdx}
                  setActivePersonaIdx={setActivePersonaIdx}
                  stickerGroups={stickerGroups}
                  setStickerGroups={setStickerGroups}
                  walletData={walletData}
                  setWalletData={setWalletData}
                  moments={moments}
                  setMoments={setMoments}
                  openApp={openApp}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/30 rounded-full z-50 cursor-pointer hover:bg-white/50 transition-colors" onClick={closeApp} />
        </div>
      </div>

      {/* Hidden File Input for Image Uploads */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}

function HomeScreen({ openApp, theme, homeImages, changeHomeImage, appConfigs, widgetTitles }: { 
  openApp: (app: string) => void, 
  theme: string,
  homeImages: any,
  changeHomeImage: (type: 'home' | 'wallpaper' | 'appIcon' | 'font', key?: string) => void,
  appConfigs: any,
  widgetTitles: any
}) {
  const formatDate = () => {
    const d = new Date();
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const shortDays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    return {
      date: `${d.getMonth() + 1}月${d.getDate()}日`,
      day: days[d.getDay()],
      shortDay: shortDays[d.getDay()]
    };
  };

  const { date, day, shortDay } = formatDate();

  // If theme is not minimal, use the old layout
  if (theme !== 'minimal') {
    const mainApps = [
      { id: 'chat', name: 'Chat', icon: APP_ICONS.chat, color: 'bg-green-500' },
      { id: 'worldBook', name: 'World', icon: APP_ICONS.worldBook, color: 'bg-orange-500' },
      { id: 'settings', name: 'Settings', icon: APP_ICONS.settings, color: 'bg-zinc-600' },
      { id: 'themes', name: 'Design', icon: APP_ICONS.themes, color: 'bg-purple-500' },
    ];

    const dockApps = [
      { id: 'addChar', name: 'Add Char', icon: APP_ICONS.addChar, color: 'bg-blue-500' },
      { id: 'profile', name: 'Profile', icon: APP_ICONS.profile, color: 'bg-zinc-100 text-zinc-900' },
    ];

    return (
      <div className="w-full h-full flex flex-col pt-12">
        <div className="grid grid-cols-4 gap-x-6 gap-y-8 px-6">
          {mainApps.map(app => (
            <button key={app.id} onClick={() => openApp(app.id)} className="flex flex-col items-center gap-2 group active:scale-90 transition-transform">
              <div className={`w-[64px] h-[64px] ${app.color} rounded-[16px] flex items-center justify-center shadow-md backdrop-blur-lg group-hover:brightness-105 transition-all`}>
                <app.icon size={30} color={app.color.includes('zinc-100') ? '#18181b' : 'white'} />
              </div>
              <span className="text-[12px] font-medium text-white drop-shadow-md">{app.name}</span>
            </button>
          ))}
        </div>
        <div className="mt-auto mb-4 px-4">
          <div className="bg-white/20 h-auto rounded-[36px] backdrop-blur-2xl flex justify-around items-center p-4 shadow-xl border border-white/10">
            {dockApps.map(app => (
              <button key={app.id} onClick={() => openApp(app.id)} className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform">
                <div className={`w-[64px] h-[64px] ${app.color} rounded-[16px] flex items-center justify-center shadow-md active:scale-95 transition-all`}>
                  <app.icon size={28} color={app.color.includes('zinc-100') ? '#18181b' : 'white'} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- MINIMAL AESTHETIC LAYOUT ---
  return (
    <div className="w-full h-full flex flex-col p-4 relative text-[#2d3436]">
      {/* Background Stars Overlay */}
      <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-20" style={{ 
          background: 'transparent',
          backgroundImage: 'radial-gradient(circle, #888 1.5px, transparent 1.5px)',
          backgroundSize: '50px 50px'
        }} />
        {/* Random decorative stars based on image */}
        <div className="absolute top-[15%] left-[10%] text-zinc-300 text-xl opacity-40 select-none">★</div>
        <div className="absolute top-[8%] left-[45%] text-zinc-300 text-sm opacity-40 select-none">★</div>
        <div className="absolute top-[20%] right-[15%] text-zinc-300 text-lg opacity-40 select-none">★</div>
        <div className="absolute top-[40%] left-[5%] text-zinc-300 text-xs opacity-40 select-none">★</div>
        <div className="absolute top-[60%] right-[5%] text-zinc-300 text-sm opacity-40 select-none">★</div>
        <div className="absolute bottom-[25%] left-[20%] text-zinc-300 text-lg opacity-40 select-none">★</div>
        <div className="absolute bottom-[20%] right-[25%] text-zinc-300 text-sm opacity-40 select-none">★</div>
      </div>

      {/* Top Row: Profile & Photos */}
      <div className="flex gap-4 mb-4">
        {/* Profile Circle - Now changes image instead of opening app */}
        <button onClick={() => changeHomeImage('home', 'profile')} className="flex flex-col items-center gap-1 active:scale-95 transition-all">
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden">
            <img src={homeImages.profile} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="text-center">
            <div className="text-[14px] font-bold">{shortDay}</div>
            <div className="text-[12px] opacity-70">{date}</div>
          </div>
        </button>

        {/* Dual Photo Widget - Now clickable to change images */}
        <div className="flex-1 flex flex-col items-center gap-1">
           <div className="text-[12px] font-bold opacity-60 self-start ml-2">{widgetTitles.diaryTop}</div>
           <div className="flex gap-2 w-full h-24">
             <img 
               src={homeImages.diary1} 
               onClick={() => changeHomeImage('home', 'diary1')}
               className="flex-1 h-full rounded-2xl object-cover shadow-sm border-2 border-white cursor-pointer active:brightness-90 transition-all" 
               referrerPolicy="no-referrer" 
             />
             <img 
               src={homeImages.diary2} 
               onClick={() => changeHomeImage('home', 'diary2')}
               className="flex-1 h-full rounded-2xl object-cover shadow-sm border-2 border-white cursor-pointer active:brightness-90 transition-all" 
               referrerPolicy="no-referrer" 
             />
           </div>
           <div className="text-[10px] opacity-40 uppercase tracking-widest mt-1">{widgetTitles.diaryBottom}</div>
        </div>
      </div>

      {/* Middle Row: Large Photo & 2x2 Grid */}
      <div className="flex gap-4 mb-4">
        {/* Large Photo - Now changes image instead of opening chat */}
        <div className="flex flex-col items-center gap-1 flex-1">
          <button 
            onClick={() => changeHomeImage('home', 'large')}
            className="w-full aspect-square rounded-[32px] border-4 border-white shadow-md overflow-hidden bg-white/40 active:scale-95 transition-transform"
          >
            <img src={homeImages.large} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </button>
          <div className="text-[10px] opacity-40 uppercase tracking-widest mt-1">{widgetTitles.largeBottom}</div>
        </div>

        {/* Grid of Apps */}
        <div className="flex-1 flex flex-col gap-4 justify-between">
           <div className="grid grid-cols-2 gap-3 h-full">
             {/* Existing Apps */}
             <button onClick={() => openApp('chat')} className="flex flex-col items-center gap-1 active:scale-95 transition-all">
                <div className={`w-full aspect-square ${appConfigs.chat.color} backdrop-blur-lg rounded-2xl shadow-sm border-2 border-white flex items-center justify-center overflow-hidden`}>
                   {appConfigs.chat.icon ? (
                     <img src={appConfigs.chat.icon} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   ) : (
                     <MessageSquare size={24} className="text-green-500" />
                   )}
                </div>
                <div className="text-[11px] font-bold">{appConfigs.chat.name}</div>
             </button>
             <button onClick={() => openApp('worldBook')} className="flex flex-col items-center gap-1 active:scale-95 transition-all">
                <div className={`w-full aspect-square ${appConfigs.worldBook.color} backdrop-blur-lg rounded-2xl shadow-sm border-2 border-white flex items-center justify-center overflow-hidden`}>
                   {appConfigs.worldBook.icon ? (
                     <img src={appConfigs.worldBook.icon} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   ) : (
                     <Book size={24} className="text-orange-500" />
                   )}
                </div>
                <div className="text-[11px] font-bold">{appConfigs.worldBook.name}</div>
             </button>
             <button onClick={() => openApp('themes')} className="flex flex-col items-center gap-1 active:scale-95 transition-all">
                <div className={`w-full aspect-square ${appConfigs.themes.color} backdrop-blur-lg rounded-2xl shadow-sm border-2 border-white flex items-center justify-center overflow-hidden`}>
                   {appConfigs.themes.icon ? (
                     <img src={appConfigs.themes.icon} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   ) : (
                     <Palette size={24} className="text-purple-500" />
                   )}
                </div>
                <div className="text-[11px] font-bold">{appConfigs.themes.name}</div>
             </button>
             <button onClick={() => openApp('settings')} className="flex flex-col items-center gap-1 active:scale-95 transition-all">
                <div className={`w-full aspect-square ${appConfigs.settings.color} backdrop-blur-lg rounded-2xl shadow-sm border-2 border-white flex items-center justify-center overflow-hidden`}>
                   {appConfigs.settings.icon ? (
                     <img src={appConfigs.settings.icon} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   ) : (
                     <Settings size={24} className="text-zinc-600" />
                   )}
                </div>
                <div className="text-[11px] font-bold">{appConfigs.settings.name}</div>
             </button>
           </div>
        </div>
      </div>

      {/* Dock (Placed where the previous bottom row was) */}
      <div className="mt-auto -mx-2 h-24 bg-white/50 backdrop-blur-3xl rounded-[32px] border-4 border-white flex items-center justify-around px-8 shadow-xl">
          <button onClick={() => openApp('addChar')} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <div className={`w-16 h-16 rounded-2xl border-4 border-white shadow-md overflow-hidden ${appConfigs.addChar.color} flex items-center justify-center`}>
              {appConfigs.addChar.icon ? (
                <img src={appConfigs.addChar.icon} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <MessageCircle size={32} className="text-white" />
              )}
            </div>
            <div className="text-[10px] font-bold">{appConfigs.addChar.name}</div>
          </button>
          <button onClick={() => openApp('instagram')} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <div className={`w-16 h-16 rounded-2xl border-2 border-white shadow-md overflow-hidden ${appConfigs.instagram.color} flex items-center justify-center`}>
              {appConfigs.instagram.icon ? (
                 <img src={appConfigs.instagram.icon} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                 <div className="w-full h-full flex items-center justify-center bg-white/20">
                   <Instagram size={32} className="text-pink-500" />
                 </div>
              )}
            </div>
            <div className="text-[10px] font-bold">{appConfigs.instagram.name}</div>
          </button>
      </div>
    </div>
  );
}

// Sub-apps Router
function AppRunner({ appName, ...props }: any) {
  switch (appName) {
    case 'chat': return <CharacterManagerApp {...props} />;
    case 'addChar': return <WeChatApp {...props} />;
    case 'conversation': return <ChatApp {...props} />;
    case 'worldBook': return <WorldBookApp {...props} />;
    case 'themes': return <ThemeApp {...props} />;
    case 'settings': return <SettingsApp {...props} />;
    case 'instagram': return <InstagramProfileApp {...props} />;
    default: return null;
  }
}

// --- APPS IMPLEMENTATION ---

function ChatApp(props: any) {
  const { characters, messages, setMessages, selectedCharId, setSelectedCharId, settings } = props;
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const selectedChar = characters.find((c: any) => c.id === selectedCharId);
  const charMessages = messages.filter((m: any) => m.charId === selectedCharId);

  const handleSend = async () => {
    if (!input.trim() || !selectedCharId || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      charId: selectedCharId,
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev: any) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      if (!settings.geminiKey) throw new Error('API Key missing');
      
      const ai = new GoogleGenAI({ apiKey: settings.geminiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: selectedChar.systemPrompt }] },
          ...charMessages.map((m: any) => ({
            role: m.role,
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: currentInput }] }
        ],
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        charId: selectedCharId,
        role: 'model',
        content: response.text || '...',
        timestamp: Date.now(),
      };
      setMessages((prev: any) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        charId: selectedCharId,
        role: 'model',
        content: "[Error: Check your API settings in the Settings app. Or possibly invalid API Key.]",
        timestamp: Date.now(),
      };
      setMessages((prev: any) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!selectedCharId) {
    return (
      <div className="flex flex-col h-full bg-inherit">
        <header className="p-4 border-b border-white/10 flex items-center gap-3">
          <button onClick={props.closeApp} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Pick a Character</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {characters.map((char: any) => (
            <button 
              key={char.id} 
              onClick={() => setSelectedCharId(char.id)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            >
              <img src={char.avatar} className="w-14 h-14 rounded-full object-cover" referrerPolicy="no-referrer" />
              <div className="text-left">
                <h3 className="font-bold">{char.name}</h3>
                <p className="text-xs text-white/50">{char.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-inherit">
      <header className="p-4 border-b border-white/10 flex items-center gap-4">
        <button onClick={props.closeApp} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <img src={selectedChar.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm border border-white/20" referrerPolicy="no-referrer" />
        <div>
          <h2 className="font-bold">{selectedChar.name}</h2>
          <p className="text-[10px] text-green-400">Online</p>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-start">
          <div className="bg-white/10 rounded-2xl p-3 max-w-[80%] text-sm">
            {selectedChar.greeting}
          </div>
        </div>
        {charMessages.map((m: any) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`${m.role === 'user' ? 'bg-blue-600' : 'bg-white/10'} rounded-2xl p-3 max-w-[85%] text-sm`}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-full px-4 py-2 text-xs opacity-50 animate-pulse">
              Typing...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10 flex gap-2 items-end">
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message..."
          className="flex-1 bg-white/10 rounded-2xl p-3 text-sm outline-none resize-none max-h-32"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button 
          onClick={handleSend}
          disabled={isTyping}
          className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

function WeChatApp({ 
  characters, setCharacters, messages, pinnedCharIds, setPinnedCharIds, userProfile, openApp, closeApp, setSelectedCharId,
  userPersonas, setUserPersonas, activePersonaIdx, setActivePersonaIdx, stickerGroups, setStickerGroups, walletData, setWalletData, 
  moments, setMoments
}: any) {
  const [activeTab, setActiveTab] = useState<'chats' | 'discover' | 'me'>('chats');
  const [subPage, setSubPage] = useState<string | null>(null);
  const activeUser = userPersonas[activePersonaIdx];

  const handleLike = (momentId: string) => {
    setMoments(moments.map((m: any) => {
      if (m.id === momentId) {
        const hasLiked = m.likes.includes(activeUser.name);
        return {
          ...m,
          likes: hasLiked ? m.likes.filter((name: string) => name !== activeUser.name) : [...m.likes, activeUser.name]
        };
      }
      return m;
    }));
  };

  const handleComment = (momentId: string) => {
    const text = prompt('输入评论:');
    if (!text) return;
    setMoments(moments.map((m: any) => {
      if (m.id === momentId) {
        return {
          ...m,
          comments: [...m.comments, { userName: activeUser.name, text }]
        };
      }
      return m;
    }));
  };

  const getLatestMessage = (charId: string) => {
    const charMsgs = messages.filter((m: any) => m.charId === charId);
    if (charMsgs.length === 0) return "[No messages]";
    const last = charMsgs[charMsgs.length - 1];
    return last.content;
  };

  const sortedChars = [...characters].sort((a, b) => {
    const aPinned = pinnedCharIds.includes(a.id);
    const bPinned = pinnedCharIds.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  const enterChat = (id: string) => {
    setSelectedCharId(id);
    openApp('conversation');
  };

  // Sub-navigation handling
  if (subPage === 'personas') return <PersonasPage userPersonas={userPersonas} activePersonaIdx={activePersonaIdx} setActivePersonaIdx={setActivePersonaIdx} onBack={() => setSubPage(null)} />;
  if (subPage === 'stickers') return <StickersPage stickerGroups={stickerGroups} setStickerGroups={setStickerGroups} onBack={() => setSubPage(null)} />;
  if (subPage === 'wallet') return <WalletPage walletData={walletData} setWalletData={setWalletData} onBack={() => setSubPage(null)} />;
  if (subPage === 'favorites') return <FavoritesPage onBack={() => setSubPage(null)} />;
  if (subPage === 'post') return <PostMomentPage activeUser={activeUser} onPost={(content: string, imgs: string[]) => {
    const newMoment = {
      id: Date.now().toString(),
      userId: 'user',
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      content,
      images: imgs,
      likes: [],
      comments: [],
      timestamp: Date.now()
    };
    setMoments([newMoment, ...moments]);
    setSubPage(null);
  }} onBack={() => setSubPage(null)} />;

  return (
    <div className="flex flex-col h-full bg-[#f7f7f7] text-black">
      {/* Dynamic Header */}
      {activeTab !== 'me' && (
        <header className="px-4 pt-12 pb-3 bg-[#f7f7f7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
             <button onClick={closeApp} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                <ChevronLeft size={22} className="text-zinc-600" />
             </button>
             <h1 className="text-[17px] font-bold">
               {activeTab === 'chats' ? `WeChat (${characters.length})` : 'Discover'}
             </h1>
          </div>
          <div className="flex items-center gap-4">
             <Search size={20} className="text-zinc-700" />
             {activeTab === 'discover' ? (
               <Plus size={22} className="text-zinc-700 cursor-pointer" onClick={() => setSubPage('post')} />
             ) : (
               <Plus size={22} className="text-zinc-700" />
             )}
          </div>
        </header>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'chats' && (
          <div className="bg-white">
            {sortedChars.map((char: any) => {
              const isPinned = pinnedCharIds.includes(char.id);
              return (
                <div 
                  key={char.id}
                  onClick={() => enterChat(char.id)}
                  onContextMenu={(e) => { 
                    e.preventDefault(); 
                    setPinnedCharIds((prev: string[]) => 
                      prev.includes(char.id) ? prev.filter(p => p !== char.id) : [...prev, char.id]
                    );
                  }}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-zinc-100 active:bg-zinc-200 transition-colors cursor-pointer ${isPinned ? 'bg-[#f7f7f7]' : 'bg-white'}`}
                >
                  <div className="relative">
                    <img src={char.avatar} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    {isPinned && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-zinc-300 rounded-bl-lg transform translate-x-1.5 -translate-y-1.5 rotate-45" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[16px] truncate">{char.name}</h3>
                      <span className="text-[11px] text-zinc-400">Yesterday</span>
                    </div>
                    <p className="text-[13px] text-zinc-400 truncate mt-0.5">
                      {getLatestMessage(char.id)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="bg-white min-h-full pb-20">
            {/* Cover and User Info */}
            <div className="relative h-64 w-full bg-[#333] mb-12">
              <img src="https://picsum.photos/seed/wechatcover/800/600" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
              <div className="absolute right-4 -bottom-6 flex items-end gap-3">
                <div className="text-right mb-4">
                  <div className="font-bold text-white drop-shadow-lg text-lg leading-none">{activeUser.name}</div>
                  <div className="text-[11px] text-white/70 drop-shadow-md mt-1">{activeUser.signature}</div>
                </div>
                <img src={activeUser.avatar} className="w-16 h-16 rounded-lg border-2 border-white shadow-lg bg-zinc-100" referrerPolicy="no-referrer" />
              </div>
            </div>
            
            {/* Posts */}
            <div className="px-4 space-y-10">
              {moments.map((m: any) => (
                <div key={m.id} className="flex gap-3">
                  <img src={m.userAvatar} className="w-10 h-10 rounded-lg object-cover shrink-0" referrerPolicy="no-referrer" />
                  <div className="flex-1 space-y-2 border-b border-zinc-200 pb-6">
                    <h4 className="text-[#576b95] font-bold text-[15px]">{m.userName}</h4>
                    <p className="text-[15px] leading-relaxed text-[#111]">{m.content}</p>
                    
                    {m.images && m.images.length > 0 && (
                      <div className={`grid gap-1 pt-1 ${m.images.length === 1 ? 'w-2/3' : 'grid-cols-3'}`}>
                         {m.images.map((img: string, idx: number) => (
                           <img key={idx} src={img} className="aspect-square object-cover rounded-sm w-full" referrerPolicy="no-referrer" />
                         ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[12px] text-zinc-400 pt-3">
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <div className="flex items-center gap-4">
                        <button onClick={() => handleLike(m.id)} className="flex items-center gap-1 group">
                          <ThumbsUp size={16} className={`${m.likes.includes(activeUser.name) ? 'text-[#576b95]' : 'text-zinc-400'} group-active:scale-125 transition-transform`} fill={m.likes.includes(activeUser.name) ? "currentColor" : "none"} />
                        </button>
                        <button onClick={() => handleComment(m.id)} className="flex items-center gap-1">
                          <MessageSquareMore size={16} className="text-zinc-400 hover:text-[#576b95]" />
                        </button>
                      </div>
                    </div>

                    {/* Likes and Comments */}
                    {(m.likes.length > 0 || m.comments.length > 0) && (
                      <div className="mt-3 bg-[#f3f3f5] rounded-sm p-2 text-[13px] relative">
                         <div className="absolute top-[-8px] left-3 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#f3f3f5]" />
                         {m.likes.length > 0 && (
                           <div className="flex items-start gap-1 pb-1 border-b border-zinc-200/50 mb-1">
                              <Heart size={12} className="text-[#576b95] mt-1 shrink-0" fill="currentColor" />
                              <span className="text-[#576b95] font-medium">{m.likes.join(', ')}</span>
                           </div>
                         )}
                         {m.comments.map((c: any, ci: number) => (
                           <div key={ci} className="mb-0.5">
                              <span className="text-[#576b95] font-medium">{c.userName}: </span>
                              <span className="text-[#333]">{c.text}</span>
                           </div>
                         ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'me' && (
          <div className="bg-[#f2f2f2] min-h-full space-y-3 pb-20 p-4 pt-16">
            <h1 className="text-[32px] font-black tracking-tight mb-6 px-2">Profile</h1>
            
            {/* Header Card */}
            <div className="bg-white rounded-[24px] p-6 flex items-center gap-5 shadow-sm border border-zinc-200/50 active:scale-[0.98] transition-transform cursor-pointer" onClick={() => setSubPage('personas')}>
              <img src={activeUser.avatar} className="w-16 h-16 rounded-full object-cover shadow-sm bg-zinc-50 border border-black/5" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#111]">{activeUser.name}</h2>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-zinc-400 text-[13px] font-medium">{activeUser.bio}</span>
                  <ChevronRight size={18} className="text-zinc-300" />
                </div>
              </div>
            </div>

            {/* Menu Groups */}
            <div className="bg-white rounded-[24px] shadow-sm border border-zinc-200/50 overflow-hidden">
              <MeListItem icon={<UserCircle className="text-blue-500" size={20} />} label="我的人设" onClick={() => setSubPage('personas')} />
              <MeListItem icon={<Sticker className="text-orange-500" size={20} />} label="表情包管理" onClick={() => setSubPage('stickers')} />
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-zinc-200/50 overflow-hidden">
              <MeListItem icon={<Wallet className="text-green-500" size={20} />} label="我的钱包" onClick={() => setSubPage('wallet')} />
              <MeListItem icon={<Heart className="text-red-500" size={20} />} label="我的收藏" onClick={() => setSubPage('favorites')} />
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-zinc-200/50 overflow-hidden">
              <MeListItem 
                icon={<Settings className="text-zinc-500" size={20} />} 
                label="Settings" 
                onClick={() => openApp('settings')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Dock */}
      <div className="absolute bottom-2 left-4 right-4 h-16 bg-white/90 backdrop-blur-xl border border-zinc-200 rounded-full flex items-center justify-around px-4 shadow-xl shadow-black/5 z-50">
        <NavButton active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} label="Chat" />
        <NavButton active={activeTab === 'contacts'} onClick={() => openApp('chat')} label="Contacts" />
        <NavButton active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} label="Discover" />
        <NavButton active={activeTab === 'me'} onClick={() => setActiveTab('me')} label="Me" />
      </div>
    </div>
  );
}

function MeListItem({ icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 px-6 py-5 border-b border-zinc-50 active:bg-zinc-50 transition-colors last:border-b-0 group">
      <div className="shrink-0 p-2 bg-zinc-50 rounded-xl group-active:scale-90 transition-transform">{icon}</div>
      <span className="flex-1 text-left text-[16px] font-medium">{label}</span>
      <ChevronRight size={18} className="text-zinc-300" />
    </button>
  );
}

function NavButton({ active, onClick, label }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-1 group">
      <span className={`text-[12px] font-bold transition-all ${active ? 'text-black scale-110' : 'text-zinc-400 group-hover:text-zinc-600'}`}>{label}</span>
      {active && <motion.div layoutId="nav-dot" className="w-6 h-0.5 bg-black rounded-full" />}
    </button>
  );
}

// --- SUB PAGES ---

function PersonasPage({ userPersonas, activePersonaIdx, setActivePersonaIdx, onBack }: any) {
  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] text-black pt-12">
      <header className="px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-black">我的人设库</h2>
      </header>
      <div className="p-6 space-y-4">
        {userPersonas.map((p: any, idx: number) => (
          <div 
            key={idx} 
            onClick={() => { setActivePersonaIdx(idx); onBack(); }}
            className={`bg-white p-4 rounded-[24px] flex items-center gap-4 border shadow-sm transition-all cursor-pointer ${activePersonaIdx === idx ? 'border-zinc-800 ring-2 ring-zinc-800' : 'border-zinc-100'}`}
          >
            <img src={p.avatar} className="w-14 h-14 rounded-full object-cover" />
            <div className="flex-1">
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-xs text-zinc-400 mt-1 italic">"{p.signature}"</p>
            </div>
            {activePersonaIdx === idx && <div className="p-1 px-3 bg-zinc-800 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">Active</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function StickersPage({ stickerGroups, setStickerGroups, onBack }: any) {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const addGroup = () => {
    const name = prompt('输入分组名称:');
    if (!name) return;
    setStickerGroups([...stickerGroups, { id: Date.now().toString(), name, stickers: [] }]);
  };

  const addSticker = (id: string) => {
    const url = `https://picsum.photos/seed/${Date.now()}/200`;
    setStickerGroups(stickerGroups.map(g => g.id === id ? { ...g, stickers: [...g.stickers, url] } : g));
  };

  if (activeGroupId) {
    const group = stickerGroups.find(g => g.id === activeGroupId);
    return (
      <div className="flex flex-col h-full bg-white text-black pt-12">
        <header className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveGroupId(null)} className="p-2 bg-zinc-100 rounded-full"><ChevronLeft size={20} /></button>
            <h2 className="text-xl font-bold">{group?.name}</h2>
          </div>
          <button onClick={() => addSticker(activeGroupId)} className="text-[#576b95] font-bold">添加表情</button>
        </header>
        <div className="p-4 grid grid-cols-4 gap-2">
          {group?.stickers.map((s, i) => <img key={i} src={s} className="w-full aspect-square object-cover rounded-lg bg-zinc-50" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] text-black pt-12">
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><ChevronLeft size={20} /></button>
          <h2 className="text-xl font-black">表情包管理</h2>
        </div>
        <button onClick={addGroup} className="p-2 bg-zinc-800 text-white rounded-full"><Plus size={20} /></button>
      </header>
      <div className="p-6 grid grid-cols-2 gap-4">
        {stickerGroups.map(g => (
          <div key={g.id} onClick={() => setActiveGroupId(g.id)} className="bg-white p-4 rounded-[24px] border border-zinc-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all cursor-pointer">
            <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center overflow-hidden">
               {g.stickers.length > 0 ? <img src={g.stickers[0]} className="w-full h-full object-cover" /> : <ImageIcon className="text-zinc-300" />}
            </div>
            <span className="font-bold text-sm">{g.name}</span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase">{g.stickers.length} Stickers</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WalletPage({ walletData, setWalletData, onBack }: any) {
  const addFunds = () => {
    const amount = prompt('添加金额:');
    if (!amount || isNaN(Number(amount))) return;
    const num = Number(amount);
    setWalletData({
      balance: walletData.balance + num,
      history: [{ id: Date.now().toString(), type: num >= 0 ? '收款' : '支付', amount: num, date: new Date().toISOString().split('T')[0], label: '手动调整' }, ...walletData.history]
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] text-black pt-12">
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><ChevronLeft size={20} /></button>
          <h2 className="text-xl font-black">我的钱包</h2>
        </div>
        <button onClick={addFunds} className="px-4 py-1.5 bg-zinc-800 text-white rounded-full text-xs font-bold tracking-wider">添加</button>
      </header>
      
      <div className="p-10 flex flex-col items-center">
         <div className="p-4 bg-zinc-50 rounded-full mb-4"><CreditCard size={48} className="text-zinc-400" /></div>
         <span className="text-sm font-medium text-zinc-400 uppercase tracking-[0.2em] mb-2">Current Balance</span>
         <div className="text-5xl font-black tracking-tight"><span className="text-2xl mr-1">¥</span>{walletData.balance.toFixed(2)}</div>
      </div>

      <div className="bg-white rounded-t-[40px] flex-1 p-8 shadow-2xl border-t border-zinc-100">
         <div className="flex items-center gap-2 mb-6">
            <History size={16} className="text-zinc-300" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-300">Transaction History</span>
         </div>
         <div className="space-y-6">
            {walletData.history.map((h: any) => (
              <div key={h.id} className="flex items-center justify-between">
                 <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${h.type === '收款' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                       {h.type === '收款' ? '+' : '-'}
                    </div>
                    <div>
                       <div className="font-bold text-sm">{h.label}</div>
                       <div className="text-[10px] text-zinc-400">{h.date} · {h.type}</div>
                    </div>
                 </div>
                 <div className={`font-black ${h.type === '收款' ? 'text-green-600' : 'text-zinc-800'}`}>
                    {h.amount > 0 ? '+' : ''}{h.amount.toFixed(2)}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}

function PostMomentPage({ activeUser, onPost, onBack }: any) {
  const [text, setText] = useState('');
  const handlePost = () => {
    if (!text.trim()) return;
    onPost(text, [`https://picsum.photos/seed/${Date.now()}/400`]);
  };

  return (
    <div className="flex flex-col h-full bg-white text-black pt-12">
      <header className="px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="text-zinc-600">取消</button>
        <button onClick={handlePost} className={`px-4 py-1.5 rounded-md font-bold text-sm ${text.trim() ? 'bg-[#07c160] text-white' : 'bg-zinc-100 text-zinc-300 cursor-not-allowed'}`}>发表</button>
      </header>
      <div className="p-6 space-y-4">
        <textarea 
          autoFocus 
          value={text} 
          onChange={e => setText(e.target.value)}
          placeholder="这一刻的想法..."
          className="w-full text-[17px] leading-relaxed outline-none border-none resize-none h-40"
        />
        <div className="w-24 h-24 bg-zinc-100 flex items-center justify-center text-zinc-300 rounded-sm">
           <Camera size={32} />
        </div>
      </div>
    </div>
  );
}

function FavoritesPage({ onBack }: any) {
  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] text-black pt-12">
      <header className="px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-black">我的收藏</h2>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-4">
         <div className="p-8 bg-zinc-50 rounded-full text-zinc-300">
            <Book size={64} />
         </div>
         <p className="text-zinc-400 font-medium">暂时没有收藏的内容哦</p>
      </div>
    </div>
  );
}

function InstagramProfileApp({ userProfile, closeApp }: any) {
  const [activeTab, setActiveTab] = useState('posts');
  
  const stats = {
    posts: 124,
    followers: '5.2k',
    following: 482
  };

  const dummyPosts = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/insta${i}/400`
  }));

  return (
    <div className="flex flex-col h-full bg-white text-black pt-12">
      {/* Header */}
      <header className="px-5 py-3 flex items-center justify-between border-b border-zinc-50">
        <div className="flex items-center gap-1">
          <button onClick={closeApp} className="p-1 -ml-1 hover:bg-zinc-50 rounded-full transition-colors">
             <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-lg tracking-tight">yuet_studio</span>
        </div>
        <div className="flex items-center gap-5">
          <Plus size={24} strokeWidth={1.5} className="cursor-pointer" />
          <Menu size={24} strokeWidth={1.5} className="cursor-pointer" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {/* Profile Info */}
        <div className="px-5 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                <img 
                  src={userProfile.avatar} 
                  className="w-full h-full rounded-full border-2 border-white object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="flex gap-8 flex-1 justify-center">
              <div className="text-center">
                <div className="font-bold text-lg">{stats.posts}</div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-tighter">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{stats.followers}</div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-tighter">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{stats.following}</div>
                <div className="text-[11px] text-zinc-500 uppercase tracking-tighter">Following</div>
              </div>
            </div>
          </div>

          <div className="space-y-0.5">
            <h1 className="font-bold text-sm tracking-tight">{userProfile.name}</h1>
            <p className="text-[13px] text-zinc-800 leading-snug whitespace-pre-wrap">
              {userProfile.bio || 'Minimalism & Lifestyle'}
            </p>
            <div className="flex items-center gap-1 text-zinc-400 text-[11px] py-1">
              <AtSign size={10} />
              <span>korean_vibe</span>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button className="flex-1 bg-zinc-100 hover:bg-zinc-200 transition-colors py-2 rounded-lg text-sm font-semibold active:scale-95 transition-all">
              Edit Profile
            </button>
            <button className="flex-1 bg-zinc-100 hover:bg-zinc-200 transition-colors py-2 rounded-lg text-sm font-semibold active:scale-95 transition-all">
              Share Profile
            </button>
            <button className="px-2 bg-zinc-100 hover:bg-zinc-200 transition-colors py-2 rounded-lg active:scale-95 transition-all">
              <UserPlus size={18} />
            </button>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="px-5 pb-6 flex gap-4 overflow-x-auto scrollbar-hide">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="w-16 h-16 rounded-full border border-zinc-200 p-0.5">
                <img src={`https://picsum.photos/seed/story${i}/200`} className="w-full h-full rounded-full object-cover grayscale-[0.3]" />
              </div>
              <span className="text-[10px] text-zinc-500 italic">vlog {i}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="w-16 h-16 rounded-full border border-zinc-200 flex items-center justify-center">
              <Plus size={24} className="text-zinc-300" />
            </div>
            <span className="text-[10px] text-zinc-500 italic">New</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-zinc-100">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex-1 flex justify-center py-3 border-t-2 transition-all ${activeTab === 'posts' ? 'border-black text-black' : 'border-transparent text-zinc-400'}`}
          >
            <Grid size={22} strokeWidth={activeTab === 'posts' ? 2 : 1.5} />
          </button>
          <button 
            onClick={() => setActiveTab('reels')}
            className={`flex-1 flex justify-center py-3 border-t-2 transition-all ${activeTab === 'reels' ? 'border-black text-black' : 'border-transparent text-zinc-400'}`}
          >
            <Video size={22} strokeWidth={activeTab === 'reels' ? 2 : 1.5} />
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex justify-center py-3 border-t-2 transition-all ${activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-zinc-400'}`}
          >
            <Bookmark size={22} strokeWidth={activeTab === 'saved' ? 2 : 1.5} />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-0.5">
          {dummyPosts.map(post => (
            <div key={post.id} className="aspect-square bg-zinc-100 overflow-hidden">
              <img src={post.url} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CharacterManagerApp({ characters, setCharacters, closeApp }: any) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [setting, setSetting] = useState('');
  const [avatar, setAvatar] = useState('https://picsum.photos/seed/newchar/200');

  const groups = ['哥哥', '傅', '11', '江'];

  const handleAdd = () => {
    if (!name) return;
    const newChar: Character = {
      id: Date.now().toString(),
      name,
      avatar,
      description: group,
      systemPrompt: setting,
      greeting: `Hello, I am ${name}.`,
    };
    setCharacters((prev: any) => [...prev, newChar]);
    setShowForm(false);
    setName('');
    setGroup('');
    setSetting('');
  };

  const removeChar = (id: string, e: any) => {
    e.stopPropagation();
    setCharacters((prev: any) => prev.filter((c: any) => c.id !== id));
  };

  if (showForm) {
    return (
      <div className="flex flex-col h-full bg-[#f9f9f9] text-[#333]">
        {/* New Contact Form Header */}
        <header className="px-6 py-8 flex items-center justify-between text-[15px]">
          <button onClick={() => setShowForm(false)} className="text-[#888]">取消</button>
          <h2 className="text-[#222] font-serif tracking-tight">New Contact</h2>
          <button onClick={handleAdd} className="font-bold text-[#222]">添加</button>
        </header>

        {/* Form Body */}
        <div className="px-8 flex-1 overflow-y-auto no-scrollbar pb-10">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5 flex flex-col items-center">
            {/* Profile Photo Area */}
            <div className="mb-10 flex flex-col items-center gap-4">
               <div className="w-28 h-28 border-[1.5px] border-dashed border-zinc-200 rounded-[32px] flex items-center justify-center p-2">
                 <img src={avatar} className="w-full h-full object-cover rounded-[24px]" />
               </div>
               <span className="text-[10px] text-[#bbb] uppercase tracking-[0.2em] font-sans">Profile Photo</span>
            </div>

            {/* Inputs */}
            <div className="w-full space-y-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#ccc] uppercase tracking-wider font-sans">Name / 名字</label>
                <input 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="输入名字"
                  className="w-full border-b border-zinc-100 pb-3 text-[15px] outline-none placeholder:text-[#ddd] focus:border-zinc-300 transition-colors"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#ccc] uppercase tracking-wider font-sans">Group / 分组</label>
                <input 
                  value={group}
                  onChange={e => setGroup(e.target.value)}
                  placeholder="输入分组名称(可选)"
                  className="w-full border-b border-zinc-100 pb-3 text-[15px] outline-none placeholder:text-[#ddd] focus:border-zinc-300 transition-colors"
                />
                <div className="flex gap-2 pt-2">
                  {groups.map(g => (
                    <button 
                      key={g} 
                      onClick={() => setGroup(g)}
                      className={`px-4 py-1.5 rounded-full text-[12px] bg-[#f0f0f5] text-[#888] active:scale-95 transition-all ${group === g ? 'bg-zinc-800 text-white' : ''}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-[#ccc] uppercase tracking-wider font-sans">Setting / 设定</label>
                <textarea 
                  value={setting}
                  onChange={e => setSetting(e.target.value)}
                  placeholder="输入角色设定..."
                  className="w-full min-h-[120px] text-[14px] leading-relaxed outline-none border-none placeholder:text-[#ddd] resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] text-[#333]">
      <header className="px-6 pt-10 pb-6 flex items-center justify-between">
        <button onClick={closeApp} className="p-1 hover:bg-black/5 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-widest">Contacts</h1>
        <button onClick={() => setShowForm(true)} className="p-1 bg-black text-white rounded-full">
           <Plus size={20} />
        </button>
      </header>
      
      <div className="flex-1 px-6 space-y-4 overflow-y-auto pb-10">
        {characters.map((char: any) => (
          <div key={char.id} className="bg-white rounded-[24px] p-4 flex items-center gap-4 border border-black/5 shadow-sm active:scale-[0.98] transition-all group">
            <img src={char.avatar} className="w-14 h-14 rounded-2xl object-cover" />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{char.name}</h3>
              <p className="text-[11px] text-[#aaa] font-bold uppercase tracking-wide">{char.description || 'General'}</p>
            </div>
            <button 
              onClick={(e) => removeChar(char.id, e)}
              className="p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {characters.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-[#ddd]">
            <Users size={48} className="mb-2" />
            <p className="text-sm font-bold uppercase">No characters yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddCharApp() { return null; }

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className="flex-1 flex flex-col items-center justify-center gap-0.5">
      <div className={active ? 'text-[#07c160]' : 'text-zinc-500'}>
        {icon}
      </div>
      <span className={`text-[10px] ${active ? 'text-[#07c160]' : 'text-zinc-500'}`}>{label}</span>
    </button>
  );
}

function MeItem({ icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 px-6 py-4 border-b border-zinc-50 active:bg-zinc-50 transition-colors last:border-b-0">
      <div className="shrink-0">{icon}</div>
      <span className="flex-1 text-left text-[16px]">{label}</span>
      <ChevronLeft size={16} className="rotate-180 opacity-20 shrink-0" />
    </button>
  );
}

function ProfileApp({ userProfile, setUserProfile, closeApp }: any) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);

  return (
    <div className="flex flex-col h-full bg-inherit">
      <div className="h-48 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-end px-6 pb-6 relative">
        <button onClick={closeApp} className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white border border-white/20 active:scale-90 transition-transform">
           <ChevronLeft size={20} />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          {editing ? (
            <button onClick={() => { setUserProfile(formData); setEditing(false); }} className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">Save</button>
          ) : (
            <button onClick={() => setEditing(true)} className="bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/20">Edit</button>
          )}
        </div>
        <div className="relative">
          <img src={userProfile.avatar} className="w-24 h-24 rounded-3xl border-4 border-zinc-900 shadow-xl" />
          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700">
            <Camera size={14} />
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-8">
        <div className="space-y-1">
          {editing ? (
            <input 
              value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/10 text-2xl font-bold w-full p-2 rounded-lg"
            />
          ) : (
            <h1 className="text-3xl font-bold">{userProfile.name}</h1>
          )}
          <p className="text-sm opacity-50">@user_unique_id</p>
        </div>

        <div className="space-y-4">
          <h3 className="uppercase text-[10px] font-bold tracking-widest opacity-40">Bio</h3>
          {editing ? (
            <textarea 
              value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="bg-white/10 w-full p-3 rounded-xl min-h-[100px]"
            />
          ) : (
            <p className="text-sm leading-relaxed">{userProfile.bio}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
            <div className="text-xl font-bold">12</div>
            <div className="text-[10px] opacity-40 uppercase">Chats</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
            <div className="text-xl font-bold">4</div>
            <div className="text-[10px] opacity-40 uppercase">Personas</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl text-center border border-white/5">
            <div className="text-xl font-bold">8</div>
            <div className="text-[10px] opacity-40 uppercase">Badges</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorldBookApp({ worldBook, setWorldBook, closeApp }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addEntry = () => {
    if (!title || !content) return;
    setWorldBook((prev: any) => [...prev, { id: Date.now().toString(), title, content, category: 'General' }]);
    setIsAdding(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="flex flex-col h-full bg-inherit">
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={closeApp} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">World Book</h1>
            <p className="text-xs opacity-50">Global lore and background</p>
          </div>
        </div>
        <Plus onClick={() => setIsAdding(true)} className="cursor-pointer" />
      </header>

      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-20">
        {worldBook.map((entry: any) => (
          <div key={entry.id} className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{entry.title}</h3>
              <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full opacity-60">{entry.category}</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">{entry.content}</p>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
            <div className="relative bg-zinc-900 border border-white/10 w-full max-w-sm rounded-[32px] p-8 space-y-4 shadow-2xl overflow-hidden">
              <h2 className="text-xl font-bold">New Lore Entry</h2>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full bg-white/5 rounded-xl p-4 border border-white/10 outline-none" />
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Entry details..." className="w-full bg-white/5 rounded-xl p-4 border border-white/10 h-40 outline-none" />
              <button onClick={addEntry} className="w-full bg-orange-500 rounded-xl p-4 font-bold shadow-lg active:scale-95 transition-all">Save Entry</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThemeApp({ 
  theme, setTheme, closeApp, triggerUpload, appConfigs, setAppConfigs, systemConfig, setSystemConfig, customWallpaper, setCustomWallpaper, widgetTitles, setWidgetTitles 
}: any) {
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  const fonts = [
    { name: 'Default', value: 'PingFang SC, sans-serif' },
    { name: 'Serif', value: 'Georgia, serif' },
    { name: 'Mono', value: 'ui-monospace, monospace' },
    { name: 'Rounded', value: 'ui-rounded, sans-serif' },
  ];

  const sounds = ['Default', 'Melody', 'Crystal', 'Retro', 'None'];

  return (
    <div className="p-6 space-y-10 h-full overflow-y-auto pb-20 no-scrollbar">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={closeApp} className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0">
           <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Aesthetic Studio</h1>
          <p className="text-sm opacity-50 font-medium">Customize your digital world</p>
        </div>
      </div>

      {/* SECTION 1: WALLPAPER & WIDGET TITLES */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Palette size={20} className="text-blue-500" />
          <h2 className="text-xl font-bold">主页壁纸区</h2>
        </div>
        
        <div className="space-y-4">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border-2 border-white shadow-lg group">
            {customWallpaper ? (
              <img src={customWallpaper} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-sm opacity-50">No Custom Wallpaper</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button 
                onClick={() => triggerUpload('wallpaper')}
                className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-xl active:scale-95 transition-transform"
              >
                修改壁纸
              </button>
            </div>
          </div>

          {/* Widget Title Editors */}
          <div className="space-y-3 bg-white/5 p-5 rounded-3xl border border-white/5">
            <h3 className="text-xs uppercase font-black opacity-30 tracking-widest mb-2">组件文字定制</h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] opacity-40 font-bold ml-1">双图挂件上方标题</label>
                <input 
                  value={widgetTitles.diaryTop}
                  onChange={(e) => setWidgetTitles((prev: any) => ({ ...prev, diaryTop: e.target.value }))}
                  className="w-full bg-white/5 rounded-xl px-4 py-2 text-sm border border-white/10 outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] opacity-40 font-bold ml-1">双图挂件下方标题</label>
                <input 
                  value={widgetTitles.diaryBottom}
                  onChange={(e) => setWidgetTitles((prev: any) => ({ ...prev, diaryBottom: e.target.value }))}
                  className="w-full bg-white/5 rounded-xl px-4 py-2 text-sm border border-white/10 outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] opacity-40 font-bold ml-1">超大图片下方标题</label>
                <input 
                  value={widgetTitles.largeBottom}
                  onChange={(e) => setWidgetTitles((prev: any) => ({ ...prev, largeBottom: e.target.value }))}
                  className="w-full bg-white/5 rounded-xl px-4 py-2 text-sm border border-white/10 outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: APP ICONS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare size={20} className="text-green-500" />
          <h2 className="text-xl font-bold">APP 图标区</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(appConfigs).map(([id, config]: [string, any]) => (
            <div key={id} className="bg-white/5 rounded-[24px] p-4 border border-white/5 space-y-4">
              <div className="flex items-center gap-4">
                {/* Icon Change */}
                <button 
                  onClick={() => triggerUpload('appIcon', id)}
                  className={`w-14 h-14 rounded-2xl ${config.color} border-2 border-white shadow-md flex items-center justify-center shrink-0 overflow-hidden active:scale-90 transition-transform relative group`}
                >
                  {config.icon ? (
                    <img src={config.icon} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    createElement(APP_ICONS[id as keyof typeof APP_ICONS], { size: 24, className: 'opacity-60' })
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={16} className="text-white" />
                  </div>
                </button>
                
                {/* Name */}
                <div className="flex-1">
                  <input 
                    value={config.name}
                    onChange={(e) => setAppConfigs((prev: any) => ({
                      ...prev,
                      [id]: { ...prev[id], name: e.target.value }
                    }))}
                    className="w-full bg-white/5 rounded-xl px-4 py-2 text-sm font-bold border border-white/10 outline-none focus:border-blue-500/50"
                    placeholder="App Name"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: SYSTEM */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings size={20} className="text-zinc-500" />
          <h2 className="text-xl font-bold">系统区</h2>
        </div>

        {/* Font Selection & Upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Type size={14} className="opacity-40" />
              <label className="text-xs uppercase font-bold opacity-40">文字字体</label>
            </div>
            <button 
              onClick={() => triggerUpload('font')}
              className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-black border border-blue-500/20 active:scale-95 transition-all"
            >
              上传字体文件
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {fonts.map(f => (
              <button 
                key={f.value}
                onClick={() => setSystemConfig((prev: any) => ({ ...prev, font: f.value }))}
                className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${systemConfig.font === f.value ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-white/5'}`}
                style={{ fontFamily: f.value }}
              >
                {f.name}
              </button>
            ))}
            {systemConfig.font === 'CustomUploadFont' && (
              <button 
                className="p-3 rounded-xl border-2 text-xs font-bold border-blue-500 bg-blue-500/10 col-span-2"
                style={{ fontFamily: 'CustomUploadFont' }}
              >
                已启用自定义字体
              </button>
            )}
          </div>
        </div>

        {/* Status Bar Toggle */}
        <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              {systemConfig.showStatusBar ? <Eye size={18} className="text-blue-500" /> : <EyeOff size={18} className="text-zinc-500" />}
            </div>
            <span className="font-bold">显示状态栏</span>
          </div>
          <button 
            onClick={() => setSystemConfig((prev: any) => ({ ...prev, showStatusBar: !prev.showStatusBar }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${systemConfig.showStatusBar ? 'bg-blue-500' : 'bg-zinc-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${systemConfig.showStatusBar ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

        {/* Audio Settings */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Bell size={14} className="opacity-40" />
                <label className="text-xs uppercase font-bold opacity-40">消息提示音</label>
              </div>
              <span className="text-[10px] opacity-40">{systemConfig.messageSound}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {sounds.map(s => (
                <button 
                  key={s}
                  onClick={() => setSystemConfig((prev: any) => ({ ...prev, messageSound: s }))}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold shrink-0 border border-white/10 transition-all ${systemConfig.messageSound === s ? 'bg-zinc-100 text-black' : 'bg-white/5 text-zinc-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Volume2 size={14} className="opacity-40" />
                <label className="text-xs uppercase font-bold opacity-40">来电音效</label>
              </div>
              <span className="text-[10px] opacity-40">{systemConfig.callSound}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {sounds.map(s => (
                <button 
                  key={s}
                  onClick={() => setSystemConfig((prev: any) => ({ ...prev, callSound: s }))}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold shrink-0 border border-white/10 transition-all ${systemConfig.callSound === s ? 'bg-zinc-100 text-black' : 'bg-white/5 text-zinc-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="pt-4 text-center">
        <p className="text-[10px] opacity-20 uppercase tracking-[0.2em]">Designed for PersonaHub OS</p>
      </div>
    </div>
  );
}

function SettingsApp({ settings, setSettings, closeApp }: any) {
  return (
    <div className="p-8 space-y-8 h-full flex flex-col">
       <div className="flex items-center gap-4">
        <button onClick={closeApp} className="p-2 hover:bg-white/10 rounded-full transition-colors">
           <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-sm opacity-50">Configure your connection</p>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-xs uppercase font-bold opacity-40 ml-1">Gemini API Key</label>
          <input 
            type="password"
            value={settings.geminiKey}
            onChange={e => setSettings({ ...settings, geminiKey: e.target.value })}
            placeholder="Enter API Key"
            className="w-full bg-white/10 rounded-2xl p-4 border border-white/10 focus:border-blue-500 transition-colors outline-none"
          />
          <p className="text-[10px] opacity-40 ml-1">Used locally in your browser.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold opacity-40 ml-1">Custom API URL (Optional)</label>
          <input 
            value={settings.geminiUrl}
            onChange={e => setSettings({ ...settings, geminiUrl: e.target.value })}
            placeholder="https://..."
            className="w-full bg-white/10 rounded-2xl p-4 border border-white/10 focus:border-blue-500 transition-colors outline-none"
          />
        </div>

        <div className="pt-4">
          <div className="p-5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
            <h4 className="text-yellow-400 font-bold text-sm mb-1">Notice</h4>
            <p className="text-[11px] text-yellow-200/60 leading-relaxed">
              Ensure you have a Gemini API key from Google AI Studio. 
              Leave URL blank for default.
            </p>
          </div>
        </div>
      </div>

      <div className="pb-8 text-center">
        <p className="text-[10px] opacity-30">PersonaHub OS v1.0.4</p>
      </div>
    </div>
  );
}
