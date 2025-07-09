import { useState } from "react";
import { Form, Button, InputGroup } from 'react-bootstrap';
import commentService from "../services/comments";

const CommentForm = ({blogId, userId, setComments, comments}) => {
  const [newComment, setNewComment] = useState("");

  if (!blogId || !userId) { 
    return <p>Please log in to add comments.</p>; 
  }

  const addComment = async (event) => {
    event.preventDefault();
    
    if (newComment.trim() === '') {
      return;
    }

    try {
      const returnedComment = await commentService.create(
        newComment.trim(), 
        blogId, 
        userId
      );
      
      setComments(comments.concat(returnedComment));
      setNewComment("");
    } catch (exception) {
      console.log("Failed to add comment", exception);
    }
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  }

  return (
    <Form onSubmit={addComment}>
      <InputGroup className="mb-3">
        <Form.Control 
          type="text"
          value={newComment}
          name="Comment"
          placeholder="Write a comment..."
          onChange={handleCommentChange}
        />
        <Button 
          variant="primary" 
          type="submit"
          disabled={newComment.trim() === ''}
        >
          💬 Add Comment
        </Button>
      </InputGroup>
    </Form>
  )
}

export default CommentForm;