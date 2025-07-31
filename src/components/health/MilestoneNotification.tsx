import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, X } from 'lucide-react';
import { toast } from 'sonner';

interface Milestone {
    id: string;
    displayName: string;
    achievedDate: string;
    description: string;
}

interface MilestoneNotificationProps {
    recentAchievements: Milestone[];
    onDismiss?: (milestoneId: string) => void;
}

export const MilestoneNotification: React.FC<MilestoneNotificationProps> = ({
    recentAchievements,
    onDismiss
}) => {
    const [visibleMilestones, setVisibleMilestones] = useState<Milestone[]>([]);

    useEffect(() => {
        // Chỉ hiển thị những milestone mới (trong 24h gần đây)
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const newMilestones = recentAchievements.filter(milestone => {
            const achievedDate = new Date(milestone.achievedDate);
            return achievedDate > oneDayAgo;
        });

        setVisibleMilestones(newMilestones);

        // Hiển thị toast cho milestone mới
        newMilestones.forEach(milestone => {
            toast.success(`🎉 Chúc mừng! ${milestone.displayName}`, {
                description: milestone.description,
                duration: 5000,
                action: {
                    label: 'Xem chi tiết',
                    onClick: () => {
                        // Có thể scroll đến milestone hoặc mở modal
                        console.log('View milestone details:', milestone.id);
                    }
                }
            });
        });
    }, [recentAchievements]);

    if (visibleMilestones.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2">
            {visibleMilestones.map((milestone) => (
                <Alert key={milestone.id} className="border-green-200 bg-green-50">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <Award className="h-5 w-5 text-green-600 mt-0.5" />
                            <div className="flex-1">
                                <AlertDescription className="text-green-800">
                                    <strong>🎉 {milestone.displayName}</strong>
                                    <br />
                                    <span className="text-sm text-green-600">
                                        {milestone.description}
                                    </span>
                                    <br />
                                    <Badge variant="outline" className="mt-1 text-xs">
                                        Hoàn thành {new Date(milestone.achievedDate).toLocaleDateString('vi-VN')}
                                    </Badge>
                                </AlertDescription>
                            </div>
                        </div>
                        {onDismiss && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDismiss(milestone.id)}
                                className="text-green-600 hover:text-green-800"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </Alert>
            ))}
        </div>
    );
}; 