ACalendar-Client
================

**ACalendar is a Web-based scheduling system which allows users to create, retrieve, update and delete events.**

**(This repository is for front end only.)**

* * * * *

### Structure

```
/* File Structure
app
│
├── fonts                           // All icons
│   ├── fontaweson
│   └── glyphicons
│
├── css                             // List of style sheets
│   └── main.css                    // The main style sheet that some styles are override
│
├── templates                       // There are a number of templates
│
├── js                              // All Javascript files
│   ├── libs
│   │   ├── jquery-ui.custom.min.js
│   │   ├── keymaster.min.js
│   │   ├── nlp.js
│   │   └── rrule.js
│   │
│   ├── models
│   │   └── Event.js
│   │
│   ├── collections
│   │   └── Events.js
│   │
│   ├── routers
│   │   └── router.js
│   │
│   ├── views
│   │   ├── Calendar.js
│   │   └── EventEditor.js
│   │
│   ├── vendor                      // All JS libraries retrieved via bower
│   │   ├── jquery
│   │   ├── underscore
│   │   ├── backbone
│   │   ├── bootstrap
│   │   ├── fullCalendar
│   │   ├── moment
│   │   ├── datepicker
│   │   ├── daterangepicker
│   │   ├── qtip2
│   │   ├── icheck
│   │   ├── bongo
│   │   └── keymaster
│   │
│   ├── app.js
│   └── main.js
│
└── index.html

*/
```

## Copyright and license
Copyright 2013 Xiao Shi

[MIT License](LICENSE)
