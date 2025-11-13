# DynamicNFC Backend API Documentation

## 🆕 Recent Updates

**HashID System Implemented** *(November 13, 2025)*
- All user endpoints now support HashID (e.g., `WzBvz3`) alongside numeric IDs
- QR codes and public URLs use secure HashIDs for better user experience
- Backwards compatibility maintained for existing numeric ID usage

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
| companyLogo    | file        | optional | Image file                                                                      |
| profilePicture | file        | optional | Image file                                                                      |
| coverPhoto     | file        | optional | Image file                                                                      |
| socialLinks    | JSON string | optional | List of `{ "platform": "LinkedIn", "link": "https://linkedin.com/in/johndoe" }` |

### Example (Postman Form-Data)

| Key            | Value                                                                | Type |
| -------------- | -------------------------------------------------------------------- | ---- |
| name           | John Doe                                                             | Text |
| email          | [john@example.com](mailto:john@example.com)                          | Text |
| profilePicture | (choose file)                                                        | File |
| socialLinks    | `[{"platform":"LinkedIn","link":"https://linkedin.com/in/johndoe"}]` | Text |

### Response Example

```json
{
  "id": 15,
  "name": "John Doe",
  "email": "john@example.com",
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
| profilePicture | (choose file)                                                       | File |
| socialLinks    | `[{"platform":"Instagram","link":"https://instagram.com/janedoe"}]` | Text |

### Response Example

```json
{
  "id": 15,
  "name": "Jane Doe",
  "email": "john@example.com",
  "profilePicture": "data:image/png;base64,...",
  "socialLinks": [
    { "platform": "Instagram", "link": "https://instagram.com/janedoe" }
  ]
}
```

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

| Operation    | Method | Endpoint                 | Content-Type          | Description             | Frontend Page    | HashID Support |
| ------------ | ------ | ------------------------ | --------------------- | ----------------------- | ---------------- | -------------- |
| Request Card | `POST` | `/api/request-card`      | `application/json`    | Sends mail/logs request | Order Card       | ❌             |
| Save Card    | `POST` | `/api/users/upload`      | `multipart/form-data` | Create a new card       | Create My Card   | ✅ (Returns)   |
| Update Card  | `PUT`  | `/api/users/{id}/upload` | `multipart/form-data` | Update an existing card | Create My Card   | ✅ (Accepts)   |
| **View Card**| `GET`  | `/api/users/{id}`        | `application/json`    | **Display card publicly**| **View My Card** | **✅ Primary** |
| Get User     | `GET`  | `/api/users/{id}`        | –                     | Fetch single user       | –                | ✅ (Accepts)   |
| List Users   | `GET`  | `/api/users`             | –                     | Fetch all users         | –                | ✅ (Returns)   |

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
