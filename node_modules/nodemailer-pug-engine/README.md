# Nodemailer-pug-engine

## Install

```bash
npm install nodemailer-pug-engine
```

## Usage
```typescript
// typescript
import { pugEngine } from "nodemailer-pug-engine";

// javascript
const { pugEngine } = require("nodemailer-pug-engine");



const mailer = createTransport(...)

mailer.use('compile', pugEngine({
    templateDir: __dirname + '/templates',
    pretty: true
}));

mailer.sendMail({
    to: '..',
    template: 'test',   // defines the template to compile for the email
    ctx: {
        // this is available in the template
    }
});
```

## Options

### pugEngine
**templateDir** {string} - Path to templates directory

**pretty** {boolean} *optional* - Pretty print html (defaults to false)

### sendMail Options
**template** {string} *optional* - defines the template relative to the pugEngine templateDir

**ctx** {object} *optional* - this is the available context in the pug template
 