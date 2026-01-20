"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { 
    Calendar,
    Trophy,
    Flame,
    Github,
    X,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { USER_PROFILE, TOPICS, USER_STATS, generateContributionData } from '@/lib/data';

// Dynamically import ActivityCalendar to avoid SSR issues and type errors
const ActivityCalendar = dynamic(
    () => import('react-activity-calendar').then((mod: any) => mod.ActivityCalendar),
    { ssr: false }
) as any;

type Activity = {
    date: string;
    count: number;
    level: number;
};

export default function ProfilePage() {
    // Use state to hold data only after mount to prevent hydration mismatch
    const [contributionData, setContributionData] = useState<Activity[]>([]);
    const [mounted, setMounted] = useState(false);
    
    // Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: USER_PROFILE.name
    });
    const [editForm, setEditForm] = useState(profile);
    const [selectedTopic, setSelectedTopic] = useState<typeof TOPICS[0] | null>(null);

    useEffect(() => {
        setContributionData(generateContributionData());
        setMounted(true);
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditForm(profile); // Reset form on toggle
    };

    const handleSave = () => {
        setProfile(editForm);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm(profile);
    };

    if (!mounted) {
        return <div className="p-8">Loading profile...</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 relative">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

            {/* User Info Card */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary shrink-0">
                    {profile.name.charAt(0)}
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-2 w-full">
                    {isEditing ? (
                        <div className="space-y-3 max-w-md mx-auto md:mx-0 w-full">
                            <Input 
                                value={editForm.name} 
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                placeholder="Name"
                                className="text-lg font-bold"
                            />
                        </div>
                    ) : (
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                    )}
                    
                    {/* Topics Section */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4 pt-4 border-t border-border/50">
                        {TOPICS.map(topic => (
                            <div 
                                key={topic.id}
                                onClick={() => setSelectedTopic(topic)}
                                className="bg-muted/50 hover:bg-muted border border-border rounded-full px-4 py-1.5 text-sm flex items-center gap-2 cursor-pointer transition-colors"
                            >
                                <span className="font-medium">{topic.name}</span>
                                {topic.confidence > 0 && (
                                    <div className="flex items-center gap-0.5 ml-1" title={`Confidence: ${topic.confidence}/5`}>
                                        <span className="text-xs font-bold text-yellow-500">{topic.confidence}</span>
                                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave} className="gap-2">
                                Save Changes
                            </Button>
                            <Button variant="outline" onClick={handleCancel} className="gap-2">
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={handleEditToggle} className="gap-2">
                            <Github className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
                        <Flame className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                        <h3 className="text-2xl font-bold">{USER_STATS.currentStreak} Days</h3>
                        <p className="text-xs text-muted-foreground">Feb 18 - Mar 1</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500">
                        <Trophy className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Longest Streak</p>
                        <h3 className="text-2xl font-bold">{USER_STATS.longestStreak} Days</h3>
                        <p className="text-xs text-muted-foreground">Jan 1 - Feb 3</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                        <Calendar className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Contributions</p>
                        <h3 className="text-2xl font-bold">{USER_STATS.totalContributions.toLocaleString()}</h3>
                        <p className="text-xs text-muted-foreground">Last year</p>
                    </div>
                </div>
            </div>

            {/* Heatmap Section */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Contribution Activity</h3>
                    <select className="bg-background border border-border rounded-md text-sm px-3 py-1">
                        <option>2024</option>
                        <option>2023</option>
                    </select>
                </div>
                
                <div className="w-full overflow-x-auto pb-4">
                     <ActivityCalendar
                        data={contributionData}
                        colorScheme="dark"
                        theme={{
                            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                            dark: ['#161b22', '#0e2a47', '#004d7a', '#006eac', '#0096d6'],
                        }}
                        labels={{
                            legend: {
                                less: 'Less',
                                more: 'More',
                            },
                        }}
                        showWeekdayLabels
                        renderBlock={(block: any, activity: any) => 
                            React.cloneElement(block, {
                                'data-tooltip-id': 'react-tooltip',
                                'data-tooltip-content': `${activity.count} contributions on ${activity.date}`
                            })
                        }
                    />
                    <ReactTooltip id="react-tooltip" />
                </div>
            </div>

            {/* Topic Details Modal */}
            {selectedTopic && (
                <div 
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedTopic(null)}
                >
                    <div 
                        className="bg-card border border-border rounded-xl shadow-lg w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold">{selectedTopic.name}</h3>
                                <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                                    <span>Overall Confidence:</span>
                                    <div className="flex items-center gap-0.5">
                                        <span className="font-semibold text-yellow-500">{selectedTopic.confidence}</span>
                                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedTopic(null)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Topic Breakdown</h4>
                            <div className="space-y-3">
                                {selectedTopic.subTopics?.map((sub, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                                        <span className="font-medium">{sub.name}</span>
                                        <div className="flex items-center gap-1" title={`Confidence: ${sub.confidence}/5`}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star 
                                                    key={star} 
                                                    className={`h-4 w-4 ${
                                                        star <= sub.confidence 
                                                            ? 'fill-yellow-500 text-yellow-500' 
                                                            : 'text-muted-foreground/30'
                                                    }`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {(!selectedTopic.subTopics || selectedTopic.subTopics.length === 0) && (
                                    <p className="text-sm text-muted-foreground italic text-center py-4">No sub-topics available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
