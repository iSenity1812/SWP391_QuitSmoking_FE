import React from 'react';
import './AboutPage.css'; // Import file CSS
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AboutPage: React.FC = () => {
    const teamMembers = [
        {
            name: "Nguyễn Văn A",
            role: "Chuyên gia tư vấn",
            description: "10 năm kinh nghiệm trong lĩnh vực cai nghiện thuốc lá",
            avatar: "/placeholder.svg?height=40&width=40&text=NA"
        },
        {
            name: "Trần Thị B",
            role: "Bác sĩ tư vấn",
            description: "Chuyên gia về sức khỏe và dinh dưỡng",
            avatar: "/placeholder.svg?height=40&width=40&text=TB"
        },
        {
            name: "Lê Văn C",
            role: "Huấn luyện viên",
            description: "Chuyên gia về thay đổi hành vi và thói quen",
            avatar: "/placeholder.svg?height=40&width=40&text=LC"
        }
    ];

    const features = [
        {
            title: "Phương pháp khoa học",
            description: "Áp dụng các phương pháp đã được chứng minh hiệu quả trong việc cai thuốc lá"
        },
        {
            title: "Hỗ trợ 24/7",
            description: "Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi"
        },
        {
            title: "Cộng đồng mạnh mẽ",
            description: "Tham gia vào cộng đồng những người cùng chí hướng, chia sẻ kinh nghiệm"
        },
        {
            title: "Theo dõi tiến độ",
            description: "Hệ thống theo dõi và đánh giá tiến độ cai thuốc chi tiết"
        }
    ];

    return (

        <div className="container mx-auto py-12 pt-16">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Về Chúng Tôi</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Chúng tôi cam kết giúp bạn bỏ thuốc lá một cách hiệu quả và bền vững thông qua
                    các phương pháp khoa học và sự hỗ trợ tận tâm.
                </p>
            </div>

            {/* Mission Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <Card>
                    <CardHeader>
                        <CardTitle>Sứ Mệnh</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Chúng tôi cam kết giúp mọi người bỏ thuốc lá thành công thông qua các phương pháp
                            khoa học, sự hỗ trợ tận tâm và một cộng đồng mạnh mẽ. Mục tiêu của chúng tôi là
                            cải thiện sức khỏe và chất lượng cuộc sống cho mọi người.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tầm Nhìn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Chúng tôi mong muốn trở thành nền tảng hàng đầu trong việc hỗ trợ cai thuốc lá,
                            giúp mọi người có thể sống một cuộc sống khỏe mạnh và hạnh phúc hơn.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Features Section */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-8">Tại Sao Chọn Chúng Tôi</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div>
                <h2 className="text-3xl font-bold text-center mb-8">Đội Ngũ Chuyên Gia</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle>{member.name}</CardTitle>
                                        <CardDescription>{member.role}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{member.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Contact Section */}
            <div className="mt-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h2>
                <p className="text-muted-foreground mb-6">
                    Bạn có thắc mắc hoặc cần tư vấn? Hãy liên hệ với chúng tôi
                </p>
                <div className="flex justify-center gap-4">
                    <a
                        href="mailto:contact@quitsmoking.com"
                        className="text-primary hover:underline"
                    >
                        contact@quitsmoking.com
                    </a>
                    <span className="text-muted-foreground">|</span>
                    <a
                        href="tel:+84123456789"
                        className="text-primary hover:underline"
                    >
                        +84 123 456 789
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AboutPage; 