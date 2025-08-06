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
  hasRegressed?: boolean;
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
  const [processedMilestones, setProcessedMilestones] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Chỉ hiển thị những milestone mới (trong 24h gần đây)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const newMilestones = recentAchievements.filter(milestone => {
      const achievedDate = new Date(milestone.achievedDate);
      return achievedDate > oneDayAgo;
    });

    // Lọc ra những milestone chưa được xử lý
    const unprocessedMilestones = newMilestones.filter(milestone => 
      !processedMilestones.has(milestone.id)
    );

    setVisibleMilestones(unprocessedMilestones);

    // TẮT MILESTONE TOAST NOTIFICATIONS - COMMENT OUT
    // // Hiển thị toast cho milestone mới
    // unprocessedMilestones.forEach(milestone => {
    //   // Chỉ thông báo cho milestone mới hoàn thành hoặc đã từng tụt xuống và đạt lại 100%
    //   const isNewCompletion = !milestone.hasRegressed;
    //   const isRecovery = milestone.hasRegressed === false; // Đã từng tụt xuống và đạt lại 100%
      
    //   if (isNewCompletion || isRecovery) {
    //     const message = isRecovery 
    //       ? `🎉 Chúc mừng! ${milestone.displayName} (Đạt lại sau khi tụt xuống)`
    //       : `🎉 Chúc mừng! ${milestone.displayName}`;
          
    //     toast.success(message, {
    //       description: milestone.description,
    //       duration: 5000,
    //       action: {
    //         label: 'Xem chi tiết',
    //         onClick: () => {
    //           console.log('View milestone details:', milestone.id);
    //         }
    //       }
    //     });
    //   }
      
    //   // Đánh dấu milestone đã được xử lý
    //   setProcessedMilestones(prev => new Set([...prev, milestone.id]));
    // });
  }, [recentAchievements, processedMilestones]);

  // TẮT HEALTH MILESTONE NOTIFICATIONS - CHỈ GIỮ PROFILE ACHIEVEMENTS
  // if (visibleMilestones.length === 0) {
  //   return null;
  // }

  // return (
  //   <div className="space-y-2">
  //     {visibleMilestones.map((milestone) => {
  //       const isRecovery = milestone.hasRegressed === false;
        
  //       return (
  //         <Alert key={milestone.id} className="border-green-200 bg-green-50">
  //           <div className="flex items-start justify-between">
  //             <div className="flex items-start gap-3">
  //               <Award className="h-5 w-5 text-green-600 mt-0.5" />
  //               <div className="flex-1">
  //                 <AlertDescription className="text-green-800">
  //                   <strong>
  //                     🎉 {milestone.displayName}
  //                     {isRecovery && <span className="text-orange-600"> (Đạt lại)</span>}
  //                   </strong>
  //                   <br />
  //                   <span className="text-sm text-green-600">
  //                     {milestone.description}
  //                   </span>
  //                   <br />
  //                   <Badge variant="outline" className="mt-1 text-xs">
  //                     Hoàn thành {new Date(milestone.achievedDate).toLocaleDateString('vi-VN')}
  //                   </Badge>
  //                 </AlertDescription>
  //               </div>
  //             </div>
  //             {onDismiss && (
  //               <Button
  //                 variant="ghost"
  //                 size="sm"
  //                 onClick={() => onDismiss(milestone.id)}
  //                 className="text-green-600 hover:text-green-800"
  //               >
  //                 <X className="h-4 w-4" />
  //               </Button>
  //             )}
  //           </div>
  //         </Alert>
  //       );
  //     })}
  //   </div>
  // );
  
  // TẮT HOÀN TOÀN - RETURN NULL
  return null;
}; 