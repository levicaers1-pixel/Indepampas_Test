/**
 * Spam trap for public forms. Real visitors never see or fill it; bots that fill every
 * input do, and the server silently drops those submissions (see `website` in the
 * server function schemas).
 */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label>
        Laat dit veld leeg
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function honeypotValue(form: HTMLFormElement): string {
  return String(new FormData(form).get("website") ?? "");
}
