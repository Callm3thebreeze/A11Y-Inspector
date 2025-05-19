import classnames from "tailwindcss-classnames";
import PropTypes from "prop-types";

const cnBase = classnames("block", "rounded-full");
const cnText = classnames("sr-only");

const Dot = ({ type, size = "small" }) => {
  const cnDot = classnames(cnBase, {
    "bg-warning-dark": type === "warning",
    "bg-danger": type === "danger",
    "bg-success": type === "success",
    "h-1.5 w-1.5": size === "small",
    "h-2.5 w-2.5": size === "big",
  });

  return (
    <span className={cnDot}>
      <span className={cnText}>Icono alerta</span>
    </span>
  );
};

Dot.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export default Dot;
