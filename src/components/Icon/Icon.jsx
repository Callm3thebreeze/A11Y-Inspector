import PropTypes from "prop-types";
import classnames from "tailwindcss-classnames";
import { SVG } from "./svg";

const DSIcon = ({ id, className }) => {
  const classes = classnames(className, "inline-block");
  return (
    <>
      <SVG id={id} className={classes} />
    </>
  );
};

DSIcon.propTypes = {
  id: PropTypes.oneOf(["vodafone-esp", "unicorn", "chevron-down", "download"])
    .isRequired,
  className: PropTypes.string,
};

DSIcon.defaultProps = {
  className: "",
};

export { SVGSource as IconSource } from "./svg";
export default DSIcon;
