import classnames from "tailwindcss-classnames";

import A11yLogo from "../../assets/images/a11y.png";

const cnContainer = classnames(
  "flex",
  "items-center",
  "justify-between",
  "gap-4",
  "border-b",
  "border-b-gray-300"
);
const cnTitle = classnames(
  "flex",
  "items-center",
  "justify-center",
  "font-bold",
  "text-xl",
  "py-2",
  "w-full"
);
const cnImage = classnames("rounded-full", "h-14", "w-14", "ml-4");
const cnBlue = classnames("text-primary");

const Header = () => (
  <header className={cnContainer}>
    <h1 className={cnTitle}>
      <span className={cnBlue}>A11Y </span>
      <span>Inspector</span>
      <img className={cnImage} src={A11yLogo} />
    </h1>
  </header>
);

export default Header;
