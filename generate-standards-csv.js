#!/usr/bin/env node

// For running CLI functions
const { exec } = require('child_process');
let execute = function(command, callback) {
    exec(command, function(error, stdout, stderr) { callback(stdout); });
}

// For parsing and writing JSON from the command line
const fs = require('fs');
const he = require('he');
const { parse } = require('json2csv');


// Mappings between acronyms and topics/domains
topic_lookup = {
    "HSN": "Number & Quantity",
    "HSA": "Algebra",
    "HSF": "Functions",
    "HSM": "Modeling",
    "HSG": "Geometry",
    "HSS": "Statistics & Probability",
    "MP": "Mathematical Practices"
};

domain_lookup = {
    "Number & Quantity": {
        "RN": "The Real Number System",
        "Q": "Quantities",
        "CN": "The Complex Number System",
        "VM": "Vector and Matrix Quantities"
    },

    "Algebra": {
        "APR": "Arithmetic with Polynomials & Rational Expressions",
        "SSE": "Seeing Structure in Expressions",
        "ARP": "Arithmetic with Polynomials and Rational Functions",
        "CED": "Creating Equations",
        "REI": "Reasoning with Equations and Inequalities"
    },

    "Functions": {
        "IF": "Interpreting Functions",
        "BF": "Building Functions",
        "LE": "Linear; Quadratic; and Exponential Models", // kludge because Notion's importer seems to break on ,'s in CSVs
        "TF": "Trigonometric Functions"
    },

    "Modeling": {},

    "Geometry": {
        "CO": "Congruence",
        "SRT": "Similarity; Right Triangles; and Trigonometry", // kludge because Notion's importer seems to break on ,'s in CSVs
        "C": "Circles",
        "GPE": "Expressing Geometric Properties with Equations",
        "GMD": "Geometric Measurement and Dimension",
        "MG": "Modeling with Geometry"
    },

    "Statistics & Probability": {
        "ID": "Interpreting Categorical and Quantitative Data",
        "IC": "Making Inferences and Justifying Conclusions",
        "CP": "Conditional Probability and the Rules of Probability",
        "MD": "Using Probability to Make Decisions"
    },

    "Mathematical Practices": {
        "1": "Make sense of problems and persevere in solving them.",
        "2": "Reason abstractly and quantitatively.",
        "3": "Construct viable arguments and critique the reasoning of others.",
        "4": "Model with mathematics.",
        "5": "Use appropriate tools strategically.",
        "6": "Attend to precision.",
        "7": "Look for and make use of structure.",
        "8": "Look for and express regularity in repeated reasoning."
    }
};

// Scrape the HTML and then…

// Read and parse the substandards from the JSON
let substandards_raw = fs.readFileSync('./pruned_standards.json', 'utf8');
let substandards = JSON.parse(substandards_raw);

// For each substandard
substandards.forEach(function(standard) {
    console.log("Looking at", standard);
    let topic_acronym = standard.ID.split('.')[3];
    let domain_acronym = standard.ID.split('.')[4];
    standard.Topic = topic_lookup[topic_acronym]; // Pull out its topic
    standard.Domain = domain_lookup[standard.Topic][domain_acronym]; // and domain
    standard.ID = standard.ID.replace("CCSS.Math.Content.", ""); // Clean up a shorter ID
    standard["Long ID"] = standard.ID.replace(/^/, "CCSS.Math.Content."); // kludge to get Notion to render the short ID as the DB ID
    // Check if it's a "transition" course: http://www.corestandards.org/Math/Content/note-on-courses-transitions/courses-transitions/
    if (standard.Description.match(/^\(\+\) /)) {
        standard.Transition = true;
        standard.Description = standard.Description.replace(/^\(\+\) /, '');
    } else {
        standard.Transition = false;
    }

    // Clean up HTML encoded entities
    standard.Description = he.decode(standard.Description)

    // Check if it is a Modeling standard
    if (standard.raw.some(s => s.hasOwnProperty('tag') && s.tag === "sup" && s.text === "*")) {
        // Insanely, the structure is a superscript asterisk, which is what we check for: http://www.corestandards.org/Math/Content/HSM/
        standard.Modeling = true;
    } else {
        standard.Modeling = false;
    }
});

// Write to a CSV file, removing the raw JSON representation of each standard from the CSV
const fields = Object.keys(substandards[0]).filter(f => f !== 'raw');
const opts = { fields }
try {
    const csv = parse(substandards, opts);
    fs.writeFileSync('standards.csv', csv, "utf8");
} catch (err) {
    console.error(err);
}
console.log("Wrote", substandards.length, "standards…");
console.log("Expected to write", fs.readFileSync("./expected_links.txt", "utf8").trim().split('\n').length);