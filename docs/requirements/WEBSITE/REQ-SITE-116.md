# REQ-SITE-116: Organization Admin Panel

## Metadata
- **Category**: WEBSITE
- **Subcategory**: ORG_ADMIN
- **Priority**: P0
- **Status**: COMPLETE
- **External ID**: rtmx-ai/REQ-MONO-025

## Requirement

rtmx.ai SHALL provide `/orgs/{slug}/admin` for org owners and admins to
list members, change roles, and link to billing. Members/viewers SHALL
be denied.

## Acceptance Criteria

- [x] Admin panel lists members from `GET /orgs/{id}/members`.
- [x] Role changes call PATCH.
- [x] Non-admin sees an access denied state.
- [x] Link to `/billing/manage`.
