const fs = require('fs');
const path = require('path');

const files = [
    'src/rooms/RoomBookingScreen.js',
    'src/components/BookingSummaryBar.js',
    'slides/shoots.js',
    'slides/feedbacks.js',
    'slides/start.js',
    'slides/about.js',
    'src/adminOnly/Dashboard.js',
    'src/view/MemberBookingsScreen.js',
    'src/halls/BanquetHallScreen.js',
    'src/halls/HallDetailsScreen.js',
    'src/lawn/Lawn.js',
    'slides/BanquetHallDetailsScreen.js',
    'App.js',
    'src/adminOnly/calender.js',
];

files.forEach(f => {
    try {
        const content = fs.readFileSync(f, 'utf8');
        let braces = 0, parens = 0, brackets = 0;
        let inString = false, strChar = '';
        let inComment = false, inBlockComment = false;
        let inTemplate = false;

        for (let i = 0; i < content.length; i++) {
            const ch = content[i];
            const next = content[i + 1];

            if (inBlockComment) {
                if (ch === '*' && next === '/') { inBlockComment = false; i++; }
                continue;
            }
            if (inComment) {
                if (ch === '\n') inComment = false;
                continue;
            }
            if (inString) {
                if (ch === '\\') { i++; continue; }
                if (ch === strChar) inString = false;
                continue;
            }
            if (inTemplate) {
                if (ch === '\\') { i++; continue; }
                if (ch === '`') inTemplate = false;
                continue;
            }

            if (ch === '/' && next === '/') { inComment = true; i++; continue; }
            if (ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
            if (ch === '"' || ch === "'") { inString = true; strChar = ch; continue; }
            if (ch === '`') { inTemplate = true; continue; }

            if (ch === '{') braces++;
            if (ch === '}') braces--;
            if (ch === '(') parens++;
            if (ch === ')') parens--;
            if (ch === '[') brackets++;
            if (ch === ']') brackets--;
        }

        const issues = [];
        if (braces !== 0) issues.push('braces: ' + braces);
        if (parens !== 0) issues.push('parens: ' + parens);
        if (brackets !== 0) issues.push('brackets: ' + brackets);

        if (issues.length > 0) {
            console.log('ISSUE in ' + f + ': ' + issues.join(', '));
        } else {
            console.log('OK: ' + f);
        }
    } catch (e) {
        console.log('ERROR reading ' + f + ': ' + e.message);
    }
});
