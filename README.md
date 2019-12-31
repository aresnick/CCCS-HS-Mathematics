# README

**As of 30 December 2019, the standards as scraped may be viewed [here](https://www.notion.so/powderhouse/446fa0839c05410fa2b9ccdb0223e644?v=d54ef6bc7cbe40458385c2fb271ab993).**

Note that two areas of the CCCS standards do not appear here because they appear across all of the standards: [Mathematical Practices](http://www.corestandards.org/Math/Practice/) and [Modeling](http://www.corestandards.org/Math/Content/HSM/).  Modeling standards are indicated by a boolean.

Mathematical practices are enumerated below for reference and appear across all standards:

+ Make sense of problems and persevere in solving them.
+ Reason abstractly and quantitatively.
+ Construct viable arguments and critique the reasoning of others.
+ Model with mathematics.
+ Use appropriate tools strategically.
+ Attend to precision.
+ Look for and make use of structure.
+ Look for and express regularity in repeated reasoning.

## Installation

1. Install [`jq`](https://stedolan.github.io/jq/) and [`pup`](https://github.com/ericchiang/pup).  Both of these may be installed _via_ [Homebrew](http://brew.sh/).
2. `npm install`
3. `./scrape.sh`
3. `node generate-standards-csv.js`
4. Use `standards.csv` as you see fit.