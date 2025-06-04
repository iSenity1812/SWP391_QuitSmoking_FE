import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Plan {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    targetDate: Date;
    dailyCigarettes: number;
    motivation: string;
    cigaretteType: string;
}

interface PlanFormData {
    title: string;
    description: string;
    startDate: Date;
    targetDate: Date;
    dailyCigarettes: number;
    motivation: string;
    cigaretteType: string;
}

// Danh sách các loại thuốc lá phổ biến ở Việt Nam và giá tham khảo (VNĐ)
const cigarettePrices: { [key: string]: number } = {
    "Vinataba (mềm)": 25000,
    "Vinataba (đóng gói cứng)": 30000,
    "Thăng Long": 23000,
    "Marlboro (đỏ/trắng)": 35000,
    "555": 40000,
    "Esse": 30000,
    "Black Stone": 50000,
    "Captain Black": 60000,
    "Khác": 30000, // Giá mặc định nếu chọn "Khác"
};

export default function PlanPage() {
    const navigate = useNavigate();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [progress, setProgress] = useState(35);
    const [isCreatingPlan, setIsCreatingPlan] = useState(true);
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);

    const [newPlan, setNewPlan] = useState<PlanFormData>({
        title: '',
        description: '',
        startDate: new Date(),
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        dailyCigarettes: 0,
        motivation: '',
        cigaretteType: Object.keys(cigarettePrices)[0], // Default to the first type
    });

    // Kiểm tra đăng nhập khi component mount

    const handleCreatePlan = () => {
        // Here you would typically save to backend
        const plan: Plan = {
            id: Date.now(), // Generate unique ID
            ...newPlan
        };
        setCurrentPlan(plan);
        setIsCreatingPlan(false);
    };

    const handleEditPlan = () => {
        if (currentPlan) {
            setNewPlan({
                title: currentPlan.title,
                description: currentPlan.description,
                startDate: currentPlan.startDate,
                targetDate: currentPlan.targetDate,
                dailyCigarettes: currentPlan.dailyCigarettes,
                motivation: currentPlan.motivation,
                cigaretteType: currentPlan.cigaretteType,
            });
            setIsCreatingPlan(true);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPlan(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPlan(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPlan(prev => ({
            ...prev,
            [name]: new Date(value)
        }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPlan(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    };

    // Tính số ngày không hút thuốc và tiền tiết kiệm
    const calculateSavings = (plan: Plan | null) => {
        if (!plan) return { days: 0, saved: 0 };

        const today = new Date();
        const startDate = new Date(plan.startDate);
        const timeDiff = today.getTime() - startDate.getTime();
        const daysSmokeFree = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));

        const cigarettePricePerPack = cigarettePrices[plan.cigaretteType] || cigarettePrices["Khác"];
        // Giả định 1 gói có 20 điếu
        const costPerCigarette = cigarettePricePerPack / 20;
        const dailyCost = costPerCigarette * plan.dailyCigarettes;
        const totalSaved = dailyCost * daysSmokeFree;

        return { days: daysSmokeFree, saved: totalSaved };
    };

    const { days: smokeFreeDays, saved: moneySaved } = calculateSavings(currentPlan);

    return (
        <div className="container mx-auto py-8">
            {!currentPlan ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                    <h2 className="text-3xl font-bold text-center">Bắt đầu hành trình cai thuốc lá của bạn</h2>
                    <p className="text-lg text-muted-foreground text-center max-w-2xl">
                        Tạo kế hoạch cai thuốc lá cá nhân hóa để đạt được mục tiêu của bạn
                    </p>
                    <Dialog open={isCreatingPlan} onOpenChange={setIsCreatingPlan}>
                        <DialogTrigger asChild>
                            <Button size="lg" className="px-8 py-4 rounded-xl font-bold text-lg">
                                Tạo Kế Hoạch Mới
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Tạo Kế Hoạch Cai Thuốc Lá</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Tên Kế Hoạch</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={newPlan.title}
                                        onChange={handleInputChange}
                                        placeholder="Ví dụ: Kế hoạch cai thuốc 30 ngày"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={newPlan.description}
                                        onChange={handleInputChange}
                                        placeholder="Mô tả chi tiết về kế hoạch của bạn"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="cigaretteType">Loại thuốc lá thường hút</Label>
                                    <select
                                        id="cigaretteType"
                                        name="cigaretteType"
                                        value={newPlan.cigaretteType}
                                        onChange={handleSelectChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {Object.keys(cigarettePrices).map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Ngày bắt đầu</Label>
                                        <Input
                                            type="date"
                                            name="startDate"
                                            value={newPlan.startDate?.toISOString().split('T')[0]}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Ngày mục tiêu</Label>
                                        <Input
                                            type="date"
                                            name="targetDate"
                                            value={newPlan.targetDate?.toISOString().split('T')[0]}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dailyCigarettes">Số điếu thuốc hút mỗi ngày (trước khi cai)</Label>
                                    <Input
                                        id="dailyCigarettes"
                                        name="dailyCigarettes"
                                        type="number"
                                        value={newPlan.dailyCigarettes}
                                        onChange={handleNumberChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="motivation">Động lực của bạn</Label>
                                    <Textarea
                                        id="motivation"
                                        name="motivation"
                                        value={newPlan.motivation}
                                        onChange={handleInputChange}
                                        placeholder="Viết ra lý do tại sao bạn muốn bỏ thuốc lá"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <Button variant="outline" onClick={() => setIsCreatingPlan(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleCreatePlan}>
                                    Tạo Kế Hoạch
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cột trái - Tiến độ và Lịch */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tiến độ cai thuốc</CardTitle>
                                <CardDescription>Hành trình của bạn</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span>Ngày không hút thuốc</span>
                                        <Badge variant="secondary">{smokeFreeDays} ngày</Badge>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                    <div className="text-sm text-muted-foreground">
                                        Tiết kiệm được: {moneySaved.toLocaleString('vi-VN')} VND
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Loại thuốc lá: {currentPlan.cigaretteType}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Lịch theo dõi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Calendar
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cột phải - Thông tin kế hoạch */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>{currentPlan.title}</CardTitle>
                                        <CardDescription>Kế hoạch của bạn</CardDescription>
                                    </div>
                                    <Button variant="outline" onClick={handleEditPlan}>
                                        Chỉnh sửa
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium">Mô tả</h4>
                                        <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Động lực</h4>
                                        <p className="text-sm text-muted-foreground">{currentPlan.motivation}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium">Ngày bắt đầu</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {currentPlan.startDate.toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium">Ngày mục tiêu</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {currentPlan.targetDate.toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Số điếu thuốc mỗi ngày (trước khi cai)</h4>
                                        <p className="text-sm text-muted-foreground">{currentPlan.dailyCigarettes} điếu</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Loại thuốc lá</h4>
                                        <p className="text-sm text-muted-foreground">{currentPlan.cigaretteType}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
} 