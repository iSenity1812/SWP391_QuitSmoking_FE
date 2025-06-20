import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import BlogPostCard from "./BlogPostCard"
import type { BlogPost, BlogUser } from "@/types/blog"
import type { CommentResponseDTO } from "@/types/comment"

interface BlogPostListProps {
  posts: BlogPost[]
  currentUser: BlogUser | null
  comments: CommentResponseDTO[]
  handleViewPost: (post: BlogPost) => void
  handleEditPost: (post: BlogPost) => void
  handleDeletePost: (post: BlogPost) => void
  handleReportPost: (post: BlogPost) => void
  canEditPost: (post: BlogPost) => boolean
  canDeletePost: (post: BlogPost) => boolean
  canReportPost: (post: BlogPost) => boolean
  getRootComments: (blogId: number) => CommentResponseDTO[]
}

const BlogPostList: React.FC<BlogPostListProps> = ({
  posts,
  currentUser,
  comments,
  handleViewPost,
  handleEditPost,
  handleDeletePost,
  handleReportPost,
  canEditPost,
  canDeletePost,
  canReportPost,
  getRootComments,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></span>
        Bài viết ({posts.length})
      </h2>

      {posts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">Chưa có bài viết nào</h3>
            <p className="text-slate-500 dark:text-slate-500">Hãy là người đầu tiên chia sẻ câu chuyện của bạn!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {posts.map((post, index) => (
            <BlogPostCard
              key={post.blogId || `blog-${index}`} // Fix: Add unique key prop
              post={post}
              index={index}
              currentUser={currentUser}
              comments={comments}
              handleViewPost={handleViewPost}
              handleEditPost={handleEditPost}
              handleDeletePost={handleDeletePost}
              handleReportPost={handleReportPost}
              canEditPost={canEditPost}
              canDeletePost={canDeletePost}
              canReportPost={canReportPost}
              getRootComments={getRootComments}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogPostList
