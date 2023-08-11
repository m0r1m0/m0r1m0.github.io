/// <reference types="next" />
/// <reference types="next/types/global" />

declare global {
  interface Window {
    gtag: Gtag.Gtag;
  }
}
