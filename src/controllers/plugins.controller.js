import fs from 'fs';
import path from 'path';

export let stylesheet = (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname, '..', 'resources', 'css', filename);

  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(404).send('File not Found');
      return;
    }

    const contentLength = data.toString().length;

    res.writeHead(200, {
      'Content-Type': 'text/css',
      'Content-Length': contentLength.toString(),
    });
    res.end(data);
  });
};
export let pluginScripts = (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname, filename);

  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(404).send('File not Found');
      return;
    }

    const contentLength = data.toString().length;

    res.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Content-Length': contentLength.toString(),
    });
    res.end(data);
  });
};
export let utilsScripts = (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname,'..','utils', filename);

  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(404).send('File not Found');
      return;
    }

    const contentLength = data.toString().length;

    res.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Content-Length': contentLength.toString(),
    });
    res.end(data);
  });
};
export let getSocketIo = (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname,'..','..','node_modules','socket.io','client-dist', filename);

  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(404).send('File not Found');
      return;
    }

    const contentLength = data.toString().length;

    res.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Content-Length': data.length,
    });
    res.end(data);
  });
};
export let getLuxon = (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname,'..','..','node_modules','luxon','build','es6',filename);

  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(404).send('File not Found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Content-Length': data.length,
    });
    res.end(data);
  });
};
export let assets = (req, res) => {
  const  filename  = req.params[0];
  const file = path.join(__dirname, '..', 'resources', 'assets', filename);
  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(500).send('File not Found');
      console.log(err)
      return
    }
    let ext = file.substring((file.lastIndexOf('.')+1))
    let header
    switch (ext) {
      case 'js':
        header = 'text/javascript'
        break;
      case 'css':
        header = 'text/css'
        break;
      case 'svg':
        header = 'image/svg+xml'
        break;
      case 'png':
        header = 'image/png'
        break;
      case 'jpg':
        header = 'image/jpg'
        break;
      default:
        header = 'text/html'
        break;
    }
    const contentLength = data.length;
    res.writeHead(200, {
      'Content-Type': header,
      'Content-Length': contentLength,
    });
    res.end(data);
  });
};

