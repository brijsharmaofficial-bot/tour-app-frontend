import { UrlSegment, Route, UrlSegmentGroup, UrlMatchResult } from '@angular/router';

const staticRoutes = [
  'about-us', 'oneway', 'local', 'round-trip', 'airport',
  'booking-info', 'payment-details', 'booking-confirm',
  'payment-success', 'payment-failed', 'user-profile'
];

export function pageSlugMatcher(segments: UrlSegment[], group: UrlSegmentGroup, route: Route): UrlMatchResult | null {
  if (segments.length === 1 && !staticRoutes.includes(segments[0].path)) {
    return {
      consumed: segments,
      posParams: {
        slug: segments[0]
      }
    };
  }
  return null;
}
