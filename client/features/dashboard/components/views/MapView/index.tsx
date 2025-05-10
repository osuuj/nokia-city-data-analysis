'use client';

import { MapView, type MapViewProps } from './MapView';
import { ThemeAwareMapWrapper } from './ThemeAwareMapWrapper';

export function MapViewWithTheme(props: MapViewProps) {
  return (
    <ThemeAwareMapWrapper>
      <MapView {...props} />
    </ThemeAwareMapWrapper>
  );
}

export type { MapViewProps } from './MapView';
export { MapViewWithTheme as MapView };
