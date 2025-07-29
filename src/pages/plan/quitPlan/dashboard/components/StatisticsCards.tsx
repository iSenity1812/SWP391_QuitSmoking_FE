import { motion } from "framer-motion";
import { TrendingUp, Users, HeartHandshake } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CravingStats {
  totalCravings: number;
  commonSituations: { situation: string; count: number }[];
  commonCompanions: { companion: string; count: number }[];
}

interface MoodStats {
  totalMoodRecords: number;
  commonMoods: { mood: string; count: number }[];
}

interface StatisticsCardsProps {
  cravingStats: CravingStats;
  moodStats: MoodStats;
  isCravingStatsLoading: boolean;
  isMoodStatsLoading: boolean;
}

export function StatisticsCards({
  cravingStats,
  moodStats,
  isCravingStatsLoading,
  isMoodStatsLoading,
}: StatisticsCardsProps) {
  const getMoodAdvice = (moodVietnamese: string) => {
    const moodMap: Record<string, string> = {
      "căng thẳng": "STRESSED",
      "chán nản": "BORED",
      "lo lắng": "ANXIOUS",
      "tức giận": "ANGRY",
      "buồn bã": "SAD",
      vui: "HAPPY",
      "thư giãn": "RELAXED",
      "khó chịu": "ANNOYED",
      "trầm cảm": "DEPRESSED",
      "thất vọng": "DISSAPOINTED",
      "nản lòng": "DISCOURAGED",
      "xuống tinh thần": "DOWN",
      "bực bội": "FRUSTATED",
      đói: "HUNGRY",
      "cô đơn": "LONELY",
      "mệt mỏi": "TIRED",
      "không thoải mái": "UNCOMFORTABLE",
      "không vui": "UNHAPPY",
      "không hài lòng": "UNSATISFIED",
      buồn: "UPSET",
      "phấn khích": "EXCITED",
      "lo âu": "WORRIED",
      "rất vui": "VERY_HAPPY",
      "rất buồn": "VERY_SAD",
      "bình thường": "NEUTRAL",
      "bình tĩnh": "CALM",
      "yên bình": "PEACEFUL",
      "tự tin": "CONFIDENT",
      "hy vọng": "HOPEFUL",
      "hài lòng": "CONTENT",
      "có động lực": "MOTIVATED",
      "tràn đầy năng lượng": "ENERGETIC",
    };

    const englishMood = moodMap[moodVietnamese.toLowerCase()];

    if (
      [
        "HAPPY",
        "VERY_HAPPY",
        "EXCITED",
        "RELAXED",
        "PEACEFUL",
        "CONFIDENT",
        "HOPEFUL",
        "CONTENT",
        "MOTIVATED",
        "ENERGETIC",
        "CALM",
      ].includes(englishMood)
    ) {
      return `Tuyệt vời! Tâm trạng này rất tích cực. Hãy duy trì những hoạt động và môi trường tạo ra cảm giác này để hỗ trợ hành trình cai thuốc.`;
    }

    if (
      ["STRESSED", "ANXIOUS", "WORRIED", "FRUSTRATED"].includes(englishMood)
    ) {
      return `Điều này có thể sẽ tăng cảm giác thèm thuốc. Hãy thử các kỹ thuật thở sâu, thiền, hoặc tập thể dục nhẹ để giảm cảm giác này nhé.`;
    }

    if (
      [
        "SAD",
        "VERY_SAD",
        "DEPRESSED",
        "DISAPPOINTED",
        "DISCOURAGED",
        "DOWN",
        "UNHAPPY",
      ].includes(englishMood)
    ) {
      return `Khi cảm thấy ${moodVietnamese}, bạn có thể dễ tìm đến thuốc lá. Hãy liên hệ với bạn bè, gia đình hoặc tham gia hoạt động yêu thích để cải thiện tâm trạng.`;
    }

    if (["ANGRY", "ANNOYED", "UPSET"].includes(englishMood)) {
      return `Cảm giác này có thể khiến bạn muốn hút thuốc để "bình tĩnh". Thay vào đó, hãy thử đi bộ, nghe nhạc, hoặc viết nhật ký để xử lý cảm xúc.`;
    }

    if (
      ["TIRED", "HUNGRY", "UNCOMFORTABLE", "UNSATISFIED"].includes(englishMood)
    ) {
      return `Điều này có thể tạo ra cảm giác muốn "thưởng thuốc lá" cho bản thân. Hãy cố gắng chăm sóc bản thân: nghỉ ngơi đủ, ăn uống đều đặn.`;
    }

    if (["LONELY", "BORED"].includes(englishMood)) {
      return `Khi ${moodVietnamese}, thuốc lá có thể trở thành "bạn đồng hành". Hãy tìm kiếm kết nối xã hội, tham gia sở thích mới hoặc gọi điện cho người thân.`;
    }

    if (englishMood === "NEUTRAL") {
      return `Tâm trạng này là điều tốt - bạn đang ở trạng thái cân bằng. Đây là thời điểm tuyệt vời để xây dựng thói quen tích cực thay thế thuốc lá.`;
    }

    return `Mỗi tâm trạng đều ảnh hưởng đến việc cai thuốc. Hãy ghi nhận cảm xúc của bạn và tìm những cách lành mạnh để đối phó thay vì dùng thuốc lá.`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      {/* Craving Situations Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Thống Kê Tác Nhân & Hoạt Động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 flex flex-col justify-around">
              {isCravingStatsLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Đang tải dữ liệu thống kê...
                </div>
              ) : (
                <>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Tác nhân phổ biến nhất:
                  </h4>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {cravingStats.commonSituations.map((item) => (
                      <div
                        key={item.situation}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{item.situation}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{
                                width:
                                  cravingStats.totalCravings > 0
                                    ? `${
                                        (item.count /
                                          cravingStats.totalCravings) *
                                        100
                                      }%`
                                    : "0%",
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-700">
                      💡 <strong>Gợi ý:</strong>{" "}
                      {cravingStats.commonSituations[0]?.count > 0 ? (
                        <>
                          Bạn thường hút/thèm thuốc nhất khi{" "}
                          <span className="font-bold bg-orange-200 px-2 py-1 rounded-md text-orange-800">
                            {cravingStats.commonSituations[0].situation.toLowerCase()}
                          </span>
                          . Hãy tránh hoặc chuẩn bị chiến lược đối phó với tình
                          huống này.
                        </>
                      ) : (
                        "Chưa có đủ dữ liệu để đưa ra gợi ý. Hãy tiếp tục ghi nhận để nhận được phân tích cá nhân hóa."
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Social Context Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Bối Cảnh Xã Hội
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 flex flex-col justify-around">
              {isCravingStatsLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Đang tải dữ liệu thống kê...
                </div>
              ) : (
                <>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Hoạt động theo bối cảnh:
                  </h4>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {cravingStats.commonCompanions.map((item) => (
                      <div
                        key={item.companion}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{item.companion}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{
                                width:
                                  cravingStats.totalCravings > 0
                                    ? `${
                                        (item.count /
                                          cravingStats.totalCravings) *
                                        100
                                      }%`
                                    : "0%",
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Gợi ý:</strong>{" "}
                      {cravingStats.commonCompanions[0]?.count > 0 ? (
                        <>
                          Bạn thường hút/thèm thuốc nhất khi{" "}
                          <span className="font-bold bg-blue-200 px-2 py-1 rounded-md text-blue-800">
                            {cravingStats.commonCompanions[0].companion.toLowerCase()}
                          </span>
                          . Hãy chuẩn bị kế hoạch để đối phó với tình huống này.
                        </>
                      ) : (
                        "Chưa có đủ dữ liệu để đưa ra gợi ý. Hãy tiếp tục ghi nhận để nhận được phân tích cá nhân hóa."
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mood Statistics Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-700" />
              Thống Kê Tâm Trạng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 flex flex-col justify-around">
              {isMoodStatsLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Đang tải dữ liệu thống kê...
                </div>
              ) : (
                <>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Tâm trạng phổ biến nhất:
                  </h4>
                  <div className="max-h-[200px] overflow-y-auto space-y-2">
                    {moodStats.commonMoods.map((item) => (
                      <div
                        key={item.mood}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">{item.mood}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{
                                width:
                                  moodStats.totalMoodRecords > 0
                                    ? `${
                                        (item.count /
                                          moodStats.totalMoodRecords) *
                                        100
                                      }%`
                                    : "0%",
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      💡 <strong>Gợi ý:</strong>{" "}
                      {moodStats.commonMoods[0]?.count > 0
                        ? (() => {
                            const topMood =
                              moodStats.commonMoods[0].mood.toLowerCase();
                            return (
                              <>
                                Tâm trạng phổ biến nhất của bạn là{" "}
                                <span className="font-bold bg-green-200 px-2 py-1 rounded-md text-green-800">
                                  {topMood}
                                </span>
                                . {getMoodAdvice(topMood)}
                              </>
                            );
                          })()
                        : "Chưa có đủ dữ liệu về tâm trạng. Hãy tiếp tục ghi nhận để theo dõi sự thay đổi tâm trạng trong hành trình cai thuốc."}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
