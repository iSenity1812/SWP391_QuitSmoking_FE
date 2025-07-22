import type { Situation, WithWhom } from "@/services/cravingTrackingService";
import type { Mood } from "@/services/dailySummaryService";

// Mapping for Vietnamese translation
const situationTranslations: Record<Situation, string> = {
    "AFTER_SEX": "Sau khi quan hệ",
    "AT_BAR": "Ở quán bar",
    "AT_PARTY": "Ở tiệc tùng",
    "AT_EVENT": "Ở sự kiện",
    "WORKING": "Khi làm việc",
    "BBQ": "BBQ/Nướng",
    "DRIVING": "Khi lái xe",
    "WATCHING_TV": "Xem TV",
    "ON_PHONE": "Khi gọi điện thoại",
    "ON_COMPUTER": "Khi dùng máy tính",
    "CANT_SLEEP": "Không ngủ được",
    "CHATITNG": "Khi trò chuyện",
    "CLEANING": "Khi dọn dẹp",
    "COOKING": "Khi nấu ăn",
    "DRINKING": "Khi uống rượu",
    "SITTING_ON_CAR": "Khi ngồi trên xe",
    "GAMING": "Khi chơi game",
    "THINKING": "Khi suy nghĩ",
    "GOING_TO_BED": "Trước khi đi ngủ",
    "HAIVNG_A_BREAK": "Khi nghỉ giải lao",
    "JUST_EATEN": "Sau khi ăn",
    "READING": "Khi đọc sách",
    "SHOPPING": "Khi mua sắm",
    "RELAXING": "Khi thư giãn",
    "WALKING": "Khi đi bộ",
    "WAITING": "Khi chờ đợi",
    "SOCIALIZING": "Khi giao lưu",
    "WAKING_UP": "Khi thức dậy",
    "WORK_BREAK": "Nghỉ giữa giờ làm",
    "OTHER": "Khác"
};

const withWhomTranslations: Record<WithWhom, string> = {
    "ALONE": "Một mình",
    "CLOSE_FRIEND": "Bạn thân",
    "FAMILY_MEMBER": "Thành viên gia đình",
    "PARTNER": "Đối tác/Người yêu",
    "COLLEAGUE": "Đồng nghiệp",
    "STRANGER": "Người lạ",
    "OTHER": "Khác"
};

const moodTranslations: Record<Mood, string> = {
    "STRESSED": "Căng thẳng",
    "BORED": "Chán nản",
    "ANXIOUS": "Lo lắng",
    "ANGRY": "Tức giận",
    "SAD": "Buồn",
    "HAPPY": "Vui vẻ",
    "RELAXED": "Thư giãn",
    "ANNOYED": "Khó chịu",
    "DEPRESSED": "Trầm cảm",
    "DISSAPOINTED": "Thất vọng",
    "DISCOURAGED": "Nản lòng",
    "DOWN": "Buồn bã",
    "FRUSTATED": "Thất vọng",
    "HUNGRY": "Đói",
    "LONELY": "Cô đơn",
    "TIRED": "Mệt mỏi",
    "UNCOMFORTABLE": "Không thoải mái",
    "UNHAPPY": "Không vui",
    "UNSATISFIED": "Không hài lòng",
    "UPSET": "Bực bội",
    "EXCITED": "Hứng thú",
    "WORRIED": "Lo âu",
    "OTHER": "Khác"
};

// Function to format enum labels (original logic)
export function formatEnumLabel(value: string): string {
    const keepUppercase = new Set(["TV", "BBQ", "ID", "CEO", "AI", "IT"]);

    return value
        .split("_")
        .map((word) => {
            if (keepUppercase.has(word)) return word;
            return word.charAt(0) + word.slice(1).toLowerCase();
        })
        .join(" ");
}

// Function to get Vietnamese translation
export function getVietnameseTranslation(value: Situation | WithWhom | Mood): string {
    // Handle Mood type specifically
    if (value in moodTranslations) {
        return moodTranslations[value as Mood];
    }

    // Handle Situation type
    if (value in situationTranslations) {
        return situationTranslations[value as Situation];
    }

    // Handle WithWhom type
    if (value in withWhomTranslations) {
        return withWhomTranslations[value as WithWhom];
    }

    // Debug log for unmatched values
    console.warn(`Translation not found for: ${value}`);

    // Fallback to formatted label
    return formatEnumLabel(value);
}

// Function to translate array of enums to Vietnamese
export function translateEnumsToVietnamese(values: (Situation | WithWhom | Mood)[]): string {
    if (!values || values.length === 0) {
        return "Không có";
    }

    return values.map(value => getVietnameseTranslation(value)).join(", ");
}
