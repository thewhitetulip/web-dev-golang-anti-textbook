# About the book

[![Join the chat at https://gitter.im/thewhitetulip/web-dev-golang-anti-textbook](https://badges.gitter.im/thewhitetulip/web-dev-golang-anti-textbook.svg)](https://gitter.im/thewhitetulip/web-dev-golang-anti-textbook?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

|Source | Read online | Watch  | Download | Code | Pay? |
| ----| ---- | ---- | ------ | ------ | ------ |
|[Github](https://github.com/thewhitetulip/web-dev-golang-anti-textbook/)| [Gitbooks](https://thewhitetulip.gitbooks.io/webapp-with-golang-anti-textbook/content/)| [YouTube series](https://www.youtube.com/playlist?list=PL41psiCma00wgiTKkAZwJiwtLTdcyEyc4) | [leanpub](https://leanpub.com/antitextbookGo) | [Tasks](http://github.com/thewhitetulip/Tasks) | This book is free, but if you want to pay, you can buy it on leanpub.|

## What is this?

This is an easy to understand example based tutorial aimed at those who know a
little of Go and nothing of webdev and want to learn how to write a webserver
in Go. You will create a to do list application as you advance the chapters.

Please use the `front end` folder in the `code` folder to get the index.html
of the Tasks project and work on it while reading this tutorial.

## Supporting Docs

We have a YouTube series and a fully functioning web application as supporting
documents. [Tasks](http://github.com/thewhitetulip/Tasks) is the application
which you'll as you read into the book

If you prefer learning by watching, [YouTube
series](https://www.youtube.com/playlist?list=PL41psiCma00wgiTKkAZwJiwtLTdcyEyc4).
The code corresponding to the YouTube series is available
[here](https://github.com/thewhitetulip/write-webapps-in-go-video). The code
is published as branches, each video has a particular branch.

## Multiversity

This guide is a part of the
[Multiversity](https://github.com/thewhitetulip/multiversity) initiative. The
aim is to have high quality open source tutorials along with screencasts.

## Contributing

We welcome all Pull Requests, please raise an issue before starting your work!

## Backstory

I got feedback from a reddit user that maybe it is too early for me to start
writing this book. Decades ago, a young student from the University of
Helsinki had an endless debate with Andrew Tannenbaum on comp.minix. It was
about monolithic kernels. Had the student listened to Andrew Tannenbaum, the
world probably would not have had Linux. This is the whole point of open
source projects, a little initiative from everyone goes a long way. I would
like to thank everyone who gave their suggestions on reddit and HN.

## Philosophy

- Through this book we want to teach how to develop web applications in Go. We
  expect the reader to know the basics of Go but we assume the reader knows
  **nothing** about how to write web applications.
- The book shall comprise of chapters, if the topic is huge and doesn't fit
  into one chapter, then we split into multiple chapters, if possible.
- Each chapter should be split into logical parts or sections with a
  meaningful title which'll teach the reader something.
- Every concept should be accompanied by the Go code (if there is any), for
  *sneak peek* type sections write the Go pseudo code, writing just the
  necessary parts of the code and keeping everything else.
- The code shouldn't be more than 80 characters wide because in the PDF
  versions of the book the code is invisible.
- *Brevity is the soul of wit*, please keep the description as small as
     possible. This doesn't mean we skip it, but try to explain it in as
     simple words as possible. In such cases do explain the concept.
- In the todo list manager which we are creating, we'll strive to implement as
  much functionality as possible to give a taste of practical Go programming
  to the reader. In cases where we re-implement stdlib stuff, we should
  mention it clearly.
- The main title should have one #, sections should have 2 #'s sub section
  should have 4 and notes should have 6 #'s (note should have a title too).
- Multi-line code should use [syntax
  fencing](https://help.github.com/articles/creating-and-highlighting-code-blocks/),
  single line of code can be indented using tabs or by backticks.

Written with love in India with help from the Internet.

## License

Book License: [CC BY-SA 3.0
License](http://creativecommons.org/licenses/by-sa/3.0/)

## Note

1. The Go Programming Basics section has been adapted from
   [build-web-application-with-golang](https://github.com/astaxie/build-web-application-with-golang/)
   by [astaxie](http://github.com/astaxie) Links were updated to refer the
   correct aspects of the current book, titles were updated to fit into this
   book. Modifications to the content was done to suit to the style of the
   book.
1. The gopher in the cover page is taken from
   https://golang.org/doc/gopher/appenginegophercolor.jpg without
   modifications.
1. The chapter on database is adapted from
   https://github.com/VividCortex/go-database-sql-tutorial/ with
   modifications.

## Links

- [Next section](manuscript/0.0installation.md)
