const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser')
const ServerRenderer = require("./renderer");
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.pdf')
  }
})
// var upload = multer({ storage: storage })
var upload = multer({ dest: './uploads/',storage })
const app = express();
// const urlencodedParser = bodyParser.urlencoded({ extended: false })
const isProd = process.env.NODE_ENV === "production";

let renderer;
let readyPromise;
let template = fs.readFileSync("./index.html", "utf-8");
if (isProd) {
  // 静态资源映射到dist路径下
  app.use("/dist", express.static(path.join(__dirname, "../dist")));

  let bundle = require("../dist/server-bundle.json");
  let clientManifest = require("../dist/client-manifest.json"); 
  renderer = new ServerRenderer(bundle, template, clientManifest);
} else {
  readyPromise = require("./dev-server")(app, (
    bundle,
    clientManifest) => {
      renderer = new ServerRenderer(bundle, template, clientManifest);
  });
}
// app.use(urlencodedParser);

// app.all('*',function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//   if (req.method == 'OPTIONS') {
//     res.send(200); /让options请求快速返回/
//   }
//   else {
//     next();
//   }
// });

app.use("/public", express.static(path.join(__dirname, "../public")));
const render = (req, res) => {
  console.log("======enter server======");
  console.log("visit url: " + req.url);

  // 此对象会合并然后传给服务端路由，不需要可不传
  const context = {};

  renderer.renderToString(req, context).then(({error, html}) => {
    if (error) {
      if (error.url) {
        res.redirect(error.url);
      } else if (error.code) {
        res.status(error.code).send("error code：" + error.code);
      }
    }
    res.send(html);
  }).catch(error => {
    console.log(error);
    res.status(500).send("Internal server error");
  });
}

app.all(/^(?!\/api).*/, isProd ? render : (req, res) => {
  // 等待客户端和服务端打包完成后进行render
  console.log("render")
  readyPromise.then(() => render(req, res));
});
app.get('/api/hello',(req, res)=>{
  res.send('Hello World');
})
app.post('/api/upload',upload.single('file'),(req, res)=>{
  console.log(req.body);
  console.log(req.files);
  res.send('JSON.stringify(result)');
})
app.listen(3000, () => {
  console.log("Your app is running");
});
