#!/bin/bash

# God I hate nodejs so much...

podman run -v $PWD:/app:rw --uidmap 1000:0:1 --uidmap 0:1:1000 --user 1000 -it --workdir /app --network host node:16 /bin/bash