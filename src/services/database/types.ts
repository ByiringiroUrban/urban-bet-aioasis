
import { ObjectId } from 'mongodb';

export interface BetRecord {
  id: string;
  userId: string;
  items: {
    event: string;
    selection: string;
    odds: number;
  }[];
  totalOdds: number;
  amount: number;
  potentialWinnings: number;
  timestamp: string;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  currency?: 'USD' | 'RWF';
}

export interface UserData {
  id?: string;
  name?: string;
  email?: string;
  balance?: number;
  currency?: 'USD' | 'RWF';
  provider?: string;
  createdAt?: Date;
  lastLogin?: Date;
  _id?: ObjectId;
}

export interface AIprediction {
  id?: string;
  match: string;
  prediction: string;
  confidence: number;
  analysis: string;
  trend?: string;
  odds: string;
  userId?: string;
  _id?: ObjectId;
}

export interface SportEvent {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  date: string;
  homeOdds: number;
  drawOdds?: number;
  awayOdds: number;
  isLive?: boolean;
}

export interface Market {
  id: string;
  name: string;
  options: string[];
  eventId?: string;
}
