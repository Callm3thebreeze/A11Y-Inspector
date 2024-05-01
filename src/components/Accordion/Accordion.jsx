import { useState, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "tailwindcss-classnames";

import Icon from "../Icon/Icon";

const baseClasses = {
  contentParent: "w-full overflow-hidden transition-all duration-700",
  button:
    "w-full flex items-center justify-between transition-all duration-700 hover:text-primary",
  buttonIcon: "transform transition-transform duration-700 text-primary",
};

const DSAccordion = ({ title, children, classes }) => {
  const [visible, setVisible] = useState(false);
  const [height, setHeight] = useState(0);
  const content = useRef();

  const toggleVisibility = () => {
    if (!visible) setHeight(content.current.scrollHeight);
    else setHeight(0);
    setVisible(!visible);
  };

  const cnAccordion = classnames("w-full", classes.container);
  const cnButton = classnames(baseClasses.button, classes.button.text);
  const cnContentParent = classnames(
    baseClasses.contentParent,
    { "opacity-0": !visible },
    { "opacity-1": visible }
  );
  const cnButtonIcon = classnames(
    baseClasses.buttonIcon,
    classes.button.icon,
    { "rotate-0": !visible },
    { "rotate-180": visible }
  );
  const cnContent = classnames(classes.content);

  return (
    <div className={cnAccordion}>
      <button type="button" onClick={toggleVisibility} className={cnButton}>
        <span>{title}</span>
        <Icon id="chevron-down" className={cnButtonIcon} />
      </button>
      <div className={cnContentParent} style={{ maxHeight: `${height}px` }}>
        <div ref={content} className={cnContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

DSAccordion.propTypes = {
  title: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string,
    button: PropTypes.shape({
      text: PropTypes.string,
      icon: PropTypes.string,
    }),
    content: PropTypes.string,
  }),
};

DSAccordion.defaultProps = {
  classes: {
    container: "text-base font-bold",
    button: {
      text: "text-base font-bold",
      icon: "w-4 h-4 text-primary",
    },
    content: "text-sm",
  },
};

export default DSAccordion;
