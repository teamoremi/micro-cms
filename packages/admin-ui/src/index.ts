import { CmsModule } from '@micro-cms/types';
import { ComponentRegistry, DefaultTextInput, DefaultNumberInput, DefaultBooleanInput } from './registry';

// The compiled CSS rules from Tailwind 3 with mcms- prefix
const CSS_CONTENT = `*,::backdrop,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#3b82f680;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.mcms-pointer-events-none{pointer-events:none}.mcms-fixed{position:fixed}.mcms-inset-0{inset:0}.mcms-inset-4{inset:1rem}.mcms-right-0{right:0}.mcms-top-0{top:0}.mcms-z-\\[9998\\]{z-index:9998}.mcms-z-\\[9999\\]{z-index:9999}.mcms-mx-auto{margin-left:auto;margin-right:auto}.mcms-mb-2{margin-bottom:.5rem}.mcms-mr-4{margin-right:1rem}.mcms-flex{display:flex}.mcms-hidden{display:none}.mcms-h-6{height:1.5rem}.mcms-h-full{height:100%}.mcms-w-6{width:1.5rem}.mcms-w-full{width:100%}.mcms-min-w-full{min-width:100%}.mcms-max-w-4xl{max-width:56rem}.mcms-max-w-md{max-width:28rem}.mcms-flex-1{flex:1 1 0%}.mcms-translate-x-0{--tw-translate-x:0px}.mcms-translate-x-0,.mcms-translate-x-full{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.mcms-translate-x-full{--tw-translate-x:100%}.mcms-transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.mcms-flex-col{flex-direction:column}.mcms-items-center{align-items:center}.mcms-justify-between{justify-content:space-between}.mcms-gap-1{gap:.25rem}.mcms-gap-2{gap:.5rem}.mcms-gap-4{gap:1rem}.mcms-space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1rem*var(--tw-space-y-reverse))}.mcms-space-y-6>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem*var(--tw-space-y-reverse))}.mcms-divide-y>:not([hidden])~:not([hidden]){--tw-divide-y-reverse:0;border-top-width:calc(1px*(1 - var(--tw-divide-y-reverse)));border-bottom-width:calc(1px*var(--tw-divide-y-reverse))}.mcms-divide-gray-200>:not([hidden])~:not([hidden]){--tw-divide-opacity:1;border-color:rgb(229 231 235/var(--tw-divide-opacity))}.mcms-overflow-x-auto{overflow-x:auto}.mcms-overflow-y-auto{overflow-y:auto}.mcms-truncate{overflow:hidden;text-overflow:ellipsis}.mcms-truncate,.mcms-whitespace-nowrap{white-space:nowrap}.mcms-rounded{border-radius:.25rem}.mcms-rounded-2xl{border-radius:1rem}.mcms-rounded-lg{border-radius:.5rem}.mcms-rounded-t-2xl{border-top-left-radius:1rem;border-top-right-radius:1rem}.mcms-border{border-width:1px}.mcms-border-b{border-bottom-width:1px}.mcms-border-l{border-left-width:1px}.mcms-bg-black\\/40{background-color:#0006}.mcms-bg-blue-600{--tw-bg-opacity:1;background-color:rgb(37 99 235/var(--tw-bg-opacity))}.mcms-bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251/var(--tw-bg-opacity))}.mcms-bg-gray-50\\/50{background-color:#f9fafb80}.mcms-bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.mcms-p-2{padding:.5rem}.mcms-p-4{padding:1rem}.mcms-p-6{padding:1.5rem}.mcms-p-8{padding:2rem}.mcms-px-2{padding-left:.5rem;padding-right:.5rem}.mcms-px-3{padding-left:.75rem;padding-right:.75rem}.mcms-px-4{padding-left:1rem;padding-right:1rem}.mcms-px-6{padding-left:1.5rem;padding-right:1.5rem}.mcms-py-1{padding-top:.25rem;padding-bottom:.25rem}.mcms-py-2{padding-top:.5rem;padding-bottom:.5rem}.mcms-py-3{padding-top:.75rem;padding-bottom:.75rem}.mcms-py-4{padding-top:1rem;padding-bottom:1rem}.mcms-text-left{text-align:left}.mcms-text-center{text-align:center}.mcms-text-right{text-align:right}.mcms-text-sm{font-size:.875rem;line-height:1.25rem}.mcms-text-xl{font-size:1.25rem;line-height:1.75rem}.mcms-text-xs{font-size:.75rem;line-height:1rem}.mcms-font-bold{font-weight:700}.mcms-font-medium{font-weight:500}.mcms-font-semibold{font-weight:600}.mcms-uppercase{text-transform:uppercase}.mcms-tracking-wider{letter-spacing:.05em}.mcms-text-blue-600{--tw-text-opacity:1;color:rgb(37 99 235/var(--tw-text-opacity))}.mcms-text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.mcms-text-gray-700{--tw-text-opacity:1;color:rgb(55 65 81/var(--tw-text-opacity))}.mcms-text-gray-900{--tw-text-opacity:1;color:rgb(17 24 39/var(--tw-text-opacity))}.mcms-text-red-600{--tw-text-opacity:1;color:rgb(220 38 38/var(--tw-text-opacity))}.mcms-text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.mcms-opacity-0{opacity:0}.mcms-opacity-100{opacity:1}.mcms-shadow-2xl{--tw-shadow:0 25px 50px -12px #00000040;--tw-shadow-colored:0 25px 50px -12px var(--tw-shadow-color)}.mcms-shadow-2xl,.mcms-shadow-sm{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.mcms-shadow-sm{--tw-shadow:0 1px 2px 0 #0000000d;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.mcms-backdrop-blur-sm{--tw-backdrop-blur:blur(4px);backdrop-filter:var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)}.mcms-transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.mcms-transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.mcms-transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.mcms-duration-300{transition-duration:.3s}.mcms-ease-in-out{transition-timing-function:cubic-bezier(.4,0,.2,1)}.hover\:mcms-bg-blue-700:hover{--tw-bg-opacity:1;background-color:rgb(29 78 216/var(--tw-bg-opacity))}.hover\:mcms-bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\:mcms-bg-gray-50:hover{--tw-bg-opacity:1;background-color:rgb(249 250 251/var(--tw-bg-opacity))}.hover\:mcms-text-blue-900:hover{--tw-text-opacity:1;color:rgb(30 58 138/var(--tw-text-opacity))}.hover\:mcms-text-red-900:hover{--tw-text-opacity:1;color:rgb(127 29 29/var(--tw-text-opacity))}.disabled\:mcms-opacity-50:disabled{opacity:.5}@media (min-width:768px){.md\:mcms-inset-8{inset:2rem}.md\:mcms-block{display:block}.md\:mcms-p-12{padding:3rem}}`;

export const injectStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('mcms-styles')) return;

  const style = document.createElement('style');
  style.id = 'mcms-styles';
  style.textContent = CSS_CONTENT;
  document.head.appendChild(style);
};

export * from './registry';
export * from './AutoForm';
export * from './AutoTable';
export * from './OffCanvas';
export * from './Notification';

const adminUiModule: CmsModule = {
  manifest: {
    name: '@micro-cms/admin-ui',
    version: '0.0.1',
    provides: ['admin-interface'],
    requires: ['introspection'],
    pairsWith: {
      '@micro-cms/mock-db': { reason: 'Admin needs data to display', strength: 'recommended' }
    }
  },
  async load({ context }) {
    // Inject styles automatically on module load
    injectStyles();

    // Register default components
    ComponentRegistry.register('text', DefaultTextInput);
    ComponentRegistry.register('number', DefaultNumberInput);
    ComponentRegistry.register('boolean', DefaultBooleanInput);

    // Listen to schema changes to potentially re-render or update internal UI state
    context.subscribe('database.schema', (schema) => {
      console.log('Admin UI detected schema update', schema);
    });
  }
};

export default adminUiModule;