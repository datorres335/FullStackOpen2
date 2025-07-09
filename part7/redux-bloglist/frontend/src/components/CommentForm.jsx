import { useState } from "react";
import { Form, Button } from 'react-bootstrap';
import commentService from "../services/comments";

const CommentForm = ({blogId, userId, setComments, comments}) => {
  const [newComment, setNewComment] = useState("");

  if (!blogId || !userId) { 
    return <p>Please log in to add comments.</p>; 
  }

  const addComment = async (event) => {
    event.preventDefault();
    const commentObject = {
      content: newComment.trim(),
      blogId,
      userId
    };

    try {
      const returnedComment = await commentService.create(commentObject.content, commentObject.blogId, commentObject.userId);
      setComments(comments.concat(returnedComment));
      setNewComment("");
    } catch (exception) {
      console.log("Failed to add comment", exception);
    }
  }

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  }

  return (
    <Form onSubmit={addComment}>
      <div>
        <Form.Group>
          <Form.Control 
            type="text"
            value={newComment}
            name="Comment"
            placeholder="Write a comment..."
            onChange={handleCommentChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Comment
        </Button>
      </div>
    </Form>
  )
}

export default CommentForm;