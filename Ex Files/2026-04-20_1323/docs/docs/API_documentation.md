# DynamicNFC Backend API Documentation

## 🆕 Recent Updates

**Edit Card API (JSON) Added** *(February 6, 2026)*
- New `PUT /api/users/{id}` endpoint with JSON body support
- Simpler alternative to multipart/form-data for text field updates
- Supports base64 encoded images in JSON body
- Ownership verification - only card owner can edit

**Authentication System Implemented** *(December 4, 2025)*
- Login/Register system with Account table integration
- Session-based authentication with Spring Security
- Account-UserEntity relationship (one-to-many)
- Protected endpoints requiring authentication

**HashID System Implemented** *(November 13, 2025)*
- All user endpoints now support HashID (e.g., `WzBvz3`) alongside numeric IDs
- QR codes and public URLs use secure HashIDs for better user experience
- Backwards compatibility maintained for existing numeric ID usage

## 🔐 Authentication API

**Purpose:** Handle user authentication, registration, and session management.

**Controller:** `AuthController`

### 1. User Login

```
POST /api/auth/login
```

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "accountId": 1,
  "email": "user@example.com"
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

### 2. User Registration

```
POST /api/auth/register
```

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Registration successful",
  "accountId": 2,
  "email": "newuser@example.com"
}
```

**Error Response (400):**
```json
{
  "error": "Email already exists"
}
```

### 3. User Logout

```
POST /api/auth/logout
```

**Content-Type:** `application/json`

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

**Authentication Notes:**
- Session-based authentication using cookies
- Include `credentials: 'include'` in frontend requests
- Protected endpoints return 401 if not authenticated
- Account table stores user credentials with bcrypt password hashing

## 📊 Database Schema

### Account Table
```sql
CREATE TABLE account (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### UserEntity Table (Updated)
```sql
CREATE TABLE user_entity (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT REFERENCES account(id),
    hash_id VARCHAR(255) UNIQUE,
    -- other existing fields...
);
```

**Relationship:** Account (1) → UserEntity (Many)

## 🔒 Protected Endpoints

The following endpoints require authentication. Frontend must include session cookies in requests:

- `POST /api/users` - Create new user profile
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update user profile
- `DELETE /api/users/{id}` - Delete user profile
- `GET /api/users/search` - Search users
- All UserEntity CRUD operations

## 🌐 Frontend Integration Guide

### Authentication Setup
```javascript
// Login request
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important: includes session cookies
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// For protected API calls
const userResponse = await fetch('/api/users/1', {
  method: 'GET',
  credentials: 'include' // Always include for protected endpoints
});
```

### Error Handling
```javascript
if (response.status === 401) {
  // User not authenticated - redirect to login
  window.location.href = '/login';
}
```

### Session Management
- Login successful: Store user info in localStorage/context
- Session expires: Backend returns 401, frontend should redirect to login
- Logout: Call `/api/auth/logout` then clear frontend state

## 📩 1. Request Card API

**Purpose:** User submits a card request form.

**Controller:** `RequestCardController`

### Endpoint

```
POST /api/request-card
```

### Content-Type

```
application/json
```

### Request Body Example

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 647-555-2211",
  "company": "Dynamic NFC",
  "jobTitle": "Software Engineer",
  "address": "123 King Street, Toronto",
  "notes": "I would like a matte finish card.",
  "plan": "premium"
}
```

### Response

**Success:**

```json
"sent"
```

**If mail not configured:**

```json
"logged"
```

**Error:**

```json
"mail send failed: <error message>"
```

---

## 💾 2. Save (Create) Card API

**Purpose:** Create a new user/card profile.

**Controller:** `UserController.createUserWithFiles`

### Endpoint

```
POST /api/users/upload
```

### Content-Type

```
multipart/form-data
```

### Request Fields

| Field          | Type        | Required | Description                                                                     |
| -------------- | ----------- | -------- | ------------------------------------------------------------------------------- |
| name           | string      | optional | Full name                                                                       |
| jobTitle       | string      | optional | Job title                                                                       |
| department     | string      | optional | Department name                                                                 |
| companyName    | string      | optional | Company name                                                                    |
| email          | string      | optional | Email address                                                                   |
| phone          | string      | optional | Phone number                                                                    |
| companyUrl     | string      | optional | Website URL                                                                     |
| address        | string      | optional | Address                                                                         |
| backgroundColor| string      | optional | Card background color (hex format, e.g., "#FFFFFF"). Default: "#FFFFFF"      |
| companyLogo    | file        | optional | Image file                                                                      |
| profilePicture | file        | optional | Image file                                                                      |
| coverPhoto     | file        | optional | Image file                                                                      |
| socialLinks    | JSON string | optional | List of `{ "platform": "LinkedIn", "link": "https://linkedin.com/in/johndoe" }` |

### Example (Postman Form-Data)

| Key            | Value                                                                | Type |
| -------------- | -------------------------------------------------------------------- | ---- |
| name           | John Doe                                                             | Text |
| email          | [john@example.com](mailto:john@example.com)                          | Text |
| backgroundColor| #E3F2FD                                                              | Text |
| profilePicture | (choose file)                                                        | File |
| socialLinks    | `[{"platform":"LinkedIn","link":"https://linkedin.com/in/johndoe"}]` | Text |

### Response Example

```json
{
  "id": 15,
  "name": "John Doe",
  "email": "john@example.com",
  "backgroundColor": "#E3F2FD",
  "profilePicture": "data:image/png;base64,...",
  "socialLinks": [
    { "platform": "LinkedIn", "link": "https://linkedin.com/in/johndoe" }
  ]
}
```

---

## ✏️ 3. Update Card API

**Purpose:** Update an existing user/card profile.

**Controller:** `UserController.updateUserWithFiles`

### Endpoint

```
PUT /api/users/{id}/upload
```

*(Also supports `POST` method)*

### Content-Type

```
multipart/form-data
```

### Request Fields

Same as **Save Card** endpoint. Only changed fields need to be sent.

### Example (Form-Data)

| Key            | Value                                                               | Type |
| -------------- | ------------------------------------------------------------------- | ---- |
| name           | Jane Doe                                                            | Text |
| backgroundColor| #F3E5F5                                                             | Text |
| profilePicture | (choose file)                                                       | File |
| socialLinks    | `[{"platform":"Instagram","link":"https://instagram.com/janedoe"}]` | Text |

### Response Example

```json
{
  "id": 15,
  "name": "Jane Doe",
  "email": "john@example.com",
  "backgroundColor": "#F3E5F5",
  "profilePicture": "data:image/png;base64,...",
  "socialLinks": [
    { "platform": "Instagram", "link": "https://instagram.com/janedoe" }
  ]
}
```

---

## ✏️ 3.1 Edit Card API (JSON)

**Purpose:** Edit an existing user/card profile using JSON body. This is a simpler alternative to the multipart/form-data endpoint when you don't need to upload new files.

**Controller:** `UserController.editCard`

### Endpoint

```
PUT /api/users/{id}
```

### Content-Type

```
application/json
```

### URL Parameters

| Parameter | Type   | Required | Description                            |
| --------- | ------ | -------- | -------------------------------------- |
| id        | String | yes      | HashID (e.g., "WzBvz3") or numeric ID |

### Request Body

All fields are optional. Only provided fields will be updated.

```json
{
  "name": "Jane Doe",
  "jobTitle": "Senior Developer",
  "department": "Engineering",
  "companyName": "Tech Corp",
  "email": "jane@example.com",
  "phone": "+1-555-1234",
  "companyUrl": "https://techcorp.com",
  "address": "123 Tech Street",
  "backgroundColor": "#F0FDF4",
  "profilePicture": "data:image/png;base64,...",
  "coverPhoto": "data:image/jpeg;base64,...",
  "companyLogo": "data:image/png;base64,...",
  "socialLinks": [
    { "platform": "LinkedIn", "link": "https://linkedin.com/in/janedoe" },
    { "platform": "Twitter", "link": "https://twitter.com/janedoe" }
  ]
}
```

### Request Fields

| Field           | Type              | Required | Description                                      |
| --------------- | ----------------- | -------- | ------------------------------------------------ |
| name            | string            | optional | Full name                                        |
| jobTitle        | string            | optional | Job title                                        |
| department      | string            | optional | Department name                                  |
| companyName     | string            | optional | Company name                                     |
| email           | string            | optional | Email address                                    |
| phone           | string            | optional | Phone number                                     |
| companyUrl      | string            | optional | Website URL                                      |
| address         | string            | optional | Address                                          |
| backgroundColor | string            | optional | Hex color code (e.g., "#FFFFFF")                |
| profilePicture  | string            | optional | Base64 encoded image (data URL format)          |
| coverPhoto      | string            | optional | Base64 encoded image (data URL format)          |
| companyLogo     | string            | optional | Base64 encoded image (data URL format)          |
| socialLinks     | array             | optional | List of social link objects                     |

### Response Example

```json
{
  "id": 15,
  "hashId": "WzBvz3",
  "name": "Jane Doe",
  "jobTitle": "Senior Developer",
  "email": "jane@example.com",
  "backgroundColor": "#F0FDF4",
  "profilePicture": "data:image/png;base64,...",
  "socialLinks": [
    { "id": 1, "platform": "LinkedIn", "link": "https://linkedin.com/in/janedoe" }
  ]
}
```

### Error Responses

**Not authenticated (401):**
```json
{
  "status": 401,
  "error": "Unauthorized"
}
```

**Card not owned by user (403):**
```json
{
  "status": 403,
  "error": "Forbidden"
}
```

**Card not found (404):**
```json
{
  "status": 404,
  "error": "Not Found"
}
```

### Example API Call (cURL)

```bash
curl -X PUT "http://localhost:8080/api/users/WzBvz3" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=your-session-id" \
  -d '{
    "name": "Jane Doe Updated",
    "jobTitle": "Lead Developer",
    "backgroundColor": "#EFF6FF"
  }'
```

### Example API Call (JavaScript)

```javascript
const response = await fetch('/api/users/WzBvz3', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    name: 'Jane Doe Updated',
    jobTitle: 'Lead Developer',
    backgroundColor: '#EFF6FF'
  })
});

const updatedCard = await response.json();
```

### When to Use This vs Update Card API (3)

| Use Case                              | Recommended Endpoint              |
| ------------------------------------- | --------------------------------- |
| Updating text fields only             | `PUT /api/users/{id}` (JSON)      |
| Uploading new image files             | `PUT /api/users/{id}/upload` (multipart) |
| Updating everything including images  | Either works                      |
| Frontend with base64 images in state  | `PUT /api/users/{id}` (JSON)      |
| Frontend with File objects            | `PUT /api/users/{id}/upload` (multipart) |

---

## 👀 4. View Card API (HashID Supported!)

**Purpose:** Display a user's digital business card in view-only mode. This is used by the ViewMyCard page to show card information to visitors.

**Controller:** `UserController.getUserById`
**Frontend Route:** `/view-my-card/{id}`

### Endpoint

```
GET /api/users/{id}
```

### Content-Type

```
application/json
```

### URL Parameters

| Parameter | Type        | Required | Description                                |
| --------- | ----------- | -------- | ------------------------------------------ |
| id        | String/Long | yes      | HashID (e.g., "WzBvz3") or numeric ID     |

### HashID Support 🔐

- **Primary Method:** Use encoded hashId (e.g., `WzBvz3`, `wzpaG8`) 
- **Fallback:** Numeric ID still supported for backwards compatibility
- **Security:** HashIDs prevent ID enumeration attacks
- **URL Friendly:** Short, clean URLs for sharing

### Response Example

```json
{
  "id": 24,
  "hashId": "WzBvz3",
  "name": "Alice Doe",
  "jobTitle": "Junior Software Engineer",
  "department": "TT Department",
  "companyName": "dynamicMed",
  "email": "gulseren.fedakar@gmail.com",
  "phone": "4374292711",
  "companyUrl": "www.dynamicnfc.ca",
  "address": "80 Massachusetts Lane",
  "backgroundColor": "#F0FDF4",
  "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "coverPhoto": null,
  "companyLogo": "data:image/jpeg;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYx...",
  "socialLinks": [
    { "id": 95, "platform": "facebook", "link": "www.facebook.com/alice" }
  ]
}
```

### Example API Calls

**Using HashID (Recommended):**
```bash
GET /api/users/WzBvz3
```

**Using Numeric ID (Backwards Compatibility):**
```bash
GET /api/users/24
```

### Frontend Features

- **QR Code Generation:** Automatically generates QR code pointing to the view page URL
- **Contact Actions:** 
  - 📞 Contact Now (phone or email)
  - 📧 Send Email (direct mailto link)
  - 💾 Save to Contacts (downloads VCard file)
- **Responsive Design:** Card preview matches CreateMyCard styling exactly
- **Image Display:** Shows profile picture, cover photo, and company logo if available

### Error Responses

**Card not found:**

```json
{
  "status": 404,
  "error": "Not Found"
}
```

**Server error:**

```json
{
  "status": 500,
  "error": "Internal Server Error"
}
```

---

## 🌐 5. Supporting Endpoints

### Get All Users

```
GET /api/users
```

Response:

```json
[
  { "id": 1, "name": "John Doe", ... },
  { "id": 2, "name": "Jane Smith", ... }
]
```

### Get Single User (by ID)

```
GET /api/users/{id}
```

Response:

```json
{
  "id": 15,
  "name": "Jane Doe",
  "email": "john@example.com"
}
```

---

## 🧬 Summary for Frontend Team

| Operation    | Method   | Endpoint                 | Content-Type          | Description               | Frontend Page    | HashID Support |
| ------------ | -------- | ------------------------ | --------------------- | ------------------------- | ---------------- | -------------- |
| Request Card | `POST`   | `/api/request-card`      | `application/json`    | Sends mail/logs request   | Order Card       | ❌             |
| Save Card    | `POST`   | `/api/users/upload`      | `multipart/form-data` | Create a new card         | Create My Card   | ✅ (Returns)   |
| Update Card  | `PUT`    | `/api/users/{id}/upload` | `multipart/form-data` | Update card (with files)  | Create My Card   | ✅ (Accepts)   |
| **Edit Card**| `PUT`    | `/api/users/{id}`        | `application/json`    | **Edit card (JSON body)** | Create My Card   | ✅ (Accepts)   |
| **View Card**| `GET`    | `/api/users/{id}`        | `application/json`    | **Display card publicly** | **View My Card** | **✅ Primary** |
| Delete Card  | `DELETE` | `/api/users/{id}`        | –                     | Delete a card             | My Cards         | ✅ (Accepts)   |
| Get User     | `GET`    | `/api/users/{id}`        | –                     | Fetch single user         | –                | ✅ (Accepts)   |
| List Users   | `GET`    | `/api/users`             | –                     | Fetch all users           | –                | ✅ (Returns)   |
| My Cards     | `GET`    | `/api/users/my-cards`    | –                     | Get cards for account     | My Cards         | ✅ (Returns)   |

---

## 🎯 QR Code Integration (HashID Enhanced!)

### QR Code Generation
- **Service:** `https://api.qrserver.com/v1/create-qr-code/`
- **Target URL:** `{domain}/view-my-card/{hashId}` (uses HashID for security)
- **Usage:** QR codes generated with encoded HashIDs for clean, secure URLs
- **Purpose:** Allow easy sharing of business cards via QR code scanning

### QR Code Flow (Updated)
1. User creates card in CreateMyCard (`/create-my-card`)
2. Backend generates unique HashID (e.g., `WzBvz3`) for the user
3. QR code is generated pointing to ViewMyCard (`/view-my-card/WzBvz3`)
4. When scanned, QR code opens public view using secure HashID
5. Viewers can contact the card owner or save contact info

### HashID Benefits for QR Codes
- **Clean URLs:** `/view-my-card/WzBvz3` instead of `/view-my-card/24`
- **Security:** Prevents ID enumeration attacks
- **Scalability:** No sequential ID exposure
- **Professional:** Short, memorable codes for business cards

---

## 🔐 HashID System

### Overview
The system uses HashIDs to encode numeric database IDs into short, URL-safe strings for better security and user experience.

### Configuration
- **Salt:** `DynamicNFC-Secret-Salt-2024`
- **Minimum Length:** 6 characters
- **Alphabet:** `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`

### Example Conversions
| Database ID | HashID   | Usage                                    |
| ----------- | -------- | ---------------------------------------- |
| 24          | `WzBvz3` | `/view-my-card/WzBvz3`                   |
| 83          | `wzpaG8` | `/view-my-card/wzpaG8`                   |
| 1           | `jR`     | `/view-my-card/jR` (shorter for small IDs) |

### Implementation Details
- **Generation:** Auto-generated when user is created/updated
- **Storage:** Stored in `user_entity.hash_id` column
- **API Support:** All user endpoints accept both HashID and numeric ID
- **Frontend Priority:** Use HashID for all public URLs and QR codes

### Security Benefits
- **No ID Enumeration:** Cannot guess other user IDs
- **Clean URLs:** Professional looking links
- **Reversible:** Can decode back to original ID for database queries
- **Consistent Length:** Predictable URL structure

---

## 🎨 Background Color Customization

### Overview
The backgroundColor field allows users to customize their digital business card's background color for better branding and visual appeal.

### Implementation Details
- **Field Name:** `backgroundColor`
- **Format:** Hex color code (e.g., `#FFFFFF`, `#E3F2FD`)
- **Default Value:** `#FFFFFF` (white)
- **Frontend UI:** Color picker + 8 preset color options
- **Storage:** String field in database
- **API Support:** Available in both create and update endpoints

### Preset Color Options (Frontend)
| Color Name    | Hex Code  | Description    |
| ------------- | --------- | -------------- |
| White         | `#FFFFFF` | Default white  |
| Light Gray    | `#F8FAFC` | Subtle gray    |
| Light Blue    | `#EFF6FF` | Soft blue      |
| Light Green   | `#F0FDF4` | Soft green     |
| Light Red     | `#FEF3F2` | Soft red       |
| Light Yellow  | `#FFFBEB` | Soft yellow    |
| Light Purple  | `#F5F3FF` | Soft purple    |
| Light Pink    | `#FDF2F8` | Soft pink      |

### Usage Examples

**Create Card with Background Color:**
```
POST /api/users/upload
Content-Type: multipart/form-data

backgroundColor: #E3F2FD
name: John Doe
email: john@example.com
```

**Update Background Color:**
```
PUT /api/users/24/upload
Content-Type: multipart/form-data

backgroundColor: #F0FDF4
```

### Frontend Integration
- **CreateMyCard:** Color picker with live preview
- **ViewMyCard:** Card background dynamically styled with selected color
- **Real-time Preview:** Color changes reflect immediately in card preview
- **Validation:** Frontend ensures valid hex color format

---

## 🔄 Image Handling

All image files (profilePicture, coverPhoto, companyLogo) are:
- **Uploaded as:** `multipart/form-data` files
- **Stored as:** Base64 encoded strings in database  
- **Returned as:** Data URLs (`data:image/jpeg;base64,...`)
- **Frontend Usage:** Can be directly used in `<img src="">` tags

### Supported Image Types
- JPEG/JPG
- PNG  
- GIF
- WebP
- Any valid image MIME type

---

## 🌍 CORS Configuration

The backend accepts requests from:
- `localhost:3000-3002` (development)
- `3.128.244.219:3000-3002` (staging)
- `dynamicnfc.ca` and `www.dynamicnfc.ca` (production)
- Both HTTP and HTTPS protocols supported