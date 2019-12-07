#! /bin/bash

# declare adventureList=(TheSiege BuffAdventures_TMC_Unknown_Regions)
declare downloadDir=./downloads
declare advListFile=adventures.json
declare advListFileTxt=$downloadDir/adventures.txt

function formatJsonFile() {
   file=$1
   echo Formatting: $file
   jq . "$file" > "$file.tmp"
   if [ "$?" == 0 ];  then
      rm "$file"
      mv "$file.tmp" "$file"
   else
      rm "$file.tmp"
      echo -n " jq . $file > $file.tmp"
   fi
}

function createAdventureTxt() {
   cat "$downloadDir/$advListFile" | jq -r -j '.data[] | "\(.id)\n"' | sort > $advListFileTxt
}

function downloadAdventureList() {
   echo Download: Adventure List
   curl -s "https://www.settlerscombatsimulator.com/api/adventures?locale=de" -o "$downloadDir/$advListFile"
   formatJsonFile "$downloadDir/$advListFile"
}

function listAdventureList() {
   # cat "downloads/adventures.json" | jq -r  '.data  | map("\(.id) \t\t \(.name)") | .[]'
   cat "$downloadDir/$advListFile" | jq -r -j '.data[] | "\"\(.name)\" \(.difficulty) \(.id) \n"' | xargs printf "%-40s %-5s %s\n" | sort
}

function download() {
   while read advId ; do
      echo Downloading $advId
      curl -s "https://www.settlerscombatsimulator.com/api/adventures/$advId?locale=de" -o "$downloadDir/$advId.json"
   done < $advListFileTxt
}

function format() {
   while read advId ; do
      formatJsonFile "$downloadDir/$advId.json"
   done < $advListFileTxt
}

if [ "$1" == "downloadAdventureList" ]; then
   downloadAdventureList
elif [ "$1" == "list" ]; then
   listAdventureList
elif [ "$1" == "formatJsonFile" ]; then
   formatJsonFile $2
elif [ "$1" == "download" ]; then
   download $adventureList
elif [ "$1" == "createAdventureTxt" ]; then
   createAdventureTxt
elif [ "$1" == "format" ]; then
   format
else
   echo "unknown parameter: $1"
fi
