interface LogoProps {
  /** Height in pixels — width scales proportionally. Default 36 */
  size?: number;
  className?: string;
  /**
   * `mark` = icon only (best for sidebars)
   * `full` = icon + "Smart Ability" wordmark
   */
  variant?: 'mark' | 'full';
}

/**
 * SmartAbility innovation logo.
 * Uses transparent PNGs — mark for compact UI, full for hero/login.
 */
export default function Logo({ size = 36, className = '', variant = 'mark' }: LogoProps) {
  const src = variant === 'full' ? '/smartability-logo.png' : '/smartability-mark.png';
  const alt = variant === 'full' ? 'Smart Ability' : 'Smart Ability mark';

  return (
    <img
      src={src}
      alt={alt}
      height={size}
      width={size}
      className={`object-contain ${className}`.trim()}
      draggable={false}
      decoding="async"
    />
  );
}
