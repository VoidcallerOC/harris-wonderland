# Harris in Wonderland

Canton, Connecticut reptile shop — live Square catalog, on-site cart, pickup on Route 44.

**This repository (`VoidcallerOC/harris-wonderland`) is the current production application.** [`VoidcallerOC/Harris`](https://github.com/VoidcallerOC/Harris) is the reusable client-site template and legacy source. Changes intended for the live Canton site belong here.

## Square checkout

Inventory is pulled live from the Harris Square Online catalog. Cart and checkout stay on this site.

To take cards **on the page** (Square Web Payments, no redirect):

1. Create a production application at [developer.squareup.com](https://developer.squareup.com/apps)
2. Allow this site’s domain under Web Payments SDK
3. In Vercel project env (not a committed `.env`):

```
SQUARE_ACCESS_TOKEN=
SQUARE_APPLICATION_ID=
VITE_SQUARE_APPLICATION_ID=
SQUARE_LOCATION_ID=3DKC91D1D0V6X
```

Until those are set, Pay with Square still routes through Harris’s Square Online product checkout as a Canton pickup.

Location `3DKC91D1D0V6X` and merchant `DS6T9M4TDWYFT` are the shop’s public Square IDs.
