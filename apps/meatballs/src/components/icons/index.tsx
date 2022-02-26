function Logo(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg
      viewBox="0 0 140 123"
      fill="#d90429"
      stroke="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      id="shiftrr-logo"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M124.787 64.442l-4.98-.636c-.885-.113-1.691.514-1.839 1.393A40.326 40.326 0 0155.29 91.674c-2.462-1.7-1.57-5.286 1.32-6.06l21.06-5.643a3.318 3.318 0 10-1.717-6.41l-27.098 7.261c-.07.019-.14.036-.211.052l-12.779 3.424a.897.897 0 01-.083.027 3.318 3.318 0 101.717 6.41l.29-.078c1.99-.533 4.09.151 5.523 1.63a48.582 48.582 0 0038.695 14.632 48.577 48.577 0 0044.151-40.674c.142-.88-.486-1.69-1.371-1.803zM23.479 60.166a5.439 5.439 0 00-.533.115l-10.423 2.793a3.318 3.318 0 11-1.718-6.41l15.957-4.276c2.048-.548 3.547-2.27 4.003-4.34a48.57 48.57 0 0124.618-32.436 48.577 48.577 0 0159.093 10.57c.594.666.499 1.686-.187 2.257l-3.857 3.213-1.237 1.03c-.003.002-.006.002-.009 0a40.323 40.323 0 00-68.139 10.145c-1.16 2.754 1.449 5.345 4.336 4.572l2.222-.596a3.318 3.318 0 011.718 6.41l-7.667 2.054a5.35 5.35 0 00-.515.167l-17.662 4.732z"
        id="path71"
      />
      <rect
        x="69.904"
        y="56.905"
        width="6.636"
        height="16.454"
        rx="3.318"
        transform="rotate(75 69.904 56.905)"
        id="rect73"
      />
      <rect
        x="48.333"
        y="62.703"
        width="6.636"
        height="49.768"
        rx="3.318"
        transform="rotate(75 48.333 62.703)"
        id="rect75"
      />
      <rect
        x="94.364"
        y="50.565"
        width="6.636"
        height="19.829"
        rx="3.318"
        transform="rotate(75 94.364 50.565)"
        id="rect77"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M97.725 51.927c3.022 11.276 14.612 17.967 25.888 14.946 11.275-3.022 17.967-14.612 14.946-25.887-3.022-11.276-14.612-17.968-25.888-14.946-11.275 3.021-17.967 14.611-14.946 25.887zm20.425 9.448c8.429 0 15.262-6.684 15.262-14.93 0-8.246-6.833-14.93-15.262-14.93s-15.262 6.684-15.262 14.93c0 8.246 6.833 14.93 15.262 14.93z"
        id="path79"
      />
    </svg>
  );
}

function MenuIcon(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg
      viewBox="0 0 20 20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      shapeRendering="geometricPrecision"
      fill="none"
      {...props}
    >
      <path d="M2.5 7.5H17.5" />
      <path d="M2.5 12.5H17.5" />
    </svg>
  );
}

function CrossIcon(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      shapeRendering="geometricPrecision"
      {...props}
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function ProfileIcon(props: JSX.IntrinsicElements['svg']) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export { Logo, MenuIcon, CrossIcon, ProfileIcon };
