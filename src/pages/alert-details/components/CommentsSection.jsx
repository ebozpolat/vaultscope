import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommentsSection = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="MessageCircle" size={20} className="text-text-secondary" />
        <h3 className="text-lg font-semibold text-text-primary">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={16} className="text-primary" />
          </div>
          
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3"
              disabled={isSubmitting}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary">
                Markdown supported
              </span>
              
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!newComment.trim() || isSubmitting}
                loading={isSubmitting}
                iconName="Send"
                iconSize={14}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="MessageCircle" size={48} className="text-text-quaternary mx-auto mb-4" />
            <p className="text-text-secondary">No comments yet</p>
            <p className="text-text-tertiary text-sm">Be the first to add a comment</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3 p-4 bg-background-secondary rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={16} className="text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-text-primary">{comment.author}</span>
                  <span className="text-xs text-text-tertiary">
                    {formatTimeAgo(comment.timestamp)}
                  </span>
                  {comment.isEdited && (
                    <span className="text-xs text-text-quaternary">(edited)</span>
                  )}
                </div>
                
                <p className="text-text-secondary text-sm whitespace-pre-wrap">
                  {comment.content}
                </p>
                
                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="mt-2 flex items-center space-x-2">
                    <Icon name="Paperclip" size={14} className="text-text-tertiary" />
                    <span className="text-xs text-text-tertiary">
                      {comment.attachments.length} attachment(s)
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-4 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ThumbsUp"
                    iconSize={12}
                    className="text-text-tertiary hover:text-text-primary text-xs"
                  >
                    {comment.likes || 0}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Reply"
                    iconSize={12}
                    className="text-text-tertiary hover:text-text-primary text-xs"
                  >
                    Reply
                  </Button>
                  
                  {comment.canEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      iconSize={12}
                      className="text-text-tertiary hover:text-text-primary text-xs"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;