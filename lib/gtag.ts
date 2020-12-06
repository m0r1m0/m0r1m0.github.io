export const GA_TRACKING_ID = "G-N6MC6SMGJM";

export const pageview = (url: string): void => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: EventArg): void => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

interface EventArg {
  action: Gtag.EventNames | string;
  category?: string;
  label?: string;
  value?: number;
}
