import React from 'react';

import bookingItems from '@/components/filters/booking-items';
import FiltersWrapper from '@/components/filters/filters-wrapper';

export default function Component() {
  return <FiltersWrapper items={bookingItems} />;
}
