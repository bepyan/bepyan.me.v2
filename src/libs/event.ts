// import { isProd } from '~/libs/utils';

// type RecodeEventProps = {
//   action: string;
//   label?: string;
//   value?: string;
// };

// export const recordEvent = ({ action, label, value }: RecodeEventProps) => {
//   if (!isProd) return;

//   window.gtag('event', action, {
//     event_category: process.env.WEB_VERSION,
//     event_label: label,
//     value: value,
//   });
//   window.mixpanel.track(action, {
//     category: process.env.WEB_VERSION,
//     label,
//     value,
//   });
// };
