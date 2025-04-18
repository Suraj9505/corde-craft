import { SignInButton, useUser } from "@clerk/nextjs";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { MessageSquare } from "lucide-react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

function Comments({ snippetId }: { snippetId: Id<"snippets"> }) {
    const { user } = useUser();
    const [isCommenting, setIsCommenting] = useState(false);
    const [deletingComment, setDeletingComment] = useState<string | null>(null);

    const comments = useQuery(api.snippets.getComments, { snippetId }) || [];
    const addComment = useMutation(api.snippets.addComment);
    const deleteComment = useMutation(api.snippets.deleteComment);

    const handleAddComment = async (content: string) => {
        setIsCommenting(true);
        try {
            await addComment({ snippetId, content });
            toast.success("Comment added successfully.");

        } catch (error) {
            console.log("Error adding comment:", error);
            toast.error("Error adding comment.");
        } finally {
            setIsCommenting(false);
        }
    }
    const handleDeleteComment = async (commentId: Id<"snippetComments">) => {
        setDeletingComment(commentId);
        try {
            await deleteComment({ commentId });
            toast.success("Comment deleted successfully.");
        } catch (error) {
            console.log("Error deleting comment:", error);
            toast.error("Error deleting comment.");
        } finally {
            setDeletingComment(null);
        }
    }


    return (
        <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden">
            <div className="px-6 sm:px-8 py-6 border-b border-[#ffffff0a]">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Discussion ({comments.length})
                </h2>
            </div>
            <div className="p-6 sm:p-8">
                {user ? (
                    <CommentForm onSubmit={handleAddComment} isCommenting={isCommenting} />
                ) : (
                    <div className="bg-[#0a0a0f] rounded-xl p-6 text-center mb-8 border border-[#ffffff0a]">
                        <p className="text-[#808086] mb-4">Sign in to join the discussion</p>
                        <SignInButton mode="modal">
                            <button className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                    </div>
                )}

                <div className="space-y-6">
                    {comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            onDelete={handleDeleteComment}
                            isDeleting={deletingComment === comment._id}
                            currentUserId={user?.id} />
                    ))}
                </div>
            </div >
        </div >
    )
}

export default Comments;
