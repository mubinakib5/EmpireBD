"use client";

export default function SocialIcon({ name, href, icon }) {
  const renderIcon = () => {
    if (icon.path) {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox={icon.viewBox}
        >
          <path d={icon.path} />
        </svg>
      );
    }

    if (icon.paths) {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox={icon.viewBox}
        >
          {icon.paths.map((pathData, index) => {
            const { type, props } = pathData;
            
            if (type === "rect") {
              return <rect key={index} {...props} />;
            }
            if (type === "circle") {
              return <circle key={index} {...props} />;
            }
            if (type === "polygon") {
              return <polygon key={index} {...props} />;
            }
            if (type === "path") {
              return <path key={index} {...props} />;
            }
            return null;
          })}
        </svg>
      );
    }

    return null;
  };

  return (
    <a href={href} aria-label={name}>
      {renderIcon()}
    </a>
  );
}