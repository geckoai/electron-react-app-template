/// <reference types="@types/node" />
/// <reference types="@types/react" />
/// <reference types="@types/react-dom" />
/// <reference types="@geckoai/electron-react-scripts/src/react-app" />

interface Window {
  WAVES(ops: {
    color: number;
    el: HTMLDivElement;
    gyroControls: boolean;
    scale: number;
    minWidth: number;
    zoom: number;
    waveSpeed: number;
    waveHeight: number;
    minHeight: number;
    shininess: number;
    mouseControls: boolean;
    scaleMobile: number;
    touchControls: boolean
  }): VantaEffect<EffectWavesOps>;
}

var window: Window & typeof globalThis;


declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare type NullLike<T> = null | T;

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare interface BPMNContextPadProvider {
  $inject: string[];
}

declare interface BPMNModule {
  contextPadProvider: [string, BPMNContextPadProvider];
}

declare module 'bpmn-js-embedded-comments' {
  declare var m: BPMNModule;
  export default m;
}

declare module 'diagram-js-minimap' {
  declare var m: BPMNModule;
  export default m;
}

declare module 'camunda-transaction-boundaries' {
  declare var m: BPMNModule;
  export default m;
}

declare module 'bpmn-js-color-picker' {
  declare var m: BPMNModule;
  export default m;
}

declare module 'bpmn-js-properties-panel' {
  export var BpmnPropertiesPanelModule: BPMNModule;
  export var BpmnPropertiesProviderModule: BPMNModule;
  export var CamundaPlatformPropertiesProviderModule: BPMNModule;
  export var ZeebePropertiesProviderModule: BPMNModule;

  export default {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule,
    ZeebePropertiesProviderModule,
  };
}

declare module 'react-color' {
  import { FC } from 'react';
  export const SketchPicker: FC<any>;
}
