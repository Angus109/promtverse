interface TruncateParams {
  text: string;
  startChars: number;
  endChars: number;
  maxLength: number;
}

interface Prompt {
  id: bigint;
  title: string;
  description: string;
  promptText: string;
  category: string;
  aiModel: string;
  imageUri: string;
  creator: string;
  price: number;
  createdAt: number;
  tags: string[];
}

interface Creator {
  id: string,
  creatorAddress: string;
  username: string;
  avatarUri: string;
  bio: string;
  specialties: string[];
  verified: boolean;
  followerCount: number;
  promptCount: number;
  totalEarnings: number;
  totalSales: number;
  ratingCount: number;
  totalRating: number;
  joinedDate: number;
}

interface CreatorDetails {
  creatorAddress: string;
  username: string;
  avatarUri: string;
  verified: boolean;
  followerCount: number;
  promptCount: number;
  totalEarnings: number;
  rating: number;
}

interface PromptDetails {
  id: number;
  title: string;
  imageUri: string;
  creator: string;
  price: number;
  category: string;
  aiModel: string;
  tags: string[],
  promtText: string,
  description: string,
}

// Utility functions
const truncate = ({ text, startChars, endChars, maxLength }: TruncateParams): string => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars);
    let end = text.substring(text.length - endChars, text.length);
    while (start.length + end.length < maxLength) {
      start = start + '.';
    }
    return start + end;
  }
  return text;
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dayOfWeek = daysOfWeek[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${dayOfWeek}, ${month} ${day}, ${year}`;
};

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Structure functions for the Prompt Marketplace
const structurePrompts = (prompts: any[]): Prompt[] => {
  return prompts.map(prompt => ({
    id: BigInt(prompt.id),
    title: prompt.title,
    description: prompt.description,
    promptText: prompt.promptText,
    category: prompt.category,
    aiModel: prompt.aiModel,
    imageUri: prompt.imageUri,
    creator: prompt.creator.toLowerCase(),
    price: Number(prompt.price),
    createdAt: Number(prompt.createdAt),
    tags: prompt.tags
  })).sort((a, b) => b.createdAt - a.createdAt);
};

const structureCreators = (creators: any[]): Creator[] => {
  let creatorCount = 1
  return creators.map(creator => ({
    id: `creator-${creatorCount++}`,
    creatorAddress: creator.creatorAddress.toLowerCase(),
    username: creator.username,
    avatarUri: creator.avatarUri,
    bio: creator.bio,
    specialties: creator.specialties,
    verified: creator.verified,
    followerCount: Number(creator.followerCount),
    promptCount: Number(creator.promptCount),
    totalEarnings: Number(creator.totalEarnings),
    totalSales: Number(creator.totalSales),
    ratingCount: Number(creator.ratingCount),
    totalRating: Number(creator.totalRating),
    joinedDate: Number(creator.joinedDate)
  })).sort((a, b) => b.joinedDate - a.joinedDate);
};

const structureCreatorDetails = (creators: any[]): CreatorDetails[] => {
  return creators.map(creator => ({
    creatorAddress: creator.creatorAddress.toLowerCase(),
    username: creator.username,
    avatarUri: creator.avatarUri,
    verified: creator.verified,
    followerCount: Number(creator.followerCount),
    promptCount: Number(creator.promptCount),
    totalEarnings: Number(creator.totalEarnings),
    rating: creator.ratingCount > 0 ? 
      Math.floor(Number(creator.totalRating) / Number(creator.ratingCount)) : 0
  }));
};

const structurePromptDetails = (prompts: any[]): PromptDetails[] => {
  let promtCount = 1
  return prompts.map(prompt => ({
    id: Number(prompt.id) || promtCount++,
    title: prompt.title,
    imageUri: prompt.imageUri,
    creator: prompt.creator.toLowerCase(),
    price: Number(prompt.price),
    category: prompt.category,
    aiModel: prompt.aiModel,
    description: prompt.description,
    tags: prompt.tags,
    promtText :prompt.promtText,

  })).sort((a, b) => b.id - a.id);
};

// Helper functions for the contract
const calculatePlatformFee = (amount: number): number => {
  return (amount * 1000) / 10000; // 1000 = 10% (10000 basis points = 100%)
};

const calculateCreatorEarnings = (amount: number): number => {
  return amount - calculatePlatformFee(amount);
};

const isFollowing = (followers: Record<string, boolean>, userAddress: string): boolean => {
  return followers[userAddress.toLowerCase()] || false;
};

export {
  truncate,
  formatDate,
  formatTimestamp,
  structurePrompts,
  structureCreators,
  structureCreatorDetails,
  structurePromptDetails,
  calculatePlatformFee,
  calculateCreatorEarnings,
  isFollowing
};

export type {
  TruncateParams,
  Prompt,
  Creator,
  CreatorDetails,
  PromptDetails
};