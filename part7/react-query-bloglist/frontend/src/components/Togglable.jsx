import PropTypes from "prop-types"; // ensures props have a value
import { useState, forwardRef, useImperativeHandle } from "react";
// useImperativeHandle is used to customize the instance value that is exposed to parent components when using ref. It allows you to define what properties and methods are accessible from the parent component.
// forwardRef is used to forward a ref to a child component, allowing the parent component to directly interact with the child's DOM or instance methods.

const Togglable = forwardRef((props, refs) => {
  //What is the refs parameter in forwardRef? It is a ref object that will be passed to the child component, allowing the parent component to access the child's instance or DOM node.
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
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className={"togglableContent"}>
        {props.children}{" "}
        {/* children is a special prop that allows you to pass components as props */}
        {/* The child components are the React elements that we define between the opening and closing tags of a component. */}
        {/* the children prop is automatically added by React and always exists */}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Togglable.displayName = "Togglable"; // this is necessary for the component to be recognized by React DevTools

export default Togglable;
