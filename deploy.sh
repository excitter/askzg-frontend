#!/usr/bin/env bash
HOST='ftp.airsoft-zagreb.com'
USER='airsoft'
PASSWD=$1

cd dist
ftp -n $HOST <<END_SCRIPT
quote USER ${USER}
quote PASS ${PASSWD}
cd public_html/app
prompt
mdel *.css
mdel *.js
mdel *.gif
mdel index.html
mdel .htaccess
mdel 3rdpartylicenses.txt
mdel favicon.ico
binary
put favicon.ico
put 3rdpartylicenses.txt
put .htaccess
put index.html
mput *.gif
mput *.js
mput *.css
ls
END_SCRIPT
exit 0
