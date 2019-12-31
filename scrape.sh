#!/usr/bin/env sh

declare -a arr=("HSN" "HSA" "HSF" "HSM" "HSG" "HSS") # Topic prefixes for URL construction

rm raw_standards.html # Clean out any existing HTML files

declare -a pids=() # Create an array of PIDs to use for awaiting curl's completion
for i in "${arr[@]}"
do # Download the pages
   URL="http://www.corestandards.org/Math/Content/"$i"/"
   curl $URL >> raw_standards.html &
   pids[${i}]=$!
done

# Wait for everything to download
for pid in ${pids[*]}; do
    wait $pid
done

echo "Done downloading raw HTML of standards…"

cat raw_standards.html | pup '.substandard json{}' > json_standards.json # Extract substandards as JSON

# Clean up with jq to get the raw representation
cat json_standards.json | jq '.[] | {ID: (if .children[0].name then .children[0].name else .children[0].children[0].name end), Description: .text, URL: (if .children[0].href then .children[0].href else .children[0].children[0].href end)}' | jq -s > pruned_standards.json
