# Members CRUD System - Documentation

A modern, full-featured member management system built with Nuxt 4, Elysia, and DaisyUI.

## Features

### Core CRUD Operations
- ✅ **Create** - Add new members with comprehensive form validation
- ✅ **Read** - Browse members with pagination, search, and sorting
- ✅ **Update** - Edit member information with real-time validation
- ✅ **Delete** - Remove members with confirmation dialogs

### User Experience
- 🎨 **Modern UI/UX** - Clean, professional interface with DaisyUI components
- 🎭 **Smooth Animations** - Fade-in, slide-in effects for better visual feedback
- 🔍 **Advanced Search** - Search across name, email, and city fields
- 📊 **Pagination** - Navigate through large datasets efficiently
- ↕️ **Sortable Columns** - Click column headers to sort data
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- ⌨️ **Keyboard Shortcuts** - Power user shortcuts for common actions
- 🔔 **Toast Notifications** - Real-time feedback for all operations
- 🌈 **Empty States** - Helpful messages when no data is available

### Technical Features
- 🔒 **Form Validation** - Client-side validation with helpful error messages
- 🚀 **Type Safety** - Full TypeScript support with Eden Treaty client
- 🎯 **State Management** - Reactive state with Vue Composition API
- 🔄 **Hot Module Replacement** - Instant updates during development
- 📚 **API Documentation** - Auto-generated Swagger/OpenAPI docs
- 💾 **SQLite Database** - Lightweight, file-based database with Drizzle ORM
- 🧪 **Test Ready** - Structured for easy unit and integration testing

## Project Structure

```
app/
├── assets/css/
│   └── main.css                  # Global styles with animations
├── components/
│   ├── ConfirmDialog.vue         # Confirmation dialog for destructive actions
│   ├── EmptyState.vue            # Empty state placeholder with actions
│   ├── LoadingSpinner.vue        # Loading indicator component
│   ├── MemberForm.vue            # Reusable form for create/edit
│   ├── Modal.vue                 # Generic modal wrapper
│   ├── Pagination.vue            # Pagination controls
│   ├── Table.vue                 # Reusable table component
│   └── ToastContainer.vue        # Toast notification container
├── composables/
│   ├── useMembersTable.ts        # Members table state and logic
│   └── useToast.ts               # Toast notification system
├── layouts/
│   └── default.vue               # Main layout with header and footer
├── pages/
│   ├── index.vue                 # Home page (redirects to /members)
│   └── members/
│       └── index.vue             # Members CRUD page
└── utils/
    └── membersApi.ts             # API helper functions

server/
└── db/
    ├── index.ts                  # Database connection
    ├── schema.ts                 # Drizzle schema definitions
    └── seed.ts                   # Database seeding script

api.ts                            # Elysia API routes (GET, POST, PATCH, DELETE)
```

## API Endpoints

### GET /members
Retrieve paginated list of members with optional filtering and sorting.

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search query for firstName, lastName, email, or city
- `sortBy` - Field to sort by (default: id)
- `sortOrder` - Sort order: asc or desc (default: asc)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "081-234-5678",
      "age": 30,
      "city": "Bangkok",
      "status": "active",
      "joinDate": "2025-01-01",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### POST /members
Create a new member.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "081-234-5678",
  "age": 30,
  "city": "Bangkok",
  "status": "active"
}
```

**Response:** Returns the created member object (201 Created)

### PATCH /members/:id
Update an existing member.

**Request Body:** (all fields optional)
```json
{
  "firstName": "Jane",
  "status": "inactive"
}
```

**Response:** Returns the updated member object (200 OK)

### DELETE /members/:id
Delete a member by ID.

**Response:**
```json
{
  "success": true,
  "message": "Member deleted successfully"
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Focus search input |
| `Cmd/Ctrl + N` | Open create member modal |
| `Esc` | Close any open modal/dialog |
| `Enter` | Submit form (when in form) |

## Form Validation Rules

### Member Form
- **First Name** - Required, minimum 1 character
- **Last Name** - Required, minimum 1 character
- **Email** - Required, valid email format, unique in database
- **Phone** - Required, numeric format (allows dashes)
- **Age** - Required, between 1-150
- **City** - Required, minimum 1 character
- **Status** - Required, must be 'active' or 'inactive'

## Development

### Start Development Server
```bash
bun run dev
```

The app will be available at http://localhost:3001/

### Build for Production
```bash
bun run build
```

### Run Production Server
```bash
bun run start
```

### Database Management

Seed the database with sample data:
```bash
bun run server/db/seed.ts
```

## UI Components

### Modal
Reusable modal component with backdrop blur, animations, and customizable sizes (sm, md, lg, xl).

### ConfirmDialog
Confirmation dialog for destructive actions (delete, etc.) with type-based styling (info, warning, error, success).

### Toast Notifications
Auto-dismissing toast notifications for user feedback:
- Success messages (green)
- Error messages (red)
- Info messages (blue)
- Warning messages (yellow)

### EmptyState
Placeholder component shown when there's no data, with optional action buttons.

### Table
Feature-rich table component with:
- Sortable columns
- Column pinning (sticky headers/columns)
- Custom cell formatting
- Loading skeleton state
- Zebra striping

## Styling

The project uses:
- **TailwindCSS v4** - Utility-first CSS framework
- **DaisyUI v5** - Component library for Tailwind
- **Custom Animations** - Fade-in, slide-in effects for smooth UX

### Custom Animation Classes
- `.animate-fade-in` - Fade in with slight upward movement
- `.animate-slide-in-right` - Slide in from right
- Smooth hover effects on buttons and cards
- Smooth transitions on table rows

## Best Practices

1. **Type Safety** - All API calls are type-safe using Eden Treaty
2. **Error Handling** - Comprehensive error handling with user-friendly messages
3. **Validation** - Both client-side and server-side validation
4. **Accessibility** - Semantic HTML, keyboard navigation support
5. **Performance** - Pagination to handle large datasets efficiently
6. **UX** - Loading states, empty states, and instant feedback
7. **Reusability** - Components are modular and reusable

## Future Enhancements

Potential improvements for the system:
- [ ] Bulk operations (delete multiple, export CSV)
- [ ] Advanced filters (by status, age range, date range)
- [ ] Member profile pages
- [ ] Activity/audit logs
- [ ] Image upload for member avatars
- [ ] Authentication and authorization
- [ ] Role-based access control
- [ ] Email notifications
- [ ] Dark mode support
- [ ] Mobile app using the same API

## License

MIT

---

Built with ❤️ using Nuxt 4, Elysia, and DaisyUI
