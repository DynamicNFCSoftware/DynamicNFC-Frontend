# DynamicNFC Backend API Documentation

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

## 👀 4. View Card API (New!)

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

| Parameter | Type | Required | Description           |
| --------- | ---- | -------- | --------------------- |
| id        | Long | yes      | User/Card ID to view  |

### Response Example

```json
{
  "id": 15,
  "name": "John Doe",
  "jobTitle": "Software Engineer",
  "department": "Engineering",
  "companyName": "Dynamic NFC",
  "email": "john@example.com",
  "phone": "+1 647-555-2211",
  "companyUrl": "https://dynamicnfc.ca",
  "address": "123 King Street, Toronto",
  "profilePicture": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "coverPhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "companyLogo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "socialLinks": [
    { "platform": "LinkedIn", "link": "https://linkedin.com/in/johndoe" },
    { "platform": "Instagram", "link": "https://instagram.com/johndoe" }
  ]
}
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

| Operation    | Method | Endpoint                 | Content-Type          | Description             | Frontend Page    |
| ------------ | ------ | ------------------------ | --------------------- | ----------------------- | ---------------- |
| Request Card | `POST` | `/api/request-card`      | `application/json`    | Sends mail/logs request | Order Card       |
| Save Card    | `POST` | `/api/users/upload`      | `multipart/form-data` | Create a new card       | Create My Card   |
| Update Card  | `PUT`  | `/api/users/{id}/upload` | `multipart/form-data` | Update an existing card | Create My Card   |
| **View Card**| `GET`  | `/api/users/{id}`        | `application/json`    | **Display card publicly**| **View My Card** |
| Get User     | `GET`  | `/api/users/{id}`        | –                     | Fetch single user       | –                |
| List Users   | `GET`  | `/api/users`             | –                     | Fetch all users         | –                |

---

## 🎯 QR Code Integration

### QR Code Generation
- **Service:** `https://api.qrserver.com/v1/create-qr-code/`
- **Target URL:** `{domain}/view-my-card/{id}`
- **Usage:** QR codes generated in CreateMyCard now point to ViewMyCard page instead of edit page
- **Purpose:** Allow easy sharing of business cards via QR code scanning

### QR Code Flow
1. User creates card in CreateMyCard (`/create-my-card`)
2. QR code is generated pointing to ViewMyCard (`/view-my-card/{id}`)
3. When scanned, QR code opens public view of the card
4. Viewers can contact the card owner or save contact info

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