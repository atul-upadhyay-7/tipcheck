// Plain editorial panel. No pointer effect, remote assets or background animation.
export default function SpotlightCard({ children, className = "" }) {
  return <div className={`spotlight-card ${className}`}>{children}</div>;
}
