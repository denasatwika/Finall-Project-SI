const CartIcon = ({ className = "w-5 h-5", fill = "none", stroke = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill={fill}
    viewBox="0 0 24 24"
    stroke={stroke}
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .963.304 1.157.772l.72 1.778m0 0L7.5 13.5h9.75a1.5 1.5 0 001.474-1.235l1.125-6.75H6.513m0 0L5.25 3M9 21a.75.75 0 100-1.5.75.75 0 000 1.5zm8.25 0a.75.75 0 100-1.5.75.75 0 000 1.5z"
    />
  </svg>
);

export default CartIcon;
