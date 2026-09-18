/**
 * Invisible field that only bots fill in (they auto-fill every input they
 * find). Real users never see or interact with it. Positioned off-screen
 * rather than display:none, since some bots skip hidden fields.
 */
export default function HoneypotField({ value, onChange }) {
  return (
    <input
      type="text"
      name="website"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
    />
  );
}
