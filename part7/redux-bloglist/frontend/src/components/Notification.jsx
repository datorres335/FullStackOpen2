import { Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const Notification = ({ type }) => {
  const notification = useSelector(state => state.notification[type]);

  if (!notification) {
    return null;
  }

  return (
    <div className="message container">
      <Alert variant={notification.color}>
        {notification.message}
      </Alert>
    </div>
  );
};

export default Notification;
