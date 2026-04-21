import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TournamentCategory {
  id: string;
  name: string;
  ageGroups: string[];
  isDouble?: boolean;
  fee?: number;
  deposit?: number;
  maxParticipants?: number;
  currentParticipants?: number;
  requirements?: string;
}

export interface Tournament {
  id: string;
  title: string;
  regStartTime: string;
  regEndTime: string;
  matchStartTime: string;
  matchEndTime: string;
  location: string;
  status: 'registration' | 'scheduling' | 'ongoing' | 'finished';
  type: 'Individual' | 'Team' | 'Comprehensive';
  image: string;
  participants: number;
  description: string;
  contactPerson: string;
  contactPhone: string;
  wechatGroupQr?: string;
  documents: { name: string; url: string }[];
  categories: TournamentCategory[];
  fee?: number;
  allowMultiCategory?: boolean;
  maxParticipants?: number;
  organizer?: string;
}

export interface UniformInfo {
  frontImage: string;
  backImage: string;
  mainColor: string;
}

export interface TeamInfo {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  leader?: ParticipantInfo;
  coach?: string;
  members: ParticipantInfo[];
  uniforms?: UniformInfo[];
}

export interface SubMatch {
  id: string;
  category: string;
  player1: string;
  player2: string;
  score1: number[];
  score2: number[];
  status: 'live' | 'upcoming' | 'finished';
  winner?: 1 | 2;
}

export interface Match {
  id: string;
  tournamentId: string;
  player1: string;
  player2: string;
  score1: number[];
  score2: number[];
  status: 'live' | 'upcoming' | 'finished';
  court: string;
  time: string;
  category?: string;
  isWalkover?: boolean;
  winner?: 1 | 2;
  type?: 'Individual' | 'Team';
  subMatches?: SubMatch[];
  teamScore1?: number;
  teamScore2?: number;
  // Common fields used in UI
  date?: string;
  matchNum?: string;
  groupInfo?: string;
  pos1?: string;
  pos2?: string;
  setScore1?: number;
  setScore2?: number;
  startTime?: string;
  endTime?: string;
  duration?: string;
  isMyMatch?: boolean;
  // Team competition specific fields
  teamName1?: string;
  teamName2?: string;
  teamGroup1?: string;
  teamGroup2?: string;
  roundInfo?: string;
  matchCode?: string;
  matchNumber?: string;
  teamEvent?: string;
  totalTeamScore1?: string;
  totalTeamScore2?: string;
}

export type IDType = 
  | 'ID_CARD' // 中国居民身份证
  | 'HK_MACAU_RESIDENCE' // 港澳居民居住证
  | 'TAIWAN_RESIDENCE' // 台湾居民居住证
  | 'FOREIGNER_PERMANENT_RESIDENCE' // 外国人永久居留身份证
  | 'HK_MACAU_PERMIT' // 港澳居民来往内地通行证
  | 'TAIWAN_PERMIT' // 台湾居民来往大陆通行证
  | 'PASSPORT'; // 外国护照

export type Gender = 'MALE' | 'FEMALE';
export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '';

export interface ParticipantInfo {
  name: string;
  phone: string;
  idType: IDType;
  idNumber: string;
  gender: Gender;
  birthDate: string;
  clothingSize: ClothingSize;
  address?: string;
  idCard?: string;
  householdProof?: string;
  signature?: string;
  photo?: string;
  tags?: string[];
  position?: string;
  isLeader?: boolean;
}

export interface GameActivity {
  id: string;
  title: string;
  time: string;
  venueName: string;
  venueImage?: string;
  organizer: string;
  maleCount: number;
  femaleCount: number;
  maxParticipants: number;
  fee: number;
  status: 'registration' | 'full' | 'finished';
  type: string; // e.g. "进阶局", "新手局"
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  distance: string;
  price: number;
  image: string;
  tags: string[];
  lat: number;
  lng: number;
  courts: number;
  phone: string;
  facilities: string[];
  description: string;
  bookingType: 'platform' | 'mini-program' | 'phone';
  businessHours: string;
  activities?: GameActivity[];
}

export interface TimeSlot {
  time: string;
  price: number;
  status: 'available' | 'booked' | 'selected';
}

export interface PartnerRequest {
  id: string;
  user: {
    name: string;
    avatar: string;
    level: string;
  };
  title: string;
  time: string;
  location: string;
  currentPlayers: number;
  maxPlayers: number;
  description: string;
  tags: string[];
}
