# Display Dashboard

To run the server you will need the following `ENV` variables set:

```
CLIENT_ID
CLIENT_SECRET
REFRESH_TOKEN
```

You can create the client id and client secret using the [Google developer
console][1]. You need to generate the refresh token, there is a [short Ruby
script to create one for you][2].

Once you have them you can start the server running:

```
CLIENT_ID=... CLIENT_SECRET=... REFRESH_TOKEN=... ruby ./server.rb
```

You can then browse to the server in your browser.


[1]: https://developer.google.com/console
[2]: https://gist.github.com/edds/9363713

# Licence

Copyright (C) 2013 Edd Sowden

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
