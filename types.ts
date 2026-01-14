
export interface SiteTheme {
  background: string;
  surface: string;
  primary: string;
  accent: string;
}

export interface AssetVaultItem {
  id: string;
  url: string;
  timestamp: number;
  label: string;
}

export interface PortfolioItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
}

export interface EnterpriseSection {
  id: string;
  title: string;
  subtitle: string;
  items: PortfolioItem[];
}

export interface RosterItem {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  isrc?: string;
  upc?: string;
  label?: string;
  publisher?: string;
  releaseTitle?: string;
  releaseDate?: string;
  catalogNumber?: string;
  genre?: string;
  explicit?: boolean;
  territories?: string;
  rightsNotes?: string;
  publishingSplits?: string;
}

export interface SiteData {
  theme: SiteTheme;
  adminPassword?: string;
  spotifyPlaylistId?: string;
  activeAudioSource?: 'archive' | 'stream';
  visualDirectives?: Record<string, string>;
  assetLibrary?: AssetVaultItem[];
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    image: string;
  };
  vision: {
    title: string;
    paragraphs: string[];
    image: string;
  };
  enterpriseSections: EnterpriseSection[];
  roster: RosterItem[];
  newsletter: {
    title: string;
    subtitle: string;
    buttonText: string;
    image: string;
    subscribers?: Array<{ name: string; email: string; timestamp: number }>;
  };
  customSections: CustomSection[];
  catalog: AudioTrack[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
