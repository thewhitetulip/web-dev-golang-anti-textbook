#About the book

Please note that the book is a work in progress.

This book was written to teach how to develop web applications in Go for people who know a bit of Go and have basic information about web applications in general. 

We (you) will build a webapp without using a third party framework and using as few external libraries as possible. The advantage is that you'll learn a lot when you code without a framework.

I hereby present to you the anti text book.

##Contributing
I don't profess to be a God of either Go or webdev or anything in general, and I don't claim that this is the best book for learning how to build web appplications with Go, but I do believe that good things happen when people collaborate, so pull requests are not only appreciated, but they are welcome.

##Philosophy
 - Through this book we want to teach how to develop web applications in Go. We expect the reader to know the basics of Go but we assume the reader knows **nothing** about how to write web applications
 - The book shall comprise of chapters, if the topic is huge and doesn't fit into one chapter, then we split into multiple chapters.
 - Each chapter should be split into logical parts or sections with a meaningful title which'll teach the reader something.
 - Every concept should be accompanied by the Go code (if there is any), for *sneak peek* type sections write the Go pseudo code, writing just the necessary parts of the code and keeping everything else.
 - The code shouldn't be more than 80 characters wide because in the PDF versions of the book the code is invisible.
 - *Brevity is the soul of wit*, so keep the description as small as possible. But this doesn't mean that we should just assume that the reader knows the concept and skip it
     in such cases do explain the concept.
 - In the todo list manager which we are creating, we'll strive to implement as much functionality as possible to give a taste of practical Go programming to the reader, but we should mention
   as a note the other way, suppose you re-implement a function like `ParseGlob` by listing all html files and using `ParseFiles` to parse them, we should mention about the function `ParseGlob`
 - The main title should have one #, sections should have 3 #'s note should have 6 #'s (note should have a title too)
 - Multi line code should have three tabs indentation, single line of code can be indented using tabs or by backticks.

Written with love in India.

Disclaimer: The gopher in the cover page is taken from https://golang.org/doc/gopher/appenginegophercolor.jpg without modifications
since it is under Creative Commons license.


## Links

- Next section: [Installation and Tools](content/0.0install.md)
