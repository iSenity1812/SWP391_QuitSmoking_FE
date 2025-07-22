import React from 'react';

export const TestAchievement: React.FC = () => {
  const testAchievementToast = () => {
    console.log('[TestAchievement] Testing achievement toast manually');
    
    const mockAchievement = {
      achievementId: 1,
      name: "Test Achievement",
      description: "This is a test achievement for debugging",
      badgeImageUrl: "https://via.placeholder.com/64x64/4ade80/ffffff?text=TEST",
      category: "TEST",
      targetValue: 1,
      currentProgress: 1
    };

    const customEvent = new CustomEvent('achievement-unlocked', {
      detail: { achievement: mockAchievement }
    });

    console.log('[TestAchievement] Dispatching achievement-unlocked event:', customEvent);
    window.dispatchEvent(customEvent);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={testAchievementToast}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Test Achievement Toast
      </button>
    </div>
  );
};
