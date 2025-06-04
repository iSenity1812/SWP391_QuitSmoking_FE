import React, { useState } from 'react';
import './BlogPage.css'; // Import file CSS

// Định nghĩa kiểu cho Comment
interface Comment {
    id: number;
    text: string;
    author: string; // Có thể thêm thông tin tác giả bình luận
}

// Cập nhật kiểu cho BlogPost để thêm likes và comments
interface BlogPost {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    image: string;
    likes: number; // Thêm số lượt thích
    comments: Comment[]; // Thêm danh sách bình luận
}

const BlogPage: React.FC = () => {
    // Dữ liệu mẫu cho các bài viết blog
    // Cập nhật dữ liệu mẫu để bao gồm likes và comments ban đầu
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
        {
            id: 1,
            title: 'Bài viết 1',
            content: 'Nội dung tóm tắt của bài viết 1...',
            author: 'Tác giả 1',
            date: '2023-01-01',
            image: 'url_to_image_1',
            likes: 10, // Số lượt thích ban đầu
            comments: [{ id: 1, text: 'Bình luận 1', author: 'User A' }], // Bình luận mẫu
        },
        {
            id: 2,
            title: 'Bài viết 2',
            content: 'Nội dung tóm tắt của bài viết 2...',
            author: 'Tác giả 2',
            date: '2023-01-02',
            image: 'url_to_image_2',
            likes: 5, // Số lượt thích ban đầu
            comments: [], // Chưa có bình luận
        },
        // Thêm các bài viết khác nếu cần, bao gồm likes và comments
    ]);

    // Hàm xử lý khi click Like
    const handleLike = (postId: number) => {
        setBlogPosts(blogPosts.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
        ));
    };

    // Hàm xử lý khi gửi bình luận mới
    const handleAddComment = (postId: number, commentText: string) => {
        if (!commentText.trim()) return; // Không thêm bình luận rỗng

        const newComment: Comment = {
            id: Date.now(), // ID tạm thời dựa vào timestamp
            text: commentText,
            author: 'Current User', // Thay bằng tên người dùng thực tế
        };

        setBlogPosts(blogPosts.map(post =>
            post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
        ));
    };

    return (
        <>
            <div className="container mx-auto py-8 pt-16"></div>
            {/* Phần Header giống trang chủ */}
            <div className="blog-header">
                <h1>Blog của chúng tôi</h1>
                <p>Khám phá các bài viết hữu ích về việc bỏ thuốc và sống khỏe mạnh.</p>
            </div>
            {/* Kết thúc Phần Header */}

            <div className="blog-container">
                <h1 className="blog-title">Blog</h1>
                <div className="blog-content-area"> {/* Thêm div này để bao bọc bài viết và sidebar */}
                    <div className="blog-posts-container">
                        {blogPosts.map((post) => (
                            <div key={post.id} className="blog-post">
                                <h2 className="post-title">{post.title}</h2>
                                <img className="post-image" src={post.image} alt={post.title} />
                                <p className="post-content">{post.content}</p>
                                <p className="post-author">Author: {post.author}</p>
                                <p className="post-date">Date: {post.date}</p>

                                {/* Phần Like */}
                                <div className="post-actions">
                                    <button onClick={() => handleLike(post.id)} className="like-button">Like ({post.likes})</button>
                                </div>

                                {/* Phần Comment */}
                                <div className="comments-container">
                                    <h3 className="comment-title">Comments</h3>
                                    {post.comments.map(comment => (
                                        <div key={comment.id} className="comment">
                                            <p><strong>{comment.author}:</strong> {comment.text}</p>
                                        </div>
                                    ))}

                                    {/* Form thêm bình luận */}
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = e.target as HTMLFormElement;
                                        const formData = new FormData(form);
                                        const commentText = formData.get('comment') as string;
                                        handleAddComment(post.id, commentText);
                                        form.reset(); // Reset form sau khi gửi
                                    }} className="comment-form">
                                        <input type="text" name="comment" placeholder="Thêm bình luận..." required className="comment-input" />
                                        <button type="submit" className="submit-comment-button">Gửi</button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> {/* Kết thúc div blog-content-area */}
            </div>
        </>
    );
};

export default BlogPage; 