In order to grant access for ISO images you must first grant `scan` action for underlying **SR**s.

If a `scan` action is granted for an SR and this is an ISO SR, then a `plug` action is granted for all underlying **ISO**s.

We do that by making changes in `vdis_user` table simultaneously with `srs_user` table.