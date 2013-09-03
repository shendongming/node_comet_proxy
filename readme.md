
install:

	npm install redis express



node app.js



发布
http://localhost:9080/pub?id=/user-12323&msg=xxxxxx&callback=ff
response:
ff("ok")

http://localhost:9080/pub?id=/user-12323&msg=xxxxxx
response:
mycall("ok")



指定callback 就返回jsonp 格式

http://localhost:9080/sub?id=/user-12323&callback=mycall
http://localhost:9080/sub?id=/group-12323&callback=mycall

response:
mycall("msg data")

http://localhost:9080/sub?id=/group-12323

response:
msg data


