const data = require('../../../../balderdash_words_with_definitions.json');
var fs = require('fs');

let entries = Object.entries(data);

let sql = '';

entries.forEach((wordDefintion) => {
    if (wordDefintion[1][0]) {
        let word = wordDefintion[0];
        let definition = wordDefintion[1][0].text;

        definition = definition.replace(/[\']+/g, '');
        definition = definition.replace(/[.]+/g, '');

        if (!definition.includes('Same as')) {
            sql += `INSERT INTO public.words(word, definition)VALUES (\'${word}\', \'${definition}\');\n`;
        }
    }
});

fs.writeFile('definitions.sql', sql, function (err) {
    if (err) throw err;
});
