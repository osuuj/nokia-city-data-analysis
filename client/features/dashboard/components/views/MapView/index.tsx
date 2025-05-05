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

export { MapViewWithTheme as MapView };
export type { MapViewProps } from './MapView';
