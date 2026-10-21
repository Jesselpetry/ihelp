/**
 * The sound that plays when "กดเลย" opens the resignation form.
 *
 * Flip `loud` to true to make that button ask first and then play at the
 * loudest level a web page can request.
 *
 * A page cannot raise the device's own volume (no browser allows it), and
 * `HTMLMediaElement.volume` stops at 1, so "loudest" means volume 1 on
 * whatever level the device is already set to. Gain above 1 would only clip,
 * which sounds worse and can hurt speakers, so it is not offered. Ultrasonic
 * output is not offered either: nobody can hear it, but pets and some people
 * can, and speakers heat up playing it.
 */
export const RESIGN_SOUND = {
  /** true: confirm modal, then full volume. false: no modal, `normalVolume`. */
  loud: false,
  /** Volume (0-1) when `loud` is off. */
  normalVolume: 1,
  /** Ramp from silence to full volume, so it does not hit like a click. */
  fadeInMs: 500,
} as const;
