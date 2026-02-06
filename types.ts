
export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export interface UserProfile {
  name: string;
  major: string;
  year: string;
  gpa: number;
  credits: number;
}

export interface TimetableEntry {
  id: number;
  startTime: string; 
  endTime: string;
  subject: string; 
  room: string; 
  occupancy: number; 
  prof: string;
  officeHours: string;
  type: string;
}

export interface Assignment {
  id: number;
  title: string;
  course: string;
  status: string;
  points: number | null;
  color: string;
}

export interface MarketplaceItem {
  id: number;
  title: string;
  price: number;
  seller: string;
  image: string;
  category: string;
  description: string;
}

export interface LostFoundItem {
  id: number;
  type: 'lost' | 'found';
  title: string;
  location: string;
  date: string;
  image: string;
  category: string;
  description: string;
  reporter: string;
}

export interface Material {
  id: number;
  name: string;
  size: string;
  type: string;
}

export interface MailSummary {
  summary: string;
  category: 'academic' | 'urgent' | 'events' | 'general';
  priority: 'low' | 'medium' | 'high';
  priorityScore: number;
  sentiment: string;
  deadline: string;
  actionRequired: boolean;
  relevanceReason: string;
}

export interface CampusAlert {
  id: string;
  title: string;
  content: string;
  type: 'maintenance' | 'emergency' | 'event';
  timestamp: string;
}
