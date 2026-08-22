# Validation Utility — `validation.js`

**File:** [`UI/src/utils/validation.js`](file:///d:/Hackathon-UI/UI/src/utils/validation.js)

This module exports two pure validation functions used across the application's authentication forms. Both functions follow a consistent return contract and are fully RFC-aligned.

---

## Return Contract

Every function in this module returns the same shape:

```ts
{ isValid: boolean, message: string }
```

| Field     | Type      | Description                                                |
| --------- | --------- | ---------------------------------------------------------- |
| `isValid` | `boolean` | `true` if input passes all checks, `false` otherwise       |
| `message` | `string`  | Human-readable error string. Empty string `''` when valid. |

---

## `validateEmail(email)`

Validates an email address against 17 sequential checks (RFC 5321 / RFC 5322 aligned).

### Signature

```js
import { validateEmail } from '@/utils/validation';

const result = validateEmail('user@example.com');
// -> { isValid: true, message: '' }
```

### Parameters

| Param   | Type     | Description                                          |
| ------- | -------- | ---------------------------------------------------- |
| `email` | `string` | The raw email string to validate (untrimmed is fine) |

---

### Validation Checks (in order)

#### Structural

| #   | Rule                         | Triggers on                | Error Message                                                                     |
| --- | ---------------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| 1   | Non-empty input              | `""`, `"   "`, `null`      | `Please enter your email address`                                                 |
| 2   | No internal whitespace       | `"a b@x.com"`              | `Email address cannot contain spaces`                                             |
| 3   | Max 254 characters total     | String > 254 chars         | `Email address cannot exceed 254 characters`                                      |
| 4   | Must contain exactly one `@` | `"nodomain"`, `"a@@b.com"` | `Email address must contain an '@' symbol` / `...can only contain one '@' symbol` |

#### Local-Part (before `@`)

| #   | Rule                                       | Triggers on                  | Error Message                                              |
| --- | ------------------------------------------ | ---------------------------- | ---------------------------------------------------------- |
| 5   | Non-empty local part                       | `"@domain.com"`              | `Email address must have a username before the '@' symbol` |
| 6   | Max 64 characters                          | Local part > 64 chars        | `The part before '@' cannot exceed 64 characters`          |
| 7   | No leading dot                             | `".user@x.com"`              | `Email address cannot begin with a dot`                    |
| 8   | No trailing dot                            | `"user.@x.com"`              | `The username part cannot end with a dot`                  |
| 9   | No consecutive dots                        | `"us..er@x.com"`             | `Email address cannot contain consecutive dots`            |
| 10  | Allowed chars only (`A-Za-z0-9 . _ % + -`) | `"u$er@x.com"`, `"u#@x.com"` | `Email username contains invalid characters`               |

#### Domain (after `@`)

| #   | Rule                                     | Triggers on                                        | Error Message                                                                                                                                                            |
| --- | ---------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 11  | Non-empty domain                         | `"user@"`                                          | `Email address must contain a domain after the '@' symbol`                                                                                                               |
| 12  | Domain cannot start or end with a dot    | `"wewe@.com.in"`, `"user@domain."`                 | `Email domain cannot start with a dot` / `...cannot end with a dot`                                                                                                      |
| 13  | Domain cannot start or end with a hyphen | `"user@-x.com"`, `"user@x-.com"`                   | `Email domain cannot start or end with a hyphen`                                                                                                                         |
| 14  | Domain must contain at least one dot     | `"user@localhost"`                                 | `Email address is missing a top-level domain (e.g. .com)`                                                                                                                |
| 15  | Per-label validation (split on `.`)      | `"user@x..com"`, `"user@x_.com"`, label > 63 chars | `Email domain contains consecutive or misplaced dots` / `...invalid characters` / `...cannot exceed 63 characters` / `Domain segments cannot start or end with a hyphen` |
| 16  | TLD must be alpha-only, 2-63 chars       | `"user@x.c0m"`, `"user@x.1"`, `"user@x.a"`         | `Top-level domain must contain only letters (e.g. .com, .org, .in)` / `...must be at least 2 characters`                                                                 |
| 17  | At least one non-TLD domain label        | Belt-and-braces guard                              | `Email address is missing a domain name before the top-level domain`                                                                                                     |

> **Note:** Check #12 (domain cannot start with a dot) is what specifically fixes `wewe@.com.in`.
> The old implementation's `lastDotIndex === 0` check only caught single-dot domains — for `.com.in` the last dot is at index 4, so it passed through.

---

### Valid / Invalid Examples

```js
validateEmail(''); // INVALID — Please enter your email address
validateEmail('   '); // INVALID — Please enter your email address
validateEmail('nodomain'); // INVALID — Email address must contain an '@' symbol
validateEmail('a@@b.com'); // INVALID — Email address can only contain one '@' symbol
validateEmail('@domain.com'); // INVALID — Email address must have a username before the '@' symbol
validateEmail('.user@domain.com'); // INVALID — Email address cannot begin with a dot
validateEmail('user.@domain.com'); // INVALID — The username part cannot end with a dot
validateEmail('us..er@domain.com'); // INVALID — Email address cannot contain consecutive dots
validateEmail('u$er@domain.com'); // INVALID — Email username contains invalid characters
validateEmail('wewe@.com.in'); // INVALID — Email domain cannot start with a dot
validateEmail('user@domain.'); // INVALID — Email domain cannot end with a dot
validateEmail('user@-domain.com'); // INVALID — Email domain cannot start or end with a hyphen
validateEmail('user@localhost'); // INVALID — Email address is missing a top-level domain (e.g. .com)
validateEmail('user@x..com'); // INVALID — Email domain contains consecutive or misplaced dots
validateEmail('user@x.c0m'); // INVALID — Top-level domain must contain only letters
validateEmail('user@x.a'); // INVALID — Top-level domain must be at least 2 characters

validateEmail('user@example.com'); // VALID
validateEmail('first.last@sub.co.in'); // VALID
validateEmail('user+tag@domain.org'); // VALID
validateEmail('u_1%2+3@x-y.io'); // VALID
```

---

## `validatePassword(password, email?)`

Validates a password against 12 sequential security checks. No passphrase bypass — complexity is enforced for **all** passwords in the 6–20 character range.

### Signature

```js
import { validatePassword } from '@/utils/validation';

const result = validatePassword('MyPass@1', 'user@example.com');
// -> { isValid: true, message: '' }
```

### Parameters

| Param      | Type     | Default | Description                                       |
| ---------- | -------- | ------- | ------------------------------------------------- |
| `password` | `string` | —       | The raw password string to validate               |
| `email`    | `string` | `''`    | Optional. Used for identity checks (checks 4 & 5) |

---

### Validation Checks (in order)

#### Basic

| #   | Rule                   | Triggers on                | Error Message                                                                     |
| --- | ---------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| 1   | Non-empty              | `""`, `null`               | `Please enter a password`                                                         |
| 2   | No spaces              | `"my pass"`, `"pass "`     | `Password cannot contain spaces`                                                  |
| 3   | Length 6–20 characters | `"abc"`, string > 20 chars | `Password must be at least 6 characters` / `Password cannot exceed 20 characters` |

#### Identity / Context

| #   | Rule                                       | Triggers on                                           | Error Message                                        |
| --- | ------------------------------------------ | ----------------------------------------------------- | ---------------------------------------------------- |
| 4   | Not equal to full email (case-insensitive) | `password == "user@x.com"`                            | `Password cannot be the same as your email address`  |
| 5   | Not equal to email username (before `@`)   | `password == "johndoe"` when email is `johndoe@x.com` | `Password cannot be the same as your email username` |

#### Common / Weak Password Blocklist

| #   | Rule                                         | Triggers on                                 | Error Message                                                        |
| --- | -------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| 6   | Not in expanded blocklist (case-insensitive) | `"password"`, `"admin123"`, `"qwerty"` etc. | `Password is too common or weak. Please choose a stronger password.` |

#### Complexity (applied to ALL passwords)

| #   | Rule                                              | Triggers on     | Error Message                                                            |
| --- | ------------------------------------------------- | --------------- | ------------------------------------------------------------------------ |
| 7   | At least one uppercase letter `[A-Z]`             | `"mypass@1"`    | `Password must include at least one uppercase letter (A–Z)`              |
| 8   | At least one lowercase letter `[a-z]`             | `"MYPASS@1"`    | `Password must include at least one lowercase letter (a–z)`              |
| 9   | At least one digit `[0-9]`                        | `"MyPass@!"`    | `Password must include at least one number (0–9)`                        |
| 10  | At least one special character (non-alphanumeric) | `"MyPassword1"` | `Password must include at least one special character (e.g. @, #, !, $)` |

#### Pattern Checks

| #   | Rule                                                                                  | Triggers on                                        | Error Message                                                                 |
| --- | ------------------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------- |
| 11  | No more than 3 consecutive identical characters                                       | `"aaaa1A@"`, `"1111@Aa"`                           | `Password cannot contain more than 3 consecutive identical characters`        |
| 12  | No sequential run of 4+ chars (alpha, numeric, or keyboard row) — forward or backward | `"abcd@1A"`, `"1234@Aa"`, `"qwer@1A"`, `"dcba@1A"` | `Password cannot contain sequential characters (e.g. abcd, 1234, qwer, dcba)` |

**Sequences checked for rule 12:**

- Alphabet: `abcdefghijklmnopqrstuvwxyz` (and reversed)
- Digits: `0123456789` (and reversed)
- Keyboard row 1: `qwertyuiop` (and reversed)
- Keyboard row 2: `asdfghjkl` (and reversed)
- Keyboard row 3: `zxcvbnm` (and reversed)

---

### Common Password Blocklist

The following passwords (case-insensitive) are explicitly blocked:

```
Numeric sequences:
  123456  1234567  12345678  123456789  1234567890
  12345  123123  111111  000000  654321

Common words / patterns:
  password  password1  password123  pass123  passw0rd
  admin  admin123  administrator  root  toor
  letmein  letmein123  login  welcome  welcome1
  secret  monkey  dragon  master  abc123
  iloveyou  sunshine  princess  shadow  superman
  batman  trustno1  qwerty  qwerty123  qwertyuiop
  asdfgh  zxcvbn  1q2w3e  1q2w3e4r

Character/pattern repeats:
  aaaaaa  111111  aaaa1234  test1234  user1234
  changeme  newpass  temp123  guest123
```

---

### Valid / Invalid Examples

```js
validatePassword(''); // INVALID — Please enter a password
validatePassword('my pass'); // INVALID — Password cannot contain spaces
validatePassword('abc'); // INVALID — Password must be at least 6 characters
validatePassword('thispasswordiswaytoolong!'); // INVALID — Password cannot exceed 20 characters
validatePassword('password', 'user@example.com'); // INVALID — Password is too common or weak
validatePassword('johndoe', 'johndoe@example.com'); // INVALID — Password cannot be the same as your email username
validatePassword('mypass@1'); // INVALID — Password must include at least one uppercase letter (A–Z)
validatePassword('MYPASS@1'); // INVALID — Password must include at least one lowercase letter (a–z)
validatePassword('MyPass@!'); // INVALID — Password must include at least one number (0–9)
validatePassword('MyPassword1'); // INVALID — Password must include at least one special character
validatePassword('aaaa@B2x'); // INVALID — Password cannot contain more than 3 consecutive identical characters
validatePassword('abcd@B2x'); // INVALID — Password cannot contain sequential characters
validatePassword('1234@Bx!'); // INVALID — Password cannot contain sequential characters
validatePassword('qwer@B2x'); // INVALID — Password cannot contain sequential characters

validatePassword('MyPass@1'); // VALID
validatePassword('X9#mK2pL'); // VALID
validatePassword('Tr0ub4dor&'); // VALID
validatePassword('P@ssw0rd!'); // VALID
```

---

## Usage in Forms

Both functions are consumed by [`LoginForm.jsx`](file:///d:/Hackathon-UI/UI/src/components/Login/LoginLayout/LoginForm/LoginForm.jsx) during form submission:

```js
import { validateEmail, validatePassword } from '@/utils/validation';

const emailValidation = validateEmail(trimmedEmail);
if (!emailValidation.isValid) {
    setEmailError(emailValidation.message);
}

const passwordValidation = validatePassword(trimmedPassword, trimmedEmail);
if (!passwordValidation.isValid) {
    setPasswordError(passwordValidation.message);
}
```

Errors are surfaced directly to the relevant `InputField` via the `error` prop, and focus is moved to the first failing field.

---

## Standards Reference

| Standard                                                                                                | Relevance                                                                 |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321)                                                      | SMTP — email max length (254), local-part max (64), domain label max (63) |
| [RFC 5322](https://www.rfc-editor.org/rfc/rfc5322)                                                      | Internet Message Format — email syntax rules                              |
| [RFC 1035](https://www.rfc-editor.org/rfc/rfc1035)                                                      | DNS — domain label max 63 chars, label character rules                    |
| [OWASP Auth Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | Password complexity, common-password blocklist guidance                   |
