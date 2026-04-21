import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  Trophy, 
  Activity, 
  User, 
  Search, 
  MapPin, 
  Calendar, 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Bell,
  Plus,
  Zap,
  Clock,
  CheckCircle2,
  Check,
  AlertCircle,
  AlertTriangle,
  Wallet,
  Share2,
  MessageCircle,
  Filter,
  UserCheck,
  Users,
  LayoutGrid,
  List,
  ArrowRight,
  ArrowUpRight,
  Info,
  FileText,
  Phone,
  Settings,
  LogOut,
  Ticket,
  Award,
  Smartphone,
  Pencil,
  FileBadge,
  MoreHorizontal,
  Star,
  Flame,
  Medal,
  Target,
  Shield,
  Navigation,
  PhoneCall,
  Map as MapIcon,
  CreditCard,
  Users2,
  MessageSquare,
  Volume2,
  Download,
  QrCode,
  ClipboardList,
  Timer,
  Hourglass,
  MessageCircleMore,
  Send,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Camera,
  Sparkles,
  Building2,
  Heart,
  X,
  Circle,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { cn } from './types';

const MOCK_PLAYER_POOL: ParticipantInfo[] = [
  { name: '王小虎', phone: '13811112222', idType: 'ID_CARD', idNumber: '350101199505201234', gender: 'MALE', birthDate: '1995-05-20', clothingSize: 'L', photo: 'https://picsum.photos/seed/user1/200/300', position: '经理', isLeader: false },
  { name: '林小鹿', phone: '13922223333', idType: 'ID_CARD', idNumber: '350202199808155678', gender: 'FEMALE', birthDate: '1998-08-15', clothingSize: 'M', photo: 'https://picsum.photos/seed/user2/200/300', position: '职员', isLeader: false },
  { name: '陈大龙', phone: '13733334444', idType: 'ID_CARD', idNumber: '350303199212109012', gender: 'MALE', birthDate: '1992-12-10', clothingSize: 'XL', photo: 'https://picsum.photos/seed/user3/200/300', position: '主管', isLeader: false },
  { name: '张美美', phone: '13544445555', idType: 'ID_CARD', idNumber: '350404199606201234', gender: 'FEMALE', birthDate: '1996-06-20', clothingSize: 'S', photo: 'https://picsum.photos/seed/user4/200/300', tags: ['领导', '状元'], position: '总经理', isLeader: true },
  { name: '李晓芳', phone: '13655556666', idType: 'ID_CARD', idNumber: '350505199404105678', gender: 'FEMALE', birthDate: '1994-04-10', clothingSize: 'M', photo: 'https://picsum.photos/seed/user5/200/300', position: '财务', isLeader: false }
];

const MOCK_MATCH_DETAILS: Record<string, any> = {
  '男团1001': {
    code: '男团1001',
    teamA: '翔骏羽队',
    teamB: '友巨集团',
    scoreA: 72,
    scoreB: 45,
    subMatches: [
      { order: '第1场男双 90+', playersA: ['罗广立', '顾海滨'], scoresA: [52, 53], playersB: ['赖尊文', '沈志勇'], scoresB: [48, 48], subScore: '74:70', time: '14:30' },
      { order: '第2场混双', playersA: ['陈晓娟', '张智敏'], scoresA: [33], playersB: ['许敏才', '张铁凡'], scoresB: [27], subScore: '30:21' },
      { order: '第3场男双', playersA: ['李书翰', '李灿杰'], scoresA: [28, 28], playersB: ['陈镕杰', '陈俊均'], scoresB: [26, 25], subScore: '30:19' }
    ]
  },
  '男团1002': {
    code: '男团1002',
    teamA: '厦门大学',
    teamB: '集美大学',
    scoreA: 68,
    scoreB: 75,
    subMatches: [
      { order: '第1场男双 90+', playersA: ['张三', '李四'], scoresA: [45, 45], playersB: ['王五', '赵六'], scoresB: [50, 50], subScore: '60:75', time: '14:30' },
      { order: '第2场混双', playersA: ['周七', '吴八'], scoresA: [28], playersB: ['郑九', '王十'], scoresB: [30], subScore: '28:30' },
      { order: '第3场男双', playersA: ['孙一', '钱二'], scoresA: [25, 25], playersB: ['李三', '周四'], scoresB: [28, 28], subScore: '25:28' }
    ]
  }
};
import type { Tournament, Match, ParticipantInfo, IDType, Gender, ClothingSize, Venue, TimeSlot, PartnerRequest, TeamInfo, UniformInfo, GameActivity } from './types';

const getRegistrationCountdown = (endTime: string) => {
  try {
    const now = new Date();
    // Handle YYYY-MM-DD HH:mm format by replacing - with / for better cross-browser compatibility
    const formattedEndTime = endTime.replace(/-/g, '/');
    const end = new Date(formattedEndTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return '报名已截止';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `报名剩 ${days}天${hours}时`;
    return `报名剩 ${hours}时`;
  } catch (e) {
    return '报名进行中';
  }
};

const TournamentProgressBar = ({ status }: { status: Tournament['status'] }) => {
  const stages = [
    { id: 'registration', label: '报名' },
    { id: 'scheduling', label: '编排' },
    { id: 'ongoing', label: '比赛' },
    { id: 'finished', label: '结束' }
  ];

  const currentIndex = stages.findIndex(s => s.id === status);
  const progressIndex = status === 'finished' ? currentIndex : currentIndex + 0.5;

  return (
    <div className="mt-4 px-2">
      <div className="relative flex justify-between items-center">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-100 z-0" />
        
        {/* Active Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-brand-primary transition-all duration-500 z-0" 
          style={{ width: `${(Math.max(0, progressIndex) / (stages.length - 1)) * 100}%` }}
        />

        {stages.map((stage, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              <div className={cn(
                "w-2.5 h-2.5 rounded-full border-2 transition-all duration-500",
                isActive ? "bg-brand-primary border-brand-primary scale-110" : "bg-white border-slate-200",
                isCurrent && "ring-4 ring-brand-primary/20"
              )} />
              <span className={cn(
                "text-[9px] font-black mt-1.5 transition-colors duration-500",
                isActive ? "text-brand-primary" : "text-slate-400"
              )}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Mock Data
const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    title: '2026 "羽协杯" 业余羽毛球公开赛',
    regStartTime: '2026-02-01 09:00',
    regEndTime: '2026-03-01 18:00',
    matchStartTime: '2026-08-15 09:00',
    matchEndTime: '2026-08-15 18:00',
    location: '厦门市思明体育馆',
    organizer: '厦门市羽毛球协会',
    status: 'ongoing',
    type: 'Individual',
    image: 'https://picsum.photos/seed/badminton1/800/400',
    participants: 128,
    description: '本次比赛面向全市羽毛球爱好者，旨在推动全民健身运动，提高羽毛球运动水平。比赛采用中国羽毛球协会审定的最新《羽毛球竞赛规则》。',
    contactPerson: '张经理',
    contactPhone: '138-0000-0000',
    fee: 100,
    allowMultiCategory: true,
    documents: [
      { name: '赛事规程.pdf', url: '#' },
      { name: '免责声明.pdf', url: '#' }
    ],
    categories: [
      { id: 'c1', name: '男单', ageGroups: ['U10', 'U12', '成年组', '常青组'], isDouble: false },
      { id: 'c2', name: '女单', ageGroups: ['U10', 'U12', '成年组', '常青组'], isDouble: false },
      { id: 'c3', name: '男双', ageGroups: ['成年组', '常青组'], isDouble: true },
      { id: 'c4', name: '女双', ageGroups: ['成年组', '常青组'], isDouble: true },
      { id: 'c5', name: '混双', ageGroups: ['成年组'], isDouble: true }
    ]
  },
  {
    id: '2',
    title: '2026 春季高校羽毛球联赛 - 厦门站',
    regStartTime: '2026-02-15 09:00',
    regEndTime: '2026-03-02 18:00',
    matchStartTime: '2026-03-04 09:00',
    matchEndTime: '2026-03-06 17:00',
    location: '厦门大学体育馆',
    organizer: '厦门市学生体育协会',
    status: 'ongoing',
    type: 'Team',
    image: 'https://picsum.photos/seed/badminton2/800/400',
    participants: 64,
    description: '华东地区高校羽毛球盛事，展现学子风采。',
    contactPerson: '李老师',
    contactPhone: '139-1111-2222',
    fee: 500,
    allowMultiCategory: false,
    documents: [
      { name: '高校联赛手册.pdf', url: '#' }
    ],
    categories: [
      { id: 'tc1', name: '混合团体赛', ageGroups: ['高校组'] }
    ]
  },
  {
    id: '3',
    title: '2026 "企业杯" 混合团体邀请赛',
    regStartTime: '2026-03-01 09:00',
    regEndTime: '2026-04-20 18:00',
    matchStartTime: '2026-05-01 09:00',
    matchEndTime: '2026-05-03 17:00',
    location: '厦门市体育中心',
    organizer: '厦门市总工会',
    status: 'registration',
    type: 'Team',
    image: 'https://picsum.photos/seed/badminton3/800/400',
    participants: 32,
    maxParticipants: 64,
    description: '汇聚各界企业精英，以球会友，展现企业团队协作精神。比赛设混合团体赛，包含男双、女双、混双三个单项。',
    contactPerson: '王经理',
    contactPhone: '137-9999-8888',
    fee: 1200,
    allowMultiCategory: false,
    documents: [
      { name: '企业赛竞赛规程.pdf', url: '#' },
      { name: '企业赛报名表.xlsx', url: '#' }
    ],
    categories: [
      { id: 'ec1', name: '男团', ageGroups: ['甲组', '乙组', '丙组'] },
      { id: 'ec2', name: '女团', ageGroups: ['甲组', '乙组', '丙组'] },
      { id: 'ec3', name: '混团', ageGroups: ['甲组', '乙组', '丙组'] }
    ]
  },
  {
    id: '4',
    title: '2026年厦门市全民健身运动会羽毛球赛（同安站）',
    regStartTime: '2026-03-01 09:00',
    regEndTime: '2026-04-30 18:00',
    matchStartTime: '2026-05-15 09:00',
    matchEndTime: '2026-05-17 17:00',
    location: '厦门市同安区体育馆',
    organizer: '厦门市体育局 厦门市体育总会',
    status: 'registration',
    type: 'Individual',
    image: 'https://picsum.photos/seed/badminton4/800/400',
    participants: 256,
    maxParticipants: 500,
    description: '为推进全民健身运动，提高羽毛球运动水平，特举办2026年厦门市全民健身运动会羽毛球赛（同安站）。',
    contactPerson: '陈教练',
    contactPhone: '136-2222-3333',
    fee: 80,
    allowMultiCategory: true,
    documents: [
      { name: '竞赛规程.pdf', url: '#' },
      { name: '报名须知.pdf', url: '#' }
    ],
    categories: [
      { id: 'yc1', name: 'A组男单（18-30岁）', ageGroups: ['18-30岁'], isDouble: false },
      { id: 'yc2', name: 'A组女单（18-30岁）', ageGroups: ['18-30岁'], isDouble: false },
      { id: 'yc3', name: 'A组男双（18-30岁）', ageGroups: ['18-30岁'], isDouble: true },
      { id: 'yc4', name: 'A组女双（18-30岁）', ageGroups: ['18-30岁'], isDouble: true },
      { id: 'yc5', name: 'A组混双（18-30岁）', ageGroups: ['18-30岁'], isDouble: true },
      { id: 'yc6', name: 'B组男单（31-40岁）', ageGroups: ['31-40岁'], isDouble: false },
      { id: 'yc7', name: 'B组女单（31-40岁）', ageGroups: ['31-40岁'], isDouble: false },
      { id: 'yc8', name: 'B组男双（31-40岁）', ageGroups: ['31-40岁'], isDouble: true },
      { id: 'yc9', name: 'B组女双（31-40岁）', ageGroups: ['31-40岁'], isDouble: true },
      { id: 'yc10', name: 'B组混双（31-40岁）', ageGroups: ['31-40岁'], isDouble: true },
      { id: 'yc11', name: 'C组男单（41-50岁）', ageGroups: ['41-50岁'], isDouble: false },
      { id: 'yc12', name: 'C组男双（41-50岁）', ageGroups: ['41-50岁'], isDouble: true },
      { id: 'yc13', name: 'C组女双（41-50岁）', ageGroups: ['41-50岁'], isDouble: true },
      { id: 'yc14', name: 'C组混双（41-50岁）', ageGroups: ['41-50岁'], isDouble: true },
      { id: 'yc15', name: 'D组男双（51-69岁）', ageGroups: ['51-69岁'], isDouble: true },
      { id: 'yc16', name: 'D组混双（51-69岁）', ageGroups: ['51-69岁'], isDouble: true }
    ]
  },
  {
    id: '5',
    title: '2026 "卡猫杯" 羽毛球综合大奖赛',
    regStartTime: '2026-03-01 09:00',
    regEndTime: '2026-04-15 18:00',
    matchStartTime: '2026-05-01 08:00',
    matchEndTime: '2026-05-07 20:00',
    location: '厦门国际会展中心',
    organizer: '卡猫体育文化有限公司',
    status: 'registration',
    type: 'Comprehensive',
    image: 'https://picsum.photos/seed/badminton5/800/400',
    participants: 320,
    maxParticipants: 1000,
    description: '年度最盛大的羽毛球赛事，包含单项赛与团体赛，总奖金高达10万元！',
    contactPerson: '赛事组委会',
    contactPhone: '400-123-4567',
    fee: 150,
    allowMultiCategory: true,
    documents: [
      { name: '大奖赛竞赛规程.pdf', url: '#' },
      { name: '奖金分配方案.pdf', url: '#' }
    ],
    categories: [
      { id: 'cc1', name: 'C组男单', ageGroups: ['18-45岁'], isDouble: false },
      { id: 'cc2', name: 'C组女单', ageGroups: ['18-45岁'], isDouble: false },
      { id: 'cc3', name: 'C组男双', ageGroups: ['18-45岁'], isDouble: true },
      { id: 'cc4', name: 'C组女双', ageGroups: ['18-45岁'], isDouble: true },
      { id: 'cc5', name: 'C组混双', ageGroups: ['18-45岁'], isDouble: true }
    ]
  },
  {
    id: '6',
    title: '2026 "同心杯" 混合团体赛（邀请队员报名流程）',
    regStartTime: '2026-03-15 09:00',
    regEndTime: '2026-04-15 18:00',
    matchStartTime: '2026-04-20 09:00',
    matchEndTime: '2026-04-22 17:00',
    location: '海沧体育中心',
    organizer: '同心体育俱乐部',
    status: 'registration',
    type: 'Team',
    image: 'https://picsum.photos/seed/badminton6/800/400',
    participants: 16,
    maxParticipants: 32,
    description: '同心协力，共创佳绩。本次团体赛旨在增强团队凝聚力，促进球友交流。',
    contactPerson: '刘领队',
    contactPhone: '133-4444-5555',
    fee: 800,
    allowMultiCategory: false,
    documents: [
      { name: '同心杯规程.pdf', url: '#' }
    ],
    categories: [
      { id: 'tx1', name: '甲组混合团体赛', ageGroups: ['成年组'] }
    ]
  }
];

const MOCK_TEAMS: TeamInfo[] = [
  {
    id: 't1',
    name: '卡猫羽毛球一队',
    shortName: '卡猫一队',
    logo: 'https://picsum.photos/seed/logo1/200/200',
    leader: MOCK_PLAYER_POOL[0],
    members: [MOCK_PLAYER_POOL[0], MOCK_PLAYER_POOL[1]],
    uniforms: [
      { frontImage: 'https://picsum.photos/seed/u1f/400/400', backImage: 'https://picsum.photos/seed/u1b/400/400', mainColor: '#FF6321' }
    ]
  },
  {
    id: 't2',
    name: '同心羽球俱乐部',
    shortName: '同心俱乐部',
    logo: 'https://picsum.photos/seed/logo2/200/200',
    leader: MOCK_PLAYER_POOL[2],
    members: [MOCK_PLAYER_POOL[2], MOCK_PLAYER_POOL[3], MOCK_PLAYER_POOL[4]],
    uniforms: [
      { frontImage: 'https://picsum.photos/seed/u2f/400/400', backImage: 'https://picsum.photos/seed/u2b/400/400', mainColor: '#3B82F6' }
    ]
  }
];

const MOCK_GAMES: GameActivity[] = [
  {
    id: 'g1',
    title: '思明区晚间进阶3U/4U双打',
    time: '2026-04-25 19:00 - 21:00',
    venueName: '卡猫羽毛球馆 (思明店)',
    venueImage: 'https://picsum.photos/seed/venue1/400/300',
    organizer: '雷霆羽毛球俱乐部',
    maleCount: 4,
    femaleCount: 2,
    maxParticipants: 8,
    fee: 35,
    status: 'registration',
    type: '进阶局'
  },
  {
    id: 'g2',
    title: '周末集美区新手友好/纯练球',
    time: '2026-04-26 14:00 - 16:00',
    venueName: '悦动羽毛球中心',
    venueImage: 'https://picsum.photos/seed/venue3/400/300',
    organizer: '李大雷',
    maleCount: 1,
    femaleCount: 1,
    maxParticipants: 4,
    fee: 25,
    status: 'registration',
    type: '新手局'
  },
  {
    id: 'g3',
    title: '湖里区混双约战 欢迎挑战',
    time: '2026-04-27 20:00 - 22:00',
    venueName: '冠军羽毛球训练基地',
    venueImage: 'https://picsum.photos/seed/venue2/400/300',
    organizer: '陈美美',
    maleCount: 2,
    femaleCount: 2,
    maxParticipants: 4,
    fee: 45,
    status: 'full',
    type: '对抗局'
  },
  {
    id: 'g4',
    title: '思明区午后休闲局',
    time: '2026-04-25 14:00 - 16:00',
    venueName: '卡猫羽毛球馆 (思明店)',
    venueImage: 'https://picsum.photos/seed/venue1/400/301',
    organizer: '闲逛羽球',
    maleCount: 2,
    femaleCount: 2,
    maxParticipants: 8,
    fee: 20,
    status: 'registration',
    type: '娱乐局'
  }
];

const MOCK_VENUES: Venue[] = [
  {
    id: 'v1',
    name: '卡猫羽毛球馆 (思明店)',
    address: '厦门市思明区莲前西路123号',
    distance: '1.2km',
    price: 60,
    image: 'https://picsum.photos/seed/venue1/400/300',
    tags: ['空调', '淋浴', '免费停车'],
    lat: 24.4798,
    lng: 118.1102,
    courts: 12,
    phone: '0592-1234567',
    facilities: ['空调', '淋浴', '免费停车', '更衣室', '自动售货机'],
    description: '卡猫羽毛球馆思明店位于市中心，交通便利。场馆采用专业羽毛球塑胶地板，光线柔和，是您运动健身的理想选择。',
    bookingType: 'platform',
    businessHours: '09:00 - 22:00',
    activities: [MOCK_GAMES[0], MOCK_GAMES[3]]
  },
  {
    id: 'v2',
    name: '冠军羽毛球训练基地',
    address: '厦门市湖里区仙岳路456号',
    distance: '3.5km',
    price: 80,
    image: 'https://picsum.photos/seed/venue2/400/300',
    tags: ['专业塑胶', '夜间照明'],
    lat: 24.4950,
    lng: 118.1300,
    courts: 20,
    phone: '0592-7654321',
    facilities: ['专业塑胶', '夜间照明', '观众席', 'VIP休息室'],
    description: '冠军羽毛球训练基地是厦门市规模最大的羽毛球场馆之一，曾多次举办省级羽毛球赛事。场馆设施齐全，环境优雅。',
    bookingType: 'mini-program',
    businessHours: '08:00 - 23:00',
    activities: [MOCK_GAMES[2]]
  },
  {
    id: 'v3',
    name: '悦动羽毛球中心',
    address: '厦门市集美区银江路789号',
    distance: '8.2km',
    price: 50,
    image: 'https://picsum.photos/seed/venue3/400/300',
    tags: ['学生优惠', '器材租借'],
    lat: 24.5700,
    lng: 118.1000,
    courts: 10,
    phone: '0592-5556666',
    facilities: ['学生优惠', '器材租借', '饮水机', '急救箱'],
    description: '悦动羽毛球中心位于集美学村附近，深受学生群体喜爱。价格亲民，服务周到，提供专业的器材租借服务。',
    bookingType: 'phone',
    businessHours: '09:00 - 21:00',
    activities: [MOCK_GAMES[1]]
  }
];

const MOCK_PARTNER_REQUESTS: PartnerRequest[] = [
  {
    id: 'pr1',
    user: { name: '张小羽', avatar: 'https://picsum.photos/seed/u1/100/100', level: 'Lv.5' },
    title: '思明区周三晚间双打，缺一高手',
    time: '2026-03-04 19:00 - 21:00',
    location: '卡猫羽毛球馆 (思明店)',
    currentPlayers: 3,
    maxPlayers: 4,
    description: '我们已经有三个人了，都是经常打的，水平在4-5级左右。希望能来一个水平相当的朋友一起切磋。',
    tags: ['高手进', 'AA制', '提供用球']
  },
  {
    id: 'pr2',
    user: { name: '李大雷', avatar: 'https://picsum.photos/seed/u2/100/100', level: 'Lv.3' },
    title: '周末集美区约球，新手友好',
    time: '2026-03-07 14:00 - 16:00',
    location: '悦动羽毛球中心',
    currentPlayers: 1,
    maxPlayers: 2,
    description: '刚开始打球不久，想找个差不多水平的朋友一起练练基础。',
    tags: ['新手友好', '纯练球']
  },
  {
    id: 'pr3',
    user: { name: '陈美美', avatar: 'https://picsum.photos/seed/u3/100/100', level: 'Lv.4' },
    title: '湖里区混双约战，欢迎挑战',
    time: '2026-03-05 20:00 - 22:00',
    location: '冠军羽毛球训练基地',
    currentPlayers: 2,
    maxPlayers: 4,
    description: '我和搭档想找一对混双对手打打比赛，输了的付场地费。',
    tags: ['混双', '有彩头']
  }
];

const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    tournamentId: '1',
    player1: '张伟',
    player2: '李强',
    score1: [21, 15, 12],
    score2: [18, 21, 10],
    status: 'live',
    court: '1号场地',
    time: '14:30',
    category: '男单B组'
  },
  {
    id: 'm2',
    tournamentId: '1',
    player1: '王芳/陈晨',
    player2: '刘洋/赵敏',
    score1: [21],
    score2: [19],
    status: 'live',
    court: '3号场地',
    time: '15:00',
    category: '女子双打B组'
  },
  {
    id: 'm3',
    tournamentId: '1',
    player1: '林丹',
    player2: '李宗伟',
    score1: [21, 21],
    score2: [19, 18],
    status: 'finished',
    court: '2号场地',
    time: '10:00',
    category: '男子单打B组',
    winner: 1
  },
  {
    id: 'm4',
    tournamentId: '1',
    player1: '谌龙',
    player2: '安赛龙',
    score1: [0],
    score2: [0],
    status: 'finished',
    court: '4号场地',
    time: '11:00',
    category: '男子单打B组',
    isWalkover: true,
    winner: 2
  },
  {
    id: 'm5',
    tournamentId: '2',
    player1: '周杰',
    player2: '陈平',
    score1: [0],
    score2: [0],
    status: 'upcoming',
    court: '5号场地',
    time: '16:00',
    category: '男单B组'
  },
  {
    id: 'tm1',
    tournamentId: '2',
    player1: '复旦大学队',
    player2: '上海交通大学队',
    score1: [2, 1],
    score2: [1, 2],
    teamScore1: 2,
    teamScore2: 1,
    status: 'live',
    court: '6号场地',
    time: '14:00',
    type: 'Team',
    category: '混合团体赛',
    subMatches: [
      { id: 'sm1', category: '男单', player1: '张伟', player2: '李强', score1: [21, 21], score2: [15, 18], status: 'finished', winner: 1 },
      { id: 'sm2', category: '女子单打', player1: '王芳', player2: '刘洋', score1: [18, 15], score2: [21, 21], status: 'finished', winner: 2 },
      { id: 'sm3', category: '男子双打', player1: '陈晨/赵敏', player2: '李华/周杰', score1: [21, 15, 12], score2: [18, 21, 10], status: 'live' }
    ]
  }
];

// Components
const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', icon: HomeIcon, label: '首页' },
    { id: 'tournament', icon: Trophy, label: '赛事' },
    { id: 'play', icon: Activity, label: '打球' },
    { id: 'profile', icon: User, label: '我的' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 flex justify-around items-center h-16 safe-bottom z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full transition-colors",
            activeTab === tab.id ? "text-brand-primary" : "text-slate-400"
          )}
        >
          <tab.icon size={22} className={cn(activeTab === tab.id && "animate-pulse")} />
          <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

const getCountdown = (endTime: string) => {
  const end = new Date(endTime.replace(/-/g, '/')).getTime();
  const now = new Date().getTime();
  const diff = end - now;
  if (diff <= 0) return '报名已截止';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `还剩 ${days} 天 ${hours} 小时`;
  return `还剩 ${hours} 小时`;
};

const HomePage = ({ 
  onSelectTournament, 
  onBookingVenue, 
  onShowActivities, 
  onShowPartners,
  selectedSport,
  setSelectedSport
}: { 
  onSelectTournament: (t: Tournament) => void, 
  onBookingVenue: () => void, 
  onShowActivities: () => void, 
  onShowPartners: () => void,
  selectedSport: string,
  setSelectedSport: (sport: string) => void
}) => {
  const [venueSort, setVenueSort] = useState<'distance' | 'price'>('distance');
  const [showFilter, setShowFilter] = useState(false);
  const [activeTournamentTab, setActiveTournamentTab] = useState<'ongoing' | 'registration'>('ongoing');

  const sortedVenues = useMemo(() => {
    return [...MOCK_VENUES].sort((a, b) => {
      if (venueSort === 'distance') {
        return parseFloat(a.distance) - parseFloat(b.distance);
      }
      return a.price - b.price;
    });
  }, [venueSort]);

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 active:bg-slate-200 transition-colors cursor-pointer">
            <MapPin size={12} className="text-brand-primary" />
            <span>厦门</span>
          </div>
          <div className="relative group">
            <div className="flex items-center gap-1 bg-brand-primary/10 px-3 py-1.5 rounded-full text-[10px] font-bold text-brand-primary active:bg-brand-primary/20 transition-colors cursor-pointer">
              <span>{selectedSport}</span>
              <ChevronRight size={10} className="rotate-90" />
            </div>
            <div className="absolute top-full left-0 mt-2 w-24 bg-white rounded-xl shadow-xl border border-slate-100 py-2 hidden group-hover:block z-50">
              {['羽毛球', '网球', '匹克球'].map(sport => (
                <button 
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={cn(
                    "w-full px-4 py-2 text-left text-[10px] font-bold hover:bg-slate-50",
                    selectedSport === sport ? "text-brand-primary" : "text-slate-600"
                  )}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-white shadow-sm border border-slate-100">
            <Search size={18} className="text-slate-600" />
          </button>
          <button className="p-2 rounded-full bg-white shadow-sm border border-slate-100 relative">
            <Bell size={18} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="px-4 mb-6">
        <div className="relative rounded-2xl overflow-hidden aspect-[2.2/1] bg-brand-secondary">
          <img 
            src="https://picsum.photos/seed/badminton_hero/1200/600" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
            <span className="text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-1">正在进行</span>
            <h2 className="text-white text-lg font-bold leading-tight mb-2">2026 "羽协杯" 业余羽毛球公开赛<br/>精彩对决 实时直播中</h2>
            <button 
              onClick={() => onSelectTournament(MOCK_TOURNAMENTS[0])}
              className="w-fit px-4 py-2 bg-brand-primary text-white rounded-lg text-[10px] font-bold shadow-lg shadow-brand-primary/20"
            >
              立即查看
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions - King Kong Area (2 items) */}
      <section className="px-4 mb-8 grid grid-cols-2 gap-4">
        {[
          { id: 'tournament', icon: Trophy, label: '赛事活动', color: 'bg-orange-500 text-white', desc: '官方赛事 精彩对决' },
          { id: 'play', icon: Activity, label: '打球约球', color: 'bg-brand-primary text-white', desc: '球友约战 场地预订' },
        ].map((action, i) => (
          <div 
            key={i} 
            className="relative overflow-hidden p-5 rounded-[32px] flex flex-col gap-3 cursor-pointer active:scale-95 transition-all card-shadow border border-slate-100 bg-white"
            onClick={() => {
              if (action.id === 'tournament') onShowActivities();
              if (action.id === 'play') onShowPartners();
            }}
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", action.color)}>
              <action.icon size={24} />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">{action.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{action.desc}</div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <action.icon size={80} />
            </div>
          </div>
        ))}
      </section>

      {/* Popular Tournaments */}
      <section className="px-4 mb-8">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-black text-slate-900">热门赛事</h3>
          <button onClick={() => onShowActivities()} className="text-[10px] text-brand-primary font-black flex items-center gap-1">
            查看全部 <ChevronRight size={12} />
          </button>
        </div>

        {/* Tournament Status Toggle */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'ongoing', label: '比赛中' },
            { id: 'registration', label: '报名中' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTournamentTab(tab.id as any)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all",
                activeTournamentTab === tab.id 
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                  : "bg-slate-100 text-slate-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {MOCK_TOURNAMENTS.filter(t => t.status === activeTournamentTab).map((t) => (
            <motion.div 
              key={t.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTournament(t)}
              className="bg-white rounded-[32px] overflow-hidden card-shadow border border-slate-100"
            >
              <div className="relative h-40 sm:h-48">
                <img src={t.image} alt={t.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={cn(
                    "text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider backdrop-blur-md border",
                    t.status === 'registration' ? "bg-emerald-500/80 text-white border-emerald-400" : 
                    t.status === 'scheduling' ? "bg-amber-500/80 text-white border-amber-400" :
                    t.status === 'ongoing' ? "bg-blue-500/80 text-white border-blue-400" :
                    "bg-slate-500/80 text-white border-slate-400"
                  )}>
                    {t.status === 'registration' ? '报名中' : t.status === 'scheduling' ? '编排中' : t.status === 'ongoing' ? '比赛中' : '已结束'}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-white font-black border border-white/20">
                    {t.type === 'Individual' ? '单项赛' : t.type === 'Team' ? '团体赛' : '综合赛'}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h4 className="text-white text-sm font-black leading-tight line-clamp-1">{t.title}</h4>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <MapPin size={12} className="text-slate-300" />
                      <span className="line-clamp-1">{t.location}</span>
                    </div>
                    {t.status === 'registration' ? (
                      <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {getRegistrationCountdown(t.regEndTime)}
                      </div>
                    ) : t.status === 'ongoing' ? (
                      <div className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Activity size={10} />
                        查看赛况
                      </div>
                    ) : (
                      <div className="text-sm font-black text-brand-primary">¥{t.fee || 0}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Calendar size={12} className="text-slate-300" />
                      <span>比赛时间：{t.matchStartTime.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {t.status === 'registration' && (
                        <>
                          <span className="text-[9px] font-bold text-slate-500">
                            {t.participants}/{t.maxParticipants || 500} 席
                          </span>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-primary" 
                              style={{ width: `${Math.min(100, (t.participants / (t.maxParticipants || 500)) * 100)}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Venues Module */}
      <section className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-slate-900">热门球馆</h3>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setVenueSort('distance')}
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-bold transition-all",
                  venueSort === 'distance' ? "bg-white text-brand-primary shadow-sm" : "text-slate-400"
                )}
              >
                距离优先
              </button>
              <button 
                onClick={() => setVenueSort('price')}
                className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-bold transition-all",
                  venueSort === 'price' ? "bg-white text-brand-primary shadow-sm" : "text-slate-400"
                )}
              >
                价格优选
              </button>
            </div>
            <button 
              onClick={() => setShowFilter(true)}
              className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-brand-primary transition-colors"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {sortedVenues.map((venue) => (
            <div 
              key={venue.id} 
              onClick={() => onBookingVenue()}
              className="bg-white rounded-[32px] p-3 flex gap-4 card-shadow border border-slate-100 active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col justify-between py-1 flex-grow">
                <div>
                  <h4 className="text-sm font-black text-slate-900 line-clamp-1">{venue.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                    <MapPin size={10} />
                    <span>{venue.address}</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {venue.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[8px] font-bold bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-100">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400">{venue.distance}</span>
                  </div>
                  <div className="text-brand-primary">
                    <span className="text-[10px] font-bold">¥</span>
                    <span className="text-sm font-black">{venue.price}</span>
                    <span className="text-[8px] font-bold text-slate-400 ml-0.5">/小时</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Modal Placeholder */}
      <AnimatePresence>
        {showFilter && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilter(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[40px] p-6 relative z-10 max-h-[80vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-900">筛选球馆</h3>
                <button onClick={() => setShowFilter(false)} className="p-2 text-slate-400">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">区域</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['不限', '思明区', '湖里区', '集美区', '海沧区', '同安区'].map(area => (
                      <button key={area} className="py-3 rounded-xl bg-slate-50 text-[10px] font-bold text-slate-600 border border-transparent hover:border-brand-primary hover:text-brand-primary transition-all">
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">设施服务</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['空调', '淋浴', '免费停车', '器材租借', '专业塑胶', '夜间照明'].map(tag => (
                      <button key={tag} className="py-3 rounded-xl bg-slate-50 text-[10px] font-bold text-slate-600 border border-transparent hover:border-brand-primary hover:text-brand-primary transition-all">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 text-sm font-black">重置</button>
                <button onClick={() => setShowFilter(false)} className="flex-[2] py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20">确定</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LiveScorePage = () => {
  return (
    <div className="pb-20">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">实时比分</h1>
        <p className="text-xs text-slate-500">正在进行的精彩对决</p>
      </header>

      <div className="px-4 space-y-4">
        {MOCK_MATCHES.map((match) => (
          <div key={match.id} className="bg-white rounded-2xl overflow-hidden card-shadow border border-slate-100">
            <div className="bg-slate-50 px-4 py-2 flex justify-between items-center border-bottom border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-red-500 uppercase">Live</span>
                <span className="text-[10px] text-slate-400 font-medium">{match.court}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{match.time} 开始</span>
            </div>
            
            <div className="p-6 flex items-center justify-between">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <User size={24} className="text-slate-400" />
                </div>
                <span className="text-xs font-bold text-center">{match.player1}</span>
              </div>

              <div className="flex flex-col items-center gap-1 px-4">
                <div className="flex gap-2">
                  {match.score1.map((s, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className={cn(
                        "text-lg font-black w-8 text-center",
                        i === match.score1.length - 1 ? "text-brand-primary" : "text-slate-300"
                      )}>{s}</span>
                      <span className={cn(
                        "text-lg font-black w-8 text-center",
                        i === match.score2.length - 1 ? "text-brand-primary" : "text-slate-300"
                      )}>{match.score2[i]}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">VS</span>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                  <User size={24} className="text-slate-400" />
                </div>
                <span className="text-xs font-bold text-center">{match.player2}</span>
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50/50 flex justify-center">
              <button className="text-[10px] font-bold text-brand-primary flex items-center gap-1">
                查看详情统计 <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GameActivityCard: React.FC<{ game: GameActivity }> = ({ game }) => (
  <div 
    className="bg-white rounded-[24px] p-3 card-shadow border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500 flex gap-4"
  >
    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative">
      <img src={game.venueImage || "https://picsum.photos/seed/venue/400/300"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[8px] font-black rounded-md">
        {game.type}
      </div>
    </div>

    <div className="flex-1 flex flex-col justify-between py-0.5">
      <div>
        <div className="flex justify-between items-start">
          <h4 className="text-xs font-black text-slate-900 line-clamp-1 flex-1 leading-tight">{game.title}</h4>
          <div className="text-brand-primary font-black ml-2 whitespace-nowrap">
            <span className="text-[9px]">¥</span>
            <span className="text-sm">{game.fee}</span>
          </div>
        </div>
        
        <div className="mt-1.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Clock size={10} className="text-slate-400" />
            <span className="line-clamp-1">{game.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <MapPin size={10} className="text-slate-400" />
            <span className="line-clamp-1">{game.venueName}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-50">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                <img src={`https://picsum.photos/seed/${game.id + i}/100/100`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <span className="text-[9px] font-bold text-slate-400">
            {game.maleCount}男{game.femaleCount}女 / {game.maxParticipants}人
          </span>
        </div>
        <button className="px-3 py-1 bg-brand-primary text-white text-[9px] font-black rounded-full shadow-lg shadow-brand-primary/20 active:scale-95 transition-all">
          报名
        </button>
      </div>
    </div>
  </div>
);

const VenueDetailPage = ({ venue, onBack, onBook }: { venue: Venue, onBack: () => void, onBook: () => void }) => {
  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 z-50 w-full max-w-md mx-auto">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold truncate">{venue.name}</h1>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-6 pb-24">
          {/* Venue Images Showcase */}
          <div className="relative h-64 w-full bg-slate-900">
            <img src={venue.image} alt={venue.name} className="w-full h-full object-cover opacity-90" referrerPolicy="no-referrer" />
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold">
              1 / 5
            </div>
          </div>

          <div className="px-4 space-y-6 -mt-12 relative z-10">
            {/* Main Info Card */}
            <div className="bg-white rounded-[32px] p-6 card-shadow space-y-6 border border-slate-100">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-xl font-black text-slate-900">{venue.name}</h2>
                  <div className="px-3 py-1 bg-brand-primary/5 text-brand-primary text-[10px] font-black rounded-full border border-brand-primary/10 whitespace-nowrap">
                    营业中
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-3 bg-slate-50 p-3 rounded-2xl">
                  <Clock size={14} className="text-brand-primary" />
                  <span>营业时间：{venue.businessHours}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                    <MapPin size={14} className="text-brand-primary" />
                    <span className="line-clamp-1">{venue.address}</span>
                  </div>
                  <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl active:scale-95 transition-all">
                    <Navigation size={18} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {venue.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1.5 rounded-xl border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Facilities Section */}
            <div className="bg-white rounded-[32px] p-6 card-shadow border border-slate-100">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">场馆设施</h3>
               <div className="grid grid-cols-4 gap-4">
                 {venue.facilities.map(f => (
                   <div key={f} className="flex flex-col items-center gap-2">
                     <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                       <Zap size={18} />
                     </div>
                     <span className="text-[9px] font-bold text-slate-500">{f}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Activities Section */}
            {venue.activities && venue.activities.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">本馆球局 ({venue.activities.length})</h3>
                  <button className="text-[10px] font-bold text-brand-primary">全部局</button>
                </div>
                {venue.activities.map(game => (
                  <GameActivityCard key={game.id} game={game} />
                ))}
              </div>
            )}

            {/* Description Section */}
            <div className="bg-white rounded-[32px] p-6 card-shadow border border-slate-100">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">场馆介绍</h3>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">
                 {venue.description}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Fixed Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase">场地价格</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-brand-primary">¥{venue.price}</span>
              <span className="text-[10px] font-black text-slate-400">/小时起</span>
            </div>
          </div>
          <button 
            onClick={onBook}
            className="flex-1 py-4 bg-brand-primary text-white rounded-[24px] font-black text-sm shadow-xl shadow-brand-primary/30 active:scale-95 transition-all"
          >
            立即预订球场
          </button>
        </div>
      </div>
    </div>
  );
};

const VenueBookingGridPage = ({ venue, onBack, onConfirm }: { venue: Venue, onBack: () => void, onConfirm: (data: { selectedDate: any, selectedSlots: string[], totalPrice: number }) => void }) => {
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const dates = useMemo(() => {
    const d = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      d.push({
        day: date.toLocaleDateString('zh-CN', { weekday: 'short' }),
        date: date.getDate().toString().padStart(2, '0'),
        full: date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
        isToday: i === 0
      });
    }
    return d;
  }, []);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 9; h <= 22; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  const toggleSlot = (court: number, time: string) => {
    const slotId = `${court}-${time}`;
    if (selectedSlots.includes(slotId)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slotId));
    } else {
      setSelectedSlots([...selectedSlots, slotId]);
    }
  };

  const totalPrice = selectedSlots.length * venue.price;

  return (
    <div className="flex flex-col h-[100dvh] bg-[#1a1a1a] overflow-hidden">
      {/* Dark Header with Date Selector */}
      <div className="bg-[#1a1a1a] pt-12 pb-4 px-4 space-y-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full bg-white/10 text-white">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-white">{venue.name}</h1>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {dates.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDateIdx(i)}
              className={cn(
                "flex flex-col items-center min-w-[56px] py-3 rounded-2xl transition-all",
                selectedDateIdx === i ? "bg-brand-primary text-white" : "bg-white/5 text-white/40"
              )}
            >
              <span className="text-[10px] font-bold mb-1">{d.day}</span>
              <span className="text-base font-black">{d.date}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Booking Grid (Table-based) */}
      <div className="flex-1 overflow-auto bg-white rounded-t-[40px] relative">
        <div className="min-w-[600px] p-6">
          <table className="w-full border-separate border-spacing-x-3 border-spacing-y-3">
            <thead>
              <tr className="sticky top-0 bg-white z-10">
                <th className="w-16 text-xs font-black text-slate-300 pb-4">时间</th>
                {[1, 2, 3, 4, 5].map(c => (
                  <th key={c} className="pb-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c}号场</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time, timeIdx) => (
                <tr key={time}>
                  <td className="text-xs font-black text-slate-300 tabular-nums relative align-middle text-center">
                    {time}
                    {timeIdx === 2 && (
                      <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-orange-500 rounded-full -translate-y-1/2" />
                    )}
                  </td>
                  {[1, 2, 3, 4, 5].map(court => {
                    const isSelected = selectedSlots.includes(`${court}-${time}`);
                    const isBooked = (court + timeIdx) % 7 === 0; // Mock booked slots
                    
                    return (
                      <td key={court}>
                        <button
                          disabled={isBooked}
                          onClick={() => toggleSlot(court, time)}
                          className={cn(
                            "w-full h-14 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 relative overflow-hidden",
                            isBooked ? "bg-slate-50 border-slate-50 text-slate-200 cursor-not-allowed" :
                            isSelected ? "bg-white border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/5 scale-95" :
                            "bg-white border-slate-100 text-slate-900 hover:border-brand-primary/30"
                          )}
                        >
                          {!isBooked && (
                            <>
                              <span className="text-[10px] font-black">¥{venue.price}</span>
                              {isSelected && (
                                <div className="absolute top-0 right-0 bg-brand-primary text-white p-0.5 rounded-bl-lg">
                                  <Check size={10} strokeWidth={4} />
                                </div>
                              )}
                            </>
                          )}
                          {isBooked && <span className="text-[8px] font-bold uppercase tracking-tighter">已约</span>}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Time Indicator Line (Mock) */}
        <div className="absolute left-20 top-[180px] right-6 border-t border-dashed border-orange-500/30 pointer-events-none" />
      </div>

      {/* Bottom Actions */}
      <div className="bg-white p-6 border-t border-slate-100 safe-bottom flex-shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-slate-900">已选场次</span>
            <span className="text-base font-black text-brand-primary">{selectedSlots.length} 个</span>
          </div>
          <button className="text-xs font-bold text-slate-400 flex items-center gap-1">
            全部 <ChevronRight size={14} />
          </button>
        </div>

        {/* Selected Slots Horizontal List */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {selectedSlots.map(slot => {
            const [court, time] = slot.split('-');
            const endTime = `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;
            return (
              <div key={slot} className="min-w-[160px] bg-slate-50 rounded-2xl p-4 border border-slate-100 relative group">
                <button 
                  onClick={() => toggleSlot(parseInt(court), time)}
                  className="absolute top-2 right-2 text-slate-300 hover:text-slate-500"
                >
                  <X size={14} />
                </button>
                <div className="text-sm font-black text-slate-900 mb-1">{court}号场</div>
                <div className="text-[10px] text-slate-400 mb-2">
                  {dates[selectedDateIdx].full} {time} ~ {endTime}
                </div>
                <div className="text-sm font-black text-brand-primary">¥{venue.price}</div>
              </div>
            );
          })}
          {selectedSlots.length === 0 && (
            <div className="w-full py-8 flex flex-col items-center justify-center text-slate-300 gap-2">
              <Calendar size={24} strokeWidth={1.5} />
              <span className="text-xs font-bold">请在上方选择场次</span>
            </div>
          )}
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-4">
            <span className="font-bold">预约须知:</span>
            <span className="truncate">场馆类场地预订及取消规则一、预订流程您可...</span>
            <ChevronRight size={12} />
          </div>

          <button
            disabled={selectedSlots.length === 0}
            onClick={() => onConfirm({ 
              selectedDate: dates[selectedDateIdx], 
              selectedSlots, 
              totalPrice 
            })}
            className={cn(
              "w-full py-4 rounded-full text-base font-black transition-all active:scale-95 flex items-center justify-center gap-2",
              selectedSlots.length > 0 
                ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            {selectedSlots.length > 0 && <span>¥{totalPrice}</span>}
            立即预约
          </button>
        </div>
      </div>
    </div>
  );
};

const VenueOrderConfirmationPage = ({ 
  venue, 
  selectedDate, 
  selectedSlots, 
  totalPrice, 
  onBack, 
  onConfirm 
}: { 
  venue: Venue, 
  selectedDate: any, 
  selectedSlots: string[], 
  totalPrice: number, 
  onBack: () => void, 
  onConfirm: () => void 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'card'>('wechat');

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 z-50 w-full max-w-md mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">订单确认</h1>
        </div>
        <div className="flex items-center gap-2">
           <MoreHorizontal size={20} className="text-slate-400" />
           <div className="w-px h-4 bg-slate-200" />
           <Circle size={20} className="text-slate-400" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {/* Venue Info Card */}
        <div className="bg-white rounded-2xl p-4 card-shadow flex gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col justify-between py-1 flex-grow">
            <div>
              <h3 className="text-base font-black text-slate-900">{venue.name}</h3>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                <MapPin size={10} />
                <span className="truncate max-w-[180px]">{venue.address}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">距您 1.2km</span>
              <button className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                查看详情 <ChevronRight size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl p-5 card-shadow space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">场馆</span>
            <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
              {venue.name} <ChevronRight size={14} className="text-slate-300" />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">项目</span>
            <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
              羽毛球 <ChevronRight size={14} className="text-slate-300" />
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">预约日期</span>
            <span className="text-sm font-bold text-slate-900">{selectedDate.full}</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">场次</span>
              <span className="text-sm text-slate-400">共选择 <span className="text-brand-primary font-bold">{selectedSlots.length}</span> 个场次</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {selectedSlots.map(slot => {
                const [court, time] = slot.split('-');
                const endTime = `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;
                return (
                  <div key={slot} className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1 border border-slate-100">
                    <span className="text-sm font-bold text-slate-900">{court}号场</span>
                    <span className="text-xs text-slate-400">{time} ~ {endTime}</span>
                    <span className="text-sm font-black text-brand-primary mt-1">¥{venue.price}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-50">
            <span className="text-sm text-slate-400">优惠</span>
            <span className="text-sm text-slate-300">无可用优惠</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-5 card-shadow space-y-6">
          <h3 className="text-base font-black text-slate-900">支付方式</h3>
          <div className="space-y-4">
            <button 
              onClick={() => setPaymentMethod('wechat')}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#07c160] flex items-center justify-center text-white">
                  <MessageCircle size={18} fill="currentColor" />
                </div>
                <span className="text-sm font-bold text-slate-900">微信支付</span>
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                paymentMethod === 'wechat' ? "bg-brand-primary border-brand-primary text-white" : "border-slate-200"
              )}>
                {paymentMethod === 'wechat' && <Check size={12} strokeWidth={4} />}
              </div>
            </button>
            <button 
              onClick={() => setPaymentMethod('card')}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <CreditCard size={18} />
                </div>
                <span className="text-sm font-bold text-slate-900">使用储值卡</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">选择储值卡</span>
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full max-w-md mx-auto p-4 bg-white border-t border-slate-100 safe-bottom flex items-center justify-between gap-4 z-50">
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-slate-400">需付:</span>
          <span className="text-xs font-bold text-brand-primary">¥</span>
          <span className="text-2xl font-black text-brand-primary">{totalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={onConfirm}
          className="px-10 py-4 rounded-full bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
        >
          提交订单
        </button>
      </div>
    </div>
  );
};

const VenueBookingPage = ({ onBack, initialVenue }: { onBack: () => void, initialVenue?: Venue | null }) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(initialVenue || null);
  const [showBookingGrid, setShowBookingGrid] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<{
    selectedDate: any;
    selectedSlots: string[];
    totalPrice: number;
  } | null>(null);

  useEffect(() => {
    if (initialVenue) {
      setSelectedVenue(initialVenue);
    }
  }, [initialVenue]);

  if (showOrderConfirmation && selectedVenue && bookingData) {
    return (
      <VenueOrderConfirmationPage 
        venue={selectedVenue}
        selectedDate={bookingData.selectedDate}
        selectedSlots={bookingData.selectedSlots}
        totalPrice={bookingData.totalPrice}
        onBack={() => setShowOrderConfirmation(false)}
        onConfirm={() => {
          alert('订单提交成功！请前往支付。');
          setShowOrderConfirmation(false);
          setShowBookingGrid(false);
          onBack();
        }}
      />
    );
  }

  if (showBookingGrid && selectedVenue) {
    return (
      <VenueBookingGridPage 
        venue={selectedVenue} 
        onBack={() => setShowBookingGrid(false)} 
        onConfirm={(data) => {
          setBookingData(data);
          setShowOrderConfirmation(true);
        }}
      />
    );
  }

  if (selectedVenue) {
    return <VenueDetailPage venue={selectedVenue} onBack={() => setSelectedVenue(null)} onBook={() => {
      if (selectedVenue.bookingType === 'platform') {
        setShowBookingGrid(true);
      } else if (selectedVenue.bookingType === 'mini-program') {
        alert('正在为您跳转至第三方小程序...');
      } else {
        alert(`正在拨打场馆电话: ${selectedVenue.phone}`);
        window.location.href = `tel:${selectedVenue.phone}`;
      }
    }} />;
  }

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">场地预订</h1>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === 'list' ? "bg-white shadow-sm text-brand-primary" : "text-slate-400"
            )}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={cn(
              "p-2 rounded-lg transition-all",
              viewMode === 'map' ? "bg-white shadow-sm text-brand-primary" : "text-slate-400"
            )}
          >
            <MapIcon size={18} />
          </button>
        </div>
      </header>

      {viewMode === 'list' ? (
        <div className="p-4 space-y-4">
          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索场馆名称..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all card-shadow"
              />
            </div>
            <button className="p-3 rounded-2xl bg-white border border-slate-100 card-shadow text-slate-500">
              <Filter size={20} />
            </button>
          </div>

          {/* Venue List */}
          <div className="space-y-4">
            {MOCK_VENUES.map(venue => (
              <motion.div
                key={venue.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedVenue(venue)}
                className="bg-white rounded-[24px] overflow-hidden card-shadow border border-slate-100 flex flex-col"
              >
                <div className="relative h-40">
                  <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-4 left-4 flex gap-1">
                    {venue.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[8px] font-bold bg-black/50 text-white px-2 py-1 rounded-md backdrop-blur-sm">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-black text-slate-900">{venue.name}</h3>
                    <div className="text-right">
                      <div className="text-lg font-black text-brand-primary">¥{venue.price}<span className="text-[10px] font-bold text-slate-400 ml-0.5">/小时起</span></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin size={10} />
                      <span className="truncate max-w-[180px]">{venue.address}</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{venue.distance}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-140px)] relative bg-slate-200 overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] bg-slate-100">
            {/* Mock Map Markers */}
            {MOCK_VENUES.map(venue => (
              <motion.div
                key={venue.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSelectedVenue(venue)}
                style={{
                  position: 'absolute',
                  left: `${(venue.lng - 118.1) * 1000}%`,
                  top: `${(venue.lat - 24.4) * 1000}%`,
                }}
                className="flex flex-col items-center gap-1 cursor-pointer"
              >
                <div className="bg-brand-primary text-white px-3 py-1.5 rounded-full text-[10px] font-black shadow-lg shadow-brand-primary/20 flex items-center gap-1 whitespace-nowrap">
                  <Zap size={10} /> ¥{venue.price}
                </div>
                <div className="w-3 h-3 bg-brand-primary rounded-full border-2 border-white shadow-md" />
              </motion.div>
            ))}
          </div>

          {/* Map Overlay Info */}
          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/50 card-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <Navigation size={20} className="text-brand-primary" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">当前定位：厦门市思明区</div>
                  <div className="text-[10px] text-slate-500">为您发现附近 {MOCK_VENUES.length} 个优质场馆</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PartnerMatchmakingPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">球友约球</h1>
        </div>
        <button className="p-2 rounded-full bg-brand-primary/10 text-brand-primary">
          <Plus size={20} />
        </button>
      </header>

      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['全部', '思明区', '湖里区', '集美区', '海沧区'].map((area, i) => (
            <button 
              key={i} 
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border",
                i === 0 ? "bg-brand-primary text-white border-brand-primary" : "bg-white text-slate-500 border-slate-100"
              )}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {MOCK_PARTNER_REQUESTS.map(request => (
            <motion.div
              key={request.id}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-3xl p-5 card-shadow border border-slate-100 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src={request.user.avatar} className="w-10 h-10 rounded-full border-2 border-slate-50" referrerPolicy="no-referrer" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-slate-900">{request.user.name}</span>
                      <span className="text-[8px] font-black bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-md">{request.user.level}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">刚刚发布</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-brand-primary/5 px-2 py-1 rounded-lg">
                  <Users size={12} className="text-brand-primary" />
                  <span className="text-[10px] font-black text-brand-primary">{request.currentPlayers}/{request.maxPlayers}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 mb-2">{request.title}</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <Clock size={12} />
                    <span>{request.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <MapPin size={12} />
                    <span className="truncate">{request.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {request.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100">{tag}</span>
                ))}
              </div>

              <div className="pt-2 flex gap-3">
                <button className="flex-1 py-3 rounded-2xl bg-slate-50 text-slate-600 text-xs font-bold border border-slate-100 active:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare size={14} /> 咨询
                </button>
                <button 
                  onClick={() => alert('申请已发送，请等待发起人确认')}
                  className="flex-1 py-3 rounded-2xl bg-brand-primary text-white text-xs font-bold shadow-lg shadow-brand-primary/20 active:scale-95 transition-transform"
                >
                  立即加入
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TournamentActivitiesPage = ({ onBack, onSelectTournament }: { onBack: () => void, onSelectTournament: (t: Tournament) => void }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ongoing' | 'registration' | 'finished' | 'scheduling'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTournaments = useMemo(() => {
    return MOCK_TOURNAMENTS.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || t.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchQuery]);

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'registration', label: '报名中' },
    { id: 'ongoing', label: '比赛中' },
    { id: 'finished', label: '已结束' },
  ];

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold">赛事活动</h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索赛事名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all card-shadow"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={cn(
                "flex-shrink-0 px-6 py-2 rounded-full text-xs font-bold transition-all",
                activeFilter === tab.id 
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                  : "bg-white text-slate-400 border border-slate-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tournament List */}
        <div className="space-y-4">
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((t) => (
              <motion.div 
                key={t.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectTournament(t)}
                className="bg-white rounded-[32px] overflow-hidden card-shadow border border-slate-100"
              >
                <div className="relative h-48">
                  <img src={t.image} alt={t.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={cn(
                      "text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider backdrop-blur-md border",
                      t.status === 'registration' ? "bg-emerald-500/80 text-white border-emerald-400" : 
                      t.status === 'scheduling' ? "bg-amber-500/80 text-white border-amber-400" :
                      t.status === 'ongoing' ? "bg-blue-500/80 text-white border-blue-400" :
                      "bg-slate-500/80 text-white border-slate-400"
                    )}>
                      {t.status === 'registration' ? '报名中' : t.status === 'scheduling' ? '编排中' : t.status === 'ongoing' ? '比赛中' : '已结束'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="text-[12px] px-3 py-1 rounded-xl bg-black/40 backdrop-blur-md text-white font-black border border-white/20">
                      {t.type === 'Individual' ? '单项赛' : t.type === 'Team' ? '团体赛' : '综合赛'}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h4 className="text-white text-lg font-black leading-tight line-clamp-1">{t.title}</h4>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[12px] text-slate-600">
                        <MapPin size={16} className="text-slate-300" />
                        <span className="font-medium">{t.location}</span>
                      </div>
                      {t.status === 'registration' ? (
                        <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                          {getRegistrationCountdown(t.regEndTime)}
                        </div>
                      ) : t.status === 'ongoing' ? (
                        <div className="text-[11px] font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                          <Activity size={12} />
                          查看赛况
                        </div>
                      ) : (
                        <div className="text-xl font-black text-brand-primary">¥{t.fee || 0}</div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <Calendar size={16} className="text-slate-300" />
                        <span>比赛时间：{t.matchStartTime.split(' ')[0]}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        {t.status === 'registration' && (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-700">{t.participants}</span>
                              <span className="text-[11px] text-slate-400">/ {t.maxParticipants || 500} 席</span>
                            </div>
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-brand-primary" 
                                style={{ width: `${Math.min(100, (t.participants / (t.maxParticipants || 500)) * 100)}%` }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <Trophy size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium">暂无相关赛事</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EarlyBirdPage = ({ onBack, onSelectVenue }: { onBack: () => void, onSelectVenue: (venue: Venue) => void }) => {
  const earlyBirdVenues = useMemo(() => {
    return MOCK_VENUES.map(v => ({
      ...v,
      earlyPrice: Math.floor(v.price * 0.6),
      timeRange: '07:00 - 10:00'
    }));
  }, []);

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold">早场特惠</h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-amber-900">早起打球更划算</h3>
            <p className="text-[10px] text-amber-600 font-bold">每日 07:00 - 10:00，全场球馆6折起</p>
          </div>
        </div>

        <div className="space-y-4">
          {earlyBirdVenues.map((venue) => (
            <div 
              key={venue.id} 
              onClick={() => onSelectVenue(venue)}
              className="bg-white rounded-[32px] p-3 flex gap-4 card-shadow border border-slate-100 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-black px-3 py-1 rounded-bl-2xl shadow-sm">
                6折特惠
              </div>
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col justify-between py-1 flex-grow">
                <div>
                  <h4 className="text-sm font-black text-slate-900 line-clamp-1">{venue.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                    <Clock size={10} className="text-amber-500" />
                    <span className="text-amber-600 font-bold">{venue.timeRange}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 line-through">¥{venue.price}</span>
                    <div className="text-brand-primary">
                      <span className="text-[10px] font-bold">¥</span>
                      <span className="text-sm font-black">{venue.earlyPrice}</span>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 bg-brand-primary text-white text-[10px] font-black rounded-full shadow-lg shadow-brand-primary/20">
                    去预订
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PostGamePage = ({ onBack }: { onBack: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    time: '',
    level: 'Lv.3 进阶',
    maxPlayers: 6,
    fee: 45,
    description: ''
  });

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold">发布球局</h1>
      </header>

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-[32px] p-6 card-shadow border border-slate-100 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">球局标题</label>
            <input 
              type="text" 
              placeholder="例如：周六下午欢乐羽毛球"
              className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">选择球馆</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm focus:outline-none appearance-none"
                  value={formData.venue}
                  onChange={e => setFormData({...formData, venue: e.target.value})}
                >
                  <option value="">点击选择</option>
                  {MOCK_VENUES.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">活动时间</label>
              <div className="relative">
                <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="datetime-local"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm focus:outline-none"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">水平要求</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm focus:outline-none appearance-none"
                value={formData.level}
                onChange={e => setFormData({...formData, level: e.target.value})}
              >
                <option>Lv.1 萌新</option>
                <option>Lv.2 入门</option>
                <option>Lv.3 进阶</option>
                <option>Lv.4 高手</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">人数上限</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm focus:outline-none"
                value={formData.maxPlayers}
                onChange={e => setFormData({...formData, maxPlayers: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">费用 (元/人)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">¥</span>
              <input 
                type="number" 
                className="w-full pl-8 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm focus:outline-none"
                value={formData.fee}
                onChange={e => setFormData({...formData, fee: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">球局说明</label>
            <textarea 
              placeholder="例如：包球、包水、欢乐第一..."
              className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm focus:outline-none h-32 resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <button 
          onClick={() => {
            alert('发布成功！');
            onBack();
          }}
          className="w-full py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
        >
          立即发布
        </button>
      </div>
    </div>
  );
};

const JoinGamePage = ({ onBack }: { onBack: () => void }) => {
  const mockGames = [
    { id: '1', title: '周六下午思明体育馆欢乐局', venue: '思明体育馆', time: '周六 14:00-16:00', level: 'Lv.3 进阶', players: 4, maxPlayers: 6, fee: 45, host: '张三' },
    { id: '2', title: '新手入门局，欢迎萌新', venue: '厦门大学体育馆', time: '周日 10:00-12:00', level: 'Lv.1 萌新', players: 2, maxPlayers: 4, fee: 35, host: '李四' },
    { id: '3', title: '高手过招，谢绝菜鸟', venue: '体育中心羽毛球馆', time: '周五 19:00-21:00', level: 'Lv.4 高手', players: 5, maxPlayers: 6, fee: 50, host: '王五' },
  ];

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold">加入球局</h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {['全部', '思明区', '湖里区', '集美区', '海沧区'].map(area => (
            <button key={area} className="flex-shrink-0 px-6 py-2 rounded-full text-xs font-bold bg-white text-slate-400 border border-slate-100">
              {area}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mockGames.map(game => (
            <div key={game.id} className="bg-white rounded-[32px] p-6 card-shadow border border-slate-100 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-black text-slate-900 leading-tight flex-1 mr-4">{game.title}</h3>
                <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-lg">
                  {game.level}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <MapPin size={14} className="text-slate-300" />
                  <span>{game.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Clock size={14} className="text-slate-300" />
                  <span>{game.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {game.host[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-900">{game.host}</span>
                    <span className="text-[8px] text-slate-400">发起人</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs font-black text-brand-primary">¥{game.fee}</div>
                    <div className="text-[8px] text-slate-400">{game.players}/{game.maxPlayers} 人</div>
                  </div>
                  <button 
                    onClick={() => {
                      alert('申请已发送，请等待发起人确认');
                    }}
                    className="px-6 py-2 bg-brand-primary text-white text-[10px] font-black rounded-full shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                  >
                    立即加入
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ClubsPage = ({ onBack }: { onBack: () => void }) => {
  const mockClubs = [
    { id: '1', name: '厦门精英羽毛球俱乐部', members: 1250, activity: '高', image: 'https://picsum.photos/seed/club1/400/400', tags: ['专业训练', '定期比赛'] },
    { id: '2', name: '鹭岛羽协分会', members: 850, activity: '极高', image: 'https://picsum.photos/seed/club2/400/400', tags: ['官方认证', '会员福利'] },
    { id: '3', name: '快乐羽球社', members: 420, activity: '中', image: 'https://picsum.photos/seed/club3/400/400', tags: ['零基础友好', '周末约球'] },
  ];

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold">俱乐部</h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-black mb-2">加入俱乐部</h2>
            <p className="text-xs text-purple-100 mb-6 opacity-80">找到志同道合的球友，享受更多会员特权</p>
            <button className="px-6 py-2 bg-white text-purple-600 text-[10px] font-black rounded-full shadow-lg active:scale-95 transition-all">
              创建我的俱乐部
            </button>
          </div>
          <LayoutGrid size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12" />
        </div>

        <div className="space-y-4">
          {mockClubs.map(club => (
            <div key={club.id} className="bg-white rounded-[32px] p-4 flex gap-4 card-shadow border border-slate-100 active:scale-[0.98] transition-all cursor-pointer">
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={club.image} alt={club.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col justify-between py-1 flex-grow">
                <div>
                  <h4 className="text-sm font-black text-slate-900 line-clamp-1">{club.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400">{club.members} 成员</span>
                    <span className="text-[10px] text-emerald-500 font-bold">活跃度 {club.activity}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {club.tags.map(tag => (
                      <span key={tag} className="text-[8px] font-bold bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded border border-slate-100">{tag}</span>
                    ))}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('申请已提交，请等待管理员审核');
                    }}
                    className="px-4 py-1.5 border border-purple-600 text-purple-600 text-[10px] font-black rounded-full active:scale-95 transition-all"
                  >
                    申请加入
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SportsMapPage = ({ onBack, onSelectVenue }: { onBack: () => void, onSelectVenue: (venue: Venue) => void }) => {
  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold">运动地图</h1>
      </header>

      <div className="relative h-[calc(100vh-140px)] w-full max-w-md mx-auto overflow-hidden bg-slate-200">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1000/1000')] bg-cover bg-center opacity-40 grayscale" />
        
        {/* Map Markers */}
        <div className="absolute top-1/4 left-1/3">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <div className="bg-brand-primary text-white p-2 rounded-full shadow-xl">
              <MapPin size={24} />
            </div>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-slate-100 whitespace-nowrap">
              <span className="text-[10px] font-black text-slate-900">思明体育馆</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute top-1/2 right-1/4">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="relative"
          >
            <div className="bg-blue-500 text-white p-2 rounded-full shadow-xl">
              <MapPin size={24} />
            </div>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-slate-100 whitespace-nowrap">
              <span className="text-[10px] font-black text-slate-900">厦门大学体育馆</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-1/3 left-1/4">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="relative"
          >
            <div className="bg-purple-500 text-white p-2 rounded-full shadow-xl">
              <MapPin size={24} />
            </div>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-slate-100 whitespace-nowrap">
              <span className="text-[10px] font-black text-slate-900">体育中心羽毛球馆</span>
            </div>
          </motion.div>
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-all">
            <Plus size={20} />
          </button>
          <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-all">
            <div className="w-5 h-0.5 bg-slate-600 rounded-full" />
          </button>
          <button className="w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center text-brand-primary active:scale-95 transition-all mt-4">
            <Navigation size={20} />
          </button>
        </div>

        {/* Bottom Venue Card Preview */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-white rounded-[32px] p-4 shadow-2xl border border-slate-100 flex gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
              <img src={MOCK_VENUES[0].image} alt={MOCK_VENUES[0].name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col justify-between py-1 flex-grow">
              <div>
                <h4 className="text-sm font-black text-slate-900">{MOCK_VENUES[0].name}</h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                  <MapPin size={10} />
                  <span>{MOCK_VENUES[0].address}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <MapPin size={10} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400">距您 1.2km</span>
                </div>
                <button 
                  onClick={() => onSelectVenue(MOCK_VENUES[0])}
                  className="px-4 py-1.5 bg-brand-primary text-white text-[10px] font-black rounded-full shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                >
                  详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayPage = ({ onBack, onBookingVenue }: { onBack: () => void, onBookingVenue: (venue?: Venue) => void }) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'venues'>('sessions');
  const [sessionSort, setSessionSort] = useState<'default' | 'nearest' | 'price_low'>('default');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'tomorrow' | 'weekend'>('all');
  const [distanceFilter, setDistanceFilter] = useState<'near' | '1km' | '3km' | '5km'>('near');
  const [venueSort, setVenueSort] = useState<'distance' | 'price'>('distance');
  const [showFilter, setShowFilter] = useState(false);
  const [showAISearch, setShowAISearch] = useState(false);
  const [activeSubPage, setActiveSubPage] = useState<'early' | 'post' | 'join' | 'clubs' | 'map' | null>(null);

  const sortedVenues = useMemo(() => {
    return [...MOCK_VENUES].sort((a, b) => {
      if (venueSort === 'distance') {
        return parseFloat(a.distance) - parseFloat(b.distance);
      }
      return a.price - b.price;
    });
  }, [venueSort]);

  if (activeSubPage === 'early') return <EarlyBirdPage onBack={() => setActiveSubPage(null)} onSelectVenue={(v) => onBookingVenue(v)} />;
  if (activeSubPage === 'post') return <PostGamePage onBack={() => setActiveSubPage(null)} />;
  if (activeSubPage === 'join') return <JoinGamePage onBack={() => setActiveSubPage(null)} />;
  if (activeSubPage === 'clubs') return <ClubsPage onBack={() => setActiveSubPage(null)} />;
  if (activeSubPage === 'map') return <SportsMapPage onBack={() => setActiveSubPage(null)} onSelectVenue={(v) => onBookingVenue(v)} />;

  return (
    <div className="pb-24 bg-slate-50 min-h-screen">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold">打球约球</h1>
      </header>

      <div className="p-4 space-y-6">
        {/* Search Bar with AI Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索球馆、球局、俱乐部..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all card-shadow"
            />
          </div>
          <button 
            onClick={() => setShowAISearch(true)}
            className="px-4 bg-brand-primary text-white rounded-2xl flex items-center gap-2 text-xs font-bold shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
          >
            <Sparkles size={16} />
            <span>AI搜索</span>
          </button>
        </div>

        {/* King Kong Area (5 items) */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { id: 'early', icon: Clock, label: '早场特惠', color: 'bg-amber-500' },
            { id: 'post', icon: Plus, label: '发布球局', color: 'bg-brand-primary' },
            { id: 'join', icon: Users, label: '加入球局', color: 'bg-blue-500' },
            { id: 'clubs', icon: LayoutGrid, label: '俱乐部', color: 'bg-purple-500' },
            { id: 'map', icon: MapIcon, label: '运动地图', color: 'bg-emerald-500' },
          ].map((item, i) => (
            <div 
              key={i} 
              onClick={() => setActiveSubPage(item.id as any)}
              className="flex flex-col items-center gap-2 cursor-pointer active:scale-90 transition-all"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", item.color)}>
                <item.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Tab & Filters Container */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-2">
          {/* Tab Selection */}
          <div className="flex p-1 bg-slate-100 rounded-2xl flex-shrink-0">
            <button 
              onClick={() => setActiveTab('sessions')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                activeTab === 'sessions' ? "bg-white text-brand-primary shadow-sm" : "text-slate-400"
              )}
            >
              球局
            </button>
            <button 
              onClick={() => setActiveTab('venues')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                activeTab === 'venues' ? "bg-white text-brand-primary shadow-sm" : "text-slate-400"
              )}
            >
              场馆
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-600 shadow-sm active:scale-95 transition-all">
                {distanceFilter === 'near' ? '附近' : distanceFilter}
                <ChevronDown size={10} />
              </button>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-600 shadow-sm active:scale-95 transition-all">
                {sessionSort === 'default' ? '默认排序' : (sessionSort === 'nearest' ? '离我最近' : '价格最低')}
                <ChevronDown size={10} />
              </button>
            </div>

            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-600 shadow-sm active:scale-95 transition-all">
                {timeFilter === 'all' ? '全部时间' : '选择时间'}
                <ChevronDown size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          {activeTab === 'sessions' ? (
            <div className="space-y-4">
              {MOCK_GAMES.map((game) => (
                <GameActivityCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedVenues.map((venue) => (
                <div 
                  key={venue.id} 
                  onClick={() => onBookingVenue(venue)}
                  className="bg-white rounded-[32px] p-3 flex gap-4 card-shadow border border-slate-100 active:scale-[0.98] transition-all cursor-pointer animate-in fade-in slide-in-from-right-4 duration-500"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col justify-between py-1 flex-grow">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 line-clamp-1">{venue.name}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                        <MapPin size={10} />
                        <span className="truncate max-w-[150px]">{venue.address}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-brand-primary font-bold mt-1">
                        <Activity size={10} />
                        <span>{venue.activities?.length || 0} 个正在进行的球局</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Navigation size={10} className="text-emerald-500" />
                        <span className="text-[10px] text-slate-400 font-bold">{venue.distance}</span>
                      </div>
                      <div className="text-brand-primary">
                        <span className="text-[10px] font-bold">¥</span>
                        <span className="text-sm font-black">{venue.price}</span>
                        <span className="text-[8px] font-bold text-slate-400 ml-0.5">/时起</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Search Modal Placeholder */}
      <AnimatePresence>
        {showAISearch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAISearch(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[40px] p-8 relative z-10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-6 animate-pulse">
                  <Sparkles size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">AI 智能搜索</h3>
                <p className="text-xs text-slate-400 mb-8 leading-relaxed">
                  试试这样说：<br/>
                  "帮我找一下周六下午思明区有空位的羽毛球馆"<br/>
                  "我想加入一个水平在Lv.4左右的进阶球局"
                </p>
                <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-1.5 h-4 bg-brand-primary rounded-full animate-bounce" />
                    <span className="text-sm font-medium">正在倾听...</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAISearch(false)}
                  className="w-full py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20"
                >
                  开始对话
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filter Modal Placeholder (Reusing logic from HomePage) */}
      <AnimatePresence>
        {showFilter && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilter(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[40px] p-6 relative z-10 max-h-[80vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-900">筛选球馆</h3>
                <button onClick={() => setShowFilter(false)} className="p-2 text-slate-400">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">区域</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['不限', '思明区', '湖里区', '集美区', '海沧区', '同安区'].map(area => (
                      <button key={area} className="py-3 rounded-xl bg-slate-50 text-[10px] font-bold text-slate-600 border border-transparent hover:border-brand-primary hover:text-brand-primary transition-all">
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">设施服务</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['空调', '淋浴', '免费停车', '器材租借', '专业塑胶', '夜间照明'].map(tag => (
                      <button key={tag} className="py-3 rounded-xl bg-slate-50 text-[10px] font-bold text-slate-600 border border-transparent hover:border-brand-primary hover:text-brand-primary transition-all">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 text-sm font-black">重置</button>
                <button onClick={() => setShowFilter(false)} className="flex-[2] py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20">确定</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ParticipantsPage = ({ 
  participants, 
  onBack, 
  onUpdate 
}: { 
  participants: ParticipantInfo[], 
  onBack: () => void,
  onUpdate: (newParticipants: ParticipantInfo[]) => void
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ParticipantInfo>({
    name: '',
    phone: '',
    idType: 'ID_CARD',
    idNumber: '',
    gender: 'MALE',
    birthDate: '',
    clothingSize: 'L'
  });

  const handleSave = () => {
    if (!formData.name || !formData.phone) return;
    
    let newParticipants = [...participants];
    if (editingIndex !== null) {
      newParticipants[editingIndex] = formData;
    } else {
      newParticipants.push(formData);
    }
    
    onUpdate(newParticipants);
    setIsAdding(false);
    setEditingIndex(null);
    setFormData({
      name: '',
      phone: '',
      idType: 'ID_CARD',
      idNumber: '',
      gender: 'MALE',
      birthDate: '',
      clothingSize: 'L',
      photo: ''
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(participants[index]);
    setIsAdding(true);
  };

  const handleDelete = (index: number) => {
    const newParticipants = participants.filter((_, i) => i !== index);
    onUpdate(newParticipants);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-50 flex flex-col w-full max-w-md mx-auto left-0 right-0">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50 w-full">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">常用参赛人</h1>
        </div>
        <button 
          onClick={() => {
            setEditingIndex(null);
            setFormData({
              name: '',
              phone: '',
              idType: 'ID_CARD',
              idNumber: '',
              gender: 'MALE',
              birthDate: '',
              clothingSize: 'L',
              photo: ''
            });
            setIsAdding(true);
          }}
          className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <Users size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">暂无常用参赛人</p>
          </div>
        ) : (
          participants.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 card-shadow border border-slate-50 relative group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-800">{p.name}</h3>
                    {p.tags && p.tags.map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[8px] font-black uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-slate-400">{p.phone}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.gender === 'MALE' ? '男' : '女'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(i)} className="p-2 text-slate-400 hover:text-brand-primary transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(i)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {/* ID info hidden on primary page as per request */}
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-end justify-center"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-3xl p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900">{editingIndex !== null ? '编辑参赛人' : '新增参赛人'}</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setFormData({...formData, photo: reader.result as string});
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="w-24 h-32 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 overflow-hidden relative group cursor-pointer"
                  >
                    {formData.photo ? (
                      <img src={formData.photo} className="w-full h-full object-cover" alt="Registration Photo" />
                    ) : (
                      <>
                        <Camera size={24} />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-center px-2">上传报名照</span>
                      </>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Pencil size={16} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">姓名</label>
                    <input 
                      type="text" 
                      placeholder="请输入姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border-0 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">性别</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})}
                      className="w-full bg-slate-50 border-0 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none"
                    >
                      <option value="MALE">男</option>
                      <option value="FEMALE">女</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">手机号码</label>
                  <input 
                    type="tel" 
                    placeholder="请输入手机号码"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border-0 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">证件类型</label>
                    <select 
                      value={formData.idType}
                      onChange={(e) => setFormData({...formData, idType: e.target.value as IDType})}
                      className="w-full bg-slate-50 border-0 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none"
                    >
                      <option value="ID_CARD">身份证</option>
                      <option value="PASSPORT">护照</option>
                      <option value="HMT_PASS">港澳台通行证</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">证件号码</label>
                    <input 
                      type="text" 
                      placeholder="请输入证件号码"
                      value={formData.idNumber}
                      onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                      className="w-full bg-slate-50 border-0 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full py-5 bg-brand-primary text-white rounded-xl text-base font-black shadow-xl shadow-brand-primary/20 active:scale-95 transition-all"
              >
                保存
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LeaderManagementPage = ({ 
  onBack, 
  initialTab = 'registering',
  initialSelectedMatchId,
  onSelectTournament
}: { 
  onBack: () => void,
  initialTab?: 'registering' | 'ongoing' | 'history',
  initialSelectedMatchId?: string,
  onSelectTournament?: (tournament: Tournament) => void
}) => {
  const [activeTab, setActiveTab] = useState<'registering' | 'ongoing' | 'history'>(initialTab);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [lineup, setLineup] = useState<any[]>([]);
  const [showInviteQR, setShowInviteQR] = useState(false);
  const [detailTab, setDetailTab] = useState<'lineup' | 'schedule'>('lineup');
  const [showTeamMembers, setShowTeamMembers] = useState(false);
  const [showTransferPermission, setShowTransferPermission] = useState(false);
  const [transferSearch, setTransferSearch] = useState('');

  const registeringMatches = [
    {
      id: 'L1',
      title: '2026年厦门市全民健身运动会羽毛球赛（同安站）',
      status: 'registration',
      deadline: '2026-05-10',
      teamName: '雷霆一队',
      leaderName: '郭靖',
      image: 'https://picsum.photos/seed/badminton1/800/400',
      location: '同安体育馆',
      matchStartTime: '2026-05-20 09:00',
      participants: 120,
      maxParticipants: 200,
      regEndTime: '2026-05-10 18:00',
      type: 'Individual',
      categories: [
        {
          name: 'B组男单',
          players: [
            { name: '郭靖', status: '已报名', avatar: 'https://picsum.photos/seed/user1/100/100' },
            { name: '杨过', status: '已报名', avatar: 'https://picsum.photos/seed/user3/100/100' }
          ]
        },
        {
          name: 'B组男双',
          players: [
            { name: '郭靖/杨过', status: '已报名', avatar: 'https://picsum.photos/seed/user1/100/100' },
            { name: '乔峰/令狐冲', status: '已报名', avatar: 'https://picsum.photos/seed/user5/100/100' }
          ]
        },
        {
          name: 'A组女双',
          players: [
            { name: '黄蓉/小龙女', status: '已报名', avatar: 'https://picsum.photos/seed/user2/100/100' }
          ]
        },
        {
          name: 'A组混双',
          players: [
            { name: '郭靖/黄蓉', status: '已报名', avatar: 'https://picsum.photos/seed/user1/100/100' },
            { name: '杨过/小龙女', status: '已报名', avatar: 'https://picsum.photos/seed/user3/100/100' }
          ]
        }
      ],
      members: [
        { name: '郭靖', role: '领队', status: '已报名', avatar: 'https://picsum.photos/seed/user1/100/100' },
        { name: '黄蓉', role: '队员', status: '已报名', avatar: 'https://picsum.photos/seed/user2/100/100' },
        { name: '杨过', role: '队员', status: '已报名', avatar: 'https://picsum.photos/seed/user3/100/100' },
        { name: '小龙女', role: '队员', status: '已报名', avatar: 'https://picsum.photos/seed/user4/100/100' },
        { name: '乔峰', role: '队员', status: '已报名', avatar: 'https://picsum.photos/seed/user5/100/100' },
        { name: '令狐冲', role: '队员', status: '已报名', avatar: 'https://picsum.photos/seed/user6/100/100' },
      ],
      registeredCount: '7'
    }
  ];

  const ongoingMatches = [
    {
      id: 'L2',
      title: '2026 "羽协杯" 业余羽毛球公开赛',
      status: 'ongoing',
      type: 'Individual',
      teamName: '雷霆羽球社',
      leaderName: '郭靖',
      image: 'https://picsum.photos/seed/badminton2/800/400',
      location: '厦门市体育中心',
      matchStartTime: '2026-08-15 09:00',
      matches: [
        { 
          id: 'M1',
          category: '男单A组', 
          groupInfo: '小组赛 第1轮',
          player1: '郭靖', 
          player2: '张三', 
          score1: 21,
          score2: 18,
          setScore1: 2,
          setScore2: 0,
          status: 'finished',
          winner: 1,
          time: '09:00',
          date: '8/15',
          court: '1号场'
        },
        { 
          id: 'M2',
          category: '女单B组', 
          groupInfo: '小组赛 第1轮',
          player1: '黄蓉', 
          player2: '李四', 
          score1: 15,
          score2: 21,
          setScore1: 0,
          setScore2: 2,
          status: 'finished',
          winner: 2,
          time: '09:30',
          date: '8/15',
          court: '2号场'
        },
        { 
          id: 'M3',
          category: '男双A组', 
          groupInfo: '小组赛 第2轮',
          player1: '郭靖', 
          player1_2: '杨过',
          player2: '王五', 
          player2_2: '赵六',
          score1: 12,
          score2: 8,
          setScore1: 0,
          setScore2: 0,
          status: 'ongoing',
          time: '10:00',
          date: '8/15',
          court: '1号场'
        },
        { 
          id: 'M4',
          category: '男单A组', 
          groupInfo: '小组赛 第3轮',
          player1: '郭靖', 
          player2: '赵敏', 
          status: 'upcoming',
          time: '11:00',
          date: '8/15',
          court: '3号场'
        },
      ]
    },
    {
      id: 'L3',
      title: '2026 春季高校羽毛球联赛 - 厦门站',
      status: 'ongoing',
      type: 'Team',
      teamName: '厦大校友队',
      leaderName: '郭靖',
      image: 'https://picsum.photos/seed/badminton3/800/400',
      location: '思明体育馆',
      matchStartTime: '2026-04-10 14:00',
      nextMatch: {
        opponent: '集大校友队',
        time: '今日 14:00',
        court: '3号场'
      },
      lineupSlots: [
        { order: '男单', players: [''] },
        { order: '男双', players: ['', ''] },
        { order: '女单', players: [''] },
        { order: '女双', players: ['', ''] },
        { order: '混双', players: ['', ''] },
      ],
      availablePlayers: ['郭靖', '杨过', '张无忌', '令狐冲', '乔峰', '段誉', '虚竹'],
      teamMatches: [
        { 
          id: 'TM1',
          category: '混合团体', 
          groupInfo: '小组赛 第1轮',
          opponent: '集大校友队',
          status: 'finished',
          score: '3 : 2',
          result: '胜',
          time: '09:00',
          date: '4/10',
          court: '1号场',
          lineupStatus: 'submitted'
        },
        { 
          id: 'TM2',
          category: '混合团体', 
          groupInfo: '小组赛 第2轮',
          opponent: '华大校友队',
          status: 'ongoing',
          score: '1 : 1',
          time: '14:00',
          date: '4/10',
          court: '3号场',
          lineupStatus: 'submitted'
        },
        { 
          id: 'TM3',
          category: '混合团体', 
          groupInfo: '小组赛 第3轮',
          opponent: '理工校友队',
          status: 'upcoming',
          time: '16:30',
          date: '4/10',
          court: '2号场',
          lineupStatus: 'not_submitted'
        },
      ]
    }
  ];

  const historyMatches = [
    {
      id: 'H1',
      title: '2025年厦门市羽毛球公开赛',
      status: 'finished',
      teamName: '雷霆一队',
      leaderName: '郭靖',
      image: 'https://picsum.photos/seed/badminton4/800/400',
      location: '厦门市体育中心',
      matchStartTime: '2025-11-15 09:00',
      type: 'Individual',
      participants: 150,
      maxParticipants: 200,
      matches: [
        { 
          id: 'HM1',
          category: '男单A组', 
          groupInfo: '决赛',
          player1: '郭靖', 
          player2: '林丹', 
          score1: 21,
          score2: 19,
          setScore1: 2,
          setScore2: 1,
          status: 'finished',
          winner: 1,
          time: '15:00',
          date: '11/16',
          court: '中央球场'
        }
      ]
    }
  ];

  useEffect(() => {
    if (selectedMatch?.id === 'L3') {
      setLineup(selectedMatch.lineupSlots);
    }
  }, [selectedMatch]);

  useEffect(() => {
    if (initialSelectedMatchId) {
      const match = [...registeringMatches, ...ongoingMatches, ...historyMatches].find(m => m.id === initialSelectedMatchId);
      if (match) {
        setSelectedMatch(match);
      }
    }
  }, [initialSelectedMatchId]);

  if (selectedMatch) {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setSelectedMatch(null)} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold truncate pr-4">{selectedMatch.title}</h1>
        </header>

        <div className="p-4 space-y-4">
          {/* Scenario 1: Registration Detail */}
          {selectedMatch.id === 'L1' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 card-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 leading-tight">{selectedMatch.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded uppercase tracking-widest">报名中</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">截止: {selectedMatch.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 py-4 border-y border-slate-50">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">队伍名称</p>
                    <p className="text-sm font-black text-slate-900">{selectedMatch.teamName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">领队姓名</p>
                    <p className="text-sm font-black text-slate-900">{selectedMatch.leaderName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">已报组别数</p>
                    <p className="text-sm font-black text-brand-primary">{selectedMatch.categories?.length || 0} 个项目</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">已报人数</p>
                    <p className="text-sm font-black text-slate-900">{selectedMatch.registeredCount} 人</p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">各组别报名详情</p>
                  <div className="space-y-4">
                    {selectedMatch.categories?.map((cat: any, cIdx: number) => (
                      <div key={cIdx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-3 bg-brand-primary rounded-full" />
                          <span className="text-xs font-black text-slate-900">{cat.name}</span>
                          <span className="text-[9px] font-bold text-slate-400 ml-auto">已报 {cat.players.length} {cat.name.includes('单') ? '人' : '对'}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cat.players.map((player: any, pIdx: number) => (
                            <div key={pIdx} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                              <div className="w-5 h-5 rounded-full overflow-hidden">
                                <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[10px] font-bold text-slate-700">{player.name}</span>
                              <Check size={10} className="text-emerald-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button 
                    onClick={() => setShowInviteQR(true)}
                    className="py-4 bg-brand-primary text-white rounded-2xl text-xs font-black shadow-lg shadow-brand-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} strokeWidth={3} />
                    <span>邀请更多队员</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (onSelectTournament) {
                        const t = MOCK_TOURNAMENTS.find(t => t.title.includes('全民健身运动会'));
                        if (t) onSelectTournament(t);
                      } else {
                        alert('正在跳转赛事详情...');
                      }
                    }}
                    className="py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <FileText size={16} strokeWidth={3} />
                    <span>查看赛事详情</span>
                  </button>
                </div>
              </div>

              {/* Invitation QR Modal */}
              <AnimatePresence>
                {showInviteQR && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                  >
                    <motion.div 
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      className="bg-white w-full max-w-xs rounded-[40px] p-8 flex flex-col items-center text-center relative"
                    >
                      <button 
                        onClick={() => setShowInviteQR(false)}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                      >
                        <X size={20} />
                      </button>
                      
                      <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
                        <Users size={32} />
                      </div>
                      
                      <h3 className="text-lg font-black text-slate-900 mb-2">邀请队员加入</h3>
                      <p className="text-xs text-slate-400 font-bold mb-8">扫描二维码加入“{selectedMatch.teamName}”</p>
                      
                      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-8">
                        <QrCode size={180} className="text-slate-900" />
                      </div>
                      
                      <button 
                        onClick={() => setShowInviteQR(false)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-black shadow-xl"
                      >
                        完成
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Scenario 2: Individual Competition Ongoing */}
          {selectedMatch.id === 'L2' && (
            <div className="space-y-4">
              {/* Header Info */}
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 card-shadow">
                <h2 className="text-lg font-black text-slate-900 leading-tight mb-4">{selectedMatch.title}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">队伍名称</p>
                    <p className="text-sm font-black text-slate-900">{selectedMatch.teamName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">领队姓名</p>
                    <p className="text-sm font-black text-slate-900">{selectedMatch.leaderName}</p>
                  </div>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '总场次', value: selectedMatch.matches.length, color: 'text-slate-900' },
                  { label: '参赛中', value: selectedMatch.matches.filter((m: any) => m.status === 'ongoing').length, color: 'text-brand-primary' },
                  { label: '待开始', value: selectedMatch.matches.filter((m: any) => m.status === 'upcoming').length, color: 'text-[#1FC47F]' },
                  { label: '已结束', value: selectedMatch.matches.filter((m: any) => m.status === 'finished').length, color: 'text-slate-400' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-3 rounded-2xl border border-slate-100 text-center">
                    <div className={cn("text-lg font-black", stat.color)}>{stat.value}</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-2">队伍全部比赛</h3>
                {selectedMatch.matches.map((match: any) => {
                  const isFinished = match.status === 'finished';
                  const isOngoing = match.status === 'ongoing';
                  const isUpcoming = match.status === 'upcoming';

                  return (
                    <motion.div 
                      layout
                      key={match.id}
                      className="bg-white rounded-[32px] border border-slate-100 overflow-hidden card-shadow relative"
                    >
                      {/* Status Ribbon */}
                      <div className={cn(
                        "absolute top-0 right-0 px-6 py-1 translate-x-[25%] translate-y-[25%] rotate-45 text-[10px] font-black text-white z-10",
                        isFinished ? "bg-slate-400" : (isOngoing ? "bg-red-500" : "bg-[#1FC47F]")
                      )}>
                        {isFinished ? '已结束' : (isOngoing ? '比赛中' : '待开始')}
                      </div>

                      <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4 pr-12">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-black text-slate-800">{match.category}</h3>
                              <span className="bg-brand-primary/10 text-brand-primary text-[8px] px-1.5 py-0.5 rounded font-black uppercase">我的队伍</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{match.groupInfo}</p>
                          </div>
                        </div>

                        {/* Info Row */}
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mb-4 pb-4 border-b border-slate-50">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} className="text-slate-300" />
                            <span>{match.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText size={12} className="text-slate-300" />
                            <span className="text-brand-primary">
                              {(() => {
                                const [h, m] = match.time.split(':').map(Number);
                                const total = h * 60 + m;
                                const format = (t: number) => `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;
                                return `${format(total - 30)}-${format(total - 15)}`;
                              })()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-300" />
                            <span>{match.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-300" />
                            <span>{match.court}</span>
                          </div>
                        </div>

                        {/* Matchup Area */}
                        <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-2">
                          {/* Player 1 */}
                          <div className="flex-1 flex flex-col items-center">
                            <div className="relative">
                              <img 
                                src={`https://picsum.photos/seed/${match.player1}/100/100`} 
                                alt={match.player1} 
                                className="w-12 h-12 rounded-full border-2 border-white shadow-sm mb-2"
                                referrerPolicy="no-referrer"
                              />
                              {isFinished && match.winner === 1 && (
                                <div className="absolute -top-1 -left-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                                  胜
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-black text-slate-800 text-center">{match.player1}{match.player1_2 ? `/${match.player1_2}` : ''}</span>
                          </div>

                          {/* Score */}
                          <div className="flex flex-col items-center gap-1 min-w-[80px]">
                            {isUpcoming ? (
                              <div className="text-lg font-black text-slate-300 italic tracking-widest">VS</div>
                            ) : (
                              <>
                                <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-sm font-black tracking-tighter">
                                  {`${match.setScore1 || 0} : ${match.setScore2 || 0}`}
                                </div>
                                <div className="bg-white border border-orange-100 text-orange-400 px-3 py-0.5 rounded-lg text-[10px] font-black">
                                  {`${match.score1 || 0} : ${match.score2 || 0}`}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Player 2 */}
                          <div className="flex-1 flex flex-col items-center">
                            <div className="relative">
                              <img 
                                src={`https://picsum.photos/seed/${match.player2}/100/100`} 
                                alt={match.player2} 
                                className="w-12 h-12 rounded-full border-2 border-white shadow-sm mb-2"
                                referrerPolicy="no-referrer"
                              />
                              {isFinished && match.winner === 2 && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                                  胜
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-black text-slate-800 text-center">{match.player2}{match.player2_2 ? `/${match.player2_2}` : ''}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scenario 3: Team Competition Lineup & Schedule */}
          {selectedMatch.id === 'L3' && (
            <div className="space-y-4">
              {/* Header Info */}
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 card-shadow">
                <h2 className="text-lg font-black text-slate-900 leading-tight mb-4">{selectedMatch.title}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">队伍名称</p>
                    <p className="text-sm font-black text-slate-900">{selectedMatch.teamName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">领队姓名</p>
                    <p className="text-sm font-black text-slate-900">{selectedMatch.leaderName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTeamMembers(true)}
                  className="w-full py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between px-4 group active:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-brand-primary" />
                    <span className="text-xs font-black text-slate-700">我的团队</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">查看人员名单</span>
                    <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Sub Tabs */}
              <div className="bg-white p-1 rounded-2xl border border-slate-100 flex gap-1">
                {[
                  { id: 'lineup', label: '填写出场名单' },
                  { id: 'schedule', label: '查看比赛赛况' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDetailTab(tab.id as any)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      detailTab === tab.id ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" : "text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {detailTab === 'lineup' && (
                <div className="space-y-4">
                  <div className="bg-slate-900 p-5 rounded-[32px] border border-slate-800 card-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10 flex justify-between items-center">
                      <div>
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">下一场对手</div>
                        <div className="text-lg font-black text-white tracking-tight">{selectedMatch.nextMatch.opponent}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">{selectedMatch.nextMatch.time}</div>
                        <div className="text-sm font-black text-brand-primary">{selectedMatch.nextMatch.court}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-[32px] border border-slate-100 card-shadow">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-black text-slate-900">填写出场名单</h3>
                      <button 
                        onClick={() => setShowTransferPermission(true)}
                        className="text-[10px] text-brand-primary font-black uppercase tracking-widest bg-brand-primary/5 px-2 py-1 rounded-lg flex items-center gap-1"
                      >
                        <Shield size={12} />
                        转让权限
                      </button>
                    </div>

                    <div className="space-y-6">
                      {lineup.map((slot: any, idx: number) => (
                        <div key={idx} className="space-y-3">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1 h-3 bg-brand-primary rounded-full" />
                            {slot.order}
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            {slot.players.map((p: string, pIdx: number) => (
                              <div key={pIdx} className="relative">
                                <select 
                                  value={p}
                                  onChange={(e) => {
                                    const newLineup = [...lineup];
                                    newLineup[idx].players[pIdx] = e.target.value;
                                    setLineup(newLineup);
                                  }}
                                  className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm font-black text-slate-900 appearance-none focus:ring-2 focus:ring-brand-primary/20"
                                >
                                  <option value="">{slot.players.length > 1 ? `选择队员 ${pIdx + 1}` : '请选择队员'}</option>
                                  {selectedMatch.availablePlayers.map((player: string) => (
                                    <option key={player} value={player}>{player}</option>
                                  ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                  <ChevronDown size={16} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => {
                        alert('出场名单已提交！');
                        setSelectedMatch(null);
                      }}
                      style={{ backgroundColor: '#1FC47F' }}
                      className="w-full mt-8 py-4 text-white rounded-2xl text-sm font-black shadow-xl active:scale-[0.98] transition-all"
                    >
                      确认并提交名单
                    </button>
                  </div>
                </div>
              )}

              {detailTab === 'schedule' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-2">队伍全部比赛</h3>
                  {selectedMatch.teamMatches.map((match: any) => {
                    const isFinished = match.status === 'finished';
                    const isOngoing = match.status === 'ongoing';
                    const isUpcoming = match.status === 'upcoming';

                    return (
                      <motion.div 
                        layout
                        key={match.id}
                        className="bg-white rounded-[32px] border border-slate-100 overflow-hidden card-shadow relative"
                      >
                        {/* Status Ribbon */}
                        <div className={cn(
                          "absolute top-0 right-0 px-6 py-1 translate-x-[25%] translate-y-[25%] rotate-45 text-[10px] font-black text-white z-10",
                          isFinished ? "bg-slate-400" : (isOngoing ? "bg-red-500" : "bg-[#1FC47F]")
                        )}>
                          {isFinished ? '已结束' : (isOngoing ? '比赛中' : '待开始')}
                        </div>

                        <div className="p-6">
                          {/* Header */}
                          <div className="flex justify-between items-start mb-4 pr-12">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-black text-slate-800">{match.category}</h3>
                                <span className="bg-brand-primary/10 text-brand-primary text-[8px] px-1.5 py-0.5 rounded font-black uppercase">团体赛</span>
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{match.groupInfo}</p>
                            </div>
                          </div>

                          {/* Info Row */}
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mb-4 pb-4 border-b border-slate-50">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} className="text-slate-300" />
                              <span>{match.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText size={12} className="text-slate-300" />
                              <span className="text-brand-primary">
                                {(() => {
                                  const [h, m] = match.time.split(':').map(Number);
                                  const total = h * 60 + m;
                                  const format = (t: number) => `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;
                                  return `${format(total - 30)}-${format(total - 15)}`;
                                })()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={12} className="text-slate-300" />
                              <span>{match.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={12} className="text-slate-300" />
                              <span>{match.court}</span>
                            </div>
                            <div className="ml-auto">
                              {match.lineupStatus === 'submitted' ? (
                                <span className="text-emerald-500 flex items-center gap-1">
                                  <Check size={12} />
                                  名单已提交
                                </span>
                              ) : (
                                <span className="text-amber-500 flex items-center gap-1">
                                  <AlertCircle size={12} />
                                  名单未提交
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Matchup Area */}
                          <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-2">
                            <div className="flex-1 text-center">
                              <div className="text-sm font-black text-slate-900">{selectedMatch.teamName}</div>
                              <div className="text-[8px] text-slate-400 font-bold uppercase mt-1">我的队伍</div>
                            </div>

                            <div className="flex flex-col items-center gap-1 min-w-[80px]">
                              {isUpcoming ? (
                                <div className="text-lg font-black text-slate-300 italic tracking-widest">VS</div>
                              ) : (
                                <>
                                  <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-sm font-black tracking-tighter">
                                    {match.score}
                                  </div>
                                  {match.result && (
                                    <div className="bg-white border border-orange-100 text-orange-400 px-3 py-0.5 rounded-lg text-[10px] font-black">
                                      {match.result}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>

                            <div className="flex-1 text-center">
                              <div className="text-sm font-black text-slate-900">{match.opponent}</div>
                              <div className="text-[8px] text-slate-400 font-bold uppercase mt-1">对手</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Team Members Modal */}
              <AnimatePresence>
                {showTeamMembers && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-end justify-center p-0 bg-slate-900/60 backdrop-blur-sm"
                  >
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      className="bg-white w-full max-w-md rounded-t-[40px] p-8 flex flex-col max-h-[80vh]"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900">人员名单</h3>
                        <button 
                          onClick={() => setShowTeamMembers(false)}
                          className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      
                      <div className="overflow-y-auto space-y-3 pb-8">
                        {selectedMatch.availablePlayers.map((player: string, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                <User size={20} />
                              </div>
                              <div>
                                <div className="text-sm font-black text-slate-900">{player}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">队员</div>
                              </div>
                            </div>
                            <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">已就绪</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Transfer Permission Modal */}
              <AnimatePresence>
                {showTransferPermission && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] flex items-end justify-center p-0 bg-slate-900/60 backdrop-blur-sm"
                  >
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      className="bg-white w-full max-w-md rounded-t-[40px] p-8 flex flex-col max-h-[90vh]"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">转让管理权限</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">转让后您将失去该赛事的管理权限</p>
                        </div>
                        <button 
                          onClick={() => setShowTransferPermission(false)}
                          className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          placeholder="搜索队员姓名..."
                          value={transferSearch}
                          onChange={(e) => setTransferSearch(e.target.value)}
                          className="w-full bg-slate-50 border-0 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-900 focus:ring-2 focus:ring-brand-primary/20"
                        />
                      </div>
                      
                      <div className="overflow-y-auto space-y-3 pb-8">
                        {selectedMatch.availablePlayers
                          .filter((p: string) => p.includes(transferSearch))
                          .map((player: string, idx: number) => (
                          <button 
                            key={idx} 
                            onClick={() => {
                              if (confirm(`确定要将“${selectedMatch.title}”的管理权限转让给“${player}”吗？`)) {
                                alert('权限转让成功！');
                                setShowTransferPermission(false);
                                setSelectedMatch(null);
                              }
                            }}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                <User size={20} />
                              </div>
                              <div>
                                <div className="text-sm font-black text-slate-900">{player}</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">队员</div>
                              </div>
                            </div>
                            <div className="text-[10px] font-black text-brand-primary bg-brand-primary/5 px-3 py-1.5 rounded-xl">选择转让</div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold">领队管理中心</h1>
      </header>

      <div className="bg-white px-4 py-2 flex gap-4 border-b border-slate-100 sticky top-[88px] z-40">
        {[
          { id: 'registering', label: '报名中' },
          { id: 'ongoing', label: '比赛中' },
          { id: 'history', label: '历史比赛' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "relative py-3 text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab.id ? "text-brand-primary" : "text-slate-400"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeLeaderTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {[...registeringMatches, ...ongoingMatches, ...historyMatches].filter(m => {
          if (activeTab === 'registering') return m.status === 'registration';
          if (activeTab === 'ongoing') return m.status === 'ongoing';
          if (activeTab === 'history') return m.status === 'finished';
          return false;
        }).map((t: any) => (
          <motion.div 
            key={t.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMatch(t)}
            className="bg-white rounded-[24px] overflow-hidden card-shadow border border-slate-100 text-left flex h-32"
          >
            <div className="relative w-32 flex-shrink-0">
              <img src={t.image} alt={t.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-2 left-2">
                <span className={cn(
                  "text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider backdrop-blur-md border",
                  t.status === 'registration' ? "bg-emerald-500/80 text-white border-emerald-400" : 
                  t.status === 'ongoing' ? "bg-blue-500/80 text-white border-blue-400" :
                  "bg-slate-500/80 text-white border-slate-400"
                )}>
                  {t.status === 'registration' ? '报名中' : t.status === 'ongoing' ? '比赛中' : '已结束'}
                </span>
              </div>
            </div>
            <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
              <div className="space-y-1">
                <h4 className="text-slate-900 text-xs font-black leading-tight line-clamp-2">{t.title}</h4>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                  <MapPin size={10} className="text-slate-300" />
                  <span className="truncate">{t.location}</span>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                    <Calendar size={10} className="text-slate-300" />
                    <span>{t.matchStartTime.split(' ')[0]}</span>
                  </div>
                  {t.status === 'registration' ? (
                    <div className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                      {getRegistrationCountdown(t.regEndTime)}
                    </div>
                  ) : t.status === 'ongoing' ? (
                    <div className="text-[9px] font-black text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Activity size={8} />
                      查看赛况
                    </div>
                  ) : (
                    <div className="text-[9px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
                      查看回顾
                    </div>
                  )}
                </div>
                
                {t.status === 'registration' && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-primary" 
                        style={{ width: `${Math.min(100, (t.participants / (t.maxParticipants || 200)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 whitespace-nowrap">
                      {t.participants}/{t.maxParticipants || 200} 席
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage = ({ 
  userProfile, 
  onUpdateProfile,
  onSelectTournament
}: { 
  userProfile: ParticipantInfo | null, 
  onUpdateProfile: (profile: ParticipantInfo) => void,
  onSelectTournament?: (tournament: Tournament) => void
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSubPage, setActiveSubPage] = useState<'none' | 'orders' | 'coupons' | 'wallet' | 'my_competitions' | 'achievements' | 'id_card' | 'verification' | 'participants' | 'notifications' | 'my_games' | 'sports_map' | 'clubs' | 'favorites' | 'customer_service' | 'leader_management'>('none');
  const [leaderInitialState, setLeaderInitialState] = useState<{ tab: 'registering' | 'ongoing' | 'history', matchId?: string }>({ tab: 'registering' });
  const [notificationTab, setNotificationTab] = useState<'tournament' | 'venue' | 'platform' | 'course'>('tournament');
  const [playerPool, setPlayerPool] = useState<ParticipantInfo[]>(MOCK_PLAYER_POOL);
  const [selectedCompetition, setSelectedCompetition] = useState<any | null>(null);
  const [competitionList, setCompetitionList] = useState([
    { id: 'T1', title: '2026 "羽协杯" 业余羽毛球公开赛', category: '男单B组', status: '比赛中', date: '2026-08-15', location: '厦门市思明体育馆', organizer: '厦门市羽毛球协会', fee: '100', type: 'ongoing' },
    { id: 'T2', title: '夏季联赛 - 厦门站', category: '男单', status: '待支付', date: '2026-06-10', location: '思明体育馆', organizer: '卡猫体育', fee: '80', type: 'registering' },
    { id: 'T5', title: '全民健身运动会', category: '男双', status: '已报名', date: '2026-05-20', location: '湖里体育馆', organizer: '体育局', fee: '50', type: 'registering' },
    { id: 'T3', title: '2025 冬季邀请赛', category: '男单', status: '已结束', date: '2025-12-05', location: '集美体育中心', organizer: '集美羽协', fee: '100', type: 'history' },
    { id: 'T4', title: '秋季积分赛', category: '男单', status: '已结束', date: '2025-10-20', location: '海沧体育馆', organizer: '海沧羽协', fee: '60', type: 'history' },
  ]);
  const pendingMatches = [
    { 
      event: 'C组男单 4组第2轮', 
      matchTime: '8月15日 10:00', 
      court: '1号场', 
      opponent: '谌龙'
    },
    { 
      event: 'C组男单 4组第3轮', 
      matchTime: '8月15日 11:30', 
      court: '2号场', 
      opponent: '安赛龙'
    }
  ];
  const [editData, setEditData] = useState<ParticipantInfo>(userProfile || {
    name: '羽落无声',
    phone: '13812348888',
    idType: 'ID_CARD',
    idNumber: '',
    gender: 'MALE',
    birthDate: '',
    clothingSize: 'L',
    address: ''
  });

  const [orderTab, setOrderTab] = useState<'venue' | 'product' | 'course' | 'game'>('venue');
  const [couponTab, setCouponTab] = useState<'venue' | 'product' | 'course'>('venue');
  const [competitionTab, setCompetitionTab] = useState<'registering' | 'ongoing' | 'history'>('ongoing');
  const [walletTab, setWalletTab] = useState<'balance' | 'history'>('balance');
  const [idTab, setIdTab] = useState<'current' | 'history'>('current');
  const [checkInQRData, setCheckInQRData] = useState<{
    title: string;
    subtitle: string;
    player?: string;
    category?: string;
    groupInfo?: string;
  } | null>(null);
  const [showTotalCheckIn, setShowTotalCheckIn] = useState(false);
  const [selectedMatches, setSelectedMatches] = useState<number[]>([]);
  const [selectedHistoryMatch, setSelectedHistoryMatch] = useState<any | null>(null);
  const [verificationData, setVerificationData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    gender: userProfile?.gender || 'MALE',
    birthDate: userProfile?.birthDate || '',
    idType: userProfile?.idType || 'ID_CARD',
    idNumber: userProfile?.idNumber || '',
    idFront: null as string | null,
    idBack: null as string | null
  });

  const handleSave = () => {
    onUpdateProfile(editData);
    setIsEditing(false);
  };

  if (activeSubPage === 'participants') {
    return (
      <ParticipantsPage 
        participants={playerPool} 
        onBack={() => setActiveSubPage('none')} 
        onUpdate={(newParticipants) => setPlayerPool(newParticipants)} 
      />
    );
  }

  if (activeSubPage === 'verification') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">实名认证</h1>
        </header>
        <div className="p-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 card-shadow border border-slate-100 space-y-5">
            <h3 className="text-sm font-black text-slate-900 mb-2">基本信息</h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">姓名</label>
              <input 
                type="text" 
                placeholder="请输入真实姓名"
                value={verificationData.name}
                onChange={e => setVerificationData({...verificationData, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent text-sm focus:bg-white focus:border-brand-primary transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">手机号码</label>
              <input 
                type="tel" 
                placeholder="请输入手机号码"
                value={verificationData.phone}
                onChange={e => setVerificationData({...verificationData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent text-sm focus:bg-white focus:border-brand-primary transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">性别</label>
                <select 
                  value={verificationData.gender}
                  onChange={e => setVerificationData({...verificationData, gender: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent text-sm focus:bg-white focus:border-brand-primary transition-all appearance-none"
                >
                  <option value="MALE">男</option>
                  <option value="FEMALE">女</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">出生日期</label>
                <input 
                  type="date" 
                  value={verificationData.birthDate}
                  onChange={e => setVerificationData({...verificationData, birthDate: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent text-sm focus:bg-white focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">证件类型</label>
              <select 
                value={verificationData.idType}
                onChange={e => setVerificationData({...verificationData, idType: e.target.value as any})}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent text-sm focus:bg-white focus:border-brand-primary transition-all appearance-none"
              >
                <option value="ID_CARD">身份证</option>
                <option value="PASSPORT">护照</option>
                <option value="HK_MO_PASS">港澳居民来往内地通行证</option>
                <option value="TW_PASS">台湾居民来往大陆通行证</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">证件号码</label>
              <input 
                type="text" 
                placeholder="请输入证件号码"
                value={verificationData.idNumber}
                onChange={e => setVerificationData({...verificationData, idNumber: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-transparent text-sm focus:bg-white focus:border-brand-primary transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 card-shadow border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 mb-4">上传证件照片</h3>
            <div className="grid grid-cols-1 gap-4">
              <div 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setVerificationData({...verificationData, idFront: reader.result as string});
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                className="aspect-[1.6/1] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 overflow-hidden relative"
              >
                {verificationData.idFront ? (
                  <img src={verificationData.idFront} className="w-full h-full object-cover" alt="ID Front" />
                ) : (
                  <>
                    <ImageIcon size={32} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">上传身份证正面</span>
                  </>
                )}
              </div>
              <div 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setVerificationData({...verificationData, idBack: reader.result as string});
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
                className="aspect-[1.6/1] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 overflow-hidden relative"
              >
                {verificationData.idBack ? (
                  <img src={verificationData.idBack} className="w-full h-full object-cover" alt="ID Back" />
                ) : (
                  <>
                    <ImageIcon size={32} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">上传身份证反面</span>
                  </>
                )}
              </div>
            </div>
            <div className="mt-6 p-4 bg-amber-50 rounded-xl flex gap-3">
              <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
              <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                请确保身份证件清晰可见，证件信息将仅用于赛事身份核验，我们将严格保护您的隐私安全。
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              // Simulate submission
              alert('认证申请已提交，请等待审核');
              setActiveSubPage('none');
            }}
            className="w-full py-4 bg-brand-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-[0.98] transition-all"
          >
            提交认证
          </button>
        </div>
      </div>
    );
  }

  if (activeSubPage === 'leader_management') {
    return (
      <LeaderManagementPage 
        onBack={() => setActiveSubPage('none')} 
        initialTab={leaderInitialState.tab}
        initialSelectedMatchId={leaderInitialState.matchId}
        onSelectTournament={onSelectTournament}
      />
    );
  }

  if (activeSubPage === 'notifications') {
    const notifications = {
      tournament: [
        { title: '报名审核通过', content: '您的“羽协杯”业余羽毛球公开赛报名已审核通过，请准时参赛。', time: '10分钟前', unread: true, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50' },
        { title: '抽签结果公示', content: '“夏季联赛-厦门站”抽签结果已出炉，点击查看您的对阵信息。', time: '2小时前', unread: false, icon: Trophy, color: 'text-brand-primary bg-brand-primary/10' },
      ],
      venue: [
        { title: '订场即将开始', content: '您在“思明体育馆”预订的场地（1号场）将于1小时后开始。', time: '1小时前', unread: true, icon: Clock, color: 'text-brand-primary bg-brand-primary/10' },
        { title: '订场成功通知', content: '您已成功预订“湖里体育馆”4月15日 19:00-21:00 场地。', time: '昨天', unread: false, icon: Calendar, color: 'text-blue-500 bg-blue-50' },
      ],
      platform: [
        { title: '系统维护通知', content: '系统将于今晚22:00进行例行维护，预计耗时2小时，期间部分功能受限。', time: '昨天', unread: false, icon: AlertCircle, color: 'text-slate-400 bg-slate-50' },
        { title: '新版本发布', content: '卡猫体育V2.1版本已上线，新增“AI找球场”功能，快来体验吧！', time: '3天前', unread: false, icon: Sparkles, color: 'text-brand-primary bg-brand-primary/5' },
      ],
      course: [
        { title: '课程调课通知', content: '原定于本周六上午的“羽毛球进阶训练课”因教练临时有事调至周日下午。', time: '4小时前', unread: true, icon: BookOpen, color: 'text-orange-500 bg-orange-50' },
        { title: '课程报名成功', content: '恭喜您成功报名“青少年羽毛球基础班”，请按时参加第一课。', time: '2天前', unread: false, icon: GraduationCap, color: 'text-emerald-500 bg-emerald-50' },
      ]
    };

    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">消息通知</h1>
        </header>
        <div className="bg-white px-4 py-2 flex gap-2 border-b border-slate-100 sticky top-[88px] z-40 overflow-x-auto no-scrollbar">
          {[
            { id: 'tournament', label: '赛事通知' },
            { id: 'venue', label: '订场通知' },
            { id: 'platform', label: '平台通知' },
            { id: 'course', label: '课程通知' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setNotificationTab(tab.id as any)}
              className={cn(
                "flex-none px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap",
                notificationTab === tab.id ? "bg-brand-primary text-white shadow-md" : "text-slate-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-3">
          {notifications[notificationTab].map((msg, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow flex gap-4 relative">
              {msg.unread && <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full" />}
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", msg.color)}>
                <msg.icon size={20} />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black text-slate-900">{msg.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {notifications[notificationTab].length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
              <Bell size={48} strokeWidth={1} />
              <p className="text-xs font-bold uppercase tracking-widest">暂无消息通知</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeSubPage === 'my_games') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">我的约球</h1>
        </header>
        <div className="p-4 space-y-4">
          {[
            { title: '周末羽毛球约战 - 4人局', time: '2026-04-12 15:00', venue: '思明体育馆', status: '招募中', members: 3, total: 4 },
            { title: '工作日晚间畅打', time: '2026-04-10 19:00', venue: '湖里体育馆', status: '已满员', members: 6, total: 6 },
          ].map((game, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 card-shadow space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-black text-slate-900">{game.title}</h4>
                <span className={cn(
                  "px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-widest",
                  game.status === '招募中' ? "bg-brand-primary/10 text-brand-primary" : "bg-slate-50 text-slate-400"
                )}>
                  {game.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                  <Clock size={12} />
                  <span>{game.time}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                  <MapPin size={12} />
                  <span>{game.venue}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex -space-x-2">
                  {[...Array(game.members)].map((_, j) => (
                    <div key={j} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${j+10}/50/50`} alt="Member" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {game.total > game.members && (
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[8px] font-black text-slate-300">
                      +{game.total - game.members}
                    </div>
                  )}
                </div>
                <button className="text-[10px] font-black text-brand-primary uppercase tracking-widest">查看详情</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSubPage === 'sports_map') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">运动地图</h1>
        </header>

        <div className="relative h-[calc(100vh-140px)] w-full max-w-md mx-auto overflow-hidden bg-slate-200">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1000/1000')] bg-cover bg-center opacity-40 grayscale" />
          
          {/* Map Markers */}
          <div className="absolute top-1/4 left-1/3">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className="bg-brand-primary text-white p-2 rounded-full shadow-xl">
                <MapPin size={24} />
              </div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-slate-100 whitespace-nowrap">
                <span className="text-[10px] font-black text-slate-900">思明体育馆</span>
              </div>
            </motion.div>
          </div>

          <div className="absolute top-1/2 right-1/4">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="relative"
            >
              <div className="bg-blue-500 text-white p-2 rounded-full shadow-xl">
                <MapPin size={24} />
              </div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-slate-100 whitespace-nowrap">
                <span className="text-[10px] font-black text-slate-900">厦门大学体育馆</span>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-1/3 left-1/4">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="relative"
            >
              <div className="bg-purple-500 text-white p-2 rounded-full shadow-xl">
                <MapPin size={24} />
              </div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-slate-100 whitespace-nowrap">
                <span className="text-[10px] font-black text-slate-900">体育中心羽毛球馆</span>
              </div>
            </motion.div>
          </div>

          {/* Floating Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-all">
              <Plus size={20} />
            </button>
            <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 active:scale-95 transition-all">
              <div className="w-5 h-0.5 bg-slate-600 rounded-full" />
            </button>
            <button className="w-10 h-10 bg-white rounded-xl shadow-xl flex items-center justify-center text-brand-primary active:scale-95 transition-all mt-4">
              <Navigation size={20} />
            </button>
          </div>

          {/* Bottom Venue Card Preview */}
          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-white rounded-[32px] p-4 shadow-2xl border border-slate-100 flex gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={MOCK_VENUES[0].image} alt={MOCK_VENUES[0].name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col justify-between py-1 flex-grow">
                <div>
                  <h4 className="text-sm font-black text-slate-900">{MOCK_VENUES[0].name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                    <MapPin size={10} />
                    <span>{MOCK_VENUES[0].address}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <MapPin size={10} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400">距您 1.2km</span>
                  </div>
                  <button 
                    onClick={() => alert(`正在为您导航至: ${MOCK_VENUES[0].name}`)}
                    className="px-4 py-1.5 bg-brand-primary text-white text-[10px] font-black rounded-full shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                  >
                    导航
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubPage === 'clubs') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">加入俱乐部</h1>
        </header>
        <div className="p-4 space-y-4">
          {[
            { name: '厦门雷霆羽毛球俱乐部', members: 156, level: '专业级', desc: '厦门最具影响力的羽毛球社群之一。' },
            { name: '思明羽协之友', members: 88, level: '业余级', desc: '快乐羽球，健康生活。' },
            { name: '卡猫羽球社', members: 210, level: '综合级', desc: '定期举办内部积分赛，欢迎加入。' },
          ].map((club, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 card-shadow space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{club.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{club.members} 成员</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[8px] font-black rounded uppercase tracking-widest">
                  {club.level}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{club.desc}</p>
              <button className="w-full py-3 bg-slate-50 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest active:bg-slate-100 transition-colors">
                申请加入
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSubPage === 'favorites') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">我的收藏</h1>
        </header>
        <div className="p-4 space-y-4">
          {[
            { title: '2026 "卡猫杯" 综合大奖赛', type: '赛事', date: '2026-05-01' },
            { title: '羽毛球进阶训练课', type: '课程', price: '¥1800' },
            { title: '尤尼克斯 ASTROX 100ZZ', type: '商品', price: '¥1280' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-brand-primary">
                  <Star size={20} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-slate-900">{item.date || item.price}</div>
                <button className="text-[8px] font-black text-red-400 uppercase tracking-widest mt-1">取消收藏</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSubPage === 'customer_service') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen flex flex-col">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">联系客服</h1>
        </header>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0">
              <MessageCircle size={16} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 card-shadow max-w-[80%]">
              <p className="text-xs text-slate-800 leading-relaxed">您好！我是卡猫体育在线客服，请问有什么可以帮您？</p>
            </div>
          </div>
          <div className="flex gap-3 flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
              <img src="https://picsum.photos/seed/user_avatar/50/50" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="bg-brand-primary p-4 rounded-2xl rounded-tr-none text-white card-shadow max-w-[80%]">
              <p className="text-xs leading-relaxed">我想咨询一下“羽协杯”的报名审核进度。</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border-t border-slate-100 sticky bottom-0">
          <div className="flex gap-3">
            <input type="text" placeholder="请输入您的问题..." className="flex-1 bg-slate-50 border-0 rounded-xl px-4 py-3 text-xs" />
            <button className="w-12 h-12 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Plus size={20} className="rotate-45" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubPage === 'wallet') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">我的钱包</h1>
        </header>
        <div className="p-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">账户余额 (元)</p>
            <h2 className="text-4xl font-black tracking-tight">320.50</h2>
            <div className="mt-8 flex gap-4">
              <button className="flex-1 py-3 bg-brand-primary rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20">充值</button>
              <button className="flex-1 py-3 bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest border border-white/10">提现</button>
            </div>
          </div>

          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 px-2">收支明细</h3>
          <div className="space-y-3">
            {[
              { title: '订场支出', time: '2026-03-28 14:20', amount: '-120.00', type: 'expense' },
              { title: '充值', time: '2026-03-25 10:00', amount: '+500.00', type: 'income' },
              { title: '商品购买', time: '2026-03-20 16:45', amount: '-88.00', type: 'expense' },
              { title: '课程报名', time: '2026-03-15 09:30', amount: '-200.00', type: 'expense' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-slate-800">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">{item.time}</p>
                </div>
                <span className={cn(
                  "text-sm font-black",
                  item.type === 'income' ? "text-emerald-500" : "text-slate-900"
                )}>
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSubPage === 'achievements') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">参赛成就</h1>
        </header>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow text-center">
              <div className="text-2xl font-black text-slate-900">24</div>
              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">累计参赛</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow text-center">
              <div className="text-2xl font-black text-brand-primary">5</div>
              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">8强奖项</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow text-center">
              <div className="text-2xl font-black text-emerald-500">1280</div>
              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">我的积分</div>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-2">历史战绩</h3>
            <div className="space-y-3">
              {[
                { title: '2025 "羽协杯" 业余公开赛', category: '男单B组', result: '冠军', date: '2025-08-15' },
                { title: '厦门高校联赛', category: '男单', result: '亚军', date: '2025-05-20' },
                { title: '春季积分赛', category: '男单', result: '4强', date: '2025-03-10' },
                { title: '冬季邀请赛', category: '男单', result: '8强', date: '2024-12-05' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full uppercase tracking-widest">
                    {item.result}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (activeSubPage === 'my_competitions') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">我的赛事</h1>
        </header>
        <div className="bg-white px-4 py-2 flex gap-2 border-b border-slate-100 sticky top-[88px] z-40">
          {[
            { id: 'registering', label: '报名中' },
            { id: 'ongoing', label: '进行中' },
            { id: 'history', label: '历史比赛' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCompetitionTab(tab.id as any)}
              className={cn(
                "flex-1 py-2 rounded-xl text-[10px] font-black transition-all",
                competitionTab === tab.id ? "bg-brand-primary text-white shadow-md" : "text-slate-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-4">
          {competitionList.filter(c => c.type === competitionTab).map(item => (
            <button 
              key={item.id} 
              onClick={() => setSelectedCompetition(item)}
              className="w-full bg-white p-5 rounded-2xl border border-slate-100 card-shadow text-left active:scale-[0.98] transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-sm font-black text-slate-900 flex-1 pr-4">{item.title}</h4>
                <span className={cn(
                  "px-2 py-0.5 text-[8px] font-black rounded uppercase tracking-widest",
                  item.status === '比赛中' ? "bg-orange-50 text-orange-500" :
                  item.status === '已报名' ? "bg-emerald-50 text-emerald-500" :
                  item.status === '待支付' ? "bg-brand-primary/10 text-brand-primary" :
                  "bg-slate-50 text-slate-400"
                )}>
                  {item.status}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">参赛项目: {item.category}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Competition Detail Modal */}
        <AnimatePresence>
          {selectedCompetition && (
            <div className="fixed inset-0 z-[120] flex items-end justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCompetition(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="bg-white w-full max-w-md rounded-t-[40px] p-8 relative z-10 space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-900">{selectedCompetition.title}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedCompetition.organizer}</p>
                  </div>
                  <button onClick={() => setSelectedCompetition(null)} className="p-2 text-slate-400">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 py-4 border-y border-slate-50">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">参赛项目</span>
                    <span className="text-sm font-black text-slate-900">{selectedCompetition.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛时间</span>
                    <span className="text-sm font-black text-slate-900">{selectedCompetition.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛地点</span>
                    <span className="text-sm font-black text-slate-900">{selectedCompetition.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">报名费用</span>
                    <span className="text-sm font-black text-brand-primary">¥{selectedCompetition.fee}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  {selectedCompetition.status === '已报名' && (
                    <button 
                      onClick={() => {
                        if (confirm('确定要取消报名吗？费用将原路退回。')) {
                          setCompetitionList(prev => prev.filter(c => c.id !== selectedCompetition.id));
                          setSelectedCompetition(null);
                        }
                      }}
                      className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl text-sm font-black active:scale-95 transition-all"
                    >
                      取消报名
                    </button>
                  )}
                  {selectedCompetition.status === '待支付' ? (
                    <button className="flex-1 py-4 bg-brand-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-all">
                      立即支付
                    </button>
                  ) : (
                    <button 
                      onClick={() => setSelectedCompetition(null)}
                      className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black active:scale-95 transition-all"
                    >
                      返回
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (activeSubPage === 'orders') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">我的订单</h1>
        </header>
        <div className="bg-white px-4 py-2 flex gap-2 border-b border-slate-100 sticky top-[88px] z-40">
          {[
            { id: 'venue', label: '订场' },
            { id: 'product', label: '商品' },
            { id: 'course', label: '课程' },
            { id: 'game', label: '球局' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setOrderTab(tab.id as any)}
              className={cn(
                "flex-1 py-2 rounded-xl text-[10px] font-black transition-all",
                orderTab === tab.id ? "bg-brand-primary text-white shadow-md" : "text-slate-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-4">
          {orderTab === 'venue' ? (
            [
              { id: 'O1', title: '思明体育馆 - 1号场', time: '2026-03-28 14:00-16:00', price: '¥120', status: '待使用' },
              { id: 'O2', title: '湖里羽毛球中心 - 3号场', time: '2026-03-25 19:00-21:00', price: '¥160', status: '已完成' },
            ].map(order => (
              <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-slate-900">{order.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">{order.time}</p>
                  <p className="text-xs font-black text-brand-primary mt-2">{order.price}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  order.status === '待使用' ? "bg-brand-primary/10 text-brand-primary" : "bg-slate-50 text-slate-400"
                )}>
                  {order.status}
                </span>
              </div>
            ))
          ) : orderTab === 'product' ? (
            [
              { id: 'P1', title: '尤尼克斯羽毛球拍 ASTROX 100ZZ', time: '2026-03-20 16:45', price: '¥1280', status: '已发货' },
              { id: 'P2', title: '李宁羽毛球 A+300', time: '2026-03-18 11:20', price: '¥88', status: '已完成' },
            ].map(order => (
              <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-slate-900">{order.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">{order.time}</p>
                  <p className="text-xs font-black text-brand-primary mt-2">{order.price}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  order.status === '已发货' ? "bg-blue-50 text-blue-500" : "bg-slate-50 text-slate-400"
                )}>
                  {order.status}
                </span>
              </div>
            ))
          ) : orderTab === 'course' ? (
            [
              { id: 'C1', title: '羽毛球进阶训练课 - 10课时', time: '2026-03-15 09:30', price: '¥1800', status: '进行中' },
            ].map(order => (
              <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-slate-900">{order.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">{order.time}</p>
                  <p className="text-xs font-black text-brand-primary mt-2">{order.price}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {order.status}
                </span>
              </div>
            ))
          ) : (
            [
              { id: 'G1', title: '周末羽毛球约战 - 4人局', time: '2026-03-29 15:00', price: '¥45', status: '待开始' },
            ].map(order => (
              <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-slate-900">{order.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">{order.time}</p>
                  <p className="text-xs font-black text-brand-primary mt-2">{order.price}</p>
                </div>
                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                  {order.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeSubPage === 'coupons') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">优惠券</h1>
        </header>
        <div className="bg-white px-4 py-2 flex gap-2 border-b border-slate-100 sticky top-[88px] z-40">
          {[
            { id: 'venue', label: '订场券' },
            { id: 'product', label: '商品券' },
            { id: 'course', label: '课程券' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCouponTab(tab.id as any)}
              className={cn(
                "flex-1 py-2 rounded-xl text-[10px] font-black transition-all",
                couponTab === tab.id ? "bg-brand-primary text-white shadow-md" : "text-slate-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-4">
          {couponTab === 'venue' ? (
            [
              { id: 'C1', title: '订场满减券', desc: '满100减20', expiry: '2026-04-30', type: '通用' },
              { id: 'C2', title: '新用户体验券', desc: '无门槛减10', expiry: '2026-03-31', type: '限时' },
            ].map(coupon => (
              <div key={coupon.id} className="bg-white rounded-2xl border border-slate-100 card-shadow flex overflow-hidden relative">
                <div className="w-24 bg-brand-primary/5 flex flex-col items-center justify-center border-r border-dashed border-brand-primary/20">
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">{coupon.type}</span>
                  <Ticket size={24} className="text-brand-primary mt-2" />
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-sm font-black text-slate-900">{coupon.title}</h4>
                  <p className="text-xs text-brand-primary font-black mt-1">{coupon.desc}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-3 uppercase tracking-widest">有效期至: {coupon.expiry}</p>
                </div>
                <button className="px-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest vertical-text">
                  立即使用
                </button>
              </div>
            ))
          ) : couponTab === 'product' ? (
            [
              { id: 'CP1', title: '球拍专享券', desc: '满500减50', expiry: '2026-05-15', type: '商品' },
              { id: 'CP2', title: '羽毛球抵扣券', desc: '无门槛减5', expiry: '2026-04-20', type: '商品' },
            ].map(coupon => (
              <div key={coupon.id} className="bg-white rounded-2xl border border-slate-100 card-shadow flex overflow-hidden relative">
                <div className="w-24 bg-blue-50 flex flex-col items-center justify-center border-r border-dashed border-blue-100">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{coupon.type}</span>
                  <Ticket size={24} className="text-blue-500 mt-2" />
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-sm font-black text-slate-900">{coupon.title}</h4>
                  <p className="text-xs text-blue-500 font-black mt-1">{coupon.desc}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-3 uppercase tracking-widest">有效期至: {coupon.expiry}</p>
                </div>
                <button className="px-4 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest vertical-text">
                  立即使用
                </button>
              </div>
            ))
          ) : (
            [
              { id: 'CC1', title: '课程体验券', desc: '满200减30', expiry: '2026-06-01', type: '课程' },
            ].map(coupon => (
              <div key={coupon.id} className="bg-white rounded-2xl border border-slate-100 card-shadow flex overflow-hidden relative">
                <div className="w-24 bg-emerald-50 flex flex-col items-center justify-center border-r border-dashed border-emerald-100">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{coupon.type}</span>
                  <Ticket size={24} className="text-emerald-500 mt-2" />
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-sm font-black text-slate-900">{coupon.title}</h4>
                  <p className="text-xs text-emerald-500 font-black mt-1">{coupon.desc}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-3 uppercase tracking-widest">有效期至: {coupon.expiry}</p>
                </div>
                <button className="px-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest vertical-text">
                  立即使用
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeSubPage === 'id_card') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">电子参赛证</h1>
        </header>
        <div className="bg-white px-4 py-2 flex gap-2 border-b border-slate-100 sticky top-[88px] z-40">
          {[
            { id: 'current', label: '当前比赛' },
            { id: 'history', label: '历史比赛' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setIdTab(tab.id as any)}
              className={cn(
                "flex-1 py-2 rounded-xl text-[10px] font-black transition-all",
                idTab === tab.id ? "bg-brand-primary text-white shadow-md" : "text-slate-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6 space-y-6">
          {idTab === 'current' ? (
            <div className="bg-white rounded-[40px] p-8 card-shadow border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="w-24 h-24 rounded-full border-4 border-brand-primary/20 p-1">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop" 
                    alt="Participant" 
                    className="w-full h-full object-cover rounded-full" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{userProfile?.name || '张伟'}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">厦门雷霆羽毛球俱乐部</p>
                </div>
                
                <div className="w-full py-6 border-y border-slate-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛名称</span>
                    <span className="text-sm font-black text-brand-primary">2026 "羽协杯" 业余羽毛球公开赛</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛时间</span>
                    <span className="text-sm font-black text-slate-700">2026年8月15日-16日</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛地点</span>
                    <span className="text-sm font-black text-slate-700">厦门市体育中心羽毛球馆</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">参赛项目</span>
                    <span className="text-sm font-black text-slate-700">男单B组</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-[32px] w-full flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <QrCode size={160} className="text-slate-900" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">请根据检录时间前往检录台进行检录</p>
                  <button 
                    onClick={() => setShowTotalCheckIn(true)}
                    className="w-full py-4 bg-brand-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                  >
                    总检录二维码
                  </button>
                </div>
                
                <div className="w-full space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">我的比赛场次</h4>
                  {[
                    { 
                      event: 'C组男单 4组第3轮', 
                      checkInTime: '09:00 - 09:45', 
                      matchTime: '08月15日 11:30', 
                      court: '2号场', 
                      opponent: '安赛龙',
                      status: '待检录' 
                    },
                    { 
                      event: 'C组男单 4组第2轮', 
                      checkInTime: '08:30 - 09:15', 
                      matchTime: '08月15日 10:00', 
                      court: '1号场', 
                      opponent: '谌龙',
                      status: '待检录' 
                    },
                    { 
                      event: 'C组男单 4组第1轮', 
                      checkInTime: '07:30 - 08:15', 
                      matchTime: '08月15日 08:30', 
                      court: '1号场', 
                      opponent: '李宗伟',
                      status: '已检录' 
                    },
                  ].map((match, i) => (
                    <div key={i} className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                          {match.event.replace(' ', ' • ')}
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1",
                          match.status === '待检录' ? "text-amber-600 bg-amber-50 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        )}>
                          {match.status === '待检录' ? <Hourglass size={8} /> : <CheckCircle2 size={8} />}
                          {match.status}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold pl-1">
                          <Clock size={12} className="text-slate-400" />
                          <span>比赛</span>
                          <span className="text-slate-900 font-black">{match.matchTime}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600">{match.court}</span>
                        </div>

                        <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                              <ClipboardList size={16} />
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-amber-600">检录</span>
                                <span className="text-xs font-black text-amber-700">{match.checkInTime}</span>
                              </div>
                              <p className="text-[8px] font-bold text-amber-600/60 mt-0.5">请提前15分钟到达检录台</p>
                            </div>
                          </div>
                          <div className="text-[8px] font-black text-amber-600/40 uppercase tracking-widest">检录台A</div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold pl-1">
                          <span>比赛对阵：</span>
                          <span className="text-slate-600 font-black">{(userProfile?.name || '郭靖')} VS {match.opponent}</span>
                        </div>
                      </div>

                      {match.status === '待检录' && (
                          <button 
                            onClick={() => setCheckInQRData({
                              title: '检录二维码',
                              subtitle: match.event,
                              player: userProfile?.name || '郭靖',
                              category: match.event,
                              groupInfo: ''
                            })}
                            className="w-full py-3.5 bg-brand-primary text-white rounded-2xl text-xs font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                          >
                            去检录
                          </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Check-in Modal */}
              <AnimatePresence>
                {showTotalCheckIn && (
                  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowTotalCheckIn(false)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 relative z-10 flex flex-col gap-6 max-h-[90vh] overflow-hidden"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-900">待检录场次</h3>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => {
                              if (selectedMatches.length === pendingMatches.length) {
                                setSelectedMatches([]);
                              } else {
                                setSelectedMatches(pendingMatches.map((_, i) => i));
                              }
                            }}
                            className="text-sm font-black text-brand-primary"
                          >
                            {selectedMatches.length === pendingMatches.length ? '取消全选' : '全选'}
                          </button>
                          <button 
                            onClick={() => setShowTotalCheckIn(false)}
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
                          >
                            <Plus size={24} className="rotate-45" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {pendingMatches.map((match, i) => (
                          <div key={i} className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4 relative overflow-hidden">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => {
                                    if (selectedMatches.includes(i)) {
                                      setSelectedMatches(selectedMatches.filter(idx => idx !== i));
                                    } else {
                                      setSelectedMatches([...selectedMatches, i]);
                                    }
                                  }}
                                  className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                    selectedMatches.includes(i) ? "bg-brand-primary border-brand-primary" : "border-slate-300"
                                  )}
                                >
                                  {selectedMatches.includes(i) && <Check size={12} className="text-white" />}
                                </button>
                                <span className="text-sm font-black text-slate-900">{match.event.replace(' ', ' • ')}</span>
                              </div>
                              <div className="px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 flex items-center gap-1">
                                <Hourglass size={8} />
                                待检录
                              </div>
                            </div>
                            
                            <div className="space-y-3 pl-8">
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                                <Clock size={12} className="text-slate-400" />
                                <span>比赛</span>
                                <span className="text-slate-900 font-black">{match.matchTime}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-600">{match.court}</span>
                              </div>

                              <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                                    <ClipboardList size={16} />
                                  </div>
                                  <div className="text-left">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black text-amber-600">检录</span>
                                      <span className="text-xs font-black text-amber-700">09:00 - 09:45</span>
                                    </div>
                                    <p className="text-[8px] font-bold text-amber-600/60 mt-0.5">请提前15分钟到达检录台</p>
                                  </div>
                                </div>
                                <div className="text-[8px] font-black text-amber-600/40 uppercase tracking-widest">检录台A</div>
                              </div>

                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold pl-1">
                                <span>比赛对阵：</span>
                                <span className="text-slate-600 font-black">{(userProfile?.name || '郭靖')} VS {match.opponent}</span>
                              </div>
                            </div>

                            <div className="pl-8">
                              <button 
                                onClick={() => setCheckInQRData({
                                  title: '检录二维码',
                                  subtitle: match.event,
                                  player: userProfile?.name || '郭靖',
                                  category: match.event,
                                  groupInfo: ''
                                })}
                                className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black hover:bg-slate-50 active:scale-95 transition-all"
                              >
                                去检录
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <button 
                          disabled={selectedMatches.length === 0}
                          onClick={() => {
                            setCheckInQRData({
                              title: '一键检录码',
                              subtitle: `已选择 ${selectedMatches.length} 个场次`
                            });
                          }}
                          className={cn(
                            "w-full py-4 text-white rounded-2xl text-sm font-black shadow-lg active:scale-95 transition-all",
                            selectedMatches.length > 0 ? "bg-brand-primary shadow-brand-primary/20" : "bg-slate-300 shadow-none cursor-not-allowed"
                          )}
                        >
                          一键检录{selectedMatches.length > 0 ? `(${selectedMatches.length})` : ''}
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Check-in QR Modal */}
              <AnimatePresence>
                {checkInQRData && (
                  <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setCheckInQRData(null)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white w-full max-w-xs rounded-[40px] p-8 relative z-10 flex flex-col items-center gap-6"
                    >
                      <div className="text-center">
                        <h3 className="text-lg font-black text-slate-900">{checkInQRData.title}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{checkInQRData.subtitle}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl">
                        <QrCode size={200} className="text-slate-900" />
                      </div>
                      <button 
                        onClick={() => setCheckInQRData(null)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-black"
                      >
                        关闭
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { 
                  title: '2025 秋季业余联赛', 
                  date: '2025-11-20', 
                  venue: '厦门市思明区羽毛球馆',
                  event: 'B组男单',
                  result: '八强',
                  records: [
                    { opponent: '李宗伟', score: '21-18, 21-15', result: '胜' },
                    { opponent: '谌龙', score: '15-21, 18-21', result: '负' }
                  ]
                },
                { 
                  title: '2025 "社区杯" 邀请赛', 
                  date: '2025-09-15', 
                  venue: '厦门市湖里区体育馆',
                  event: '男双',
                  result: '冠军',
                  records: [
                    { opponent: '林丹/谢杏芳', score: '21-19, 21-17', result: '胜' },
                    { opponent: '蔡赟/傅海峰', score: '22-20, 21-18', result: '胜' }
                  ]
                },
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 card-shadow flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">{item.date}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedHistoryMatch(item)}
                    className="px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
                  >
                    查看
                  </button>
                </div>
              ))}

              {/* History Match Details Modal */}
              <AnimatePresence>
                {selectedHistoryMatch && (
                  <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedHistoryMatch(null)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white w-full max-w-md rounded-[40px] p-8 relative z-10 flex flex-col gap-6 max-h-[90vh] overflow-hidden"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-900">历史参赛证</h3>
                        <button 
                          onClick={() => setSelectedHistoryMatch(null)}
                          className="p-2 rounded-full hover:bg-slate-100 text-slate-400"
                        >
                          <Plus size={24} className="rotate-45" />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                          <div className="w-24 h-24 rounded-full border-4 border-slate-100 p-1 grayscale">
                            <img 
                              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop" 
                              alt="Participant" 
                              className="w-full h-full object-cover rounded-full" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-slate-900">{userProfile?.name || '郭靖'}</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">厦门雷霆羽毛球俱乐部</p>
                          </div>
                          
                          <div className="w-full py-6 border-y border-slate-50 space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛名称</span>
                              <span className="text-sm font-black text-slate-900">{selectedHistoryMatch.title}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛时间</span>
                              <span className="text-sm font-black text-slate-700">{selectedHistoryMatch.date}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛地点</span>
                              <span className="text-sm font-black text-slate-700">{selectedHistoryMatch.venue}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">参赛项目</span>
                              <span className="text-sm font-black text-slate-700">{selectedHistoryMatch.event}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛名次</span>
                              <span className="text-sm font-black text-brand-primary">{selectedHistoryMatch.result}</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-6 rounded-[32px] w-full flex flex-col items-center gap-4 grayscale opacity-50">
                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                              <QrCode size={160} className="text-slate-900" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">赛事已结束</p>
                          </div>
                          
                          <div className="w-full space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">我的比赛场次</h4>
                            {selectedHistoryMatch.records.map((record: any, idx: number) => (
                              <div key={idx} className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4 text-left">
                                <div className="flex justify-between items-center">
                                  <div className="text-sm font-black text-slate-900">{selectedHistoryMatch.event.replace(' ', ' • ')}</div>
                                  <div className="px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                                    <CheckCircle2 size={8} />
                                    已检录
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold pl-1">
                                    <Clock size={12} className="text-slate-400" />
                                    <span>比赛</span>
                                    <span className="text-slate-900 font-black">{selectedHistoryMatch.date}</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-600">1号场</span>
                                  </div>

                                  <div className="bg-slate-100/50 border border-slate-200/50 rounded-2xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                                        <ClipboardList size={16} />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-black text-slate-400">检录</span>
                                          <span className="text-xs font-black text-slate-500">已完成</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">检录台A</div>
                                  </div>

                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold pl-1">
                                    <span>比赛对阵：</span>
                                    <span className="text-slate-600 font-black">{(userProfile?.name || '郭靖')} VS {record.opponent}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold pl-1">
                                    <span>比赛结果：</span>
                                    <span className={cn(
                                      "font-black",
                                      record.result === '胜' ? "text-emerald-600" : "text-red-600"
                                    )}>{record.result} ({record.score})</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedHistoryMatch(null)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-black active:scale-95 transition-all"
                      >
                        关闭
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-slate-100">
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <h1 className="text-lg font-bold">编辑个人资料</h1>
          </div>
          <button onClick={handleSave} className="text-sm font-bold text-brand-primary">保存</button>
        </header>
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 space-y-5 card-shadow">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">昵称</label>
              <input 
                type="text" 
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3.5 text-sm" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">手机号码</label>
              <input 
                type="tel" 
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3.5 text-sm" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">收货地址</label>
              <textarea 
                value={editData.address || ''}
                onChange={(e) => setEditData({...editData, address: e.target.value})}
                placeholder="请输入详细收货地址"
                className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3.5 text-sm min-h-[100px] resize-none" 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-slate-50 min-h-screen">
      {/* Compact Header */}
      <header className="bg-white px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-50 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-brand-primary/20 p-0.5 overflow-hidden">
              <img 
                src="https://picsum.photos/seed/user_avatar/200/200" 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-full" 
                referrerPolicy="no-referrer"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center text-white border-2 border-white">
              <Pencil size={10} strokeWidth={3} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{userProfile?.name || '羽落惊风'}</h2>
              <button 
                onClick={() => setActiveSubPage('verification')}
                className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full hover:bg-slate-200 transition-colors"
              >
                <AlertCircle size={10} className="text-slate-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">未认证</span>
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 mt-1">
              <Smartphone size={12} />
              <span className="text-xs font-bold tracking-wider">138 **** 8888</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="p-2 text-slate-400 hover:text-brand-primary transition-colors"
        >
          <Settings size={20} />
        </button>
      </header>

      <div className="px-6 space-y-6 mt-6">
        {/* Membership Card - Compact */}
        <div className="bg-slate-900 rounded-2xl p-5 relative overflow-hidden group border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-brand-primary">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-white text-sm font-black">我的会员卡</h3>
                <div className="text-[9px] text-white/30 font-bold tracking-widest uppercase mt-0.5">SILVER · No.2025-XM-08833</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest">12/2026</div>
            </div>
          </div>

        </div>

        {/* Stats Row - Compact */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '我的订单', value: '2', id: 'orders' },
            { label: '优惠券', value: '3', id: 'coupons' },
            { label: '钱包余额', value: '¥320', id: 'wallet', color: 'text-brand-primary' },
          ].map((stat, i) => (
            <button 
              key={i} 
              onClick={() => stat.id && setActiveSubPage(stat.id as any)}
              className="bg-white p-4 rounded-xl border border-slate-100 card-shadow text-center active:scale-95 transition-all"
            >
              <div className={cn("text-lg font-black tracking-tight", stat.color || "text-slate-900")}>{stat.value}</div>
              <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">{stat.label}</div>
            </button>
          ))}
        </div>

        {/* Competition Management */}
        <section className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-2">参赛管理</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '电子参赛证', sub: '身份核验与入场', extra: '使用中', extraColor: 'text-emerald-500 bg-emerald-50', id: 'id_card' },
              { label: '我的赛事', sub: '赛程与实时比分', extra: '比赛中', extraColor: 'text-orange-500 bg-orange-50', id: 'my_competitions' },
              { label: '参赛成就', sub: '荣誉勋章与记录', extra: '冠军×2', extraColor: 'text-slate-400 bg-slate-50', id: 'achievements' },
              { label: '常用参赛人', sub: '管理队友与信息', id: 'participants' },
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => item.id && setActiveSubPage(item.id as any)}
                className="bg-white p-3.5 rounded-xl border border-slate-100 card-shadow flex items-center justify-between active:scale-95 transition-all text-left group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-black text-slate-900 tracking-tight">{item.label}</span>
                    {item.extra && (
                      <span className={cn("text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest", item.extraColor)}>
                        {item.extra}
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 tracking-tight">{item.sub}</div>
                </div>
                <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-brand-primary group-active:scale-90 transition-transform">
                  <ChevronRight size={14} strokeWidth={3} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Common Functions */}
        <section className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest px-2">常用功能</h3>
          <div className="bg-white rounded-2xl p-6 border border-slate-100 card-shadow">
            <div className="grid grid-cols-4 gap-y-6">
              {[
                { icon: Bell, label: '消息通知', extra: '2', onClick: () => setActiveSubPage('notifications') },
                { icon: MessageCircleMore, label: '我的约球', onClick: () => setActiveSubPage('my_games') },
                { icon: MapIcon, label: '运动地图', onClick: () => setActiveSubPage('sports_map') },
                { icon: Building2, label: '加入俱乐部', onClick: () => setActiveSubPage('clubs') },
                { icon: Star, label: '我的收藏', onClick: () => setActiveSubPage('favorites') },
                { icon: MessageCircle, label: '联系客服', onClick: () => setActiveSubPage('customer_service') },
                { icon: Settings, label: '更多设置', onClick: () => alert('更多设置功能开发中...') },
                { icon: LogOut, label: '退出登录', labelColor: 'text-slate-900', onClick: () => alert('已安全退出登录') },
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={item.onClick}
                  className="flex flex-col items-center gap-2 active:scale-90 transition-all"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary/5 group-hover:text-brand-primary transition-colors">
                      <item.icon size={22} />
                    </div>
                    {item.extra && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-black border-2 border-white">
                        {item.extra}
                      </span>
                    )}
                  </div>
                  <span className={cn("text-[10px] font-bold tracking-tight text-center leading-tight", item.labelColor || "text-slate-600")}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const TournamentDetailPage = ({ tournament, onBack, onRegister }: { tournament: Tournament, onBack: () => void, onRegister: (role?: 'individual' | 'leader') => void }) => {
  const [activeSubPage, setActiveSubPage] = useState<'none' | 'rules' | 'public_list' | 'messages' | 'downloads'>('none');
  const [comprehensiveType, setComprehensiveType] = useState<'Individual' | 'Team'>('Individual');
  const [selectedPublicProject, setSelectedPublicProject] = useState('男单');
  const [selectedPublicGroup, setSelectedPublicGroup] = useState('A组');

  useEffect(() => {
    if (tournament.type === 'Team') {
      setComprehensiveType('Team');
      setSelectedPublicProject('混团');
      setSelectedPublicGroup('甲组');
    } else if (tournament.type === 'Comprehensive') {
      // Default to Individual for comprehensive
      setComprehensiveType('Individual');
      setSelectedPublicProject('男单');
      setSelectedPublicGroup('A组');
    } else {
      setComprehensiveType('Individual');
      setSelectedPublicProject('男单');
      setSelectedPublicGroup('A组');
    }
  }, [tournament.type]);

  // Handle comprehensive type toggle
  const handleComprehensiveToggle = (type: 'Individual' | 'Team') => {
    setComprehensiveType(type);
    if (type === 'Team') {
      setSelectedPublicProject('混团');
      setSelectedPublicGroup('甲组');
    } else {
      setSelectedPublicProject('男单');
      setSelectedPublicGroup('A组');
    }
  };

  const [messages, setMessages] = useState([
    { id: 1, user: '羽球小将', content: '请问同安站的比赛有停车位吗？', time: '2026-03-20 10:30', reply: '有的，体育馆地下停车场可免费停车。', type: '咨询' },
    { id: 2, user: '球场老兵', content: '建议增加饮用水补给点。', time: '2026-03-21 14:20', reply: '感谢建议，我们已在每个场地旁增设了补给站。', type: '建议' },
    { id: 3, user: '新手上路', content: '双打可以跨年龄组报名吗？', time: '2026-03-22 09:15', reply: '不可以，必须符合所在组别的年龄要求。', type: '咨询' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState('咨询');
  const [searchPublic, setSearchPublic] = useState('');
  const [showWeChatQR, setShowWeChatQR] = useState(false);

  if (activeSubPage === 'rules') {
    return (
      <div className="pb-20 bg-white min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">竞赛规程</h1>
        </header>
        <div className="p-6 text-sm text-slate-600 leading-relaxed space-y-4">
          <h2 className="text-lg font-black text-slate-900">2026年厦门市全民健身运动会羽毛球赛（同安站）竞赛规程</h2>
          <p>一、主办单位：厦门市体育局</p>
          <p>二、承办单位：同安区文化和旅游局</p>
          <p>三、比赛时间：2026年5月15日-17日</p>
          <p>四、比赛地点：厦门市同安区体育馆</p>
          <p>五、竞赛项目：男单、女单、男双、女双、混双</p>
          <p>六、参加办法：凡身体健康，具有厦门市户籍或在厦工作的羽毛球爱好者均可报名参加。</p>
          <p>七、竞赛办法：采用中国羽协审定的最新《羽毛球竞赛规则》。</p>
        </div>
      </div>
    );
  }

  if (activeSubPage === 'public_list') {
    const isTeamTournament = tournament?.type === 'Team' || (tournament?.type === 'Comprehensive' && comprehensiveType === 'Team');
    
    const projects = isTeamTournament 
      ? ['男团', '女团', '混团']
      : ['男单', '男双', '女单', '女双', '混双'];
      
    const groups = isTeamTournament
      ? ['甲组', '乙组', '丙组']
      : ['A组', 'B组', 'C组', 'D组'];

    // Mock participant pool for filtering
    const individualPool = [
      { id: 1, project: '男单', group: 'A组', teamName: '厦门体育学院', shortName: '厦体', players: [{ name: '林丹', gender: '男', age: '42' }] },
      { id: 2, project: '男单', group: 'B组', teamName: '福州大学羽协', shortName: '福大羽协', players: [{ name: '谌龙', gender: '男', age: '37' }] },
      { id: 3, project: '男单', group: 'A组', teamName: '马来西亚羽协', shortName: '马羽协', players: [{ name: '李宗伟', gender: '男', age: '43' }] },
      { id: 4, project: '男双', group: 'A组', teamName: '国家队一队', shortName: '国羽一队', players: [{ name: '蔡赟', gender: '男', age: '46' }, { name: '傅海峰', gender: '男', age: '42' }] },
      { id: 6, project: '男双', group: 'B组', teamName: '韩国国家队', shortName: '韩羽', players: [{ name: '李龙大', gender: '男', age: '37' }, { name: '郑在成', gender: '男', age: '43' }] },
      { id: 8, project: '女单', group: 'A组', teamName: '国家队二队', shortName: '国羽二队', players: [{ name: '王仪涵', gender: '女', age: '38' }] },
      { id: 9, project: '女单', group: 'A组', teamName: '西班牙羽协', shortName: '西羽协', players: [{ name: '马琳', gender: '女', age: '32' }] },
      { id: 10, project: '女双', group: 'A组', teamName: '国家队一队', shortName: '国羽一队', players: [{ name: '于洋', gender: '女', age: '39' }, { name: '王晓理', gender: '女', age: '37' }] },
      { id: 12, project: '混双', group: 'A组', teamName: '国家队一队', shortName: '国羽一队', players: [{ name: '张楠', gender: '男', age: '36' }, { name: '赵芸蕾', gender: '女', age: '39' }] },
      { id: 14, project: '男单', group: 'C组', teamName: '思明羽协', shortName: '思明羽协', players: [{ name: '张三', gender: '男', age: '25' }] },
      { id: 15, project: '女单', group: 'D组', teamName: '湖里羽协', shortName: '湖里羽协', players: [{ name: '李四', gender: '女', age: '22' }] },
      { id: 16, project: '男单', group: 'A组', teamName: '集美大学', shortName: '集大', players: [{ name: '王五', gender: '男', age: '28' }] },
      { id: 17, project: '男单', group: 'A组', teamName: '华侨大学', shortName: '华大', players: [{ name: '赵六', gender: '男', age: '31' }] },
      { id: 18, project: '男单', group: 'A组', teamName: '厦门大学', shortName: '厦大', players: [{ name: '孙七', gender: '男', age: '24' }] },
      { id: 19, project: '男单', group: 'A组', teamName: '同安羽协', shortName: '同安羽协', players: [{ name: '周八', gender: '男', age: '29' }] },
      { id: 20, project: '男单', group: 'A组', teamName: '翔安羽协', shortName: '翔安羽协', players: [{ name: '吴九', gender: '男', age: '27' }] },
      { id: 21, project: '男单', group: 'A组', teamName: '海沧羽协', shortName: '海沧羽协', players: [{ name: '郑十', gender: '男', age: '30' }] },
      { id: 22, project: '男单', group: 'A组', teamName: '卡猫俱乐部', shortName: '卡猫', players: [{ name: '陈十一', gender: '男', age: '26' }] },
      { id: 23, project: '男单', group: 'A组', teamName: '友巨集团', shortName: '友巨', players: [{ name: '林十二', gender: '男', age: '32' }] },
      { id: 24, project: '男双', group: 'B组', teamName: '终南山羽协', shortName: '终南山', players: [{ name: '郭靖', gender: '男', age: '35' }, { name: '杨康', gender: '男', age: '34' }] },
      { id: 25, project: '混双', group: 'B组', teamName: '桃花岛羽协', shortName: '桃花岛', players: [{ name: '郭靖', gender: '男', age: '35' }, { name: '黄蓉', gender: '女', age: '33' }] },
      { id: 26, project: '男单', group: 'B组', teamName: '古墓派', shortName: '古墓派', players: [{ name: '杨过', gender: '男', age: '24' }] },
      { id: 27, project: '女单', group: 'B组', teamName: '古墓派', shortName: '古墓派', players: [{ name: '小龙女', gender: '女', age: '22' }] },
      { id: 28, project: '男单', group: 'C组', teamName: '明教', shortName: '明教', players: [{ name: '张无忌', gender: '男', age: '26' }] },
      { id: 29, project: '女单', group: 'C组', teamName: '汝阳王府', shortName: '汝阳王府', players: [{ name: '赵敏', gender: '女', age: '24' }] },
      { id: 30, project: '女单', group: 'C组', teamName: '峨眉派', shortName: '峨眉派', players: [{ name: '周芷若', gender: '女', age: '23' }] },
      { id: 31, project: '男双', group: 'C组', teamName: '丐帮', shortName: '丐帮', players: [{ name: '萧峰', gender: '男', age: '38' }, { name: '虚竹', gender: '男', age: '34' }] },
      { id: 33, project: '男单', group: 'D组', teamName: '大理段氏', shortName: '大理段氏', players: [{ name: '段誉', gender: '男', age: '28' }] },
      { id: 34, project: '女单', group: 'D组', teamName: '曼陀山庄', shortName: '曼陀山庄', players: [{ name: '王语嫣', gender: '女', age: '26' }] },
      { id: 35, project: '男单', group: 'D组', teamName: '华山派', shortName: '华山派', players: [{ name: '令狐冲', gender: '男', age: '30' }] },
      { id: 36, project: '女单', group: 'D组', teamName: '日月神教', shortName: '日月神教', players: [{ name: '任盈盈', gender: '女', age: '28' }] },
      { id: 37, project: '男单', group: 'A组', teamName: '侠客岛', shortName: '侠客岛', players: [{ name: '石破天', gender: '男', age: '22' }] },
      { id: 38, project: '男双', group: 'D组', teamName: '丁家庄', shortName: '丁家庄', players: [{ name: '丁不三', gender: '男', age: '65' }, { name: '丁不四', gender: '男', age: '63' }] },
      { id: 40, project: '男单', group: 'D组', teamName: '武当派', shortName: '武当派', players: [{ name: '张三丰', gender: '男', age: '70' }] },
    ];

    const teamPool = [
      { id: 101, project: '混团', group: '甲组', teamName: '卡猫羽毛球俱乐部', shortName: '卡猫俱乐部', memberCount: 12 },
      { id: 102, project: '混团', group: '甲组', teamName: '思明羽协代表队', shortName: '思明羽协', memberCount: 10 },
      { id: 103, project: '混团', group: '乙组', teamName: '同安青创羽球队', shortName: '同安青创', memberCount: 8 },
      { id: 104, project: '男团', group: '甲组', teamName: '火炬高新区代表队', shortName: '火炬代表队', memberCount: 15 },
      { id: 105, project: '女团', group: '丙组', teamName: '厦门女子羽球联盟', shortName: '女子联盟', memberCount: 9 },
      { id: 106, project: '混团', group: '丙组', teamName: '集美大学校友队', shortName: '集大校友', memberCount: 11 },
      { id: 107, project: '混团', group: '甲组', teamName: '海沧体育中心队', shortName: '海沧中心', memberCount: 14 },
      { id: 108, project: '混团', group: '甲组', teamName: '翔安羽球协会', shortName: '翔安羽协', memberCount: 13 },
      { id: 109, project: '男团', group: '乙组', teamName: '软件园三期代表队', shortName: '软三代表队', memberCount: 12 },
      { id: 110, project: '女团', group: '甲组', teamName: '鹭岛巾帼羽球队', shortName: '鹭岛巾帼', memberCount: 10 },
      { id: 111, project: '混团', group: '乙组', teamName: '五缘湾羽球俱乐部', shortName: '五缘湾', memberCount: 16 },
      { id: 112, project: '男团', group: '丙组', teamName: '中山路老牌羽球队', shortName: '中山路', memberCount: 8 },
    ];

    const filteredParticipants = isTeamTournament
      ? teamPool.filter(p => 
          p.project === selectedPublicProject && 
          p.group === selectedPublicGroup &&
          (searchPublic === '' || p.teamName.toLowerCase().includes(searchPublic.toLowerCase()) || p.shortName.toLowerCase().includes(searchPublic.toLowerCase()))
        )
      : individualPool.filter(p => 
          p.project === selectedPublicProject && 
          p.group === selectedPublicGroup &&
          (searchPublic === '' || p.players.some(player => player.name.toLowerCase().includes(searchPublic.toLowerCase())))
        );

    const groupCounts: Record<string, number> = isTeamTournament
      ? { '男团': 32, '女团': 16, '混团': 64 }
      : { '男单': 64, '男双': 48, '女单': 32, '女双': 24, '混双': 32 };

    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">名单公示</h1>
        </header>
        <div className="p-4 space-y-4">
          {tournament.type === 'Comprehensive' && (
            <div className="flex bg-white p-1 rounded-2xl border border-slate-100 card-shadow">
              <button
                onClick={() => handleComprehensiveToggle('Individual')}
                className={cn(
                  "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all",
                  comprehensiveType === 'Individual' 
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                    : "text-slate-500"
                )}
              >
                单项赛
              </button>
              <button
                onClick={() => handleComprehensiveToggle('Team')}
                className={cn(
                  "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all",
                  comprehensiveType === 'Team' 
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                    : "text-slate-500"
                )}
              >
                团体赛
              </button>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {projects.map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPublicProject(p)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                    selectedPublicProject === p 
                      ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20" 
                      : "bg-white text-slate-500 border-slate-100"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {groups.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedPublicGroup(g)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                    selectedPublicGroup === g 
                      ? "bg-slate-800 text-white border-slate-800 shadow-md" 
                      : "bg-white text-slate-500 border-slate-100"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={isTeamTournament ? "搜索队伍名称..." : "搜索参赛者姓名..."} 
              value={searchPublic}
              onChange={(e) => setSearchPublic(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all card-shadow"
            />
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 card-shadow">
              <div className="p-4 flex justify-between items-center border-b border-slate-50">
                <div className="text-sm font-bold text-slate-800">{selectedPublicGroup}{selectedPublicProject}</div>
                <div className="text-[10px] font-black text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-lg">
                  报名总席位: {groupCounts[selectedPublicProject] || 0}
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {isTeamTournament ? (
                  <>
                    <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                      <span className="flex-1">队伍全称</span>
                      <span className="w-24 text-center">队伍简称</span>
                      <span className="w-16 text-right">报名人数</span>
                    </div>
                    {filteredParticipants.length > 0 ? (
                      filteredParticipants.map((p: any, idx) => (
                        <div key={idx} className="flex items-center text-xs py-3 border-b border-slate-50 last:border-0">
                          <span className="flex-1 font-bold text-slate-700">{p.teamName}</span>
                          <span className="w-24 text-slate-400 text-center">{p.shortName}</span>
                          <span className="w-16 text-slate-400 text-right font-bold">{p.memberCount}人</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-slate-400 text-xs italic">
                        暂无该组别队伍数据
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                      <span className="w-16">姓名</span>
                      <span className="w-10 text-center">性别</span>
                      <span className="w-10 text-center">年龄</span>
                      <span className="flex-1 text-center">队伍全称</span>
                      <span className="w-20 text-right">队伍简称</span>
                    </div>
                    {filteredParticipants.length > 0 ? (
                      filteredParticipants.map((p: any, idx) => (
                        <div key={idx} className="flex items-start text-xs py-2 border-b border-slate-50 last:border-0">
                          <div className="w-16 flex flex-col gap-1">
                            {p.players.map((player: any, pIdx: number) => (
                              <span key={pIdx} className="font-bold text-slate-700">{player.name}</span>
                            ))}
                          </div>
                          <div className="w-10 flex flex-col items-center gap-1">
                            {p.players.map((player: any, pIdx: number) => (
                              <span key={pIdx} className="text-slate-400">{player.gender}</span>
                            ))}
                          </div>
                          <div className="w-10 flex flex-col items-center gap-1">
                            {p.players.map((player: any, pIdx: number) => (
                              <span key={pIdx} className="text-slate-400">{player.age}</span>
                            ))}
                          </div>
                          <div className="flex-1 text-center text-slate-700 font-medium">
                            {p.teamName}
                          </div>
                          <div className="w-20 text-right text-slate-400">
                            {p.shortName}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-slate-400 text-xs italic">
                        暂无该组别名单数据
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubPage === 'messages') {
    const messageTypes = ['咨询', '建议', '投诉', '其他'];
    return (
      <div className="pb-20 bg-slate-50 min-h-screen flex flex-col">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">留言问答</h1>
        </header>
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {messages.map(msg => (
            <div key={msg.id} className="space-y-0">
              {/* Question Part */}
              <div className="bg-white p-4 rounded-t-2xl border-x border-t border-slate-100 card-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary" />
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-black text-brand-primary">Q</span>
                    <span className="text-xs font-bold text-slate-800">{msg.user}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-500">{msg.type}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                </div>
                <p className="text-sm text-slate-700 font-medium pl-7">{msg.content}</p>
              </div>
              
              {/* Answer Part */}
              {msg.reply ? (
                <div className="bg-slate-50 p-4 rounded-b-2xl border border-slate-100 border-t-slate-50">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] font-black text-emerald-600 flex-shrink-0 mt-0.5">A</span>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-emerald-600 mb-1">组委会官方回复：</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{msg.reply}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50/50 p-3 rounded-b-2xl border border-dashed border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400">等待回复中...</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-white border-t border-slate-100 space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {messageTypes.map(t => (
              <button 
                key={t}
                onClick={() => setMessageType(t)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all",
                  messageType === t ? "bg-brand-primary text-white" : "bg-slate-100 text-slate-500"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder={`输入您的${messageType}内容...`} 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary"
            />
            <button 
              onClick={() => {
                if (newMessage.trim()) {
                  setMessages([...messages, { 
                    id: Date.now(), 
                    user: '我', 
                    content: newMessage, 
                    time: new Date().toLocaleString().slice(0, 16), 
                    reply: '',
                    type: messageType
                  }]);
                  setNewMessage('');
                }
              }}
              className="p-3 bg-brand-primary text-white rounded-xl active:scale-95 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubPage === 'downloads') {
    return (
      <div className="pb-20 bg-slate-50 min-h-screen">
        <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
          <button onClick={() => setActiveSubPage('none')} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRight size={20} className="rotate-180" />
          </button>
          <h1 className="text-lg font-bold">资料下载</h1>
        </header>
        <div className="p-4 space-y-3">
          {tournament.documents.map((doc, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                  <FileText size={20} />
                </div>
                <span className="text-sm font-medium text-slate-700">{doc.name}</span>
              </div>
              <button className="text-xs font-bold text-brand-primary flex items-center gap-1">
                <Download size={14} /> 下载
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-slate-50 min-h-screen">
      <div className="relative h-64">
        <img src={tournament.image} alt={tournament.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <button 
          onClick={onBack}
          className="absolute top-6 left-4 p-2 rounded-full bg-black/20 backdrop-blur-md text-white"
        >
          <ChevronRight size={20} className="rotate-180" />
        </button>
      </div>

      <div className="px-6 -mt-8 relative z-10 bg-white rounded-t-[32px] pt-8">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider",
              tournament.status === 'registration' ? "bg-emerald-100 text-emerald-700" : 
              tournament.status === 'scheduling' ? "bg-amber-100 text-amber-700" :
              tournament.status === 'ongoing' ? "bg-blue-100 text-blue-700" :
              "bg-slate-100 text-slate-700"
            )}>
              {tournament.status === 'registration' ? '正在报名' : tournament.status === 'scheduling' ? '编排中' : tournament.status === 'ongoing' ? '比赛中' : '已结束'}
            </span>
            {tournament.status === 'registration' && (
              <div className="flex items-center gap-1 text-slate-400">
                <User size={14} />
                <span className="text-xs font-medium">
                  {`${tournament.participants}人已报名 / 限额${tournament.maxParticipants || 500}人`}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-brand-primary transition-colors">
              <Share2 size={18} />
            </button>
            <button className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 transition-colors">
              <Heart size={18} />
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-black leading-tight mb-4">{tournament.title}</h1>

        <div className="mb-8">
          <TournamentProgressBar status={tournament.status} />
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <Calendar size={18} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {tournament.status === 'ongoing' ? '报名已结束' : '报名时间'}
              </div>
              <div className="text-sm font-bold text-slate-700">{tournament.regStartTime} 至 {tournament.regEndTime}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <Clock size={18} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">比赛时间</div>
              <div className="text-sm font-bold text-slate-700">{tournament.matchStartTime}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <MapPin size={18} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">比赛地点</div>
              <div className="text-sm font-bold text-slate-700">{tournament.location}</div>
            </div>
          </div>
          {tournament.organizer && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-50 text-slate-500">
                <Building2 size={18} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">主办单位</div>
                <div className="text-sm font-bold text-slate-700">{tournament.organizer}</div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Bar */}
        <div className="bg-orange-50 rounded-xl p-3 flex items-center gap-3 mb-6 overflow-hidden">
          <Volume2 size={16} className="text-orange-500 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <motion.div 
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="whitespace-nowrap text-xs font-bold text-orange-600"
            >
              温馨提示：请各位选手在报名截止前完成缴费，并上传户口证明或在厦工作证明。
            </motion.div>
          </div>
        </div>

        {/* Grid Menu */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { icon: ClipboardList, label: '竞赛规程', id: 'rules' },
            { icon: UserCheck, label: '名单公示', id: 'public_list' },
            { icon: MessageCircleMore, label: '留言板', id: 'messages' },
            { icon: Download, label: '资料下载', id: 'downloads' },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => setActiveSubPage(item.id as any)}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100">
                <item.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-lg font-bold mb-3">赛事详情</h3>
          <div className="text-sm text-slate-500 leading-relaxed space-y-4">
            <p>{tournament.description}</p>
          </div>
        </div>

        {/* WeChat Group */}
        <button 
          onClick={() => setShowWeChatQR(true)}
          className="w-full mt-8 bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden text-left active:scale-[0.98] transition-transform"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-black mb-2">赛事交流群</h3>
              <p className="text-xs text-white/60 leading-relaxed">点击扫码加入官方微信群，获取第一手赛事资讯、对阵表及精彩瞬间。</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/10">
              <QrCode size={24} className="text-white" />
            </div>
          </div>
        </button>

        <div className="mt-8 mb-8">
          <h3 className="text-lg font-bold mb-3">联系我们</h3>
          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white">
            <div>
              <div className="text-sm font-bold">{tournament.contactPerson}</div>
              <div className="text-xs text-slate-400">{tournament.contactPhone}</div>
            </div>
            <button className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">拨打</button>
          </div>
        </div>
      </div>

      {/* WeChat QR Modal */}
      <AnimatePresence>
        {showWeChatQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWeChatQR(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xs bg-white rounded-[40px] p-8 text-center shadow-2xl"
            >
              <button 
                onClick={() => setShowWeChatQR(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"
              >
                <X size={20} />
              </button>
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-900 mb-2">赛事交流群</h3>
                <p className="text-sm text-slate-500">长按识别二维码加入群聊</p>
              </div>
              <div className="aspect-square bg-slate-50 rounded-3xl p-4 mb-6 flex items-center justify-center border border-slate-100">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-slate-300">
                  <QrCode size={120} />
                </div>
              </div>
              <button 
                onClick={() => setShowWeChatQR(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm"
              >
                扫码入群
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 safe-bottom flex gap-4 z-50">
        {tournament.status === 'ongoing' ? (
          <button 
            onClick={() => onRegister()}
            className="w-full py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Activity size={18} />
            查看赛况
          </button>
        ) : (tournament.type === 'Individual' || tournament.type === 'Comprehensive') && tournament.id !== '5' ? (
          <>
            <button 
              onClick={() => onRegister('individual')}
              className="flex-1 py-4 rounded-2xl border-2 border-brand-primary text-sm font-black text-brand-primary active:scale-95 transition-transform"
            >
              个人报名
            </button>
            <button 
              onClick={() => onRegister('leader')}
              className="flex-1 py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-transform"
            >
              领队报名
            </button>
          </>
        ) : (
          <button 
            onClick={() => onRegister('leader')}
            className="w-full py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-transform"
          >
            {tournament.id === '6' ? '立即报名' : '领队报名'}
          </button>
        )}
      </div>
    </div>
  );
};

const MAIN_CATEGORIES = [
  { name: '男单', fee: 100, deposit: 50, current: 12, max: 20 },
  { name: '女单', fee: 100, current: 14, max: 20 },
  { name: '男双', fee: 100, current: 20, max: 20 },
  { name: '女双', fee: 100, current: 9, max: 20 },
  { name: '混双', fee: 100, current: 5, max: null }
];

const AGE_GROUPS = [
  { name: 'A组', age: '18-30岁', birth: '1996-01-01 至 2008-12-31' },
  { name: 'B组', age: '31-40岁', birth: '1986-01-01 至 1995-12-31' },
  { name: 'C组', age: '41-50岁', birth: '1976-01-01 至 1985-12-31' },
  { name: 'D组', age: '51岁以上', birth: '1975-12-31 及以前' }
];

const ID_TYPE_LABELS: Record<IDType, string> = {
  'ID_CARD': '身份证',
  'HK_MACAU_RESIDENCE': '港澳居民居住证',
  'TAIWAN_RESIDENCE': '台湾居民居住证',
  'FOREIGNER_PERMANENT_RESIDENCE': '外国人永久居留身份证',
  'HK_MACAU_PERMIT': '港澳居民来往内地通行证',
  'TAIWAN_PERMIT': '台湾居民来往大陆通行证',
  'PASSPORT': '护照'
};

const SignaturePad = ({ onSave, onClear, initialImage }: { onSave: (data: string) => void, onClear: () => void, initialImage?: string | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (initialImage) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = initialImage;
    }
  }, [initialImage]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL());
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  return (
    <div className="space-y-3">
      <div className="relative bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="w-full h-48 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <button 
          onClick={clear}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur shadow-sm rounded-lg text-slate-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">请在上方区域内手写签名</p>
    </div>
  );
};

const RegistrationPage = ({ 
  tournament, 
  onBack, 
  userProfile, 
  onSaveProfile,
  initialRole = 'individual'
}: { 
  tournament: Tournament, 
  onBack: () => void, 
  userProfile: ParticipantInfo | null,
  onSaveProfile: (profile: ParticipantInfo) => void,
  initialRole?: 'individual' | 'leader'
}) => {
  const [role, setRole] = useState<'individual' | 'leader'>(initialRole);
  const [step, setStep] = useState(1);
  const [showPlayerPool, setShowPlayerPool] = useState(false);
  const [playerPool, setPlayerPool] = useState<ParticipantInfo[]>(MOCK_PLAYER_POOL);
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [isRegistrationForm, setIsRegistrationForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<ParticipantInfo | null>(null);
  const [poolTarget, setPoolTarget] = useState<'personal' | 'partner' | 'member' | 'team' | 'individual_doubles' | 'team_leader'>('member');
  const [editingTarget, setEditingTarget] = useState<'personal' | 'partner' | 'member'>('member');
  const [showInvitePoster, setShowInvitePoster] = useState(false);
  const [showForwardGuide, setShowForwardGuide] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [availableTeams, setAvailableTeams] = useState<TeamInfo[]>(MOCK_TEAMS);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showUniformModal, setShowUniformModal] = useState(false);
  const [editingUniform, setEditingUniform] = useState<UniformInfo | null>(null);
  const [editingUniformIndex, setEditingUniformIndex] = useState<number | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamInfo | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [registeredCategories, setRegisteredCategories] = useState<string[]>([]);
  const [activeCategoryTab, setActiveCategoryTab] = useState('全部');
  const [activeGroupTab, setActiveGroupTab] = useState('A组');
  const [selectedPoolPlayers, setSelectedPoolPlayers] = useState<ParticipantInfo[]>([]);
  const [viewMode, setViewMode] = useState<'project' | 'group'>('project');
  const [signature, setSignature] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [newTeamLogo, setNewTeamLogo] = useState('');
  const [newTeamUniforms, setNewTeamUniforms] = useState<UniformInfo[]>([]);
  const [newTeamLeader, setNewTeamLeader] = useState<ParticipantInfo | null>(null);
  const [comprehensiveType, setComprehensiveType] = useState<'Individual' | 'Team' | null>(
    tournament.type === 'Comprehensive' && role === 'individual' ? 'Individual' : null
  );
  
  useEffect(() => {
    if (showPlayerPool) {
      setSelectedPoolPlayers([]);
    }
  }, [showPlayerPool]);
  
  // Registration Data
  const [regData, setRegData] = useState({
    teamInfo: {
      name: '',
      shortName: '',
      logo: '',
      leader: null as ParticipantInfo | null,
      uniforms: [] as UniformInfo[],
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      selectedGroup: '',
    },
    selectedCategory: tournament.categories[0]?.name || '',
    selectedAgeGroup: '',
    members: [] as ParticipantInfo[],
    personalInfo: {
      name: userProfile?.name || '',
      phone: userProfile?.phone || '',
      idType: userProfile?.idType || 'ID_CARD',
      idNumber: userProfile?.idNumber || '',
      gender: userProfile?.gender || 'MALE',
      birthDate: userProfile?.birthDate || '',
      clothingSize: '' as ClothingSize,
      householdProof: '',
      tags: userProfile?.tags || [],
      position: userProfile?.position || '',
      isLeader: userProfile?.isLeader || false,
    },
    partnerInfo: {
      name: '',
      phone: '',
      idType: 'ID_CARD' as IDType,
      idNumber: '',
      gender: 'MALE' as Gender,
      birthDate: '',
      clothingSize: '' as ClothingSize,
      tags: [] as string[],
      position: '',
      isLeader: false,
    },
    paymentMethod: 'wechat' as 'wechat' | 'offline',
    registrationMethod: 'direct' as 'direct' | 'invite',
  });

  const isComprehensiveLeader = tournament.type === 'Comprehensive' && role === 'leader';
  const isKamaoCup = tournament.id === '5';
  const effectiveType = tournament.type === 'Comprehensive' ? (isComprehensiveLeader ? comprehensiveType : 'Individual') : tournament.type;
  const isDoubles = regData.selectedCategory.includes('双');

  const steps = useMemo(() => {
    let baseSteps = 3;
    if (role === 'individual') baseSteps = 3;
    else if (effectiveType === 'Team') baseSteps = 3;
    else if (regData.registrationMethod === 'invite') baseSteps = 4;
    else baseSteps = 5;

    let extra = 0;
    if (isComprehensiveLeader) {
      extra = 1;
    }
    return baseSteps + extra;
  }, [role, effectiveType, regData.registrationMethod, isComprehensiveLeader]);

  const totalSteps = steps;

  const handleJoinTeamByCode = () => {
    if (!inviteCode.trim()) {
      alert('请输入邀请码');
      return;
    }
    // For demo: '1234' joins the first mock team
    if (inviteCode === '1234' || inviteCode.toLowerCase() === 'team') {
      const mockTeam = MOCK_TEAMS[0];
      setRegData({
        ...regData,
        teamInfo: {
          name: mockTeam.name,
          shortName: mockTeam.shortName || '',
          logo: mockTeam.logo || '',
          leader: null,
        }
      });
      alert(`成功加入队伍：${mockTeam.name}`);
    } else {
      alert('邀请码无效或队伍不存在');
    }
  };

  const handleNext = () => {
    if (step === totalSteps - 1) {
      if (regData.registrationMethod === 'invite') {
        setShowInvitePoster(true);
        return;
      }
      // Record registered category
      if (!registeredCategories.includes(regData.selectedCategory)) {
        setRegisteredCategories([...registeredCategories, regData.selectedCategory]);
      }
      setStep(step + 1);
    } else if (step < steps) {
      setStep(step + 1);
    }
  };

  const handleContinueRegistration = () => {
    setStep(1);
    // Reset registration data but keep team info for leader
    setRegData({
      ...regData,
      selectedCategory: tournament.categories[0]?.name || '',
      selectedAgeGroup: '',
      members: role === 'leader' ? [] : regData.members, // Clear members for new category
      personalInfo: role === 'individual' ? {
        ...regData.personalInfo,
        clothingSize: '' as ClothingSize,
        householdProof: '',
      } : regData.personalInfo,
      partnerInfo: {
        name: '',
        phone: '',
        idType: 'ID_CARD' as IDType,
        idNumber: '',
        gender: 'MALE' as Gender,
        birthDate: '',
        clothingSize: '' as ClothingSize,
      },
    });
    setIsAgreed(false);
    setStep(role === 'leader' ? 2 : 1); // Go to category selection
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };

  const canGoNext = () => {
    if (isKamaoCup && isComprehensiveLeader) {
      if (step === 1) return !!regData.teamInfo.name && !!regData.teamInfo.leader && !!regData.teamInfo.selectedGroup;
      if (step === 2) return !!comprehensiveType;
    } else if (isComprehensiveLeader && step === 1) {
      return !!comprehensiveType;
    }

    const currentStep = isComprehensiveLeader ? step - 1 : step;

    if (currentStep === 1) {
      if (role === 'individual') {
        return !!regData.selectedCategory && (tournament.type === 'Comprehensive' || !!regData.selectedAgeGroup);
      }
      if (effectiveType === 'Team') {
        const baseValid = !!regData.teamInfo.name && !!regData.teamInfo.leader;
        if (tournament.id === '3' || tournament.id === '5') {
          return baseValid && !!regData.teamInfo.selectedGroup;
        }
        return baseValid;
      }
      // Individual Leader Step 1: Team Selection
      const baseValid = !!regData.teamInfo.name && !!regData.teamInfo.leader;
      if (tournament.id === '3' || tournament.id === '5') {
        return baseValid && !!regData.teamInfo.selectedGroup;
      }
      return baseValid;
    }

    if (currentStep === 2) {
      if (effectiveType === 'Team') {
        const hasCategory = !!regData.selectedCategory;
        // Relaxed validation: allow payment even if team is not full
        // But still require at least one member (the leader usually) or just the category
        return hasCategory;
      }
      if (role === 'leader') {
        if (effectiveType === 'Individual' && role === 'leader') {
          return !!regData.registrationMethod;
        }
        // Check if all members have filled their forms
        return regData.members.length > 0 && regData.members.every(m => !!m.clothingSize && !!m.signature);
      }
      const basic = !!regData.personalInfo.name && !!regData.personalInfo.phone && !!regData.personalInfo.idNumber && !!regData.personalInfo.clothingSize && !!regData.personalInfo.signature;
      const doublesValid = isDoubles ? (basic && !!regData.partnerInfo.name && !!regData.partnerInfo.idNumber && !!regData.partnerInfo.clothingSize && !!regData.partnerInfo.signature) : basic;
      return doublesValid;
    }

    if (currentStep === 3) {
      if (effectiveType === 'Individual' && role === 'leader') {
        return !!regData.selectedCategory;
      }
      if (effectiveType === 'Team') return !!regData.paymentMethod;
    }

    if (currentStep === 4) {
      if (effectiveType === 'Individual' && role === 'leader' && regData.registrationMethod === 'direct') {
        const requiredCount = isDoubles ? 2 : 1;
        return regData.members.length === requiredCount && regData.members.every(m => !!m.clothingSize && !!m.signature) && !!regData.paymentMethod;
      }
    }

    return true;
  };

  const renderCategorySelection = () => {
    if (effectiveType === 'Team') {
      // Filter categories to only show team-related ones for comprehensive tournaments
      const filteredCats = tournament.type === 'Comprehensive' 
        ? tournament.categories.filter(cat => cat.name.includes('团体'))
        : tournament.categories;

      return (
        <div className="grid grid-cols-1 gap-3">
          {filteredCats.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setRegData({ ...regData, selectedCategory: cat.name, selectedAgeGroup: cat.ageGroups[0] })}
              className={cn(
                "p-4 rounded-2xl border-2 text-left transition-all",
                regData.selectedCategory === cat.name ? "border-brand-primary bg-brand-primary/5" : "border-slate-100 bg-white"
              )}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                {regData.selectedCategory === cat.name && <Check size={16} className="text-brand-primary" />}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">报名费: ¥{cat.fee || tournament.fee}</div>
            </button>
          ))}
        </div>
      );
    }

    const tabs = ['全部', '男单', '男双', '女单', '女双', '混双'];
    const groupTabs = ['A组', 'B组', 'C组', 'D组'];
    const tabMap: Record<string, string | null> = {
      '全部': null,
      '男单': '男单',
      '男双': '男双',
      '女单': '女单',
      '女双': '女双',
      '混双': '混双'
    };
    const shortCatMap: Record<string, string> = {
      '男单': '男单',
      '男双': '男双',
      '女单': '女单',
      '女双': '女双',
      '混双': '混双'
    };

    // For comprehensive tournaments, we might want to filter based on the tournament's own categories
    // But the user specifically asked for the "Tongan station" flow, which uses these standard categories.
    // However, we should filter out "团体赛" if we are in "Individual" mode of a comprehensive tournament.
    const filteredCategories = activeCategoryTab === '全部' 
      ? MAIN_CATEGORIES 
      : MAIN_CATEGORIES.filter(cat => cat.name === tabMap[activeCategoryTab]);

    const filteredGroups = AGE_GROUPS.filter(g => g.name === activeGroupTab);

    return (
      <div className="space-y-4">
        <div className="sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 -mx-6 px-6 py-2 border-b border-slate-100 space-y-2">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('project')}
              className={cn(
                "flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all",
                viewMode === 'project' ? "bg-white text-brand-primary shadow-sm" : "text-slate-400"
              )}
            >
              按项目筛选
            </button>
            <button 
              onClick={() => setViewMode('group')}
              className={cn(
                "flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all",
                viewMode === 'group' ? "bg-white text-brand-primary shadow-sm" : "text-slate-400"
              )}
            >
              按组别筛选
            </button>
          </div>

          {/* Project Tabs - only show in project view */}
          {viewMode === 'project' ? (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveCategoryTab(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition-all",
                    activeCategoryTab === tab 
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                      : "bg-white text-slate-500 border border-slate-100"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {groupTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveGroupTab(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition-all",
                    activeGroupTab === tab 
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                      : "bg-white text-slate-500 border border-slate-100"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          {viewMode === 'project' ? (
            filteredCategories.map(cat => (
              <div key={cat.name} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-brand-primary rounded-full" />
                  <h4 className="text-sm font-black text-slate-900">{cat.name}</h4>
                </div>
                <div className="space-y-3">
                  {AGE_GROUPS.map(group => {
                    const groupName = `${group.name}${cat.name} (${group.age})`;
                    const isRegistered = registeredCategories.includes(groupName);
                    const isSelected = regData.selectedAgeGroup === groupName;
                    const remaining = cat.max ? cat.max - cat.current : null;
                    const isFull = cat.max && cat.current >= cat.max;

                    return (
                      <button
                        key={groupName}
                        disabled={isRegistered || isFull}
                        onClick={() => setRegData({...regData, selectedCategory: cat.name, selectedAgeGroup: groupName})}
                        className={cn(
                          "w-full p-5 rounded-[24px] border-2 text-left transition-all relative overflow-hidden flex flex-col gap-3",
                          isSelected 
                            ? "border-brand-primary bg-white shadow-xl shadow-brand-primary/10" 
                            : isRegistered || isFull
                              ? "border-slate-100 bg-slate-50 opacity-60" 
                              : "border-transparent bg-white shadow-sm hover:shadow-md active:scale-[0.99]"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="text-lg font-black text-slate-900">{group.name}{cat.name} ({group.age})</div>
                            <div className="text-[11px] font-bold text-slate-400">
                              剩余席位：{isFull ? '0' : (remaining || cat.current)}/{cat.max || '不限'}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-400">报名费：</span>
                              <span className={cn(
                                "text-sm font-black",
                                isSelected ? "text-brand-primary" : "text-slate-600"
                              )}>¥{cat.fee}</span>
                            </div>
                            {cat.deposit && (
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-slate-400">押金：</span>
                                <span className="text-sm font-black text-slate-600">¥{cat.deposit}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary flex items-center justify-center rounded-tl-2xl">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                        {isRegistered && (
                          <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-bl-xl">
                            已报名
                          </div>
                        )}
                        {isFull && !isRegistered && (
                          <div className="absolute top-0 right-0 px-3 py-1 bg-slate-400 text-white text-[9px] font-black rounded-bl-xl">
                            已满员
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            filteredGroups.map(group => (
              <div key={group.name} className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-brand-primary rounded-full" />
                  <h4 className="text-sm font-black text-slate-900">{group.name} ({group.age})</h4>
                </div>
                <div className="space-y-3">
                  {MAIN_CATEGORIES.map(cat => {
                    const groupName = `${group.name}${cat.name} (${group.age})`;
                    const isRegistered = registeredCategories.includes(groupName);
                    const isSelected = regData.selectedAgeGroup === groupName;
                    const remaining = cat.max ? cat.max - cat.current : null;
                    const isFull = cat.max && cat.current >= cat.max;

                    return (
                      <button
                        key={groupName}
                        disabled={isRegistered || isFull}
                        onClick={() => setRegData({...regData, selectedCategory: cat.name, selectedAgeGroup: groupName})}
                        className={cn(
                          "w-full p-5 rounded-[24px] border-2 text-left transition-all relative overflow-hidden flex flex-col gap-3",
                          isSelected 
                            ? "border-brand-primary bg-white shadow-xl shadow-brand-primary/10" 
                            : isRegistered || isFull
                              ? "border-slate-100 bg-slate-50 opacity-60" 
                              : "border-transparent bg-white shadow-sm hover:shadow-md active:scale-[0.99]"
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="text-lg font-black text-slate-900">{group.name}{cat.name} ({group.age})</div>
                            <div className="text-[11px] font-bold text-slate-400">
                              剩余席位：{isFull ? '0' : (remaining || cat.current)}/{cat.max || '不限'}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-400">报名费：</span>
                              <span className={cn(
                                "text-sm font-black",
                                isSelected ? "text-brand-primary" : "text-slate-600"
                              )}>¥{cat.fee}</span>
                            </div>
                            {cat.deposit && (
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-slate-400">押金：</span>
                                <span className="text-sm font-black text-slate-600">¥{cat.deposit}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary flex items-center justify-center rounded-tl-2xl">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                        {isRegistered && (
                          <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500 text-white text-[9px] font-black rounded-bl-xl">
                            已报名
                          </div>
                        )}
                        {isFull && !isRegistered && (
                          <div className="absolute top-0 right-0 px-3 py-1 bg-slate-400 text-white text-[9px] font-black rounded-bl-xl">
                            已满员
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderComprehensiveSelection = () => {
    return (
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-black text-slate-900">请选择报名类型</h3>
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => {
              setComprehensiveType('Individual');
              setStep(2);
              // Set default category for individual
              const firstIndiCat = tournament.categories.find(cat => !cat.name.includes('团体'));
              if (firstIndiCat) {
                setRegData(prev => ({ ...prev, selectedCategory: firstIndiCat.name, selectedAgeGroup: firstIndiCat.ageGroups[0] }));
              }
            }}
            className={cn(
              "p-6 rounded-[32px] border-2 text-left transition-all flex items-center gap-6 group",
              comprehensiveType === 'Individual' ? "border-brand-primary bg-brand-primary/5" : "border-slate-100 bg-white active:scale-[0.98]"
            )}
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-active:scale-95 transition-transform">
              <User size={32} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div className="text-lg font-black text-slate-900 mb-1">单项赛报名</div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">男单、女单、男双、女双、混双等个人项目</p>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button 
            onClick={() => {
              setComprehensiveType('Team');
              setStep(2);
              // Set default category for team
              const firstTeamCat = tournament.categories.find(cat => cat.name.includes('团体'));
              if (firstTeamCat) {
                setRegData(prev => ({ ...prev, selectedCategory: firstTeamCat.name, selectedAgeGroup: firstTeamCat.ageGroups[0] }));
              }
            }}
            className={cn(
              "p-6 rounded-[32px] border-2 text-left transition-all flex items-center gap-6 group",
              comprehensiveType === 'Team' ? "border-brand-primary bg-brand-primary/5" : "border-slate-100 bg-white active:scale-[0.98]"
            )}
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-active:scale-95 transition-transform">
              <Users size={32} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div className="text-lg font-black text-slate-900 mb-1">团体赛报名</div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">混合团体邀请赛，需由领队统一报名</p>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-6">
        <Check size={40} strokeWidth={3} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2">报名提交成功</h3>
      <div className="text-xs font-black text-brand-primary uppercase tracking-widest mb-4">{tournament.title}</div>
      <p className="text-sm text-slate-500 mb-8 leading-relaxed">
        您的报名申请已提交。请等待组委会审核，审核结果将通过短信及公众号通知您。
      </p>
      <div className="w-full space-y-3">
        {effectiveType === 'Team' && (
          <button 
            onClick={() => setShowInvitePoster(true)}
            className="w-full py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
          >
            <QrCode size={18} /> 邀请队员报名
          </button>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onBack}
            className="py-4 rounded-2xl bg-slate-100 text-slate-600 text-sm font-black"
          >
            返回赛事详情
          </button>
          <button 
            onClick={handleContinueRegistration}
            className="py-4 rounded-2xl bg-slate-100 text-slate-600 text-sm font-black"
          >
            继续报名其它项目
          </button>
        </div>
      </div>
    </div>
  );

  const renderLeaderFlow = () => {
    if (isKamaoCup && isComprehensiveLeader) {
      if (step === 1) {
        // Step 1: Team Creation (same as Tournament 3)
        return (
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900">新建队伍</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍名称</label>
                  <input 
                    type="text" 
                    placeholder="请输入队伍全称"
                    value={regData.teamInfo.name}
                    onChange={e => setRegData({...regData, teamInfo: {...regData.teamInfo, name: e.target.value}})}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍简称</label>
                  <input 
                    type="text" 
                    placeholder="请输入4字以内简称"
                    maxLength={4}
                    value={regData.teamInfo.shortName}
                    onChange={e => setRegData({...regData, teamInfo: {...regData.teamInfo, shortName: e.target.value}})}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">领队</label>
                  <div 
                    onClick={() => { setPoolTarget('team_leader'); setShowPlayerPool(true); }}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm flex items-center justify-between cursor-pointer"
                  >
                    {regData.teamInfo.leader ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-black text-brand-primary">
                          {regData.teamInfo.leader.name[0]}
                        </div>
                        <span className="font-bold">{regData.teamInfo.leader.name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">请选择领队</span>
                    )}
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">组别 (单选)</label>
                  <div className="flex flex-wrap gap-2">
                    {['甲组', '乙组', '丙组'].map(group => (
                      <button
                        key={group}
                        onClick={() => {
                          setRegData({
                            ...regData,
                            teamInfo: { ...regData.teamInfo, selectedGroup: group }
                          });
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                          regData.teamInfo.selectedGroup === group
                            ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20'
                            : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍LOGO (可选)</label>
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setRegData({...regData, teamInfo: {...regData.teamInfo, logo: reader.result as string}});
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1 active:bg-slate-100 transition-all cursor-pointer overflow-hidden"
                    >
                      {regData.teamInfo.logo ? (
                        <img src={regData.teamInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera size={24} />
                          <span className="text-[10px] font-bold">上传</span>
                        </>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        建议上传 1:1 比例的图片，支持 JPG、PNG 格式。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Uniforms */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍队服</label>
                    <button 
                      onClick={() => {
                        setEditingUniform(null);
                        setEditingUniformIndex(null);
                        setShowUniformModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-brand-primary/10 text-brand-primary text-[10px] font-black flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Plus size={14} /> 添加队服
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(regData.teamInfo.uniforms || []).map((u, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden">
                            <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{u.name}</div>
                            <div className="text-[10px] text-slate-400">{u.color} · {u.type === 'TOP' ? '上衣' : '裤子/裙子'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => {
                              setEditingUniform(u);
                              setEditingUniformIndex(idx);
                              setShowUniformModal(true);
                            }}
                            className="p-2 text-slate-400 hover:bg-white rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              const updatedUniforms = (regData.teamInfo.uniforms || []).filter((_, i) => i !== idx);
                              setRegData({...regData, teamInfo: {...regData.teamInfo, uniforms: updatedUniforms}});
                            }}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {(regData.teamInfo.uniforms || []).length === 0 && (
                      <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                        <p className="text-[10px] text-slate-400 font-medium">尚未添加队服</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      if (step === 2) {
        return renderComprehensiveSelection();
      }
    } else if (isComprehensiveLeader && step === 1) {
      return renderComprehensiveSelection();
    }

    const currentStep = isComprehensiveLeader ? step - 1 : step;

    if (effectiveType === 'Individual') {
      switch (currentStep) {
        case 1: // Team Selection
          return (
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-900">选择队伍</h3>
                </div>

                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="搜索现有队伍名称..."
                    value={teamSearchQuery}
                    onChange={e => setTeamSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>

                {/* Team List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                  {availableTeams.filter(t => t.name.toLowerCase().includes(teamSearchQuery.toLowerCase())).map((team, i) => (
                    <div key={i} className="relative group">
                      <button 
                        onClick={() => {
                          setRegData({
                            ...regData, 
                            teamInfo: { 
                              ...regData.teamInfo, 
                              name: team.name,
                              shortName: team.shortName,
                              logo: team.logo,
                              leader: team.leader as any
                            }
                          });
                        }}
                        className={cn(
                          "w-full p-4 rounded-2xl border flex items-center gap-4 transition-all text-left",
                          regData.teamInfo.name === team.name ? "bg-brand-primary/5 border-brand-primary" : "bg-white border-slate-100"
                        )}
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden shadow-sm border border-slate-100">
                          {team.logo ? (
                            <img src={team.logo} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <Users className="text-slate-300" size={24} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-slate-900">{team.name}</div>
                          <div className="text-[10px] text-slate-400">简称：{team.shortName}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTeam(team);
                              setNewTeamLogo(team.logo || '');
                              setNewTeamLeader(team.leader || null);
                              setNewTeamUniforms(team.uniforms || []);
                              setShowCreateTeamModal(true);
                            }}
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-brand-primary transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          {regData.teamInfo.name === team.name && <Check size={16} className="text-brand-primary" />}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    setEditingTeam(null);
                    setNewTeamLogo('');
                    setNewTeamLeader(null);
                    setNewTeamUniforms([]);
                    setShowCreateTeamModal(true);
                  }}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-brand-primary/30 text-brand-primary bg-brand-primary/5 flex items-center justify-center gap-2 text-sm font-black active:scale-[0.98] transition-all"
                >
                  <Plus size={18} /> 新建队伍
                </button>
              </div>
            </div>
          );
        case 2: // Registration Method Selection
          return (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-black text-slate-900">选择报名方式</h3>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => {
                    setRegData({...regData, registrationMethod: 'direct'});
                    setStep(3);
                  }}
                  className={cn(
                    "p-6 rounded-[32px] border-2 text-left transition-all flex items-center gap-6 group",
                    regData.registrationMethod === 'direct' ? "border-brand-primary bg-brand-primary/5" : "border-slate-100 bg-white"
                  )}
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <UserCheck size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-black text-slate-900 mb-1">直接报名</div>
                    <p className="text-xs text-slate-400 font-medium">领队直接添加队员并支付</p>
                  </div>
                  {regData.registrationMethod === 'direct' && <Check size={20} className="text-brand-primary" />}
                </button>

                <button 
                  onClick={() => {
                    setRegData({...regData, registrationMethod: 'invite'});
                    setShowInvitePoster(true);
                  }}
                  className={cn(
                    "p-6 rounded-[32px] border-2 text-left transition-all flex items-center gap-6 group",
                    regData.registrationMethod === 'invite' ? "border-brand-primary bg-brand-primary/5" : "border-slate-100 bg-white"
                  )}
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <QrCode size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-black text-slate-900 mb-1">邀请队员报名</div>
                    <p className="text-xs text-slate-400 font-medium">生成海报邀请队员自行填写</p>
                  </div>
                  {regData.registrationMethod === 'invite' && <Check size={20} className="text-brand-primary" />}
                </button>
              </div>
            </div>
          );
        case 3: 
          // Direct Flow: Category Selection
          return (
            <div className="p-6">
              <h3 className="text-lg font-black text-slate-900 mb-4">选择参赛项目</h3>
              {renderCategorySelection()}
            </div>
          );
        case 4: // Direct Flow: Add Members + Payment or Success (if invite)
          if (regData.registrationMethod === 'invite') {
            return renderSuccess();
          }
          const requiredMembers = isDoubles ? 2 : 1;
          return (
            <div className="p-6 space-y-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-900">添加选手</h3>
                  <span className="text-xs font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">需添加 {requiredMembers} 人</span>
                </div>
                <div className="space-y-4">
                  {[...Array(requiredMembers)].map((_, i) => {
                    const m = regData.members[i];
                    return (
                      <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                              {m ? m.name[0] : (i + 1)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-800">{m ? m.name : `选手 ${i + 1}`}</div>
                              <div className="text-[10px] text-slate-400">{m ? m.phone : '未选择人员'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {m ? (
                              <>
                                <button 
                                  onClick={() => {
                                    setEditingPlayer(m);
                                    setEditingTarget('member');
                                    setIsRegistrationForm(true);
                                    setShowEditPlayerModal(true);
                                  }}
                                  className={cn(
                                    "px-3 py-1.5 rounded-lg border text-[10px] font-black active:scale-95 transition-all",
                                    (m.clothingSize && m.signature) 
                                      ? "bg-emerald-50 border-emerald-500 text-emerald-600" 
                                      : "border-brand-primary text-brand-primary"
                                  )}
                                >
                                  {(m.clothingSize && m.signature) ? '报名表已填' : '完善报名表'}
                                </button>
                                <button 
                                  onClick={() => {
                                    const newMembers = [...regData.members];
                                    newMembers.splice(i, 1);
                                    setRegData({...regData, members: newMembers});
                                  }}
                                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            ) : (
                              <button 
                                onClick={() => { setPoolTarget('member'); setShowPlayerPool(true); }}
                                className="px-4 py-2 rounded-xl bg-brand-primary/5 text-brand-primary text-xs font-black flex items-center gap-2"
                              >
                                <Plus size={14} /> 选择人员
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">支付方式</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setRegData({...regData, paymentMethod: 'wechat'})}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all",
                      regData.paymentMethod === 'wechat' ? "border-brand-primary bg-brand-primary/5" : "border-slate-50 bg-slate-50/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                        <CreditCard size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">微信支付</span>
                    </div>
                    {regData.paymentMethod === 'wechat' && <Check size={16} className="text-brand-primary" />}
                  </button>
                </div>
              </div>
            </div>
          );
        case 5: // Success
          return renderSuccess();
        default:
          return null;
      }
    }

    if (effectiveType === 'Team') {
      switch (currentStep) {
        case 1: // Team Info + Leader + Uniforms
          return (
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-900">新建队伍</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍名称</label>
                    <input 
                      type="text" 
                      placeholder="请输入队伍全称"
                      value={regData.teamInfo.name}
                      onChange={e => setRegData({...regData, teamInfo: {...regData.teamInfo, name: e.target.value}})}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍简称</label>
                    <input 
                      type="text" 
                      placeholder="请输入4字以内简称"
                      maxLength={4}
                      value={regData.teamInfo.shortName}
                      onChange={e => setRegData({...regData, teamInfo: {...regData.teamInfo, shortName: e.target.value}})}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">领队</label>
                    <div 
                      onClick={() => { setPoolTarget('team_leader'); setShowPlayerPool(true); }}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm flex items-center justify-between cursor-pointer"
                    >
                      {regData.teamInfo.leader ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-black text-brand-primary">
                            {regData.teamInfo.leader.name[0]}
                          </div>
                          <span className="font-bold">{regData.teamInfo.leader.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">请选择领队</span>
                      )}
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  </div>
                  {tournament.id === '3' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">组别 (单选)</label>
                      <div className="flex flex-wrap gap-2">
                        {['甲组', '乙组', '丙组'].map(group => (
                          <button
                            key={group}
                            onClick={() => {
                              setRegData({
                                ...regData,
                                teamInfo: { ...regData.teamInfo, selectedGroup: group }
                              });
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                              regData.teamInfo.selectedGroup === group
                                ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                            }`}
                          >
                            {group}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍LOGO (可选)</label>
                    <div className="flex items-center gap-4">
                      <div 
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setRegData({...regData, teamInfo: {...regData.teamInfo, logo: reader.result as string}});
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}
                        className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1 active:bg-slate-100 transition-all cursor-pointer overflow-hidden"
                      >
                        {regData.teamInfo.logo ? (
                          <img src={regData.teamInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Camera size={24} />
                            <span className="text-[10px] font-bold">上传</span>
                          </>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          建议上传 1:1 比例的图片，支持 JPG、PNG 格式。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Team Uniforms */}
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍队服</label>
                      <button 
                        onClick={() => {
                          setEditingUniform(null);
                          setEditingUniformIndex(null);
                          setShowUniformModal(true);
                        }}
                        className="text-[10px] font-black text-brand-primary flex items-center gap-1"
                      >
                        <Plus size={12} /> 添加队服
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {(regData.teamInfo.uniforms || []).map((uniform, idx) => (
                        <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between gap-4 card-shadow">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                                {uniform.frontImage ? (
                                  <img src={uniform.frontImage} alt="Front" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                    <Camera size={16} />
                                  </div>
                                )}
                              </div>
                              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                                {uniform.backImage ? (
                                  <img src={uniform.backImage} alt="Back" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                    <Camera size={16} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-800">队服 {idx + 1}</div>
                              <div className="text-[10px] text-slate-400">主色调：{uniform.mainColor || '未填写'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setEditingUniform(uniform);
                                setEditingUniformIndex(idx);
                                setShowUniformModal(true);
                              }}
                              className="p-2 text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => {
                                const updatedUniforms = (regData.teamInfo.uniforms || []).filter((_, i) => i !== idx);
                                setRegData({...regData, teamInfo: {...regData.teamInfo, uniforms: updatedUniforms}});
                              }}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {(regData.teamInfo.uniforms || []).length === 0 && (
                        <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                          <p className="text-[10px] text-slate-400 font-medium">尚未添加队服</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        case 2: // Category + Add Members + Payment
          return (
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">选择报名团体组别</h3>
                {renderCategorySelection()}
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">添加选手</h3>
                    <p className="text-[10px] text-slate-400 font-medium">要求：6-8名选手，且至少3名女性</p>
                  </div>
                  <span className={cn(
                    "text-xs font-black px-3 py-1 rounded-full",
                    regData.members.length >= 6 && regData.members.length <= 8 && regData.members.filter(m => m.gender === 'FEMALE').length >= 3
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-brand-primary/10 text-brand-primary"
                  )}>
                    已添加 {regData.members.length} 人 (男 {regData.members.filter(m => m.gender === 'MALE').length}人，女 {regData.members.filter(m => m.gender === 'FEMALE').length}人)
                  </span>
                </div>
                <div className="space-y-3">
                  {regData.members.map((m, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-black",
                            m.gender === 'FEMALE' ? "bg-pink-50 text-pink-500" : "bg-blue-50 text-blue-500"
                          )}>
                            {m.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-bold text-slate-800">{m.name}</div>
                              {m.tags?.map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[8px] font-black">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="text-[10px] text-slate-400">{m.phone} · {m.gender === 'FEMALE' ? '女' : '男'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setEditingPlayer(m);
                              setEditingTarget('member');
                              setIsRegistrationForm(true);
                              setShowEditPlayerModal(true);
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-[10px] font-black active:scale-95 transition-all",
                              (m.clothingSize && m.signature) 
                                ? "bg-emerald-50 border-emerald-500 text-emerald-600" 
                                : "border-brand-primary text-brand-primary"
                            )}
                          >
                            {(m.clothingSize && m.signature) ? '报名表已填' : '完善报名表'}
                          </button>
                          <button 
                            onClick={() => {
                              const newMembers = [...regData.members];
                              newMembers.splice(i, 1);
                              setRegData({...regData, members: newMembers});
                            }}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => { setPoolTarget('member'); setShowPlayerPool(true); }}
                    className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-2 text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    <Users size={24} />
                    <span className="text-xs font-bold">从选手池选择队员</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-lg font-black text-slate-900">支付方式</h3>
                <button 
                  onClick={() => setRegData({...regData, paymentMethod: 'wechat'})}
                  className={cn(
                    "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all",
                    regData.paymentMethod === 'wechat' ? "border-brand-primary bg-brand-primary/5" : "border-slate-50 bg-slate-50/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                      <CreditCard size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">微信支付</span>
                  </div>
                  {regData.paymentMethod === 'wechat' && <Check size={16} className="text-brand-primary" />}
                </button>
              </div>
            </div>
          );
        case 3: // Success
          return renderSuccess();
        default:
          return null;
      }
    }
    return null;
  };

  const renderIndividualFlow = () => {
    switch (step) {
      case 1: // Category Selection
        return (
          <div className="p-6">
            <h3 className="text-lg font-black text-slate-900 mb-4">选择参赛项目</h3>
            {renderCategorySelection()}
          </div>
        );
      case 2: // Merged: Personal Info + Team Selection + Disclaimer + Payment
        return (
          <div className="p-6 space-y-8">
            {/* Team Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">加入参赛队伍 (可选)</h3>
              {regData.teamInfo.name ? (
                <div className="bg-white p-6 rounded-[32px] border-2 border-brand-primary flex items-center justify-between gap-4 shadow-xl shadow-brand-primary/5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary overflow-hidden">
                      {regData.teamInfo.logo ? <img src={regData.teamInfo.logo} className="w-full h-full object-cover" /> : <Users size={32} />}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">{regData.teamInfo.name}</div>
                      <div className="text-[10px] text-brand-primary font-bold uppercase tracking-widest mt-1">已加入该队伍</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setRegData({...regData, teamInfo: { name: '', shortName: '', logo: '', leader: null }});
                      setInviteCode('');
                    }}
                    className="p-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-[32px] border-2 border-dashed border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <QrCode size={20} />
                    </div>
                    <div className="flex-1">
                      <input 
                        type="text"
                        placeholder="请输入队伍邀请码"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                    <button 
                      onClick={handleJoinTeamByCode}
                      disabled={!inviteCode.trim()}
                      className="px-6 py-2.5 bg-brand-primary text-white text-xs font-black rounded-xl shadow-lg shadow-brand-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      加入
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium text-center">请向您的领队索取队伍邀请码（测试码：1234）</p>
                </div>
              )}
            </div>

            {/* Player Info */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900">填写选手信息</h3>
                <button 
                  onClick={() => { 
                    setPoolTarget('individual_doubles'); 
                    setSelectedPoolPlayers([]);
                    setShowPlayerPool(true); 
                  }}
                  className="text-[10px] font-black text-brand-primary flex items-center gap-1 bg-brand-primary/5 px-3 py-1.5 rounded-full"
                >
                  <Users size={12} /> 从选手池添加
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Player 1 */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                        {regData.personalInfo.name ? regData.personalInfo.name[0] : '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-bold text-slate-800">{regData.personalInfo.name || '未填写'}</div>
                          {regData.personalInfo.tags?.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[8px] font-black">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-400">{regData.personalInfo.phone || '未填写手机号'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {regData.personalInfo.name && (
                        <>
                          <button 
                            onClick={() => {
                              setEditingPlayer(regData.personalInfo);
                              setEditingTarget('personal');
                              setIsRegistrationForm(true);
                              setShowEditPlayerModal(true);
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-[10px] font-black active:scale-95 transition-all",
                              (regData.personalInfo.clothingSize && regData.personalInfo.signature) 
                                ? "bg-emerald-50 border-emerald-500 text-emerald-600" 
                                : "border-brand-primary text-brand-primary"
                            )}
                          >
                            {(regData.personalInfo.clothingSize && regData.personalInfo.signature) ? '报名表已填' : '完善报名表'}
                          </button>
                          <button 
                            onClick={() => setRegData({...regData, personalInfo: { name: '', phone: '', idType: 'ID_CARD', idNumber: '', gender: 'MALE', birthDate: '', clothingSize: '' }})}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Player 2 (Partner) */}
                {isDoubles && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 card-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                          {regData.partnerInfo.name ? regData.partnerInfo.name[0] : '?'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-bold text-slate-800">{regData.partnerInfo.name || '未填写搭档'}</div>
                            {regData.partnerInfo.tags?.map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[8px] font-black">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="text-[10px] text-slate-400">{regData.partnerInfo.phone || '未填写手机号'}</div>
                        </div>
                      </div>
                        <div className="flex items-center gap-2">
                          {regData.partnerInfo.name && (
                            <>
                              <button 
                                onClick={() => {
                                  setEditingPlayer(regData.partnerInfo);
                                  setEditingTarget('partner');
                                  setIsRegistrationForm(true);
                                  setShowEditPlayerModal(true);
                                }}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg border text-[10px] font-black active:scale-95 transition-all",
                                  (regData.partnerInfo.clothingSize && regData.partnerInfo.signature) 
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-600" 
                                    : "border-brand-primary text-brand-primary"
                                )}
                              >
                                {(regData.partnerInfo.clothingSize && regData.partnerInfo.signature) ? '报名表已填' : '完善报名表'}
                              </button>
                              <button 
                                onClick={() => setRegData({...regData, partnerInfo: { name: '', phone: '', idType: 'ID_CARD', idNumber: '', gender: 'MALE', birthDate: '', clothingSize: '' }})}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">支付方式</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setRegData({...regData, paymentMethod: 'wechat'})}
                  className={cn(
                    "w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all",
                    regData.paymentMethod === 'wechat' ? "border-brand-primary bg-brand-primary/5" : "border-slate-50 bg-slate-50/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                      <CreditCard size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">微信支付</span>
                  </div>
                  {regData.paymentMethod === 'wechat' && <Check size={16} className="text-brand-primary" />}
                </button>
              </div>
            </div>
          </div>
        );
      case 3: // Success
        return (
          <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-6">
              <Check size={40} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">报名提交成功</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              您的报名申请已提交。请等待组委会审核，审核结果将通过短信及公众号通知您。
            </p>
            <div className="w-full space-y-3">
              <button 
                onClick={handleContinueRegistration}
                className="w-full py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20"
              >
                继续报名其它项目
              </button>
              <button 
                onClick={onBack}
                className="w-full py-4 rounded-2xl bg-slate-100 text-slate-600 text-sm font-black"
              >
                返回赛事首页
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderUniformModal = () => (
    <AnimatePresence>
      {showUniformModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="w-full max-w-md bg-white rounded-t-[40px] overflow-hidden shadow-2xl"
          >
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {editingUniformIndex !== null ? '编辑队服' : '添加新队服'}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    请上传队服正反面照片并填写主色调
                  </p>
                </div>
                <button 
                  onClick={() => setShowUniformModal(false)}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">正面照片</label>
                  <div 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditingUniform(prev => prev ? { ...prev, frontImage: reader.result as string } : { frontImage: reader.result as string, backImage: '', mainColor: '' });
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="aspect-[3/4] rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2 active:bg-slate-100 transition-all cursor-pointer overflow-hidden group"
                  >
                    {editingUniform?.frontImage ? (
                      <img src={editingUniform.frontImage} alt="Front" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                          <Camera size={24} />
                        </div>
                        <span className="text-[10px] font-black">点击上传正面</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">反面照片</label>
                  <div 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditingUniform(prev => prev ? { ...prev, backImage: reader.result as string } : { frontImage: '', backImage: reader.result as string, mainColor: '' });
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="aspect-[3/4] rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2 active:bg-slate-100 transition-all cursor-pointer overflow-hidden group"
                  >
                    {editingUniform?.backImage ? (
                      <img src={editingUniform.backImage} alt="Back" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                          <Camera size={24} />
                        </div>
                        <span className="text-[10px] font-black">点击上传反面</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">队服主色调</label>
                <input 
                  type="text"
                  placeholder="例如：红色、蓝白相间"
                  value={editingUniform?.mainColor || ''}
                  onChange={e => setEditingUniform(prev => prev ? { ...prev, mainColor: e.target.value } : { frontImage: '', backImage: '', mainColor: e.target.value })}
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setShowUniformModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 text-sm font-black active:scale-95 transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    if (!editingUniform) return;
                    
                    if (showCreateTeamModal) {
                      let updatedUniforms;
                      if (editingUniformIndex !== null) {
                        updatedUniforms = [...newTeamUniforms];
                        updatedUniforms[editingUniformIndex] = editingUniform;
                      } else {
                        updatedUniforms = [...newTeamUniforms, editingUniform];
                      }
                      setNewTeamUniforms(updatedUniforms);
                    } else {
                      const currentUniforms = regData.teamInfo.uniforms || [];
                      let updatedUniforms;
                      if (editingUniformIndex !== null) {
                        updatedUniforms = [...currentUniforms];
                        updatedUniforms[editingUniformIndex] = editingUniform;
                      } else {
                        updatedUniforms = [...currentUniforms, editingUniform];
                      }
                      setRegData({...regData, teamInfo: {...regData.teamInfo, uniforms: updatedUniforms}});
                    }
                    
                    setShowUniformModal(false);
                    setEditingUniform(null);
                    setEditingUniformIndex(null);
                  }}
                  className="flex-[2] py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                >
                  保存队服
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderStepIndicator = () => (
    <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center">
      {Array.from({ length: steps }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
            step > i + 1 ? "bg-emerald-500 text-white" : 
            step === i + 1 ? "bg-brand-primary text-white scale-110 shadow-lg shadow-brand-primary/20" : 
            "bg-slate-100 text-slate-400"
          )}>
            {step > i + 1 ? <Check size={12} strokeWidth={4} /> : i + 1}
          </div>
          {i < steps - 1 && (
            <div className={cn(
              "w-6 h-[2px] mx-1 rounded-full",
              step > i + 1 ? "bg-emerald-500" : "bg-slate-100"
            )} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep = () => {
    return role === 'leader' ? renderLeaderFlow() : renderIndividualFlow();
  };

  return (
    <div className="pb-32 bg-slate-50 min-h-screen">
      <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full max-w-md">
        <button onClick={handleBack} className="p-2 rounded-full hover:bg-slate-100">
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-black text-slate-900 truncate">{tournament.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {role === 'leader' ? '领队报名' : '个人报名'} · 步骤 {step}/{steps}
            </span>
          </div>
        </div>
      </header>

      {step < steps && renderStepIndicator()}

      {/* Persistent Project Header */}
      {step > 1 && step < steps && regData.selectedAgeGroup && (
        <div className="px-6 py-3 bg-brand-primary/5 border-b border-brand-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-brand-primary" />
            <span className="text-xs font-black text-brand-primary">已选项目：{regData.teamInfo.name ? `${regData.teamInfo.name}，` : ''}{regData.selectedAgeGroup}</span>
          </div>
          <button 
            onClick={() => setStep(role === 'leader' ? 2 : 1)} 
            className="text-[10px] font-bold text-brand-primary underline"
          >
            修改
          </button>
        </div>
      )}

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderStep()}
      </div>

      {step < steps && !showInvitePoster && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-between gap-4 z-40">
          {step === totalSteps - 1 && regData.registrationMethod !== 'invite' ? (
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">需付：</span>
              <span className="text-xl font-black text-brand-primary">¥{
                effectiveType === 'Team'
                  ? (tournament.categories.find(c => c.name === regData.selectedCategory)?.fee || tournament.fee || 0)
                  : role === 'leader' 
                    ? (tournament.categories.find(c => c.name === regData.selectedCategory)?.fee || tournament.fee || 0) * (regData.members.length || 1)
                    : (tournament.categories.find(c => c.name === regData.selectedCategory)?.fee || tournament.fee || 0) * (isDoubles ? 2 : 1)
              }</span>
            </div>
          ) : null}
          {!showInvitePoster && !(step === 2 && role === 'leader' && regData.registrationMethod === 'invite') && (
            <button 
              onClick={handleNext}
              disabled={!canGoNext()}
              className={cn(
                "flex-1 py-4 rounded-2xl text-sm font-black shadow-lg transition-all disabled:opacity-50 disabled:scale-100",
                canGoNext() ? "bg-brand-primary text-white shadow-brand-primary/20 active:scale-95" : "bg-slate-100 text-slate-400"
              )}
            >
              {step === steps - 1 ? (regData.registrationMethod === 'invite' ? '生成海报' : '确认支付') : '下一步'}
            </button>
          )}
        </div>
      )}

      {/* Player/Team Pool Modal */}
      <AnimatePresence>
        {showPlayerPool && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlayerPool(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-sm rounded-t-[32px] p-5 relative z-10 max-h-[70vh] overflow-y-auto no-scrollbar"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-slate-900">
                  {poolTarget === 'team' ? '选择队伍' : '选择人员'}
                </h3>
                <button onClick={() => setShowPlayerPool(false)} className="p-2 text-slate-400">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-3">
                {poolTarget === 'team' ? (
                  MOCK_TEAMS.map((team, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setRegData(prev => ({
                          ...prev, 
                          teamInfo: { 
                            name: team.name, 
                            shortName: team.shortName || '', 
                            logo: team.logo || '',
                            leader: team.leader || null
                          }
                        }));
                        setShowPlayerPool(false);
                      }}
                      className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center gap-3 active:scale-95 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-slate-100">
                        {team.logo ? <img src={team.logo} alt="" className="w-full h-full object-cover" /> : <Users size={20} className="text-slate-300" />}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-slate-800">{team.name}</div>
                        <div className="text-[10px] text-slate-400">简称：{team.shortName}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <>
                    {playerPool.map((player, i) => {
                      const isSelected = selectedPoolPlayers.some(p => p.phone === player.phone);
                      return (
                        <div 
                          key={i}
                          className={cn(
                            "w-full p-4 rounded-2xl border transition-all flex items-center justify-between",
                            isSelected ? "bg-brand-primary/5 border-brand-primary" : "bg-slate-50 border-slate-100"
                          )}
                        >
                          <button 
                            onClick={() => {
                              if (poolTarget === 'individual_doubles' || poolTarget === 'member') {
                                if (isSelected) {
                                  setSelectedPoolPlayers(selectedPoolPlayers.filter(p => p.phone !== player.phone));
                                } else {
                                  if (poolTarget === 'individual_doubles') {
                                    if (selectedPoolPlayers.length < (isDoubles ? 2 : 1)) {
                                      setSelectedPoolPlayers([...selectedPoolPlayers, player]);
                                    }
                                  } else {
                                    // poolTarget === 'member'
                                    const limit = effectiveType === 'Individual' ? (isDoubles ? 2 : 1) : 999;
                                    if (selectedPoolPlayers.length < limit) {
                                      setSelectedPoolPlayers([...selectedPoolPlayers, player]);
                                    }
                                  }
                                }
                              } else {
                                if (poolTarget === 'personal' || poolTarget === 'team_leader') {
                                  if (poolTarget === 'team_leader') {
                                    setNewTeamLeader(player);
                                    setRegData(prev => ({...prev, teamInfo: { ...prev.teamInfo, leader: player }}));
                                  } else if (role === 'leader') {
                                    setRegData(prev => ({...prev, teamInfo: { ...prev.teamInfo, leader: player }}));
                                  } else {
                                    setRegData(prev => ({...prev, personalInfo: { ...prev.personalInfo, ...player }}));
                                  }
                                } else if (poolTarget === 'partner') {
                                  setRegData(prev => ({...prev, partnerInfo: { ...prev.partnerInfo, ...player }}));
                                }
                                setShowPlayerPool(false);
                              }
                            }}
                            className="flex-1 flex items-center gap-4 text-left"
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors",
                              isSelected ? "bg-brand-primary text-white" : "bg-white text-brand-primary"
                            )}>
                              {isSelected ? <Check size={20} /> : <User size={20} />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-bold text-slate-900">{player.name}</div>
                                {player.tags?.map(tag => (
                                  <span key={tag} className="px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[8px] font-black">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="text-[10px] text-slate-400">{player.phone}</div>
                              <div className="text-[9px] text-slate-300 mt-0.5">{player.idNumber}</div>
                            </div>
                          </button>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPlayer(player);
                                setIsRegistrationForm(false);
                                setShowEditPlayerModal(true);
                              }}
                              className="p-2 text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlayerPool(prev => prev.filter(p => p.phone !== player.phone));
                                setSelectedPoolPlayers(prev => prev.filter(p => p.phone !== player.phone));
                              }}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {(poolTarget === 'individual_doubles' || poolTarget === 'member') && (
                      <div className="pt-4">
                        <button 
                          disabled={selectedPoolPlayers.length === 0}
                          onClick={() => {
                            if (selectedPoolPlayers.length > 0) {
                              if (poolTarget === 'individual_doubles') {
                                const [p1, p2] = selectedPoolPlayers;
                                setRegData(prev => ({
                                  ...prev,
                                  personalInfo: p1 ? { ...prev.personalInfo, ...p1 } : prev.personalInfo,
                                  partnerInfo: p2 ? { ...prev.partnerInfo, ...p2 } : prev.partnerInfo
                                }));
                              } else if (poolTarget === 'member') {
                                const newMembers = selectedPoolPlayers.filter(p => !regData.members.find(m => m.phone === p.phone));
                                setRegData(prev => ({
                                  ...prev,
                                  members: [...prev.members, ...newMembers.map(p => ({ ...p, clothingSize: '' as ClothingSize, householdProof: '' }))]
                                }));
                              }
                            }
                            setShowPlayerPool(false);
                          }}
                          className={cn(
                            "w-full py-4 rounded-2xl text-sm font-black transition-all shadow-lg",
                            selectedPoolPlayers.length > 0 
                              ? "bg-brand-primary text-white shadow-brand-primary/20" 
                              : "bg-slate-100 text-slate-400 shadow-none"
                          )}
                        >
                          确认选择 ({selectedPoolPlayers.length}{ (poolTarget === 'individual_doubles' || (poolTarget === 'member' && effectiveType === 'Individual')) ? `/${isDoubles ? 2 : 1}` : ''}人)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              {poolTarget !== 'team' && (
                <button 
                  onClick={() => {
                    setEditingPlayer({
                      name: '',
                      phone: '',
                      idType: 'ID_CARD',
                      idNumber: '',
                      gender: 'MALE',
                      birthDate: '',
                      clothingSize: '' as ClothingSize
                    });
                    setIsRegistrationForm(false);
                    setShowEditPlayerModal(true);
                  }}
                  className="w-full py-4 mt-6 rounded-2xl border-2 border-dashed border-slate-200 text-xs font-bold text-slate-400 flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> 添加人员
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Player Modal */}
      <AnimatePresence>
        {showEditPlayerModal && editingPlayer && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditPlayerModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] p-8 relative z-10 space-y-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900">{isRegistrationForm ? "填写报名表" : "编辑选手信息"}</h3>
                <button onClick={() => setShowEditPlayerModal(false)} className="p-2 text-slate-400">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              {isRegistrationForm && (
                <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-4 space-y-1">
                  <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest">正在报名</div>
                  <div className="text-sm font-black text-slate-900">{tournament.title}</div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">姓名</label>
                    <input 
                      type="text" 
                      value={editingPlayer.name}
                      onChange={e => setEditingPlayer({...editingPlayer, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">手机号码</label>
                    <input 
                      type="tel" 
                      value={editingPlayer.phone}
                      onChange={e => setEditingPlayer({...editingPlayer, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">性别选择</label>
                    <div className="flex gap-2">
                      {[
                        { label: '男', value: 'MALE' },
                        { label: '女', value: 'FEMALE' }
                      ].map(g => (
                        <button
                          key={g.value}
                          onClick={() => setEditingPlayer({...editingPlayer, gender: g.value as Gender})}
                          className={cn(
                            "flex-1 py-2 rounded-lg text-xs font-bold border transition-all",
                            editingPlayer.gender === g.value ? "bg-brand-primary text-white border-brand-primary" : "bg-white text-slate-600 border-slate-100"
                          )}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">出生日期</label>
                    <input 
                      type="date" 
                      value={editingPlayer.birthDate}
                      onChange={e => setEditingPlayer({...editingPlayer, birthDate: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">证件类型</label>
                  <select 
                    value={editingPlayer.idType}
                    onChange={e => setEditingPlayer({...editingPlayer, idType: e.target.value as IDType})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all"
                  >
                    {Object.entries(ID_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">证件号码</label>
                  <input 
                    type="text" 
                    value={editingPlayer.idNumber}
                    onChange={e => setEditingPlayer({...editingPlayer, idNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>

                {isRegistrationForm && (
                  <>
                    {tournament.title.includes('企业杯') && (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">职位</label>
                          <input 
                            type="text" 
                            placeholder="请输入职位"
                            value={editingPlayer.position || ''}
                            onChange={e => setEditingPlayer({...editingPlayer, position: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-2 py-2">
                          <input 
                            type="checkbox" 
                            id="isLeader"
                            checked={editingPlayer.isLeader || false}
                            onChange={e => {
                              const isLeader = e.target.checked;
                              let tags = editingPlayer.tags || [];
                              if (isLeader) {
                                if (!tags.includes('领导')) {
                                  tags = [...tags, '领导'];
                                }
                              } else {
                                tags = tags.filter(t => t !== '领导');
                              }
                              setEditingPlayer({...editingPlayer, isLeader, tags});
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                          />
                          <label htmlFor="isLeader" className="text-sm font-bold text-slate-700">是否领导</label>
                        </div>
                      </>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">衣服尺寸</label>
                      <select 
                        value={editingPlayer.clothingSize || ''}
                        onChange={e => setEditingPlayer({...editingPlayer, clothingSize: e.target.value as ClothingSize})}
                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all"
                      >
                        <option value="">请选择衣服尺寸</option>
                        {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">运动风险承诺书</label>
                      <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-[10px] text-slate-500 leading-relaxed max-h-32 overflow-y-auto">
                        <p>一、我完全了解自己的身体状况，确认自己健康状况良好；没有任何身体不适或疾病（包括先天性心脏病、风湿性心脏病、高血压、脑血管疾病、心肌炎、其他心脏病、冠状动脉病、严重心律不齐、血糖过高或过低的糖尿病、以及其它不适合运动的疾病），因此我郑重声明，可以正常参加【{tournament.title}】。</p>
                        <p>二、我充分了解本次比赛期间训练或比赛过程中可能出现的意外风险，责任自负。</p>
                        <p>三、我同意在比赛期间，组委会可以无偿使用我的姓名、肖像、声音等个人信息用于比赛的宣传 and 推广。</p>
                        <p>四、我已认真阅读并理解上述条款，自愿签署本责任书。</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">选手签名 (针对 {tournament.title})</label>
                      <SignaturePad 
                        onSave={(data) => setEditingPlayer({...editingPlayer, signature: data})}
                        onClear={() => setEditingPlayer({...editingPlayer, signature: undefined})}
                        initialImage={editingPlayer.signature}
                      />
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={() => {
                  // Update player pool
                  const poolIndex = playerPool.findIndex(p => p.phone === editingPlayer.phone);
                  if (poolIndex >= 0) {
                    const newPool = [...playerPool];
                    newPool[poolIndex] = editingPlayer;
                    setPlayerPool(newPool);
                  } else {
                    setPlayerPool([...playerPool, editingPlayer]);
                  }

                  // Update regData if needed
                  if (role === 'leader') {
                    const memberIndex = regData.members.findIndex(m => m.phone === editingPlayer.phone);
                    if (memberIndex >= 0) {
                      const newMembers = [...regData.members];
                      newMembers[memberIndex] = editingPlayer;
                      setRegData({ ...regData, members: newMembers });
                    }
                  } else {
                    if (editingTarget === 'personal') {
                      setRegData({ ...regData, personalInfo: editingPlayer });
                    } else if (editingTarget === 'partner') {
                      setRegData({ ...regData, partnerInfo: editingPlayer });
                    }
                  }

                  setShowEditPlayerModal(false);
                }}
                className="w-full py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
              >
                {isRegistrationForm ? "保存提交报名表" : "保存选手信息"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showCreateTeamModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateTeamModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] p-8 relative z-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-slate-900">{editingTeam ? '编辑队伍' : '新建队伍'}</h3>
                <button onClick={() => setShowCreateTeamModal(false)} className="p-2 text-slate-400">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍名称</label>
                  <input 
                    type="text" 
                    placeholder="请输入队伍全称"
                    id="new-team-name"
                    defaultValue={editingTeam?.name || ''}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍简称</label>
                  <input 
                    type="text" 
                    placeholder="请输入队伍简称"
                    id="new-team-shortname"
                    defaultValue={editingTeam?.shortName || ''}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">领队</label>
                  <div 
                    onClick={() => { setPoolTarget('team_leader'); setShowPlayerPool(true); }}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 text-sm flex items-center justify-between cursor-pointer"
                  >
                    {newTeamLeader ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-[10px] font-black text-brand-primary">
                          {newTeamLeader.name[0]}
                        </div>
                        <span className="font-bold">{newTeamLeader.name}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400">请选择领队</span>
                    )}
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍队服</label>
                      <button 
                        onClick={() => {
                          setEditingUniform({ frontImage: '', backImage: '', mainColor: '' });
                          setEditingUniformIndex(null);
                          setShowUniformModal(true);
                        }}
                        className="text-[10px] font-black text-brand-primary flex items-center gap-1"
                      >
                        <Plus size={12} /> 添加队服
                      </button>
                    </div>
                    
                    <div className="space-y-3 max-h-[200px] overflow-y-auto no-scrollbar pr-1">
                      {newTeamUniforms.map((uniform, idx) => (
                        <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between gap-4 card-shadow">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                                {uniform.frontImage ? (
                                  <img src={uniform.frontImage} alt="Front" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                    <Camera size={16} />
                                  </div>
                                )}
                              </div>
                              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                                {uniform.backImage ? (
                                  <img src={uniform.backImage} alt="Back" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                    <Camera size={16} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-800">队服 {idx + 1}</div>
                              <div className="text-[10px] text-slate-400">主色调：{uniform.mainColor || '未填写'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setEditingUniform(uniform);
                                setEditingUniformIndex(idx);
                                setShowUniformModal(true);
                              }}
                              className="p-2 text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => setNewTeamUniforms(newTeamUniforms.filter((_, i) => i !== idx))}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {newTeamUniforms.length === 0 && (
                        <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                          <p className="text-[10px] text-slate-400 font-medium">尚未添加队服</p>
                        </div>
                      )}
                    </div>
                  </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">队伍LOGO (可选)</label>
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewTeamLogo(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1 active:bg-slate-100 transition-all cursor-pointer overflow-hidden"
                    >
                      {newTeamLogo ? (
                        <img src={newTeamLogo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera size={24} />
                          <span className="text-[10px] font-bold">上传</span>
                        </>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">建议尺寸 200x200px<br/>支持 JPG, PNG 格式</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  const name = (document.getElementById('new-team-name') as HTMLInputElement).value;
                  const shortName = (document.getElementById('new-team-shortname') as HTMLInputElement).value;
                  
                  if (name && shortName) {
                    if (editingTeam) {
                      const updatedTeam: TeamInfo = {
                        ...editingTeam,
                        name,
                        shortName,
                        logo: newTeamLogo,
                        leader: newTeamLeader || undefined,
                        uniforms: newTeamUniforms
                      };
                      setAvailableTeams(availableTeams.map(t => t.id === editingTeam.id ? updatedTeam : t));
                      if (regData.teamInfo.name === editingTeam.name) {
                        setRegData({
                          ...regData,
                          teamInfo: {
                            ...regData.teamInfo,
                            name: updatedTeam.name,
                            shortName: updatedTeam.shortName,
                            logo: updatedTeam.logo || '',
                            leader: updatedTeam.leader || null
                          }
                        });
                      }
                    } else {
                      const newTeam: TeamInfo = {
                        id: `t${availableTeams.length + 1}`,
                        name,
                        shortName,
                        logo: newTeamLogo,
                        leader: newTeamLeader || undefined,
                        uniforms: newTeamUniforms,
                        members: []
                      };
                      setAvailableTeams([...availableTeams, newTeam]);
                      setRegData({
                        ...regData,
                        teamInfo: {
                          ...regData.teamInfo,
                          name: newTeam.name,
                          shortName: newTeam.shortName,
                          logo: newTeam.logo || '',
                          leader: newTeam.leader || null
                        }
                      });
                    }
                    setShowCreateTeamModal(false);
                    setEditingTeam(null);
                    setNewTeamLogo('');
                    setNewTeamLeader(null);
                    setNewTeamUniforms([]);
                  }
                }}
                className="w-full py-4 rounded-2xl bg-brand-primary text-white text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-[0.98] transition-all"
              >
                {editingTeam ? '保存修改' : '确认创建并选择'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite Poster Modal */}
      <AnimatePresence>
        {showInvitePoster && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInvitePoster(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xs rounded-[40px] p-8 relative z-10 text-center space-y-6"
            >
              <button 
                onClick={() => {
                  setShowInvitePoster(false);
                  if (regData.registrationMethod === 'invite') {
                    setStep(steps);
                  }
                }}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-lg font-black text-slate-900">邀请队员</h3>
              <div className="aspect-[3/4] bg-slate-50 rounded-3xl flex flex-col items-center justify-center border border-slate-100 p-6 space-y-4">
                <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest leading-tight">{tournament.title}</div>
                {isKamaoCup && effectiveType === 'Individual' ? (
                  regData.teamInfo.selectedGroup && (
                    <div className="text-[10px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{regData.teamInfo.selectedGroup}</div>
                  )
                ) : (
                  regData.selectedCategory && (
                    <div className="text-[10px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{regData.selectedCategory}</div>
                  )
                )}
                <div className="space-y-1">
                  <div className="text-lg font-black text-slate-900">{regData.teamInfo.name || '我的队伍'}</div>
                  <div className="text-[10px] text-slate-400 font-bold">领队：{regData.teamInfo.leader?.name || userProfile?.name || '林领队'}</div>
                </div>
                <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-sm">
                  <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
                    <QrCode size={48} />
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">扫码加入我们</div>
                <div className="pt-2 border-t border-slate-100 w-full">
                  <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">队伍邀请码</div>
                  <div className="text-sm font-black text-brand-primary tracking-widest">{(regData.teamInfo as any).inviteCode || 'ABCDEF'}</div>
                </div>
                {effectiveType === 'Team' && (
                  <div className="mt-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
                    <span className="text-[9px] font-black text-emerald-600">领队统一缴费 · 队员无需支付</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    alert('海报已保存到相册');
                    setShowInvitePoster(false);
                    setStep(steps); // Go to success
                  }}
                  className="py-4 rounded-2xl bg-slate-100 text-slate-600 text-sm font-black active:scale-95 transition-all"
                >
                  保存海报
                </button>
                <button 
                  onClick={() => setShowForwardGuide(true)}
                  className="py-4 rounded-2xl bg-brand-primary text-white text-sm font-black active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                >
                  转发给好友
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Forward Guide Overlay */}
      <AnimatePresence>
        {showForwardGuide && (
          <div 
            className="fixed inset-0 z-[200] bg-black/80 flex flex-col items-end p-6 pt-12"
            onClick={() => {
              setShowForwardGuide(false);
              setShowInvitePoster(false);
              setStep(steps);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-right space-y-4"
            >
              <div className="flex justify-end">
                <ArrowUpRight size={48} className="text-brand-primary animate-bounce" />
              </div>
              <p className="text-lg font-black">点击右上角“...”</p>
              <p className="text-sm font-medium opacity-80">选择“发送给朋友”或“分享到朋友圈”</p>
              <div className="pt-8 flex justify-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowForwardGuide(false);
                    setShowInvitePoster(false);
                    setStep(steps);
                  }}
                  className="px-8 py-3 rounded-full border border-white/30 text-sm font-bold"
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {renderUniformModal()}
    </div>
  );
};

const TournamentLiveView = ({ tournament, onBack }: { tournament: Tournament, onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'program' | 'brackets' | 'my-matches'>('program');
  const [showMatchDetailModal, setShowMatchDetailModal] = useState(false);
  const [selectedMatchDetail, setSelectedMatchDetail] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<string>('全部场地');
  const [selectedSession, setSelectedSession] = useState('第1节');
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [showOnlyMyMatches, setShowOnlyMyMatches] = useState(false);
  const [viewMode, setViewMode] = useState<'program'>('program');

  // New states for Match Table (对阵表)
  const [selectedEvent, setSelectedEvent] = useState('男单');
  const [showBracketsEventDropdown, setShowBracketsEventDropdown] = useState(false);
  const [selectedStage, setSelectedStage] = useState('第一阶段 小组赛');
  const [selectedGroup, setSelectedGroup] = useState('A组');
  const [selectedSubGroup, setSelectedSubGroup] = useState('第1组');
  const [showRoundTable, setShowRoundTable] = useState(false);
  const [showTeamSchedule, setShowTeamSchedule] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [activeRoundTab, setActiveRoundTab] = useState(0);
  const [showCheckInQR, setShowCheckInQR] = useState(false);
  const [showElectronicPass, setShowElectronicPass] = useState(false);
  const [idTab, setIdTab] = useState<'current' | 'history'>('current');
  const [showTotalCheckIn, setShowTotalCheckIn] = useState(false);
  const [checkInQRData, setCheckInQRData] = useState<{
    title: string;
    subtitle: string;
    player?: string;
    category?: string;
    groupInfo?: string;
  } | null>(null);

  useEffect(() => {
    setSelectedSession('第1节');
    if (tournament.id === '2') {
      setSelectedEvent('全部');
    } else {
      setSelectedEvent('男单');
    }
  }, [tournament.id]);

  const sessions = useMemo(() => {
    const base = [
      { id: '第1节', time: '8/15 09:00' },
      { id: '第2节', time: '8/15 14:00' },
    ];
    if (tournament.id === '1' || tournament.id === '2') {
      return base;
    }
    return [
      ...base,
      { id: '第3节', time: '8/16 09:00' },
      { id: '第4节', time: '8/16 14:00' },
    ];
  }, [tournament.id]);

  const courts = useMemo(() => ['全部场地', ...Array.from({ length: 16 }, (_, i) => `场地${i + 1}`)], []);

  const categoryGroups = useMemo(() => {
    const base = [
      { label: '全部项目', value: '全部' },
    ];
    
    if (tournament.id === '2') {
      base.push(
        { label: '男团', value: '男团' },
        { label: '女团', value: '女团' },
        { label: '混团', value: '混团' }
      );
      return base;
    }

    return [
      ...base,
      {
        label: '男单',
        value: '男单',
        sub: ['男单A组', '男单B组', '男单C组', '男单D组']
      },
      {
        label: '女单',
        value: '女单',
        sub: ['女单A组', '女单B组', '女单C组', '女单D组']
      },
      {
        label: '男双',
        value: '男双',
        sub: ['男双A组', '男双B组', '男双C组', '男双D组']
      },
      {
        label: '女双',
        value: '女双',
        sub: ['女双A组', '女双B组', '女双C组', '女双D组']
      },
      {
        label: '混双',
        value: '混双',
        sub: ['混双A组', '混双B组']
      }
    ];
  }, [tournament.id]);

  // Mock categories for filter (flat list for generation)
  const categories = useMemo(() => {
    const flat = ['全部'];
    categoryGroups.forEach(g => {
      if (g.value !== '全部') {
        if (g.sub) {
          flat.push(...g.sub);
        } else {
          flat.push(g.value);
        }
      }
    });
    return flat;
  }, [categoryGroups]);

  // Generate more mock matches for the schedule
  const scheduleMatches = useMemo(() => {
    const matches = [];
    const players = ['张伟', '李强', '王五', '赵六', '陈平', '周杰', '林丹', '谌龙', '李宗伟', '安赛龙'];
    
    let idCounter = 1001;
    for (let sessionIdx = 0; sessionIdx < sessions.length; sessionIdx++) {
      for (let courtIdx = 0; courtIdx < courts.length; courtIdx++) {
        if (courtIdx === 0) continue; // Skip '全部场地' for generation
        
        const courtName = courts[courtIdx];
        const session = sessions[sessionIdx];

        let maxMatches = 12 - (sessionIdx * 2);
        if (tournament.id === '2') maxMatches = 25; // 5 rounds * 5 matches
        
        const [sessionDate, sessionStartTime] = session.time.split(' ');
        const [startHour, startMin] = sessionStartTime.split(':').map(Number);

        for (let matchNum = 1; matchNum <= maxMatches; matchNum++) {
          // Calculate sequential time: each match takes 15 mins
          const totalMinutes = (matchNum - 1) * 15;
          const currentHour = startHour + Math.floor((startMin + totalMinutes) / 60);
          const currentMin = (startMin + totalMinutes) % 60;
          let matchTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
          
          if (sessionIdx === 0 && courtIdx === 1 && matchNum === 4) {
            matchTimeStr = '15:00';
          }
          
          // Calculate end time
          const endMinutes = totalMinutes + 12; // 12 mins duration for 15 min slot
          const endHour = startHour + Math.floor((startMin + endMinutes) / 60);
          const endMin = (startMin + endMinutes) % 60;
          const matchEndTimeStr = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

          const p1Idx = Math.floor(Math.random() * players.length);
          let p2Idx = Math.floor(Math.random() * players.length);
          while (p2Idx === p1Idx) p2Idx = Math.floor(Math.random() * players.length);
          
          const catIdx = Math.floor(Math.random() * (categories.length - 1)) + 1;
          let category = categories[catIdx];
          
          const isTeamTournament = tournament.id === '2';
          const teamNames = [
            '翔骏羽队', '友巨集团', '厦门大学', '集美大学', '华侨大学', '福州大学', '卡猫一队', '同心俱乐部',
            '龙岩学院', '泉州师范', '漳州师大', '宁德师范', '嘉庚学院', '诚毅学院', '阳光学院', '协和学院'
          ];
          
          let team1 = '';
          let team2 = '';
          let subCategory = '';
          let totalScore = '';
          
          if (isTeamTournament) {
            const t1Idx = Math.floor(Math.random() * teamNames.length);
            let t2Idx = Math.floor(Math.random() * teamNames.length);
            while (t2Idx === t1Idx) t2Idx = Math.floor(Math.random() * teamNames.length);
            team1 = teamNames[t1Idx];
            team2 = teamNames[t2Idx];
            subCategory = ['男单', '女单', '男双', '女双', '混双', '男双90+'][Math.floor(Math.random() * 6)];
            totalScore = `${Math.floor(Math.random() * 100)}:${Math.floor(Math.random() * 100)}`;
          }

          // Sequential status for Session 1
          let status = 'upcoming';
          if (sessionIdx === 0) {
            if (matchNum <= 4) {
              status = Math.random() > 0.9 ? 'walkover' : 'finished';
            } else if (matchNum === 5) {
              status = 'ongoing';
            } else {
              status = 'upcoming';
            }
          }
          
          const isWalkover = status === 'walkover';
          const winner = isWalkover ? (Math.random() > 0.5 ? 1 : 2) : (status === 'finished' ? (Math.random() > 0.5 ? 1 : 2) : 0);
          
          // My Match logic: EXACTLY 3 matches in Session 1, Court 1
          let isMyMatch = false;
          const randomGroupNum = Math.floor(Math.random() * 8) + 1;
          const randomRoundNum = Math.floor(Math.random() * 3) + 1;
          let groupInfo = `${randomGroupNum}组第${randomRoundNum}轮`;
          let p1 = players[p1Idx];
          let p2 = players[p2Idx];
          const teamNamesIndividual = ['雷霆俱乐部', '飞羽协会', '厦大校友', '集大羽协', '华大羽社', '福大羽协', '卡猫羽队', '同心羽球'];
          const team1Name = tournament.id === '1' && Math.random() > 0.5 ? teamNamesIndividual[Math.floor(Math.random() * teamNamesIndividual.length)] : '';
          const team2Name = tournament.id === '1' && Math.random() > 0.5 ? teamNamesIndividual[Math.floor(Math.random() * teamNamesIndividual.length)] : '';
          
          let p1_2 = '';
          let p2_2 = '';
          
          const p1PosNum = Math.floor(Math.random() * 4) + 1;
          let p2PosNum = Math.floor(Math.random() * 4) + 1;
          while (p2PosNum === p1PosNum) p2PosNum = Math.floor(Math.random() * 4) + 1;
          
          let pos1 = `${randomGroupNum}组${p1PosNum}`;
          let pos2 = `${randomGroupNum}组${p2PosNum}`;

          if (isTeamTournament) {
            if (sessionIdx === 0) {
              const tieNum = Math.ceil(matchNum / 5); // Round number
              const subMatchIdx = (matchNum - 1) % 5; // Match within the tie
              const subCategories = ['男双', '女双', '混双', '男单', '女单'];
              subCategory = subCategories[subMatchIdx];
              
              // Group and Round logic
              let groupNum = courtIdx; // Default group number corresponds to court
              if (courtIdx === 1) groupNum = 1; // Court 1 is Group 1
              
              groupInfo = `${groupNum}组第${tieNum}轮`;
              
              // Standard Round Robin pairings for 6 teams (simplified)
              const teamA_Pos = 1;
              const teamB_Pos = tieNum + 1;
              
              pos1 = `${groupNum}组${teamA_Pos}`;
              pos2 = `${groupNum}组${teamB_Pos}`;
              
              const groupTeams = [
                ['翔骏羽队', '友巨集团', '厦门大学', '集美大学', '华侨大学', '福州大学'],
                ['同心俱乐部', '卡猫一队', '龙岩学院', '泉州师范', '漳州师大', '宁德师范'],
                ['嘉庚学院', '诚毅学院', '阳光学院', '协和学院', '至诚学院', '金山学院']
              ];
              
              const currentGroupTeams = groupTeams[(groupNum - 1) % groupTeams.length];
              team1 = currentGroupTeams[teamA_Pos - 1] || teamNames[0];
              team2 = currentGroupTeams[teamB_Pos - 1] || teamNames[1];
              
              category = ['男团', '女团', '混团'][(groupNum - 1) % 3];
            } else {
              // Session 2: Knockout Stage
              // Ties 1-8: 16进8, 9-12: 8进4, 13-14: 半决赛, 15: 总决赛
              // Distribute over courts: Court 1-8 for 16进8, Court 9-12 for 8进4, etc.
              const subMatchIdx = (matchNum - 1) % 5;
              const subCategories = ['男双', '女双', '混双', '男单', '女单'];
              subCategory = subCategories[subMatchIdx];

              if (matchNum > 5) continue; // Only 1 tie per court in knockout for simplicity

              if (courtIdx <= 8) {
                groupInfo = '16进8';
                team1 = teamNames[courtIdx - 1];
                team2 = teamNames[courtIdx + 7];
              } else if (courtIdx <= 12) {
                groupInfo = '8进4';
                team1 = teamNames[courtIdx - 9];
                team2 = teamNames[courtIdx - 5];
              } else if (courtIdx <= 14) {
                groupInfo = '半决赛';
                team1 = teamNames[courtIdx - 13];
                team2 = teamNames[courtIdx - 11];
              } else if (courtIdx === 15) {
                groupInfo = '总决赛';
                team1 = teamNames[0];
                team2 = teamNames[1];
              } else {
                continue; // No matches for Court 16 in knockout
              }
              
              pos1 = '胜者';
              pos2 = '胜者';
              category = ['男团', '女团', '混团'][courtIdx % 3];
            }

            // Unique players for each sub-match
            if (subCategory === '男双') {
              p1 = players[0]; p1_2 = players[1];
              p2 = players[2]; p2_2 = players[3];
            } else if (subCategory === '女双') {
              p1 = '张芳'; p1_2 = '李娜';
              p2 = '王芳'; p2_2 = '刘红';
            } else if (subCategory === '混双') {
              p1 = players[4]; p1_2 = '陈美';
              p2 = players[5]; p2_2 = '林丽';
            } else if (subCategory === '男单') {
              p1 = players[6];
              p2 = players[7];
            } else if (subCategory === '女单') {
              p1 = '赵雅';
              p2 = '孙倩';
            }
          }

          if (isTeamTournament) {
            // My Match logic for team tournament: 
            // Let's say Zhang Wei is in '厦门大学' and plays in some matches
            if (sessionIdx === 0 && courtIdx === 1 && (matchNum === 3 || matchNum === 8 || matchNum === 13)) {
              isMyMatch = true;
              team1 = '厦门大学';
              team2 = ['翔骏羽队', '友巨集团', '集美大学'][Math.floor(matchNum / 5)];
              p1 = '张伟';
              if (subCategory.includes('双')) {
                p1_2 = '李强';
              }
              category = '男团';
              groupInfo = `1组第${Math.ceil(matchNum / 5)}轮`;
            }
          }

          if (!isTeamTournament && tournament.id === '1') {
            if (sessionIdx === 0) {
              // Session 1: Group Stage
              const groupNum = Math.ceil(courtIdx / 2);
              groupInfo = `${groupNum}组第${matchNum}轮`;
              
              if (courtIdx === 1 && matchNum <= 3) {
                isMyMatch = true;
                p1 = '张伟';
                p2 = ['林丹', '谌龙', '李宗伟'][matchNum - 1];
                category = '男单B组';
                pos1 = `${groupNum}组1`;
                pos2 = `${groupNum}组${matchNum + 1}`;
                status = matchNum === 1 ? 'finished' : (matchNum === 2 ? 'ongoing' : 'upcoming');
              } else {
                pos1 = `${groupNum}组${((matchNum * 2) % 4) + 1}`;
                pos2 = `${groupNum}组${((matchNum * 2 + 1) % 4) + 1}`;
              }
            } else if (sessionIdx === 1) {
              // Session 2: Knockout Stage
              // Realistic match distribution for 16-player knockout
              category = '男单'; // No group in knockout
              if (courtIdx <= 8) {
                if (matchNum > 1) continue;
                groupInfo = '16进8';
                pos1 = `${(courtIdx - 1) * 2 + 1}`;
                pos2 = `${(courtIdx - 1) * 2 + 2}`;
              } else if (courtIdx <= 12) {
                if (matchNum > 1) continue;
                groupInfo = '8进4';
                pos1 = `${(courtIdx - 9) * 4 + 1}`;
                pos2 = `${(courtIdx - 9) * 4 + 3}`;
              } else if (courtIdx <= 14) {
                if (matchNum > 1) continue;
                groupInfo = '半决赛';
                pos1 = `${(courtIdx - 13) * 8 + 1}`;
                pos2 = `${(courtIdx - 13) * 8 + 5}`;
              } else if (courtIdx === 15) {
                if (matchNum > 1) continue;
                groupInfo = '决赛';
                pos1 = '1';
                pos2 = '9';
              } else {
                continue;
              }
              
              if (courtIdx === 1 && matchNum === 1) {
                isMyMatch = true;
                p1 = '张伟';
                p2 = '安赛龙';
                groupInfo = '16进8';
                status = 'upcoming';
              }
            }
          } else if (!isTeamTournament) {
            // For other individual matches, ensure they are NOT "My Matches"
            if (p1 === '张伟') p1 = '李强';
            if (p2 === '张伟') p2 = '王五';
          }

          let matchId = `${idCounter++}`;
          if (!isTeamTournament && tournament.id === '1') {
            if (sessionIdx === 0) {
              // Group stage codes start with 1
              matchId = `1${courtIdx.toString().padStart(2, '0')}${matchNum.toString().padStart(1, '0')}`;
            } else if (sessionIdx === 1) {
              // Knockout codes start with 2 and are sequential
              // 16进8: 2001-2008 (Courts 1-8)
              // 8进4: 2009-2012 (Courts 9-12)
              // Semi: 2013-2014 (Courts 13-14)
              // Final: 2015 (Court 15)
              let knockoutNum = 0;
              if (courtIdx <= 8) knockoutNum = courtIdx;
              else if (courtIdx <= 12) knockoutNum = 8 + (courtIdx - 8);
              else if (courtIdx <= 14) knockoutNum = 12 + (courtIdx - 12);
              else if (courtIdx === 15) knockoutNum = 15;
              
              if (knockoutNum > 0) {
                matchId = `2${knockoutNum.toString().padStart(3, '0')}`;
              }
            }
          }

          matches.push({
            id: matchId,
            court: courtName,
            courtNum: courtIdx,
            session: session.id,
            time: matchTimeStr,
            date: sessionDate,
            matchNum: `第${matchNum}场`,
            player1: p1,
            player1_2: p1_2,
            player2: p2,
            player2_2: p2_2,
            category: category,
            groupInfo: groupInfo,
            pos1: pos1,
            pos2: pos2,
            score1: isWalkover ? (winner === 1 ? 21 : 0) : (status === 'finished' ? (winner === 1 ? 21 : 18) : (status === 'ongoing' ? Math.floor(Math.random() * 20) : 0)),
            score2: isWalkover ? (winner === 2 ? 21 : 0) : (status === 'finished' ? (winner === 2 ? 21 : 15) : (status === 'ongoing' ? Math.floor(Math.random() * 20) : 0)),
            setScore1: isWalkover ? (winner === 1 ? 1 : 0) : (status === 'finished' ? (winner === 1 ? 1 : 0) : 0),
            setScore2: isWalkover ? (winner === 2 ? 1 : 0) : (status === 'finished' ? (winner === 2 ? 1 : 0) : 0),
            startTime: matchTimeStr,
            endTime: (status === 'upcoming' || status === 'ongoing') ? '' : matchEndTimeStr,
            duration: (status === 'upcoming' || status === 'ongoing') ? '' : '12分钟',
            status: status,
            winner: winner,
            isWalkover: isWalkover,
            isMyMatch: isMyMatch,
            team1: team1,
            team2: team2,
            team1Name: team1Name,
            team2Name: team2Name,
            subCategory: subCategory
          });
        }
      }
    }
    return matches;
  }, [categories, sessions, courts]);

  const baseFilteredMatches = useMemo(() => {
    return scheduleMatches.filter(m => {
      const matchesSearch = m.player1.includes(searchQuery) || m.player2.includes(searchQuery);
      
      // Hierarchical category matching
      let matchesCategory = false;
      if (selectedCategory === '全部') {
        matchesCategory = true;
      } else if (m.category === selectedCategory) {
        matchesCategory = true;
      } else {
        // Check if selectedCategory is a parent category (e.g. "男单")
        const group = categoryGroups.find(g => g.value === selectedCategory);
        if (group && group.sub && group.sub.includes(m.category)) {
          matchesCategory = true;
        }
      }

      const matchesCourt = selectedCourt === '全部场地' || m.court === selectedCourt;
      const matchesSession = m.session === selectedSession;
      const matchesMyMatch = showOnlyMyMatches ? m.isMyMatch : true;
      
      return matchesSearch && matchesCategory && matchesCourt && matchesSession && matchesMyMatch;
    });
  }, [scheduleMatches, searchQuery, selectedCategory, selectedCourt, selectedSession, categoryGroups, showOnlyMyMatches]);

  const filteredMatches = useMemo(() => {
    return baseFilteredMatches.filter(m => {
      if (statusFilter === '全部') return true;
      if (statusFilter === '比赛中') return m.status === 'ongoing';
      if (statusFilter === '待开始') return m.status === 'upcoming';
      if (statusFilter === '已结束') return (m.status === 'finished' || m.status === 'walkover');
      return true;
    });
  }, [baseFilteredMatches, statusFilter]);

  const stats = useMemo(() => {
    const total = baseFilteredMatches.length;
    const ongoing = baseFilteredMatches.filter(m => m.status === 'ongoing').length;
    const upcoming = baseFilteredMatches.filter(m => m.status === 'upcoming').length;
    const finished = baseFilteredMatches.filter(m => m.status === 'finished' || m.status === 'walkover').length;
    return { total, ongoing, upcoming, finished };
  }, [baseFilteredMatches]);

  const renderMyMatchCard = (match: any) => {
    const isFinished = match.status === 'finished' || match.status === 'walkover';
    const isOngoing = match.status === 'ongoing';
    const isUpcoming = match.status === 'upcoming';

    // Calculate check-in time (15-30 mins before match)
    const [h, m] = match.time.split(':').map(Number);
    const matchTotalMins = h * 60 + m;
    const checkInStartMins = matchTotalMins - 30;
    const checkInEndMins = matchTotalMins - 15;
    
    const formatTime = (totalMins: number) => {
      const hh = Math.floor(totalMins / 60).toString().padStart(2, '0');
      const mm = (totalMins % 60).toString().padStart(2, '0');
      return `${hh}:${mm}`;
    };

    const checkInTimeStr = `${formatTime(checkInStartMins)}-${formatTime(checkInEndMins)}`;

    if (tournament.id === '2') {
      return (
        <motion.div 
          layout
          key={match.id}
          className="bg-white rounded-sm border border-slate-200 transition-all shadow-sm relative overflow-hidden mb-4"
        >
          {/* Status Ribbon */}
          <div className={cn(
            "absolute top-0 right-0 px-8 py-1 translate-x-[30%] translate-y-[30%] rotate-45 text-[10px] font-black text-white z-10",
            isFinished ? "bg-slate-400" : (isOngoing ? "bg-red-500" : "bg-[#1FC47F]")
          )}>
            {isFinished ? '已结束' : (isOngoing ? '比赛中' : '待开始')}
          </div>

          <div className="absolute top-0 left-0 bg-brand-primary text-white px-2 py-1 text-[8px] font-black rounded-br-lg z-10 shadow-sm">
            我的比赛
          </div>

          <div className="p-3">
            {/* Header: 团体项目+代码+场次+比赛项目, 组别 */}
            <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800">
                {match.category}{match.id}第{((match.matchNum - 1) % 5) + 1}场{match.subCategory}
              </h3>
              <span className="text-xs font-bold text-slate-800 mr-12">{match.groupInfo}</span>
            </div>

            {/* Sub-header: Date, Time, Court, Match Num */}
            <div className="flex justify-center gap-4 text-xs font-bold text-slate-600 mb-4">
              <span>{match.date.replace('8/', '1月')}</span>
              <span>{match.time}</span>
              <span>{match.court}</span>
              <span>{match.matchNum}</span>
            </div>

            {/* Teams Section */}
            <div className="bg-brand-primary/5 rounded-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-700 flex-1 text-center">{match.team1}</span>
                <div className="text-brand-primary text-xs font-bold mx-4 min-w-[60px] text-center">
                  {isFinished ? (match.teamScore || '50:42') : 'VS'}
                </div>
                <span className="text-xs font-bold text-slate-700 flex-1 text-center">{match.team2}</span>
              </div>

              {/* Inner Match Box */}
              <div className="bg-white border border-brand-primary/20 rounded-sm p-3 relative">
                <div className="grid grid-cols-[1fr_70px_1fr] items-center gap-2">
                  {/* Side 1 Pos */}
                  <div className="text-center text-[10px] text-slate-400">{match.pos1}</div>
                  {/* Set Score */}
                  <div className="bg-brand-primary/10 text-brand-primary py-1 rounded-sm text-xs font-bold text-center">
                    {match.setScore1}:{match.setScore2}
                  </div>
                  {/* Side 2 Pos */}
                  <div className="text-center text-[10px] text-slate-400 relative">
                    {match.pos2}
                    {isFinished && match.winner === 2 && (
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold">胜</div>
                    )}
                  </div>

                  {/* Side 1 Players Top */}
                  <div className="text-center text-[11px] font-medium text-slate-600 relative">
                    {isFinished && match.winner === 1 && (
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold">胜</div>
                    )}
                    {match.player1}
                  </div>
                  {/* Spacer */}
                  <div />
                  {/* Side 2 Players Top */}
                  <div className="text-center text-[11px] font-medium text-slate-600">{match.player2}</div>

                  {/* Side 1 Players Bottom */}
                  <div className="text-center text-[11px] font-medium text-slate-600">{match.player1_2}</div>
                  {/* Point Score */}
                  <div className="bg-brand-primary/5 text-brand-primary py-2 rounded-sm text-sm font-bold text-center">
                    {match.score1}:{match.score2}
                  </div>
                  {/* Side 2 Players Bottom */}
                  <div className="text-center text-[11px] font-medium text-slate-600">{match.player2_2}</div>
                  
                  {/* Match Timing Info */}
                  <div className="col-span-3 mt-2 pt-2 border-t border-slate-50 flex justify-center gap-3 text-[9px] text-slate-400">
                    {match.duration && <span>用时: {match.duration}</span>}
                    {match.startTime && <span>开始: {match.startTime}</span>}
                    {match.endTime && <span>结束: {match.endTime}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Check-in Section */}
            {!isFinished && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">检录时间</span>
                  <span className="text-xs font-black text-brand-primary">{checkInTimeStr}</span>
                </div>
                {isUpcoming ? (
                  <button 
                    onClick={() => setCheckInQRData({
                    title: '检录二维码',
                    subtitle: `${match.category} • ${match.groupInfo}`,
                    player: match.player1,
                    category: match.category,
                    groupInfo: match.groupInfo
                  })}
                    className="px-6 py-2 bg-brand-primary text-white rounded-lg text-xs font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                  >
                    去检录
                  </button>
                ) : (
                  <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-black text-emerald-600 uppercase tracking-widest">
                    已检录
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        layout
        key={match.id}
        className="bg-white rounded-2xl border border-brand-primary/30 ring-1 ring-brand-primary/10 transition-all card-shadow relative overflow-hidden mb-4"
      >
        {/* Status Ribbon */}
        <div className={cn(
          "absolute top-0 right-0 px-6 py-1 translate-x-[25%] translate-y-[25%] rotate-45 text-[10px] font-black text-white z-10",
          isFinished ? "bg-slate-400" : (isOngoing ? "bg-red-500" : "bg-[#1FC47F]")
        )}>
          {isFinished ? '已结束' : (isOngoing ? '比赛中' : '待开始')}
        </div>

        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 pr-12">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-800">{match.category}{match.id}</h3>
              <span className="bg-brand-primary/10 text-brand-primary text-[8px] px-1.5 py-0.5 rounded font-black uppercase">我的比赛</span>
            </div>
            <span className="text-[10px] font-black text-slate-500">{match.groupInfo}</span>
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 mb-4 pb-4 border-b border-slate-50">
            <span>{(() => {
              const dateParts = match.date.split('-');
              if (dateParts.length === 3) {
                return `${parseInt(dateParts[1])}月${parseInt(dateParts[2])}日`;
              }
              return match.date;
            })()}</span>
            <span>{match.time}</span>
            <span>{match.court}</span>
            <span>{match.matchNum}</span>
          </div>

          {/* Matchup Area */}
          <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-2">
            {/* Player 1 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative">
                <img 
                  src={`https://picsum.photos/seed/${match.player1}/100/100`} 
                  alt={match.player1} 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm mb-2"
                  referrerPolicy="no-referrer"
                />
                {isFinished && match.winner === 1 && (
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                    胜
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mb-0.5">{match.pos1}</span>
              <span className="text-xs font-black text-slate-800">{match.player1}</span>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-1 min-w-[80px]">
              <div className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-lg text-sm font-black tracking-tighter">
                {`${match.setScore1} : ${match.setScore2}`}
              </div>
              <div className="bg-white border border-brand-primary/20 text-brand-primary px-3 py-0.5 rounded-lg text-[10px] font-black">
                {`${match.score1} : ${match.score2}`}
              </div>
            </div>

            {/* Player 2 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative">
                <img 
                  src={`https://picsum.photos/seed/${match.player2}/100/100`} 
                  alt={match.player2} 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm mb-2"
                  referrerPolicy="no-referrer"
                />
                {isFinished && match.winner === 2 && (
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                    胜
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mb-0.5">{match.pos2}</span>
              <span className="text-xs font-black text-slate-800">{match.player2}</span>
            </div>
          </div>

          {/* Duration Info - Moved below matchup area */}
          {isFinished && (
            <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-500 mt-4 pt-4 border-t border-slate-50">
              {match.duration && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">用时</span>
                  <span className="text-slate-800">{match.duration}</span>
                </div>
              )}
              {match.startTime && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">开始</span>
                  <span className="text-slate-800">{match.startTime}</span>
                </div>
              )}
              {match.endTime && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">结束</span>
                  <span className="text-slate-800">{(match.status === 'finished' || match.status === 'walkover') ? match.endTime : '--'}</span>
                </div>
              )}
            </div>
          )}

          {/* Check-in Section */}
          {!isFinished && (
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">检录时间</span>
                <span className="text-xs font-black text-brand-primary">{checkInTimeStr}</span>
              </div>
              {isUpcoming ? (
                <button 
                  onClick={() => setCheckInQRData({
                    title: '检录二维码',
                    subtitle: `${match.category} • ${match.groupInfo}`,
                    player: match.player1,
                    category: match.category,
                    groupInfo: match.groupInfo
                  })}
                  className="px-6 py-2 bg-brand-primary text-white rounded-lg text-xs font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                >
                  去检录
                </button>
              ) : (
                <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-black text-emerald-600 uppercase tracking-widest">
                  已检录
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderMatchCard = (match: any) => {
    if (tournament.id === '2') {
      const isFinished = match.status === 'finished' || match.status === 'walkover';
      const isOngoing = match.status === 'ongoing';
      
      return (
        <motion.div 
          layout
          key={match.id}
          className="bg-white rounded-sm border border-slate-200 transition-all shadow-sm relative overflow-hidden mb-4"
        >
          {/* Status Ribbon */}
          <div className={cn(
            "absolute top-0 right-0 px-8 py-1 translate-x-[30%] translate-y-[30%] rotate-45 text-[10px] font-black text-white z-10",
            isFinished ? "bg-slate-400" : (isOngoing ? "bg-red-500" : "bg-[#1FC47F]")
          )}>
            {isFinished ? '已结束' : (isOngoing ? '比赛中' : '待开始')}
          </div>

          {match.isMyMatch && (
            <div className="absolute top-0 left-0 bg-brand-primary text-white px-2 py-1 text-[8px] font-black rounded-br-lg z-10 shadow-sm">
              我的比赛
            </div>
          )}

          <div className="p-3">
            {/* Header: 团体项目+代码+场次+比赛项目, 组别 */}
            <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-800">
                {match.category}{match.id}第{((match.matchNum - 1) % 5) + 1}场{match.subCategory}
              </h3>
              <span className="text-xs font-bold text-slate-800 mr-12">{match.groupInfo}</span>
            </div>

            {/* Sub-header: Date, Time, Court, Match Num */}
            <div className="flex justify-center gap-4 text-xs font-bold text-slate-600 mb-4">
              <span>{match.date.replace('8/', '1月')}</span>
              <span>{match.time}</span>
              <span>{match.court}</span>
              <span>{match.matchNum}</span>
            </div>

            {/* Teams Section */}
            <div className="bg-brand-primary/5 rounded-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-700 flex-1 text-center">{match.team1}</span>
                <div className="text-brand-primary text-xs font-bold mx-4 min-w-[60px] text-center">
                  {isFinished ? (match.teamScore || '50:42') : 'VS'}
                </div>
                <span className="text-xs font-bold text-slate-700 flex-1 text-center">{match.team2}</span>
              </div>

              {/* Inner Match Box */}
              <div className="bg-white border border-brand-primary/20 rounded-sm p-3 relative">
                <div className="grid grid-cols-[1fr_70px_1fr] items-center gap-2">
                  {/* Side 1 Pos */}
                  <div className="text-center text-[10px] text-slate-400">{match.pos1}</div>
                  {/* Set Score */}
                  <div className="bg-brand-primary/10 text-brand-primary py-1 rounded-sm text-xs font-bold text-center">
                    {match.setScore1}:{match.setScore2}
                  </div>
                  {/* Side 2 Pos */}
                  <div className="text-center text-[10px] text-slate-400 relative">
                    {match.pos2}
                    {isFinished && match.winner === 2 && (
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold">胜</div>
                    )}
                  </div>

                  {/* Side 1 Players Top */}
                  <div className="text-center text-[11px] font-medium text-slate-600 relative">
                    {isFinished && match.winner === 1 && (
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold">胜</div>
                    )}
                    {match.player1}
                  </div>
                  {/* Spacer */}
                  <div />
                  {/* Side 2 Players Top */}
                  <div className="text-center text-[11px] font-medium text-slate-600">{match.player2}</div>

                  {/* Side 1 Players Bottom */}
                  <div className="text-center text-[11px] font-medium text-slate-600">{match.player1_2}</div>
                  {/* Point Score */}
                  <div className="bg-brand-primary/5 text-brand-primary py-2 rounded-sm text-sm font-bold text-center">
                    {match.score1}:{match.score2}
                  </div>
                  {/* Side 2 Players Bottom */}
                  <div className="text-center text-[11px] font-medium text-slate-600">{match.player2_2}</div>
                  
                  {/* Match Timing Info */}
                  <div className="col-span-3 mt-2 pt-2 border-t border-slate-50 flex justify-center gap-3 text-[9px] text-slate-400">
                    {match.duration && <span>用时: {match.duration}</span>}
                    {match.startTime && <span>开始: {match.startTime}</span>}
                    {match.endTime && <span>结束: {match.endTime}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        layout
        key={match.id}
        className={cn(
          "bg-white rounded-2xl border transition-all card-shadow relative overflow-hidden",
          match.isMyMatch ? "border-brand-primary/30 ring-1 ring-brand-primary/10" : "border-slate-100"
        )}
      >
      {/* Status Ribbon */}
      <div className={cn(
        "absolute top-0 right-0 px-6 py-1 translate-x-[25%] translate-y-[25%] rotate-45 text-[10px] font-black text-white z-10",
        (match.status === 'finished' || match.status === 'walkover') ? "bg-slate-400" : (match.status === 'ongoing' ? "bg-red-500" : "bg-[#1FC47F]")
      )}>
        {(match.status === 'finished' || match.status === 'walkover') ? '已结束' : (match.status === 'ongoing' ? '比赛中' : '待开始')}
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pr-12">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-800">{match.category}{match.id}</h3>
            {match.isMyMatch && (
              <span className="bg-brand-primary/10 text-brand-primary text-[8px] px-1.5 py-0.5 rounded font-black uppercase">我的比赛</span>
            )}
          </div>
          <span className="text-[10px] font-black text-slate-500">{match.groupInfo}</span>
        </div>

        {/* Info Row */}
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 mb-4 pb-4 border-b border-slate-50">
          <span>{(() => {
            const dateParts = match.date.split('-');
            if (dateParts.length === 3) {
              return `${parseInt(dateParts[1])}月${parseInt(dateParts[2])}日`;
            }
            return match.date;
          })()}</span>
          <span>{match.time}</span>
          <span>{match.court}</span>
          <span>{match.matchNum}</span>
        </div>

        {/* Matchup Area */}
        <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-between gap-2">
          {/* Player 1 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative">
              <img 
                src={`https://picsum.photos/seed/${match.player1}/100/100`} 
                alt={match.player1} 
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm mb-2"
                referrerPolicy="no-referrer"
              />
              {(match.status === 'finished' || match.status === 'walkover') && match.winner === 1 && (
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                  胜
                </div>
              )}
              {match.status === 'walkover' && match.winner === 2 && (
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                  弃
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-400 mb-0.5">{match.pos1}</span>
            <span className="text-xs font-black text-slate-800">{match.player1}</span>
            {match.team1Name && <span className="text-[9px] text-slate-400 mt-0.5">{match.team1Name}</span>}
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-1 min-w-[80px]">
            <div className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-lg text-sm font-black tracking-tighter">
              {`${match.setScore1} : ${match.setScore2}`}
            </div>
            <div className="bg-white border border-brand-primary/20 text-brand-primary px-3 py-0.5 rounded-lg text-[10px] font-black">
              {`${match.score1} : ${match.score2}`}
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="relative">
              <img 
                src={`https://picsum.photos/seed/${match.player2}/100/100`} 
                alt={match.player2} 
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm mb-2"
                referrerPolicy="no-referrer"
              />
              {(match.status === 'finished' || match.status === 'walkover') && match.winner === 2 && (
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                  胜
                </div>
              )}
              {match.status === 'walkover' && match.winner === 1 && (
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                  弃
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-400 mb-0.5">{match.pos2}</span>
            <span className="text-xs font-black text-slate-800">{match.player2}</span>
            {match.team2Name && <span className="text-[9px] text-slate-400 mt-0.5">{match.team2Name}</span>}
          </div>
        </div>

        {/* Duration Info - Moved below matchup area */}
        <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-500 mt-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">用时</span>
            <span className="text-slate-800">{match.duration || '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-300">开始</span>
            <span className="text-slate-800">{match.startTime || '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-300">结束</span>
            <span className="text-slate-800">{match.endTime || '-'}</span>
          </div>
        </div>
      </div>
    </motion.div>
    );
  };

  return (
    <div className="pb-24 min-h-screen bg-slate-50">
      <header className="px-4 pt-12 pb-4 flex items-center gap-4 border-b bg-white border-slate-100 text-slate-900 sticky top-0 z-50 w-full">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-lg font-bold truncate">赛事详情 - {tournament.title}</h1>
      </header>

      {/* Tabs */}
      <div className="px-4 flex border-b sticky top-[105px] z-40 w-full bg-white border-slate-100">
        {[
          { id: 'program', label: '节目单' },
          { id: 'brackets', label: '对阵表' },
          { id: 'my-matches', label: '我的比赛' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 py-4 text-sm font-bold transition-all relative",
              activeTab === tab.id 
                ? "text-brand-primary" 
                : "text-slate-400"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'program' && (
          <div className="space-y-4">
            {/* Session & Category Selector */}
            <div className="flex items-center gap-3">
              <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1">
                {sessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session.id)}
                    className={cn(
                      "flex-shrink-0 px-3 py-2 rounded-2xl flex flex-col items-center min-w-[80px] transition-all border",
                      selectedSession === session.id
                        ? "bg-brand-primary/10 border-brand-primary text-brand-primary ring-2 ring-brand-primary/20"
                        : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    <span className="text-xs font-black">{session.id}</span>
                    <span className="text-[10px] font-bold opacity-80">{session.time}</span>
                  </button>
                ))}
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="bg-white border border-slate-100 rounded-xl px-4 py-2.5 pr-10 text-xs font-bold focus:outline-none focus:border-brand-primary card-shadow flex items-center justify-between min-w-[120px]"
                >
                  <span className="truncate">{selectedCategory === '全部' ? '全部项目' : selectedCategory}</span>
                  <ChevronDown size={14} className={cn("absolute right-3 text-slate-400 transition-transform", showCategoryDropdown && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {showCategoryDropdown && (
                    <>
                      <div className="fixed inset-0 z-[60]" onClick={() => setShowCategoryDropdown(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-slate-900 rounded-2xl shadow-2xl overflow-hidden z-[70] border border-slate-800"
                      >
                        <div className="max-h-[400px] overflow-y-auto no-scrollbar py-2">
                          {categoryGroups.map(group => (
                            <div key={group.label}>
                              <button
                                onClick={() => {
                                  setSelectedCategory(group.value);
                                  setShowCategoryDropdown(false);
                                }}
                                className={cn(
                                  "w-full text-left px-4 py-2.5 text-xs font-black transition-colors",
                                  selectedCategory === group.value ? "text-brand-primary bg-slate-800" : "text-slate-300 hover:bg-slate-800"
                                )}
                              >
                                {group.label}
                              </button>
                              {group.sub && group.sub.map(sub => (
                                <button
                                  key={sub}
                                  onClick={() => {
                                    setSelectedCategory(sub);
                                    setShowCategoryDropdown(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-8 py-2 text-xs font-bold transition-colors",
                                    selectedCategory === sub ? "text-white bg-brand-primary" : "text-slate-400 hover:bg-slate-800"
                                  )}
                                >
                                  {sub}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Court Selector */}
            <div className="overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-4 border-b border-slate-100">
              {courts.map(court => (
                <button
                  key={court}
                  onClick={() => setSelectedCourt(court)}
                  className={cn(
                    "flex-shrink-0 py-3 text-xs font-bold transition-all relative",
                    selectedCourt === court ? "text-brand-primary" : "text-slate-400"
                  )}
                >
                  {court}
                  {selectedCourt === court && (
                    <motion.div layoutId="activeCourt" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '总场次', filter: '全部', value: stats.total, color: 'text-blue-500' },
                { label: '比赛中', filter: '比赛中', value: stats.ongoing, color: 'text-red-500' },
                { label: '待开始', filter: '待开始', value: stats.upcoming, color: 'text-[#1FC47F]' },
                { label: '已结束', filter: '已结束', value: stats.finished, color: 'text-slate-400' },
              ].map(stat => (
                <button 
                  key={stat.label} 
                  onClick={() => setStatusFilter(stat.filter)}
                  className={cn(
                    "rounded-xl p-3 flex flex-col items-center justify-center border transition-all card-shadow",
                    statusFilter === stat.filter 
                      ? "bg-slate-50 border-brand-primary ring-2 ring-brand-primary/10" 
                      : "bg-white border-slate-100"
                  )}
                >
                  <span className={cn("text-lg font-black", stat.color)}>{stat.value}</span>
                  <span className="text-[10px] text-slate-400 font-bold mt-1">{stat.label}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="搜索选手姓名或队伍名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-100 text-sm focus:outline-none focus:border-brand-primary transition-all card-shadow"
                />
              </div>
              <button 
                onClick={() => setShowOnlyMyMatches(!showOnlyMyMatches)}
                className={cn(
                  "px-4 rounded-2xl border transition-all font-black text-xs flex items-center gap-2 card-shadow whitespace-nowrap",
                  showOnlyMyMatches 
                    ? "bg-brand-primary border-brand-primary text-white" 
                    : "bg-white border-slate-100 text-slate-600"
                )}
              >
                <User size={14} />
                我的
              </button>
            </div>

            {/* Match List */}
            <div className="space-y-4 mt-4">
              {filteredMatches.length > 0 ? (
                filteredMatches.map(match => renderMatchCard(match))
              ) : (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-400">未找到相关比赛场次</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'brackets' && (
          <div className="space-y-6">
            {/* Brackets Filters */}
            <div className="space-y-4">
              {/* Event Selector - Horizontal Switcher with Dropdown for "全部项目" */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
                {tournament.id === '2' ? (
                  <>
                    {/* Dropdown for "全部项目" */}
                    <div className="relative shrink-0">
                      <button 
                        onClick={() => setShowBracketsEventDropdown(!showBracketsEventDropdown)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap",
                          selectedEvent === '全部' 
                            ? "bg-brand-primary text-white border-brand-primary shadow-md" 
                            : "bg-white text-slate-400 border-slate-100"
                        )}
                      >
                        全部项目
                        <ChevronDown size={12} className={cn("transition-transform", showBracketsEventDropdown && "rotate-180")} />
                      </button>
                      
                      <AnimatePresence>
                        {showBracketsEventDropdown && (
                          <>
                            <div className="fixed inset-0 z-[60]" onClick={() => setShowBracketsEventDropdown(false)} />
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full left-0 mt-2 w-40 bg-slate-900 rounded-2xl shadow-2xl overflow-hidden z-[70] border border-slate-800"
                            >
                              <div className="py-2">
                                {categoryGroups.map(group => (
                                  <button
                                    key={group.value}
                                    onClick={() => {
                                      setSelectedEvent(group.value);
                                      setShowBracketsEventDropdown(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-4 py-2.5 text-xs font-black transition-colors",
                                      selectedEvent === group.value ? "text-brand-primary bg-slate-800" : "text-slate-300 hover:bg-slate-800"
                                    )}
                                  >
                                    {group.label}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Other categories as tabs */}
                    {['男团', '女团', '混团'].map(label => (
                      <button
                        key={label}
                        onClick={() => setSelectedEvent(label)}
                        className={cn(
                          "flex-shrink-0 px-6 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap",
                          selectedEvent === label 
                            ? "bg-brand-primary text-white border-brand-primary shadow-md" 
                            : "bg-white text-slate-400 border-slate-100"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </>
                ) : (
                  categoryGroups.map(group => (
                    <button
                      key={group.value}
                      onClick={() => setSelectedEvent(group.value)}
                      className={cn(
                        "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap",
                        selectedEvent === group.value 
                          ? "bg-brand-primary text-white border-brand-primary shadow-md" 
                          : "bg-white text-slate-400 border-slate-100"
                      )}
                    >
                      {group.label}
                    </button>
                  ))
                )}
              </div>

              {/* Group Selector (A, B, C, D) - Hidden for ID '2' and Knockout Stage */}
              {selectedEvent !== '全部' && tournament.id !== '2' && selectedStage !== '第二阶段 淘汰赛' && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
                  {['A组', 'B组', 'C组', 'D组'].map(group => (
                    <button
                      key={group}
                      onClick={() => setSelectedGroup(group)}
                      className={cn(
                        "flex-shrink-0 px-6 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap",
                        selectedGroup === group 
                          ? "bg-slate-800 text-white border-slate-800 shadow-md" 
                          : "bg-white text-slate-400 border-slate-100"
                      )}
                    >
                      {group}
                    </button>
                  ))}
                </div>
              )}

              {/* Stage Selector - Horizontal Switcher */}
              <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
                {['第一阶段 小组赛', '第二阶段 淘汰赛'].map(stage => (
                  <button
                    key={stage}
                    onClick={() => setSelectedStage(stage)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-xs font-black transition-all",
                      selectedStage === stage 
                        ? "bg-white text-slate-900 shadow-sm" 
                        : "text-slate-400"
                    )}
                  >
                    {stage}
                  </button>
                ))}
              </div>

              {/* Rules Display */}
              <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-3 flex items-start gap-2">
                <Info size={14} className="text-brand-primary mt-0.5 shrink-0" />
                <p className="text-[10px] font-bold text-brand-primary leading-relaxed">
                  比赛规则：{selectedStage === '第一阶段 小组赛' ? '小组赛采取单循环赛制，每组前 2 名晋级第二阶段淘汰赛。' : '淘汰赛采取单败淘汰制，直至决出冠亚季军。'}
                </p>
              </div>
            </div>

            {selectedStage === '第一阶段 小组赛' ? (
              <div className="space-y-8">
                {/* Display groups based on selectedEvent */}
                {['第1组', '第2组', '第3组', '第4组', '第5组', '第6组'].filter(subGroup => {
                  if (tournament.id !== '2' || selectedEvent === '全部') return true;
                  const groupNum = parseInt(subGroup.replace('第', '').replace('组', ''));
                  const groupCategory = ['男团', '女团', '混团'][(groupNum - 1) % 3];
                  return groupCategory === selectedEvent;
                }).map((subGroup) => {
                  const groupNum = parseInt(subGroup.replace('第', '').replace('组', ''));
                  const groupCategory = tournament.id === '2' ? ['男团', '女团', '混团'][(groupNum - 1) % 3] : selectedEvent;
                  
                  return (
                    <div key={subGroup} className="bg-white rounded-[32px] border border-slate-100 card-shadow overflow-hidden">
                      {/* Integrated Group Header */}
                      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                          <span className="text-sm font-black text-slate-800">
                            {tournament.id === '2' 
                              ? `${groupCategory} ${subGroup}`
                              : (selectedEvent === '全部' ? '全部项目' : `${selectedEvent}${selectedGroup}`) + ` ${subGroup}`
                            }
                          </span>
                        </div>
                      <button 
                        onClick={() => {
                          setSelectedSubGroup(subGroup);
                          setShowRoundTable(true);
                        }}
                        className="text-[11px] font-bold text-brand-primary hover:opacity-80 transition-all flex items-center gap-0.5"
                      >
                        对阵详情 <ChevronRight size={12} />
                      </button>
                    </div>

                    <div className="p-4 sm:p-6 space-y-8">
                      {/* Match Table (Grid) Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">小组对阵表（实时比分）</h4>
                        </div>
                        <div className="overflow-x-auto no-scrollbar border border-slate-50 rounded-2xl">
                          <table className="w-full text-center border-collapse min-w-[320px]">
                            <thead>
                              <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="py-3 px-2 text-[9px] font-black text-slate-400 uppercase w-16">队伍</th>
                                {(tournament.id === '2' ? ['翔骏羽队', '友巨集团', '厦门大学', '集美大学'] : ['郭靖', '安塞龙', '李宗伟', '林丹']).map(name => (
                                  <th key={name} className="py-3 px-2">
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                        <img src={`https://picsum.photos/seed/${name}/100/100`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                      <span className="text-[9px] font-black text-slate-800">{name}</span>
                                    </div>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(tournament.id === '2' ? [
                                { name: '翔骏羽队', results: ['-', '5:0', '3:2', '4:1'] },
                                { name: '友巨集团', results: ['0:5', '-', '2:3', '5:0'] },
                                { name: '厦门大学', results: ['2:3', '3:2', '-', '5:0'] },
                                { name: '集美大学', results: ['1:4', '0:5', '0:5', '-'] },
                              ] : [
                                { name: '郭靖', results: ['-', '21:18, 21:15', '21:19, 18:21, 21:16', '21:15, 21:12'] },
                                { name: '安塞龙', results: ['18:21, 15:21', '-', '19:21, 21:18, 16:21', '21:14, 12:10*'] },
                                { name: '李宗伟', results: ['19:21, 21:18, 16:21', '21:19, 18:21, 21:16', '-', '21:13, 21:11'] },
                                { name: '林丹', results: ['15:21, 12:21', '14:21, 10:12*', '13:21, 11:21', '-'] },
                              ]).map((row, i) => (
                                <tr key={i} className="border-b border-slate-50 last:border-0">
                                  <td className="py-3 px-2 bg-slate-50/30">
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                        <img src={`https://picsum.photos/seed/${row.name}/100/100`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                      </div>
                                      <span className="text-[9px] font-black text-slate-800">{row.name}</span>
                                    </div>
                                  </td>
                                  {row.results.map((res, j) => {
                                    const isOngoing = res.includes('*');
                                    const displayRes = res.replace('*', '');
                                    
                                    return (
                                      <td key={j} className={cn(
                                        "py-2 px-1 text-[9px] font-bold tabular-nums",
                                        res === '-' ? "bg-slate-50/50 text-slate-200" : (isOngoing ? "bg-red-50/5 text-red-500" : "text-slate-600")
                                      )}>
                                        {res === '-' ? res : (
                                          <div className="flex flex-col items-center justify-center">
                                            {displayRes.split(', ').map((score, idx) => (
                                              <div key={idx} className="leading-tight">{score}</div>
                                            ))}
                                            {isOngoing && (
                                              <div className="mt-1 px-1 bg-red-500 text-white text-[7px] font-black rounded-sm scale-90">比赛中</div>
                                            )}
                                          </div>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Standings Table Section - Compact */}
                      <div className="space-y-4">
                        <div className="px-1">
                          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">小组排名</h4>
                          <p className="text-[9px] font-bold text-slate-300 mt-1">排名将根据比赛进程动态更新</p>
                        </div>
                        <div className="overflow-hidden border border-slate-50 rounded-2xl">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50/30 border-b border-slate-50">
                                <th className="pl-4 py-3 text-[9px] font-black text-slate-400 w-12 uppercase tracking-widest">排名</th>
                                <th className="px-2 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">队伍</th>
                                <th className="px-2 py-3 text-[9px] font-black text-slate-400 text-center uppercase tracking-widest">胜次</th>
                                <th className="px-2 py-3 text-[9px] font-black text-slate-400 text-center uppercase tracking-widest">净胜场</th>
                                <th className="px-2 py-3 text-[9px] font-black text-slate-400 text-center uppercase tracking-widest">净胜局</th>
                                <th className="pr-4 py-3 text-[9px] font-black text-slate-400 text-center uppercase tracking-widest">净胜分</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(tournament.id === '2' ? [
                                { rank: 1, name: '翔骏羽队', netMatches: 3, netSets: 12, netPoints: 85 },
                                { rank: 2, name: '厦门大学', netMatches: 2, netSets: 4, netPoints: 25 },
                                { rank: 3, name: '友巨集团', netMatches: 1, netSets: -2, netPoints: -12 },
                                { rank: 4, name: '集美大学', netMatches: 0, netSets: -14, netPoints: -98 },
                              ] : [
                                { rank: 1, name: '郭靖', netMatches: 3, netSets: 6, netPoints: 42 },
                                { rank: 2, name: '安塞龙', netMatches: 2, netSets: 2, netPoints: 15 },
                                { rank: 3, name: '李宗伟', netMatches: 1, netSets: -1, netPoints: -8 },
                                { rank: 4, name: '林丹', netMatches: 0, netSets: -7, netPoints: -49 },
                              ]).map((row, i) => (
                                <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                  <td className="pl-4 py-3">
                                    <div className={cn(
                                      "w-5 h-5 rounded flex items-center justify-center text-[9px] font-black",
                                      row.rank === 1 ? "bg-amber-100 text-amber-600" : 
                                      row.rank === 2 ? "bg-slate-100 text-slate-600" : 
                                      "bg-slate-50 text-slate-400"
                                    )}>
                                      {row.rank}
                                    </div>
                                  </td>
                                  <td className="px-2 py-3">
                                    <button 
                                      onClick={() => {
                                        if (tournament.id === '2') {
                                          setSelectedTeam(row.name);
                                          setShowTeamSchedule(true);
                                        }
                                      }}
                                      className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                                    >
                                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                                        <img 
                                          src={`https://picsum.photos/seed/${row.name}/100/100`} 
                                          alt={row.name}
                                          className="w-full h-full object-cover"
                                          referrerPolicy="no-referrer"
                                        />
                                      </div>
                                      <span className="text-[10px] font-black text-slate-800 truncate max-w-[60px]">{row.name}</span>
                                    </button>
                                  </td>
                                  <td className="px-2 py-3 text-center text-[10px] font-bold tabular-nums text-slate-500">{row.rank === 1 ? 3 : row.rank === 2 ? 2 : row.rank === 3 ? 1 : 0}</td>
                                  <td className="px-2 py-3 text-center text-[10px] font-bold tabular-nums text-slate-500">{row.netMatches > 0 ? `+${row.netMatches}` : row.netMatches}</td>
                                  <td className="px-2 py-3 text-center text-[10px] font-bold tabular-nums text-slate-500">{row.netSets > 0 ? `+${row.netSets}` : row.netSets}</td>
                                  <td className="pr-4 py-3 text-center text-[10px] font-bold tabular-nums text-slate-500">{row.netPoints > 0 ? `+${row.netPoints}` : row.netPoints}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            ) : (
              /* Knockout Bracket */
              <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pb-8">
                <div className="min-w-[1000px]">
                  {/* Aligned Headers */}
                  <div className="flex gap-8 mb-8 sticky top-0 bg-white z-20 py-4 border-b border-slate-50">
                    {['16进8', '8进4', '半决赛', '决赛'].map(round => (
                      <div key={round} className="flex-1 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                        {round}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-8">
                    {/* 16进8 */}
                    <div className="flex-1 space-y-4">
                      {(() => {
                        const isYuxie = tournament.id === '1';
                        const teamNames = [
                          '雷霆俱乐部', '飞羽协会', '厦大校友', '集大羽协', '华大羽社', '福大羽协', '卡猫羽队', '同心羽球',
                          '龙岩羽协', '泉州羽社', '漳州羽协', '宁德羽社', '嘉庚羽队', '诚毅羽协', '阳光羽球', '协和羽社'
                        ];
                        const players = isYuxie ? 
                          ['郭靖', '安塞龙', '李宗伟', '林丹', '谌龙', '周杰', '李强', '王五', '赵六', '陈平', '张三', '李四', '王小二', '赵大宝', '陈小明', '周小红'] :
                          ['翔骏羽队', '友巨集团', '厦门大学', '集美大学', '华侨大学', '福州大学', '卡猫一队', '同心俱乐部', '龙岩学院', '泉州师范', '漳州师大', '宁德师范', '嘉庚学院', '诚毅学院', '阳光学院', '协和学院'];
                        
                        return Array.from({ length: 8 }).map((_, i) => {
                          const topWins = true; 
                          const matchCode = isYuxie ? `男单${2001 + i}` : `男团100${i + 1}`;
                          const matchTime = `14:${(i * 20).toString().padStart(2, '0')}`;
                          const courtNum = (i % 8) + 1;
                          const matchNum = 1;
                          const p1Name = players[i * 2];
                          const p2Name = players[i * 2 + 1];
                          const p1Team = isYuxie ? teamNames[i * 2] : '';
                          const p2Team = isYuxie ? teamNames[i * 2 + 1] : '';
                          
                          const s1 = topWins ? ['21', '21'] : ['18', '15'];
                          const s2 = !topWins ? ['21', '21'] : ['18', '15'];
                          
                          const matchDetail = MOCK_MATCH_DETAILS[matchCode];

                          return (
                            <div key={i} className="relative flex items-center h-[84px]">
                              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden w-[200px] z-10">
                                <div className="bg-slate-50/50 px-2 py-1 border-b border-slate-50 flex justify-between items-center">
                                  <button 
                                    onClick={() => {
                                      if (matchDetail) {
                                        setSelectedMatchDetail(matchDetail);
                                        setShowMatchDetailModal(true);
                                      }
                                    }}
                                    className="text-[8px] font-black text-brand-primary uppercase tracking-wider hover:underline"
                                  >
                                    {matchCode}
                                  </button>
                                  <span className="text-[7px] font-bold text-slate-400">8月15日 {matchTime}</span>
                                </div>
                                <div className="p-2 space-y-1">
                                  <div className={cn("flex justify-between items-center gap-2", !topWins && "opacity-40")}>
                                    <span className="text-[10px] font-bold text-slate-800 truncate flex-1">{p1Name}</span>
                                    <div className="flex gap-1">
                                      <span className="text-[9px] font-black text-slate-600 w-6 text-center">{matchDetail ? matchDetail.scoreA : s1[0]}</span>
                                    </div>
                                  </div>
                                  <div className={cn("flex justify-between items-center gap-2", topWins && "opacity-40")}>
                                    <span className="text-[10px] font-bold text-slate-800 truncate flex-1">{p2Name}</span>
                                    <div className="flex gap-1">
                                      <span className="text-[9px] font-black text-slate-600 w-6 text-center">{matchDetail ? matchDetail.scoreB : s2[0]}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Connector Line */}
                              <div className="flex-1 h-[2px] bg-slate-200 relative">
                                {i % 2 === 0 ? (
                                  <div className="absolute right-0 top-0 w-[2px] h-[50px] bg-slate-200" />
                                ) : (
                                  <div className="absolute right-0 bottom-0 w-[2px] h-[50px] bg-slate-200" />
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* 8进4 */}
                    <div className="flex-1 space-y-[116px] pt-[50px]">
                      {(() => {
                        const isYuxie = tournament.id === '1';
                        const winners = isYuxie ? 
                          ['郭靖', '李宗伟', '谌龙', '李强', '赵六', '张三', '王小二', '陈小明'] :
                          ['翔骏羽队', '友巨集团', '厦门大学', '集美大学', '华侨大学', '福州大学', '卡猫一队', '同心俱乐部'];
                        
                        return Array.from({ length: 4 }).map((_, i) => {
                          const topWins = (i === 0 || i === 2) ? false : true;
                          const matchCode = isYuxie ? `男单${2009 + i}` : `男团200${i + 1}`;
                          const matchTime = `16:${(i * 30).toString().padStart(2, '0')}`;
                          const p1Name = winners[i * 2];
                          const p2Name = winners[i * 2 + 1];
                          
                          const isFinished = i < 2;
                          const s1 = isFinished ? (topWins ? ['21', '21'] : ['14', '12']) : [];
                          const s2 = isFinished ? (!topWins ? ['21', '21'] : ['14', '12']) : [];
                          
                          const matchDetail = MOCK_MATCH_DETAILS[matchCode];

                          return (
                            <div key={i} className="relative flex items-center h-[84px]">
                              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden w-[200px] z-10">
                                <div className="bg-slate-50/50 px-2 py-1 border-b border-slate-50 flex justify-between items-center">
                                  <button 
                                    onClick={() => {
                                      if (matchDetail) {
                                        setSelectedMatchDetail(matchDetail);
                                        setShowMatchDetailModal(true);
                                      }
                                    }}
                                    className="text-[8px] font-black text-brand-primary uppercase tracking-wider hover:underline"
                                  >
                                    {matchCode}
                                  </button>
                                  <span className="text-[7px] font-bold text-slate-400">8月15日 {matchTime}</span>
                                </div>
                                <div className="p-2 space-y-1">
                                  <div className={cn("flex justify-between items-center gap-2", isFinished && !topWins && "opacity-40")}>
                                    <span className="text-[10px] font-bold text-slate-800 truncate flex-1">{p1Name}</span>
                                    <div className="flex gap-1">
                                      <span className="text-[9px] font-black text-slate-600 w-6 text-center">{matchDetail ? matchDetail.scoreA : (s1[0] || '-')}</span>
                                    </div>
                                  </div>
                                  <div className={cn("flex justify-between items-center gap-2", isFinished && topWins && "opacity-40")}>
                                    <span className="text-[10px] font-bold text-slate-800 truncate flex-1">{p2Name}</span>
                                    <div className="flex gap-1">
                                      <span className="text-[9px] font-black text-slate-600 w-6 text-center">{matchDetail ? matchDetail.scoreB : (s2[0] || '-')}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Connector Line */}
                              <div className="flex-1 h-[2px] bg-slate-200 relative">
                                {i % 2 === 0 ? (
                                  <div className="absolute right-0 top-0 w-[2px] h-[100px] bg-slate-200" />
                                ) : (
                                  <div className="absolute right-0 bottom-0 w-[2px] h-[100px] bg-slate-200" />
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* 半决赛 */}
                    <div className="flex-1 space-y-[316px] pt-[150px]">
                      {(() => {
                        const isYuxie = tournament.id === '1';
                        const semiFinalists = isYuxie ? ['李宗伟', '李强', '张三', '陈小明'] : ['友巨集团', '集美大学', '福州大学', '同心俱乐部'];
                        return Array.from({ length: 2 }).map((_, i) => {
                          const matchCode = isYuxie ? `男单${2013 + i}` : `男团300${i + 1}`;
                          const matchDetail = MOCK_MATCH_DETAILS[matchCode];
                          return (
                            <div key={i} className="relative flex items-center h-[84px]">
                              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden w-[200px] z-10">
                                <div className="bg-slate-50/50 px-2 py-1 border-b border-slate-50 flex justify-between items-center">
                                  <button 
                                    onClick={() => {
                                      if (matchDetail) {
                                        setSelectedMatchDetail(matchDetail);
                                        setShowMatchDetailModal(true);
                                      }
                                    }}
                                    className="text-[8px] font-black text-brand-primary uppercase tracking-wider hover:underline"
                                  >
                                    {matchCode}
                                  </button>
                                  <span className="text-[7px] font-bold text-slate-400">8月15日 18:00</span>
                                </div>
                                <div className="p-2 space-y-1">
                                  <div className="flex justify-between items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-800 truncate flex-1">{semiFinalists[i * 2]}</span>
                                    <span className="text-[9px] font-black text-slate-600 w-6 text-center">{matchDetail ? matchDetail.scoreA : '-'}</span>
                                  </div>
                                  <div className="flex justify-between items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-800 truncate flex-1">{semiFinalists[i * 2 + 1]}</span>
                                    <span className="text-[9px] font-black text-slate-600 w-6 text-center">{matchDetail ? matchDetail.scoreB : '-'}</span>
                                  </div>
                                </div>
                              </div>
                              {/* Connector Line */}
                              <div className="flex-1 h-[2px] bg-slate-200 relative">
                                {i % 2 === 0 ? (
                                  <div className="absolute right-0 top-0 w-[2px] h-[200px] bg-slate-200" />
                                ) : (
                                  <div className="absolute right-0 bottom-0 w-[2px] h-[200px] bg-slate-200" />
                                )}
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* 决赛 */}
                    <div className="flex-1 pt-[350px]">
                      <div className="flex items-center h-[84px]">
                        <div className="w-8 h-[2px] bg-slate-200" />
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col items-center justify-center shadow-2xl min-w-[200px] z-10">
                          <Trophy className="w-6 h-6 text-brand-primary mb-2" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest mb-1">冠军争夺战</span>
                          <span className="text-[8px] font-bold text-slate-500">8月15日 20:00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consolation Match (3rd/4th) */}
                  <div className="mt-20 pt-12 border-t border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left mb-8">附加赛 (3、4名决赛)</div>
                    <div className="flex justify-start">
                      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden w-[240px]">
                        <div className="bg-slate-50/50 px-3 py-2 border-b border-slate-50 flex justify-between items-center">
                          <button 
                            onClick={() => {
                              const detail = MOCK_MATCH_DETAILS['男团1001']; // Mocking for demo
                              if (detail) {
                                setSelectedMatchDetail({ ...detail, code: '季军赛' });
                                setShowMatchDetailModal(true);
                              }
                            }}
                            className="text-[9px] font-black text-brand-primary uppercase tracking-wider hover:underline"
                          >
                            季军赛
                          </button>
                          <span className="text-[8px] font-bold text-slate-400">8月15日 19:30 | 2号场</span>
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex justify-between items-center gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden">
                                <img src="https://picsum.photos/seed/p3/100/100" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="text-xs font-bold text-slate-800">半决赛负者 A</span>
                            </div>
                            <span className="text-xs font-black text-slate-600">72</span>
                          </div>
                          <div className="h-[1px] bg-slate-50" />
                          <div className="flex justify-between items-center gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden">
                                <img src="https://picsum.photos/seed/p4/100/100" alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="text-xs font-bold text-slate-800">半决赛负者 B</span>
                            </div>
                            <span className="text-xs font-black text-slate-600">45</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Match Detail Modal */}
        <AnimatePresence>
          {showMatchDetailModal && selectedMatchDetail && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMatchDetailModal(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-black text-slate-800">详细比分</h3>
                  <button 
                    onClick={() => setShowMatchDetailModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">出场顺序</th>
                        <th className="px-6 py-4 text-center">{selectedMatchDetail.teamA}</th>
                        <th className="px-6 py-4 text-center">{selectedMatchDetail.scoreA}:{selectedMatchDetail.scoreB}</th>
                        <th className="px-6 py-4 text-center">{selectedMatchDetail.teamB}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedMatchDetail.subMatches.map((sub: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800">{sub.order}</span>
                              {sub.time && <span className="text-[10px] text-slate-400">{sub.time}</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-center gap-1">
                              {sub.playersA.map((p: string, pIdx: number) => (
                                <div key={pIdx} className="flex items-center gap-2">
                                  <span className="text-slate-600 font-medium">{p}</span>
                                  <span className="text-[10px] font-black text-slate-400">{sub.scoresA[pIdx]}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center px-3 py-1 bg-slate-100 rounded-full text-[11px] font-black text-slate-600">
                              {sub.subScore}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-center gap-1">
                              {sub.playersB.map((p: string, pIdx: number) => (
                                <div key={pIdx} className="flex items-center gap-2">
                                  <span className="text-slate-600 font-medium">{p}</span>
                                  <span className="text-[10px] font-black text-slate-400">{sub.scoresB[pIdx]}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">总分</div>
                      <div className="text-3xl font-black text-slate-800">{selectedMatchDetail.scoreA}</div>
                    </div>
                    <div className="text-2xl font-black text-slate-200">:</div>
                    <div className="text-center">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">总分</div>
                      <div className="text-3xl font-black text-slate-800">{selectedMatchDetail.scoreB}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {activeTab === 'my-matches' && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-brand-primary p-0.5 bg-white shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop" 
                    alt="张伟" 
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">张伟</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-emerald-50 text-emerald-600 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-emerald-100">参赛中</span>
                    {tournament.id === '2' && (
                      <span className="bg-brand-primary/5 text-brand-primary text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-brand-primary/10">厦门大学</span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowElectronicPass(true)}
                className="bg-white border border-slate-100 px-4 py-2 rounded-xl text-[10px] font-black text-slate-600 shadow-sm flex items-center gap-2 active:scale-95 transition-all"
              >
                <CreditCard size={14} className="text-brand-primary" />
                电子参赛证
              </button>
            </div>

            {/* Check-in Reminder */}
            <div className="bg-orange-50 border-l-4 border-brand-primary rounded-2xl p-5 relative overflow-hidden group">
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-brand-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-black text-brand-primary uppercase tracking-wider">
                      {tournament.id === '2' ? '检录提醒 · 男团1组 第1轮' : '检录提醒 · 男单B组 16进8'}
                    </h3>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                    <span className="text-slate-900">14:30-15:45</span>，请前往检录台检录
                  </p>
                </div>
                <button 
                  onClick={() => setCheckInQRData({
                    title: '检录二维码',
                    subtitle: '男单B组 • 16进8',
                    player: '张伟',
                    category: '男单B组',
                    groupInfo: '16进8'
                  })}
                  className="bg-brand-primary text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20 transition-all active:scale-95"
                >
                  去检录
                </button>
                <button className="text-slate-300 hover:text-slate-400 transition-colors ml-2">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-slate-800">我的比赛场次</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                共 {scheduleMatches.filter(m => m.isMyMatch).length} 场
              </span>
            </div>

            <div className="space-y-6">
              {scheduleMatches
                .filter(m => m.isMyMatch)
                .sort((a, b) => {
                  if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
                  if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
                  return b.time.localeCompare(a.time);
                })
                .map(match => renderMyMatchCard(match))}
            </div>
          </div>
        )}
      </div>

      {/* Electronic Pass Modal */}
      <AnimatePresence>
        {showElectronicPass && (
          <div className="fixed inset-0 z-[110] bg-slate-50 flex flex-col w-full max-w-md mx-auto left-0 right-0">
            <header className="bg-white px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50 w-full">
              <button onClick={() => setShowElectronicPass(false)} className="p-2 rounded-full hover:bg-slate-100">
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <h1 className="text-lg font-bold">电子参赛证</h1>
            </header>
            <div className="bg-white px-4 py-2 flex gap-2 border-b border-slate-100 sticky top-[88px] z-40">
              {[
                { id: 'current', label: '当前比赛' },
                { id: 'history', label: '历史比赛' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setIdTab(tab.id as any)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-[10px] font-black transition-all",
                    idTab === tab.id ? "bg-brand-primary text-white shadow-md" : "text-slate-400"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
              {idTab === 'current' ? (
                <div className="bg-white rounded-[40px] p-8 card-shadow border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                    <div className="w-24 h-24 rounded-full border-4 border-brand-primary/20 p-1">
                      <img 
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop" 
                        alt="Participant" 
                        className="w-full h-full object-cover rounded-full" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">张伟</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">厦门雷霆羽毛球俱乐部</p>
                    </div>
                    
                    <div className="w-full py-6 border-y border-slate-50 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛名称</span>
                        <span className="text-sm font-black text-brand-primary">{tournament.title}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛时间</span>
                        <span className="text-sm font-black text-slate-700">2026年8月15日-16日</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">比赛地点</span>
                        <span className="text-sm font-black text-slate-700">厦门市体育中心羽毛球馆</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">参赛项目</span>
                        <span className="text-sm font-black text-slate-700">男单B组</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-[32px] w-full flex flex-col items-center gap-4">
                      <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <QrCode size={160} className="text-slate-900" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">请根据检录时间前往检录台进行检录</p>
                      <button 
                        onClick={() => setShowTotalCheckIn(true)}
                        className="w-full py-4 bg-brand-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                      >
                        总检录二维码
                      </button>
                    </div>
                    
                    <div className="w-full space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">我的比赛场次</h4>
                      {scheduleMatches
                        .filter(m => m.isMyMatch)
                        .sort((a, b) => {
                          if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
                          if (a.status !== 'upcoming' && b.status === 'upcoming') return 1;
                          return b.time.localeCompare(a.time);
                        })
                        .map((match, i) => (
                        <div key={i} className="p-5 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                              {match.category} • {match.groupInfo}
                            </div>
                            <div className={cn(
                              "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1",
                              match.status === 'upcoming' ? "text-amber-600 bg-amber-50 border border-amber-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            )}>
                              {match.status === 'upcoming' ? <Hourglass size={8} /> : <CheckCircle2 size={8} />}
                              {match.status === 'upcoming' ? '待检录' : '已检录'}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold pl-1 text-left">
                              <Clock size={12} className="text-slate-400" />
                              <span>比赛</span>
                              <span className="text-slate-900 font-black">{match.time}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-600">{match.court}</span>
                            </div>

                            <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                                  <ClipboardList size={16} />
                                </div>
                                <div className="text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-amber-600">检录</span>
                                    <span className="text-xs font-black text-amber-700">
                                      {match.category === '男单B组' && match.groupInfo === '16进8' 
                                        ? "14:30-15:45" 
                                        : (() => {
                                            const [h, m] = match.time.split(':').map(Number);
                                            const total = h * 60 + m;
                                            const format = (t: number) => `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;
                                            return `${format(total - 30)}-${format(total - 15)}`;
                                          })()}
                                    </span>
                                  </div>
                                  <p className="text-[8px] font-bold text-amber-600/60 mt-0.5">请提前15分钟到达检录台</p>
                                </div>
                              </div>
                              <div className="text-[8px] font-black text-amber-600/40 uppercase tracking-widest">检录台</div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold pl-1 text-left">
                              <span>比赛对阵：</span>
                              <span className="text-slate-600 font-black">张伟 VS {match.player2 === '张伟' ? match.player1 : match.player2}</span>
                            </div>
                          </div>

                          {match.status === 'upcoming' && (
                            <button 
                              onClick={() => setCheckInQRData({
                                title: '检录二维码',
                                subtitle: `${match.category} • ${match.groupInfo}`,
                                player: match.player1,
                                category: match.category,
                                groupInfo: match.groupInfo
                              })}
                              className="w-full py-3.5 bg-brand-primary text-white rounded-2xl text-xs font-black shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                            >
                              去检录
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                  <Trophy size={48} strokeWidth={1} />
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest">暂无历史参赛记录</p>
                </div>
              )}
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* Total Check-in Modal */}
      <AnimatePresence>
        {showTotalCheckIn && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTotalCheckIn(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xs rounded-[40px] overflow-hidden shadow-2xl relative z-10 flex flex-col items-center p-8"
            >
              <div className="w-16 h-1.5 bg-slate-100 rounded-full mb-8" />
              <h3 className="text-lg font-black text-slate-900 mb-2">总检录码</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">包含所有待检录场次</p>
              
              <div className="w-48 h-48 bg-slate-50 rounded-3xl border border-slate-100 p-4 mb-8 flex items-center justify-center relative overflow-hidden">
                <QrCode size={120} className="text-slate-900" />
              </div>

              <div className="text-center space-y-1 mb-8">
                <p className="text-sm font-black text-slate-800">张伟</p>
                <p className="text-[10px] font-bold text-slate-400">待检录场次：{scheduleMatches.filter(m => m.isMyMatch && m.status === 'upcoming').length} 场</p>
              </div>

              <button 
                onClick={() => setShowTotalCheckIn(false)}
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20 active:scale-95 transition-all"
              >
                我知道了
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Single Match Check-in QR Modal */}
      <AnimatePresence>
        {checkInQRData && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckInQRData(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xs rounded-[40px] overflow-hidden shadow-2xl relative z-10 flex flex-col items-center p-8"
            >
              <div className="w-16 h-1.5 bg-slate-100 rounded-full mb-8" />
              
              {/* Player Info */}
              <div className="flex flex-col items-center mb-6">
                <img 
                  src={`https://picsum.photos/seed/${checkInQRData.player}/100/100`}
                  alt={checkInQRData.player}
                  className="w-16 h-16 rounded-full border-2 border-brand-primary/20 shadow-sm mb-3"
                  referrerPolicy="no-referrer"
                />
                <p className="text-base font-black text-slate-900">{checkInQRData.player}</p>
                <p className="text-xs font-bold text-brand-primary mt-1">
                  {checkInQRData.category} <span className="mx-1 text-slate-300">|</span> {checkInQRData.groupInfo}
                </p>
              </div>
              
              <div className="w-48 h-48 bg-slate-50 rounded-3xl border border-slate-100 p-4 mb-8 flex items-center justify-center relative overflow-hidden">
                <QrCode size={120} className="text-slate-900" />
              </div>

              <button 
                onClick={() => setCheckInQRData(null)}
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/20 active:scale-95 transition-all"
              >
                请检录人员扫码检录
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Round Table Modal */}
      <AnimatePresence>
        {showRoundTable && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRoundTable(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-50 w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]"
            >
              <div className="p-8 bg-white border-b border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">小组对阵轮次表</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                      {selectedEvent === '全部' ? '全部项目' : `${selectedEvent}${selectedGroup}`} {selectedSubGroup}
                    </p>
                  </div>
                  <button onClick={() => setShowRoundTable(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 active:scale-90 transition-all">
                    <X size={20} />
                  </button>
                </div>

                {/* Round Switcher */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {['第1轮', '第2轮', '第3轮'].map((round, i) => (
                    <button
                      key={round}
                      onClick={() => setActiveRoundTab(i)}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap",
                        activeRoundTab === i 
                          ? "bg-brand-primary text-white border-brand-primary shadow-md" 
                          : "bg-white text-slate-400 border-slate-100"
                      )}
                    >
                      {round}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                {(tournament.id === '2' ? [
                  { 
                    round: '第1轮', 
                    matches: [
                      {team1: '翔骏羽队', team2: '友巨集团', score: '3:2', status: 'finished', winner: 1, category: '男团', id: '1001', matchNum: '第1场', subCategory: '单打', player1: '张伟', player2: '李强', setScore1: 2, setScore2: 1, score1: 21, score2: 18, date: '8/15', time: '09:00', court: '场地1', groupInfo: `${selectedSubGroup.replace('第', '')}第1轮`, pos1: '1组1', pos2: '1组2'}, 
                      {team1: '厦门大学', team2: '集美大学', score: '4:1', status: 'finished', winner: 1, category: '男团', id: '1002', matchNum: '第2场', subCategory: '单打', player1: '王五', player2: '赵六', setScore1: 2, setScore2: 0, score1: 21, score2: 15, date: '8/15', time: '09:15', court: '场地2', groupInfo: `${selectedSubGroup.replace('第', '')}第1轮`, pos1: '1组3', pos2: '1组4'}
                    ] 
                  },
                  { 
                    round: '第2轮', 
                    matches: [
                      {team1: '翔骏羽队', team2: '厦门大学', score: '3:2', status: 'finished', winner: 1, category: '男团', id: '2001', matchNum: '第1场', subCategory: '单打', player1: '张伟', player2: '王五', setScore1: 2, setScore2: 1, score1: 21, score2: 19, date: '8/15', time: '14:00', court: '场地1', groupInfo: `${selectedSubGroup.replace('第', '')}第2轮`, pos1: '1组1', pos2: '1组3'}, 
                      {team1: '友巨集团', team2: '集美大学', score: '5:0', status: 'finished', winner: 1, category: '男团', id: '2002', matchNum: '第2场', subCategory: '单打', player1: '李强', player2: '赵六', setScore1: 2, setScore2: 0, score1: 21, score2: 12, date: '8/15', time: '14:15', court: '场地2', groupInfo: `${selectedSubGroup.replace('第', '')}第2轮`, pos1: '1组2', pos2: '1组4'}
                    ] 
                  },
                  { 
                    round: '第3轮', 
                    matches: [
                      {team1: '翔骏羽队', team2: '集美大学', score: '0:0', status: 'upcoming', winner: 0, category: '男团', id: '3001', matchNum: '第1场', subCategory: '单打', player1: '张伟', player2: '赵六', setScore1: 0, setScore2: 0, score1: 0, score2: 0, date: '8/16', time: '09:00', court: '场地1', groupInfo: `${selectedSubGroup.replace('第', '')}第3轮`, pos1: '1组1', pos2: '1组4'}, 
                      {team1: '友巨集团', team2: '厦门大学', score: '0:0', status: 'upcoming', winner: 0, category: '男团', id: '3002', matchNum: '第2场', subCategory: '单打', player1: '李强', player2: '王五', setScore1: 0, setScore2: 0, score1: 0, score2: 0, date: '8/16', time: '09:15', court: '场地2', groupInfo: `${selectedSubGroup.replace('第', '')}第3轮`, pos1: '1组2', pos2: '1组3'}
                    ] 
                  },
                ] : [
                  { 
                    round: '第1轮', 
                    matches: [
                      {p1: '郭靖', p2: '安塞龙', score: '21:18, 21:15', status: 'finished', winner: 1}, 
                      {p1: '李宗伟', p2: '林丹', score: '21:19, 21:17', status: 'finished', winner: 1}
                    ] 
                  },
                  { 
                    round: '第2轮', 
                    matches: [
                      {p1: '郭靖', p2: '李宗伟', score: '21:12, 21:14', status: 'finished', winner: 1}, 
                      {p1: '安塞龙', p2: '林丹', score: '0:0', status: 'upcoming', winner: 0}
                    ] 
                  },
                  { 
                    round: '第3轮', 
                    matches: [
                      {p1: '郭靖', p2: '林丹', score: '0:0', status: 'upcoming', winner: 0}, 
                      {p1: '安塞龙', p2: '李宗伟', score: '0:0', status: 'upcoming', winner: 0}
                    ] 
                  },
                ]).filter((_, i) => i === activeRoundTab).map((r, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center text-white text-xs font-black shadow-lg shadow-brand-primary/20">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-black text-slate-800">{r.round}</span>
                    </div>
                    <div className="space-y-3">
                      {r.matches.map((m: any, mIdx) => {
                        if (tournament.id === '1') {
                          // For individual tournament, use renderMatchCard
                          // Map simple match data to the full structure expected by renderMatchCard
                          const fullMatch = {
                            id: m.id || `M${mIdx}`,
                            category: selectedEvent === '全部' ? '男单' : selectedEvent,
                            groupInfo: r.round,
                            date: '2026-08-15',
                            time: m.time || '09:00',
                            court: m.court || '1号场',
                            matchNum: m.matchNum || `第${mIdx + 1}场`,
                            player1: m.p1,
                            player2: m.p2,
                            score1: m.score ? m.score.split(', ')[0].split(':')[0] : 0,
                            score2: m.score ? m.score.split(', ')[0].split(':')[1] : 0,
                            setScore1: m.winner === 1 ? 1 : 0,
                            setScore2: m.winner === 2 ? 1 : 0,
                            status: m.status,
                            winner: m.winner,
                            duration: m.status === 'finished' ? '12分钟' : '',
                            startTime: m.time || '09:00',
                            endTime: m.status === 'finished' ? '09:12' : ''
                          };
                          return renderMatchCard(fullMatch);
                        }
                        
                        if (tournament.id === '2') {
                          const isFinished = m.status === 'finished' || m.status === 'walkover';
                          const isOngoing = m.status === 'ongoing';
                          
                          return (
                            <div 
                              key={mIdx}
                              className="bg-white rounded-sm border border-slate-200 transition-all shadow-sm relative overflow-hidden mb-4 text-left"
                            >
                              {/* Status Ribbon */}
                              <div className={cn(
                                "absolute top-0 right-0 px-8 py-1 translate-x-[30%] translate-y-[30%] rotate-45 text-[10px] font-black text-white z-10",
                                isFinished ? "bg-slate-400" : (isOngoing ? "bg-red-500" : "bg-[#1FC47F]")
                              )}>
                                {isFinished ? '已结束' : (isOngoing ? '比赛中' : '待开始')}
                              </div>

                              <div className="p-3">
                                {/* Header: 团体项目+代码+场次+比赛项目, 组别 */}
                                <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-2">
                                  <h3 className="text-xs font-bold text-slate-800">
                                    {m.category}{m.id}{m.matchNum}{m.subCategory}
                                  </h3>
                                  <span className="text-xs font-bold text-slate-800 mr-12">{m.groupInfo}</span>
                                </div>

                                {/* Sub-header: Date, Time, Court, Match Num */}
                                <div className="flex justify-center gap-4 text-[10px] text-slate-400 mb-4">
                                  <span>{m.date.replace('8/', '1月')}</span>
                                  <span>{m.time}</span>
                                  <span>{m.court}</span>
                                  <span>{m.matchNum}</span>
                                </div>

                                {/* Teams Section */}
                                <div className="bg-brand-primary/5 rounded-sm p-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold text-slate-700 flex-1 text-center">{m.team1}</span>
                                    <div className="text-brand-primary text-xs font-bold mx-4 min-w-[60px] text-center">
                                      {isFinished ? (m.teamScore || '50:42') : 'VS'}
                                    </div>
                                    <span className="text-xs font-bold text-slate-700 flex-1 text-center">{m.team2}</span>
                                  </div>

                                  {/* Inner Match Box */}
                                  <div className="bg-white border border-brand-primary/20 rounded-sm p-3 relative">
                                    <div className="grid grid-cols-[1fr_70px_1fr] items-center gap-2">
                                      {/* Side 1 Pos */}
                                      <div className="text-center text-[10px] text-slate-400">{m.pos1}</div>
                                      {/* Set Score */}
                                      <div className="bg-brand-primary/10 text-brand-primary py-1 rounded-sm text-xs font-bold text-center">
                                        {m.setScore1}:{m.setScore2}
                                      </div>
                                      {/* Side 2 Pos */}
                                      <div className="text-center text-[10px] text-slate-400 relative">
                                        {m.pos2}
                                        {isFinished && m.winner === 2 && (
                                          <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold">胜</div>
                                        )}
                                      </div>

                                      {/* Side 1 Players Top */}
                                      <div className="text-center text-[11px] font-medium text-slate-600 relative">
                                        {isFinished && m.winner === 1 && (
                                          <div className="absolute -left-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold">胜</div>
                                        )}
                                        {m.player1}
                                      </div>
                                      {/* Spacer */}
                                      <div />
                                      {/* Side 2 Players Top */}
                                      <div className="text-center text-[11px] font-medium text-slate-600">{m.player2}</div>

                                      {/* Point Score */}
                                      <div className="col-span-3 bg-brand-primary/5 text-brand-primary py-2 rounded-sm text-sm font-bold text-center">
                                        {m.score1}:{m.score2}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={mIdx} className="bg-white rounded-2xl p-4 border border-slate-100 card-shadow flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">
                                  {m.p1[0]}
                                </div>
                                <span className={cn("text-xs font-black", m.winner === 1 ? "text-slate-900" : "text-slate-400")}>{m.p1}</span>
                              </div>
                              <div className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-300 italic">VS</div>
                              <div className="flex-1 flex items-center justify-end gap-3">
                                <span className={cn("text-xs font-black", m.winner === 2 ? "text-slate-900" : "text-slate-400")}>{m.p2}</span>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">
                                  {m.p2[0]}
                                </div>
                              </div>
                            </div>
                            {m.status === 'finished' ? (
                              <div className="pt-3 border-t border-slate-50 flex justify-center">
                                <div className="bg-brand-primary/5 text-brand-primary px-4 py-1.5 rounded-xl text-xs font-black tabular-nums tracking-widest">
                                  {m.score}
                                </div>
                              </div>
                            ) : (
                              <div className="pt-3 border-t border-slate-50 flex justify-center">
                                <div className="bg-slate-50 text-slate-300 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                  待开始
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-white border-t border-slate-100">
                <button 
                  onClick={() => setShowRoundTable(false)}
                  className="w-full py-4 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-900/10 active:scale-95 transition-all"
                  style={{ backgroundColor: '#1FC47F' }}
                >
                  返回小组榜单
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Team Schedule Popup */}
      <AnimatePresence>
        {showTeamSchedule && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTeamSchedule(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-50 w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]"
            >
              <div className="p-8 bg-white border-b border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedTeam} 赛程</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                      全部比赛场次
                    </p>
                  </div>
                  <button onClick={() => setShowTeamSchedule(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 active:scale-90 transition-all">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                {[
                  { round: '小组赛 第1轮', opponent: '友巨集团', score: '3:2', status: 'finished', time: '8/15 09:00', court: '场地1' },
                  { round: '小组赛 第2轮', opponent: '厦门大学', score: '3:2', status: 'finished', time: '8/15 14:00', court: '场地1' },
                  { round: '小组赛 第3轮', opponent: '集美大学', score: '0:0', status: 'upcoming', time: '8/16 09:00', court: '场地1' },
                ].map((m, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{m.round}</span>
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-full",
                        m.status === 'finished' ? "bg-slate-100 text-slate-400" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {m.status === 'finished' ? '已结束' : '待开始'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{selectedTeam}</span>
                        <span className="text-[10px] text-slate-400 mt-1">{m.time} | {m.court}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-black text-brand-primary">{m.status === 'finished' ? m.score : 'VS'}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-800">{m.opponent}</span>
                        <span className="text-[10px] text-slate-400 mt-1">对手</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-white border-t border-slate-100">
                <button 
                  onClick={() => setShowTeamSchedule(false)}
                  className="w-full py-4 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-900/10 active:scale-95 transition-all"
                  style={{ backgroundColor: '#1FC47F' }}
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Member Join Page (Simulating scanning a QR code from an invitation poster)
const MemberJoinPage: React.FC<{
  team: TeamInfo;
  tournament: Tournament;
  onBack: () => void;
  onSuccess: () => void;
}> = ({ team, tournament, onBack, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '张小凡',
    phone: '13812345678',
    idType: 'ID_CARD' as IDType,
    idNumber: '350101199505201234',
    gender: 'MALE' as Gender,
    birthDate: '1995-05-20',
    clothingSize: 'L' as ClothingSize
  });
  const [isSigned, setIsSigned] = useState(false);

  // Calculate current team stats
  const maleCount = team.members.filter(m => m.gender === 'MALE').length;
  const femaleCount = team.members.filter(m => m.gender === 'FEMALE').length;
  const totalCount = team.members.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSigned) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setShowSuccess(true);
      // We don't call onSuccess() yet so user can see their place in the team
    }, 1200);
  };

  const renderTeamDashboard = (isPostJoin: boolean = false) => {
    const displayMembers = isPostJoin 
      ? [...team.members, { ...formData, photo: '' }] as ParticipantInfo[]
      : team.members;
    
    const dMaleCount = isPostJoin ? (formData.gender === 'MALE' ? maleCount + 1 : maleCount) : maleCount;
    const dFemaleCount = isPostJoin ? (formData.gender === 'FEMALE' ? femaleCount + 1 : femaleCount) : femaleCount;
    const dTotalCount = isPostJoin ? totalCount + 1 : totalCount;

    return (
      <div className="space-y-4">
        {/* Tournament & Team Main Card */}
        <div className="bg-white rounded-[32px] p-6 card-shadow border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-y-12 translate-x-12 blur-3xl opacity-50" />
          
          <div className="flex items-center gap-4 mb-6 relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-50 flex-shrink-0">
              <img src={team.logo || "https://picsum.photos/seed/team/200/200"} alt={team.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-slate-900 truncate mb-1">{team.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full uppercase tracking-wider italic">
                  {team.shortName || "Mixed Team"}
                </span>
                <span className="text-[10px] font-bold text-brand-primary">#{tournament.id === '6' ? '同心杯' : '团体赛'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-[24px] border border-slate-100/50 mb-6 group transition-colors hover:bg-white hover:border-brand-primary/20">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">正在报名赛事</p>
            <p className="text-xs font-black text-slate-900 leading-snug">{tournament.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50/50 rounded-[24px] border border-blue-100/50">
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">报名组别</p>
              <p className="text-xs font-black text-blue-600 truncate">
                {tournament.id === '6' ? '甲组混合团体赛' : (tournament.categories[0]?.name || '默认组别')}
              </p>
            </div>
            <div className="p-4 bg-emerald-50/50 rounded-[24px] border border-emerald-100/50">
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">当前领队</p>
              <p className="text-xs font-black text-emerald-600 truncate">{team.leader?.name || "未设置"}</p>
            </div>
          </div>
        </div>

        {/* Stats Dashboard - Compact Version */}
        <div className="bg-slate-900 rounded-[24px] p-5 text-white card-shadow relative overflow-hidden">
           <div className="absolute bottom-0 right-0 w-20 h-20 bg-brand-primary/10 rounded-full blur-2xl translate-y-8 translate-x-8" />
           
           <div className="flex justify-between items-center relative z-10">
             <div className="flex items-center gap-4">
               <div className="flex flex-col">
                 <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.2em] mb-0.5">已报名</p>
                 <div className="flex items-baseline gap-1">
                   <span className="text-2xl font-black text-brand-primary">{dTotalCount}</span>
                   <span className="text-[10px] font-black opacity-30">/ 8</span>
                 </div>
               </div>
               <div className="h-8 w-px bg-white/10 mx-1" />
               <div className="flex gap-4">
                 <div className="text-center">
                    <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-0.5">男</p>
                    <p className="text-xs font-black">{dMaleCount}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-0.5">女</p>
                    <p className="text-xs font-black">{dFemaleCount}</p>
                 </div>
               </div>
             </div>

             <div className="flex-1 max-w-[100px] ml-4">
               {/* Small Dynamic Progress Indicator */}
               <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5 mb-1">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(dTotalCount / 8) * 100}%` }}
                   className="h-full bg-brand-primary rounded-full"
                 />
               </div>
               <p className="text-[7px] font-bold opacity-30 text-right uppercase tracking-tighter">Capacity</p>
             </div>
           </div>
           
           {tournament.id === '6' && (
             <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-[8px] font-bold opacity-30 flex items-center gap-1">
                  <Info size={10} /> 组委会建议包含 3 名女性队员以满足要求
                </p>
             </div>
           )}
        </div>

        {/* Member Grid */}
        <div className="bg-white rounded-[32px] p-6 card-shadow border border-slate-100">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">已报名队员</h3>
             <span className="text-[10px] font-black text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded-full">
               {totalCount} / 32 限额
             </span>
           </div>
           
           <div className="grid grid-cols-4 gap-y-6 gap-2">
             {displayMembers.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group transition-all">
                  <div className="w-12 h-12 rounded-full ring-2 ring-white ring-offset-2 ring-offset-slate-50 overflow-hidden shadow-sm relative group-hover:scale-105 active:scale-95 transition-all">
                    <img 
                      src={m.photo || `https://picsum.photos/seed/${m.name}/100/100`} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-t opacity-40",
                      m.gender === 'MALE' ? "from-blue-500" : "from-pink-500"
                    )} />
                    <div className={cn(
                      "absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-black text-white",
                      m.gender === 'MALE' ? "bg-blue-500" : "bg-pink-500"
                    )}>
                      {m.gender === 'MALE' ? 'M' : 'F'}
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-slate-600 truncate w-full text-center group-hover:text-brand-primary transition-colors">
                    {m.name}
                  </span>
                </div>
             ))}
             {displayMembers.length < 8 && (
               <div className="flex flex-col items-center gap-2 animate-pulse">
                 <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                   <Plus size={16} />
                 </div>
                 <span className="text-[9px] font-bold text-slate-300 uppercase">Wait</span>
               </div>
             )}
           </div>
        </div>
      </div>
    );
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Animated Success Banner */}
        <div className="bg-white pt-12 pb-8 px-6 text-center border-b border-slate-100 flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-green-500 opacity-[0.02]" />
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-20 h-20 bg-emerald-500 rounded-[24px] shadow-2xl shadow-emerald-200 flex items-center justify-center mb-4 text-white relative z-10"
          >
            <Check size={40} strokeWidth={4} />
          </motion.div>
          <h2 className="text-2xl font-black text-slate-900 mb-1 relative z-10 tracking-tight">报名提交成功!</h2>
          <p className="text-xs font-bold text-slate-400 relative z-10">您的信息已入库，欢迎加入团队</p>
        </div>
        
        <div className="p-4 flex-1 space-y-4">
           <div className="px-2 pt-2">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">加入后的队伍动态</h3>
           </div>
           
           {renderTeamDashboard(true)}

           <div className="py-8">
             <button
               onClick={onBack}
               className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black shadow-2xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-3"
             >
               <HomeIcon size={18} /> 返回赛事首页
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6 flex items-center gap-4 border-b border-slate-100 sticky top-0 z-50">
        <button 
          onClick={showForm ? () => setShowForm(false) : onBack} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={24} className="text-slate-400" />
        </button>
        <div>
          <h1 className="text-lg font-black text-slate-900 leading-none mb-1">
            {showForm ? '填写个人报名表' : '加入队伍'}
          </h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-wider">STEP {showForm ? '02' : '01'} / COMPLETE</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {!showForm ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
             {renderTeamDashboard(false)}

             <div className="pt-6">
                <button 
                  onClick={() => setShowForm(true)}
                  className="w-full py-5 bg-brand-primary text-white rounded-[24px] font-black shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3 group active:scale-95 transition-all text-sm"
                >
                  我要报名
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[32px] p-6 card-shadow border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                 <FileText size={18} />
               </div>
               <div>
                 <h3 className="text-base font-black text-slate-900 leading-tight">完善个人基础信息</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">请准确填写以下字段以完成入队</p>
               </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-4">
                 <div className="space-y-1.5 px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      真实姓名 <Star size={6} className="text-red-400 fill-red-400" />
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="例：张晓凡"
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2x border border-transparent focus:ring-4 focus:ring-brand-primary/5 focus:bg-white focus:border-brand-primary/10 rounded-[20px] text-sm font-black transition-all"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4 px-1">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">性别</label>
                      <div className="flex bg-slate-50 rounded-[20px] p-1.5 border border-slate-100">
                        {(['MALE', 'FEMALE'] as Gender[]).map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: g })}
                            className={cn(
                              "flex-1 py-2.5 rounded-[15px] text-[10px] font-black transition-all",
                              formData.gender === g ? "bg-white text-brand-primary shadow-sm ring-1 ring-slate-100" : "text-slate-400"
                            )}
                          >
                            {g === 'MALE' ? '男' : '女'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">上衣尺码</label>
                      <div className="relative">
                        <select
                          value={formData.clothingSize}
                          onChange={e => setFormData({ ...formData, clothingSize: e.target.value as ClothingSize })}
                          className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-[20px] text-xs font-black appearance-none focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                        >
                          {['S', 'M', 'L', 'XL', '2XL', '3XL'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                 </div>

                 <div className="space-y-1.5 px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">出生日期</label>
                    <input
                      required
                      type="date"
                      value={formData.birthDate}
                      onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-[20px] text-sm font-black focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    />
                 </div>

                 <div className="space-y-1.5 px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">联系电话</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="请输入手机号码"
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-[20px] text-sm font-black focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none"
                    />
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">签署参赛承诺书</label>
                      <div className="h-32 bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-200 relative group active:bg-slate-100 transition-colors">
                        {isSigned ? (
                          <div className="absolute inset-0 flex items-center justify-center text-slate-900 font-serif italic text-2xl animate-in fade-in zoom-in duration-300">
                            {formData.name}
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-1 opacity-50">
                            <Pencil size={24} />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">TOUCH TO SIGN</span>
                          </div>
                        )}
                        <button 
                          type="button"
                          onClick={() => setIsSigned(true)}
                          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                        />
                      </div>
                    </div>
                 </div>
               </div>

               <button
                  type="submit"
                  disabled={isSubmitting || !isSigned}
                  className={cn(
                    "w-full py-5 rounded-[24px] font-black transition-all flex items-center justify-center gap-3 text-sm mt-8 shadow-xl",
                    isSigned 
                      ? "bg-brand-primary text-white shadow-brand-primary/20" 
                      : "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>确认个人信息，提交报名 <ArrowUpRight size={18} /></>
                  )}
               </button>
               
               {!isSigned && (
                 <p className="text-[9px] text-center text-amber-500 font-bold uppercase tracking-wider animate-bounce">
                    * 请先点击上方虚线框完成电子签名
                 </p>
               )}
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSport, setSelectedSport] = useState('羽毛球');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationRole, setRegistrationRole] = useState<'individual' | 'leader'>('individual');
  const [isBookingVenue, setIsBookingVenue] = useState(false);
  const [selectedVenueForBooking, setSelectedVenueForBooking] = useState<Venue | null>(null);
  const [isShowingActivities, setIsShowingActivities] = useState(false);
  const [isShowingPartners, setIsShowingPartners] = useState(false);
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [selectedTeamForJoin, setSelectedTeamForJoin] = useState<TeamInfo | null>(null);
  
  // User Profile State (Simulating persistence)
  const [userProfile, setUserProfile] = useState<ParticipantInfo | null>({
    name: '张伟',
    phone: '13812348888',
    idType: 'ID_CARD',
    idNumber: '350203199001011234',
    gender: 'MALE',
    birthDate: '1990-01-01',
    clothingSize: 'L',
    address: '厦门市思明区体育中心',
    tags: [],
    position: '职员',
    isLeader: false
  });

  const handleSaveProfile = (profile: ParticipantInfo) => {
    setUserProfile(profile);
  };

  const renderContent = () => {
    if (isJoiningTeam && selectedTeamForJoin && selectedTournament) {
      return (
        <MemberJoinPage
          team={selectedTeamForJoin}
          tournament={selectedTournament}
          onBack={() => {
            setIsJoiningTeam(false);
            setSelectedTeamForJoin(null);
            setSelectedTournament(null);
          }}
          onSuccess={() => {
            // In a real app, we'd update state here
          }}
        />
      );
    }

    if (isShowingActivities) {
      return (
        <TournamentActivitiesPage 
          onBack={() => setIsShowingActivities(false)} 
          onSelectTournament={(t) => {
            setSelectedTournament(t);
            setIsShowingActivities(false);
          }} 
        />
      );
    }

    if (isShowingPartners) {
      return <PartnerMatchmakingPage onBack={() => setIsShowingPartners(false)} />;
    }

    if (isBookingVenue) {
      return (
        <VenueBookingPage 
          onBack={() => {
            setIsBookingVenue(false);
            setSelectedVenueForBooking(null);
          }} 
          initialVenue={selectedVenueForBooking}
        />
      );
    }

    if (isRegistering && selectedTournament) {
      if (selectedTournament.status === 'ongoing') {
        return (
          <TournamentLiveView 
            tournament={selectedTournament} 
            onBack={() => setIsRegistering(false)} 
          />
        );
      }
      
      if (selectedTournament.id === '6') {
        return (
          <MemberJoinPage
            team={MOCK_TEAMS.find(t => t.id === 't2')!}
            tournament={selectedTournament}
            onBack={() => setIsRegistering(false)}
            onSuccess={() => setIsRegistering(false)}
          />
        );
      }

      return (
        <RegistrationPage 
          tournament={selectedTournament} 
          onBack={() => setIsRegistering(false)} 
          userProfile={userProfile}
          onSaveProfile={handleSaveProfile}
          initialRole={registrationRole}
        />
      );
    }

    if (selectedTournament) {
      return (
        <TournamentDetailPage 
          tournament={selectedTournament} 
          onBack={() => setSelectedTournament(null)} 
          onRegister={(role) => {
            setRegistrationRole(role || 'individual');
            setIsRegistering(true);
          }}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomePage 
            onSelectTournament={setSelectedTournament} 
            onBookingVenue={() => setIsBookingVenue(true)} 
            onShowActivities={() => setActiveTab('tournament')}
            onShowPartners={() => setActiveTab('play')}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
          />
        );
      case 'tournament':
        return (
          <TournamentActivitiesPage 
            onBack={() => setActiveTab('home')} 
            onSelectTournament={setSelectedTournament} 
          />
        );
      case 'play':
        return (
          <div className="relative h-full">
            <PlayPage 
              onBack={() => setActiveTab('home')}
              onBookingVenue={(venue) => {
                if (venue) {
                  setSelectedVenueForBooking(venue);
                }
                setIsBookingVenue(true);
              }}
            />
            
            {/* Simulation Entry Point for "Join via Invite" */}
            <div className="fixed bottom-24 right-4 z-20">
              <button
                onClick={() => {
                  setSelectedTournament(MOCK_TOURNAMENTS.find(t => t.id === '6') || null);
                  setSelectedTeamForJoin(MOCK_TEAMS.find(t => t.id === 't2') || null);
                  setIsJoiningTeam(true);
                }}
                className="w-14 h-14 bg-slate-900 text-white rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-white"
              >
                <QrCode size={20} />
                <span className="text-[8px] font-black mt-0.5">扫码加入</span>
              </button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <ProfilePage 
            userProfile={userProfile} 
            onUpdateProfile={handleSaveProfile} 
            onSelectTournament={setSelectedTournament}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[80vh] text-slate-400">
            <Trophy size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">功能开发中...</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-50 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTournament ? (isRegistering ? 'reg' : 'detail') : activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
      
      {!selectedTournament && !isRegistering && !isBookingVenue && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
}
