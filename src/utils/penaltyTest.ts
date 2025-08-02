// Test script để kiểm tra penalty system
export const testPenaltySystem = () => {
    console.log('🧪 Testing Penalty System...');

    // Test case 1: Health chưa hoàn thành
    const testCase1 = {
        healthMetric: 'Nồng độ oxy',
        targetHours: 8,
        cigarettesSmoked: 3,
        expectedPenalty: 3,
        expectedNewTarget: 11
    };

    // Test case 2: Health đã hoàn thành
    const testCase2 = {
        healthMetric: 'Nhịp tim',
        targetHours: 0.33, // 20 phút
        cigarettesSmoked: 1,
        expectedPenalty: 1,
        expectedRegression: true
    };

    // Test case 3: Giới hạn thời gian
    const testCase3 = {
        healthMetric: 'Nhịp tim',
        targetHours: 0.33, // 20 phút
        cigarettesSmoked: 10,
        expectedPenalty: 0.33, // Không vượt quá thời gian gốc
        expectedNewTarget: 0.66
    };

    console.log('✅ Test cases defined:');
    console.log('Case 1:', testCase1);
    console.log('Case 2:', testCase2);
    console.log('Case 3:', testCase3);

    return {
        testCase1,
        testCase2,
        testCase3
    };
};

// Helper function để tính penalty
export const calculatePenalty = (cigarettesSmoked: number, targetHours: number) => {
    const penaltyHours = cigarettesSmoked * 1.0; // 1 điếu = 1 giờ
    const maxPenaltyHours = targetHours; // Không vượt quá thời gian gốc
    const actualPenaltyHours = Math.min(penaltyHours, maxPenaltyHours);

    return {
        penaltyHours,
        maxPenaltyHours,
        actualPenaltyHours,
        newTargetHours: targetHours + actualPenaltyHours
    };
};

// Test penalty calculation
export const runPenaltyTests = () => {
    console.log('🚀 Running Penalty Tests...');

    const tests = [
        { cigarettes: 3, targetHours: 8, description: 'Nồng độ oxy - 3 điếu' },
        { cigarettes: 1, targetHours: 0.33, description: 'Nhịp tim - 1 điếu' },
        { cigarettes: 10, targetHours: 0.33, description: 'Nhịp tim - 10 điếu (giới hạn)' },
        { cigarettes: 0, targetHours: 8, description: 'Không hút thuốc' }
    ];

    tests.forEach(test => {
        const result = calculatePenalty(test.cigarettes, test.targetHours);
        console.log(`📊 ${test.description}:`, result);
    });

    console.log('✅ Penalty tests completed!');
}; 