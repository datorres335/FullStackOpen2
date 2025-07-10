import { useState } from "react";
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { addNewComment } from "../reducers/blogReducer";

const CommentForm = ({blogId, userId}) => {
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();

  if (!blogId || !userId) { 
    return <p>Please log in to add comments.</p>; 
  }

  const addComment = async (event) => {
    event.preventDefault();
    
    if (newComment.trim() === '') {
      return;
    }

    const commentObject = {
      content: newComment.trim(),
      blogId,
      userId
    };

    try {
      // const returnedComment = await blogService.update();
      // setComments(comments.concat(returnedComment));
      dispatch(addNewComment(newComment.trim(), blogId));
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