import { useSelector } from 'react-redux'

const Notification = ({ color, type }) => {
  const notification = useSelector(state => state.notification[type]?.message)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 10,
    borderColor: color,
    marginBottom: 10
  }

  if (!notification) {
    return null
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification