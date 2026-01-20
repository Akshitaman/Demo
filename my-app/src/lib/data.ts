
import { Activity } from "react-activity-calendar";

export const USER_PROFILE = {
    name: "User Name",
    role: "Full Stack Developer",
    location: "San Francisco, CA",
    website: "website.com",
    joinDate: "January 2024"
};

export const USER_STATS = {
    currentStreak: 12,
    longestStreak: 34,
    totalContributions: 1234
};

export const TOPICS = [
    { 
        id: 1, 
        name: 'DSA', 
        confidence: 4,
        subTopics: [
            { name: 'Arrays & Strings', confidence: 5 },
            { name: 'Linked Lists', confidence: 4 },
            { name: 'Trees & Graphs', confidence: 3 },
            { name: 'Dynamic Programming', confidence: 2 },
            { name: 'System Design', confidence: 3 }
        ]
    },
    { 
        id: 2, 
        name: 'System Design', 
        confidence: 3,
        subTopics: [
            { name: 'Load Balancing', confidence: 4 },
            { name: 'Caching', confidence: 3 },
            { name: 'Database Sharding', confidence: 2 },
            { name: 'CAP Theorem', confidence: 5 },
            { name: 'API Design', confidence: 4 }
        ]
    },
    { 
        id: 3, 
        name: 'React', 
        confidence: 5,
        subTopics: [
            { name: 'Hooks', confidence: 5 },
            { name: 'Context API', confidence: 5 },
            { name: 'Redux / Zustand', confidence: 4 },
            { name: 'Performance Optimization', confidence: 3 },
            { name: 'Server Components', confidence: 4 }
        ]
    },
    { 
        id: 4, 
        name: 'Next.js', 
        confidence: 2,
        subTopics: [
            { name: 'Routing', confidence: 4 },
            { name: 'Server Actions', confidence: 2 },
            { name: 'Middleware', confidence: 1 },
            { name: 'Data Fetching', confidence: 3 }
        ]
    },
    { 
        id: 5, 
        name: 'TypeScript', 
        confidence: 4,
        subTopics: [
            { name: 'Interfaces vs Types', confidence: 5 },
            { name: 'Generics', confidence: 3 },
            { name: 'Utility Types', confidence: 4 },
            { name: 'Configuration', confidence: 4 }
        ]
    },
];

export const generateContributionData = (): Activity[] => {
    const data: Activity[] = [];
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
        const count = Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0;
        data.push({
            date: d.toISOString().split('T')[0],
            count: count,
            level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 9 ? 3 : 4
        });
    }
    return data;
};
