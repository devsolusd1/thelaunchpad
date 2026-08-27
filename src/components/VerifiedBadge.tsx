// Selo de launchpad com X (Twitter) verificado. So renderiza quando
// xVerified=true no banco (setado pelo fluxo de OAuth com o X — em breve).
export default function VerifiedBadge({
  xHandle,
  className = '',
}: {
  xHandle?: string | null;
  className?: string;
}) {
  return (
    <span
      title={xHandle ? `verified: @${xHandle}` : 'verified'}
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent align-middle ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
        <path
          d="M5 12.5l4.5 4.5L19 7.5"
          stroke="#fff7e8"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
