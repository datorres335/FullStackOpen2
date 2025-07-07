import { Alert } from 'react-bootstrap'

const Notification = ({ message, color }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className="message container">
      <Alert variant={color}>
        {message}
      </Alert>
    </div>
  );
};

export default Notification;
