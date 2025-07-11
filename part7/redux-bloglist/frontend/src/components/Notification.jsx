import { Alert } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification.create);

  if (notification.message === '') {
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
