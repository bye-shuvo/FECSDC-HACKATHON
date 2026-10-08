# Admin Routes

The admin pages are read-only, server-rendered HTML pages mounted under `/admin`.

## Configure Access

Set these server-side environment variables before starting the backend:

```env
ADMIN_USER=your-admin-username
ADMIN_PASSWORD=use-a-long-unique-password
```

`ADMIN_PASSWORD` must be at least 12 characters. Set both variables in the Render service environment for deployment. Do not use `VITE_` variable names, place credentials in a URL, or commit real credentials. Restart the backend after changing either value.

The routes use HTTP Basic Authentication. Open an admin URL in a browser and enter the configured username and password when prompted. Requests without valid credentials receive `401`; after five failed attempts from one client IP during a 15-minute window, further requests receive `429` with a `Retry-After` header. If either variable is missing or the password is too short, admin requests return `503 Admin disabled`; the rest of the API remains available.

## Pages

| Method | Path | Content |
|---|---|---|
| GET | `/admin` | User, submission, and question totals; five latest users and submissions |
| GET | `/admin/users` | Users with registration dates and submission counts |
| GET | `/admin/submissions` | Submissions with user, question, repository, README, and submission details |
| GET | `/admin/anything-else` | Admin-styled 404 page |

The page navigation links to Dashboard, Users, and Submissions. No admin page provides data-changing actions.

## List Options

The users and submissions pages accept these query parameters:

- `page`: positive page number; defaults to `1`.
- `limit`: rows per page; defaults to `50` and is capped at `200` for HTML pages.
- `q`: text search. Users are searched by name, HackerRank username, and email. Submissions are searched by user name/email, question category/text, and GitHub/README URLs.
- `format=csv`: download the current list page as CSV. CSV limits are capped at `10,000` rows.

Pagination links retain the search and page-size options. Examples:

```text
/admin/users?page=2&limit=50
/admin/users?q=sample&limit=25
/admin/submissions?q=algorithms
/admin/submissions?format=csv&limit=10000
```

CSV values are quoted, embedded quotes are doubled, and spreadsheet-formula prefixes are neutralized. HTML output escapes stored values; GitHub and README values are links only when they begin with `https://`.

## Responses and Security

Admin pages use `no-store`, `noindex`, and restrictive browser security headers. Database failures return a generic HTML `500` page; details are not returned to the browser. Admin request errors are handled within the admin router.
