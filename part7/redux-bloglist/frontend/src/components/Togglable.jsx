import { useState, useImperativeHandle, forwardRef } from "react";
import { Button, Collapse } from "react-bootstrap";

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button 
          variant="primary" 
          size="sm"
          onClick={toggleVisibility}
          className="mb-3"
        >
          {props.buttonLabel}
        </Button>
      </div>
      <Collapse in={visible}>
        <div style={showWhenVisible} className="mb-3">
          {props.children}
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={toggleVisibility}
            className="mt-2"
          >
            Cancel
          </Button>
        </div>
      </Collapse>
    </div>
  );
});

Togglable.displayName = "Togglable";

export default Togglable;